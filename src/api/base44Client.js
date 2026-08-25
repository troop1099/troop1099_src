import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});

// ─── Google Sheets Data Layer ───────────────────────────────────────
// All entity CRUD is routed to Google Sheets (via the sheets-proxy
// backend function) instead of the Base44 database. The spreadsheet
// "Troop 1099 Data" in the troop's Google Drive folder is the source
// of truth — one tab per entity, with a header row of field names.

const ENTITY_NAMES = [
  'Event', 'Announcement', 'Eagle', 'Leader', 'GearItem', 'GearCheckout',
  'AdvancementRequest', 'Outing', 'OutingAttendee', 'Document', 'Adventure',
  'MeritBadge', 'MeritBadgeCounselor', 'TroopPhoto', 'PinestrawOrder', 'Setting', 'Reimbursement',
];

const ENTITY_SCHEMAS = {
  Event: { type: 'object', properties: { title: { type: 'string' }, date: { type: 'string', format: 'date' }, end_date: { type: 'string', format: 'date' }, location: { type: 'string' }, type: { type: 'string', enum: ['meeting', 'campout', 'hike', 'service', 'fundraiser', 'special'] }, description: { type: 'string' } }, required: ['title', 'date', 'type'] },
  Announcement: { type: 'object', properties: { title: { type: 'string' }, body: { type: 'string' }, visibility: { type: 'string', enum: ['public', 'members'], default: 'members' } }, required: ['title', 'body'] },
  Eagle: { type: 'object', properties: { name: { type: 'string' }, date: { type: 'string', format: 'date' }, photo_url: { type: 'string' }, project: { type: 'string' } }, required: ['name', 'date'] },
  Leader: { type: 'object', properties: { name: { type: 'string' }, role: { type: 'string' }, email: { type: 'string' }, type: { type: 'string', enum: ['adult', 'youth'], default: 'adult' }, patrol: { type: 'string' }, sort_order: { type: 'number', default: 0 } }, required: ['name', 'role'] },
  GearItem: { type: 'object', properties: { title: { type: 'string' }, caption: { type: 'string' }, image_url: { type: 'string' }, buy_link: { type: 'string' }, category: { type: 'string', enum: ['clothing', 'camping', 'cooking', 'navigation', 'tools', 'other'], default: 'other' } }, required: ['title', 'image_url'] },
  GearCheckout: { type: 'object', properties: { scout_name: { type: 'string' }, scout_email: { type: 'string' }, gear_item: { type: 'string' }, tent_number: { type: 'string' }, checkout_date: { type: 'string', format: 'date' }, checkin_date: { type: 'string', format: 'date' }, status: { type: 'string', enum: ['checked_out', 'returned'], default: 'checked_out' }, notes: { type: 'string' } }, required: ['scout_name', 'scout_email', 'gear_item', 'checkout_date'] },
  AdvancementRequest: { type: 'object', properties: { type: { type: 'string', enum: ['scoutmaster_conference', 'board_of_review', 'blue_card'] }, scout_name: { type: 'string' }, scout_email: { type: 'string' }, rank: { type: 'string' }, merit_badge: { type: 'string' }, notes: { type: 'string' }, meeting_date: { type: 'string', format: 'date' }, status: { type: 'string', enum: ['pending', 'approved', 'scheduled', 'completed', 'canceled', 'rejected'], default: 'pending' } }, required: ['type', 'scout_name'] },
  Outing: { type: 'object', properties: { title: { type: 'string' }, month_label: { type: 'string' }, departure_date: { type: 'string', format: 'date' }, departure_time: { type: 'string' }, return_date: { type: 'string', format: 'date' }, return_time: { type: 'string' }, price_per_scout: { type: 'string' }, friday_shirt: { type: 'string' }, saturday_shirt: { type: 'string' }, sunday_shirt: { type: 'string' }, permission_slip_url: { type: 'string' }, grubmasters: { type: 'string' }, active: { type: 'boolean', default: true } }, required: ['title'] },
  OutingAttendee: { type: 'object', properties: { outing_id: { type: 'string' }, scout_name: { type: 'string' }, patrol: { type: 'string' }, attending: { type: 'boolean', default: false }, permission_slip: { type: 'boolean', default: false }, paid: { type: 'boolean', default: false }, notes: { type: 'string' }, request_to_attend: { type: 'boolean', default: false } }, required: ['outing_id', 'scout_name'] },
  Document: { type: 'object', properties: { title: { type: 'string' }, category: { type: 'string', enum: ['trip_docs', 'health_safety', 'advancement', 'governance', 'fundraising'] }, file_url: { type: 'string' }, description: { type: 'string' }, pinned: { type: 'boolean', default: false } }, required: ['title', 'category', 'file_url'] },
  Adventure: { type: 'object', properties: { title: { type: 'string' }, date: { type: 'string', format: 'date' }, location: { type: 'string' }, distance: { type: 'string' }, elevation: { type: 'string' }, skill: { type: 'string' }, description: { type: 'string' }, image_url: { type: 'string' } }, required: ['title', 'date'] },
  MeritBadge: { type: 'object', properties: { name: { type: 'string' }, bsa_url: { type: 'string' }, image_url: { type: 'string' }, description: { type: 'string' }, requirements: { type: 'string' }, eagle_required: { type: 'boolean', default: false } }, required: ['name', 'bsa_url'] },
  MeritBadgeCounselor: { type: 'object', properties: { badge_id: { type: 'string' }, name: { type: 'string' }, email: { type: 'string' } }, required: ['badge_id', 'name'] },
  TroopPhoto: { type: 'object', properties: { image_url: { type: 'string' }, caption: { type: 'string' }, uploaded_by: { type: 'string' } }, required: ['image_url'] },
  PinestrawOrder: { type: 'object', properties: { customer_name: { type: 'string' }, address: { type: 'string' }, phone: { type: 'string' }, email: { type: 'string' }, bales: { type: 'number' }, special_instructions: { type: 'string' }, status: { type: 'string', enum: ['pending', 'scheduled', 'delivered'], default: 'pending' } }, required: ['customer_name', 'address', 'bales'] },
  Setting: { type: 'object', properties: { key: { type: 'string' }, value: { type: 'string' } }, required: ['key', 'value'] },
  Reimbursement: { type: 'object', properties: { name: { type: 'string' }, purchase_date: { type: 'string', format: 'date' }, amount: { type: 'number' }, purpose: { type: 'string' }, description: { type: 'string' }, receipt_file_uri: { type: 'string' }, status: { type: 'string', enum: ['pending', 'approved', 'reimbursed', 'rejected'], default: 'pending' }, admin_note: { type: 'string' } }, required: ['name', 'purchase_date', 'amount', 'purpose', 'receipt_file_uri'] },
};

function createEntityProxy(entityName) {
  const invoke = (operation, params = {}) =>
    base44.functions.invoke('sheets-proxy', { entity: entityName, operation, ...params }).then(res => res.data);

  return {
    list: (sort, limit) => invoke('list', { sort, limit }),
    filter: (query, sort, limit) => invoke('filter', { query, sort, limit }),
    get: (id) => invoke('get', { id }),
    create: (data) => invoke('create', { data }),
    update: (id, data) => invoke('update', { id, data }),
    delete: (id) => invoke('delete', { id }),
    bulkCreate: (items) => invoke('bulkCreate', { data: items }),
    updateMany: (query, data) => invoke('updateMany', { query, data }),
    deleteMany: (query) => invoke('deleteMany', { query }),
    bulkUpdate: (items) => invoke('bulkUpdate', { data: items }),
    schema: () => ENTITY_SCHEMAS[entityName] || { type: 'object', properties: {} },
    subscribe: () => () => {},
  };
}

const sheetsEntities = {};
ENTITY_NAMES.forEach(name => { sheetsEntities[name] = createEntityProxy(name); });

Object.defineProperty(base44, 'entities', {
  value: sheetsEntities,
  writable: true,
  configurable: true,
});