import { base44 } from '@/api/base44Client';

export async function fetchMeritBadgeData(bsaUrl) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `Go to this BSA Scouting merit badge page: ${bsaUrl}\n\nExtract the following:\n1. The exact merit badge name\n2. A 1-2 sentence description of the badge\n3. The full list of official requirements (one per line)\n4. The URL of the official merit badge image if visible on the page`,
    add_context_from_internet: true,
    model: 'gemini_3_flash',
    response_json_schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        requirements: { type: 'array', items: { type: 'string' } },
        image_url: { type: 'string' }
      }
    }
  });
  return result;
}

export function validateImageUrl(url) {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      resolve(false);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    setTimeout(() => resolve(false), 8000);
  });
}

export async function refreshBadge(badge, queryClient) {
  if (!badge.bsa_url) {
    return { success: false, message: 'No official BSA URL for this badge.' };
  }

  let result;
  try {
    result = await fetchMeritBadgeData(badge.bsa_url);
  } catch {
    return { success: false, message: 'Unable to retrieve updated information from the official BSA page. Existing information was kept.' };
  }

  const updateData = {};

  if (result.image_url) {
    const valid = await validateImageUrl(result.image_url);
    if (valid) updateData.image_url = result.image_url;
  }

  if (result.description && result.description.trim()) {
    updateData.description = result.description.trim();
  }

  if (result.requirements && result.requirements.length > 0) {
    updateData.requirements = JSON.stringify(result.requirements);
  }

  if (Object.keys(updateData).length === 0) {
    return { success: false, message: 'Unable to retrieve updated information from the official BSA page. Existing information was kept.' };
  }

  if (badge.dbId) {
    await base44.entities.MeritBadge.update(badge.dbId, updateData);
  } else {
    await base44.entities.MeritBadge.create({
      name: badge.name,
      bsa_url: badge.bsa_url,
      ...updateData,
    });
  }

  if (queryClient) queryClient.invalidateQueries(['merit-badges']);

  return { success: true, updateData };
}