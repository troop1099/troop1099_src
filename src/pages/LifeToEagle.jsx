import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, CheckSquare, FileText, Users, Edit2, Save, X } from 'lucide-react';
import { useAdmin } from '@/lib/AdminContext';

const SIGNUP_KEY = 'etowah_district_signup_url';
const DEFAULT_SIGNUP_URL = 'https://www.signupgenius.com/go/4090544ABAE2DAAFA7-60003792-etowah#/';

const checklist = [
  'Earned all 21 required merit badges (13 Eagle-required)',
  'Served actively in a leadership position for 6 months after Life rank',
  'Completed Eagle Scout Service Project',
  'Eagle Scout Service Project Workbook completed (both parts)',
  'Eagle Rank Application filled out completely',
  'Letters of Recommendation requested (allow 2–3 weeks)',
  'Statement of ambitions and life purpose written',
  'Application submitted to Jefferson Service Center (2 weeks prior to BOR)',
  'Eagle Board of Review scheduled',
  'Scout spirit demonstrated throughout scouting career',
];

export default function LifeToEagle() {
  const [signupUrl, setSignupUrl] = useState(() => localStorage.getItem(SIGNUP_KEY) || DEFAULT_SIGNUP_URL);
  const [editingUrl, setEditingUrl] = useState(false);
  const [urlDraft, setUrlDraft] = useState(signupUrl);
  const { adminUnlocked } = useAdmin();

  const saveUrl = () => {
    localStorage.setItem(SIGNUP_KEY, urlDraft);
    setSignupUrl(urlDraft);
    setEditingUrl(false);
  };

  const steps = [
    {
      icon: FileText,
      color: 'bg-blue-100 text-blue-700',
      title: 'Eagle Service Project Proposal',
      content: (
        <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
          <p>First, the Life Scout completes <strong>Part One of the Eagle Scout Service Project Workbook</strong>. This section outlines what the Scout plans to do, at a high level. He must schedule an appointment with the district to review the project and get approval to proceed.</p>
          <p className="font-semibold text-red-600">⚠️ Until this approval is received, a Scout CANNOT work on the project.</p>
          <div className="flex flex-col gap-2 mt-2">
            <a href="https://media.base44.com/files/public/6a1da1101f26862b7b863a4a/f0bc37543_EagleProjectWorkbook2023a.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold">
              📄 Download Eagle Scout Service Project Workbook (2023a) <ExternalLink className="w-3 h-3" />
            </a>

            {/* Editable Etowah District Sign-Up Genius Link */}
            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide">Etowah District — Approval Appointments</p>
                {!editingUrl && adminUnlocked
                  ? <button onClick={() => { setUrlDraft(signupUrl); setEditingUrl(true); }} className="text-xs text-gray-500 hover:text-[#1a2744] flex items-center gap-1">
                      <Edit2 className="w-3 h-3" /> Edit Link
                    </button>
                  : <div className="flex gap-1">
                      <button onClick={saveUrl} className="text-xs text-green-700 hover:text-green-900 flex items-center gap-1"><Save className="w-3 h-3" /> Save</button>
                      <button onClick={() => setEditingUrl(false)} className="text-xs text-gray-500 ml-2 flex items-center gap-1"><X className="w-3 h-3" /> Cancel</button>
                    </div>
                }
              </div>
              {editingUrl
                ? <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs mt-1" value={urlDraft} onChange={e => setUrlDraft(e.target.value)} placeholder="Paste SignUpGenius URL here..." />
                : <a href={signupUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-semibold">
                    📅 Project Proposal Approval, Eagle Board & Adult Volunteering (SignUpGenius) <ExternalLink className="w-3 h-3" />
                  </a>
              }
              <p className="text-xs text-yellow-700 mt-1.5 italic">This link updates annually — click "Edit Link" to paste the new year's URL.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: CheckSquare,
      color: 'bg-green-100 text-green-700',
      title: 'Eagle Project',
      content: (
        <div className="text-gray-700 text-sm leading-relaxed">
          <p>Following proposal approval, the Scout can work on the project and complete <strong>Part Two of the Workbook</strong>. Document all work carefully — photos, hours, materials, and participant lists.</p>
        </div>
      )
    },
    {
      icon: FileText,
      color: 'bg-yellow-100 text-yellow-700',
      title: 'Eagle Application',
      content: (
        <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
          <p>Once all requirements are complete, the Scout prepares the <strong>Eagle Rank Application</strong>. Read the application carefully — it contains 6 Requirements and 3 signatures that must be totally complete before an application will even be considered for an Eagle Board of Review.</p>
          <p><strong>Requirement Two</strong> requires the Scout to obtain Letters of Recommendation from parents, religious leader, employers, and others listed on the application. Letters are sent in sealed envelopes to the Eagle Board. Allow <strong>2–3 weeks</strong> for receipt of these letters prior to the scheduled Eagle Board of Review.</p>
          <p><strong>Requirement Six</strong> requires the Scout to write a statement of ambitions and life purpose and a listing of positions held where he demonstrated leadership skills.</p>
          <a href="https://filestore.scouting.org/filestore/pdf/512-728_WB_fillable.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold">
            📄 Download the Eagle Scout Application Form <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )
    },
    {
      icon: Users,
      color: 'bg-red-100 text-red-700',
      title: 'Eagle Board of Review Preparation',
      content: (
        <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
          <p>If all other Eagle Rank requirements are complete, the Scout is ready for his <strong>Eagle Board of Review</strong>.</p>
          <p>Your completed application must be submitted to the <strong>Jefferson Service Center</strong> a <strong>minimum of TWO weeks</strong> prior to your scheduled Eagle Board appointment.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2 space-y-2">
            <p><strong>Submitting your application:</strong> You can hand-deliver your completed application directly to the <strong>Jefferson Scout Shop / Service Center</strong> in Jefferson, GA, or you can drop it off at the <strong>Lawrenceville Scout Shop</strong> and they will forward it to Jefferson on your behalf. Either way, ensure it arrives at Jefferson at least two weeks before your Eagle Board appointment.</p>
            <div className="flex flex-wrap gap-3 mt-2">
              <a href="https://www.scouting.org/programs/scouts-bsa/scouts-bsa-local-council-locator/?council=119&location=jefferson%2C+GA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-semibold">
                📍 Jefferson Scout Shop <ExternalLink className="w-3 h-3" />
              </a>
              <a href="https://maps.google.com/?q=203+Swanson+Dr+Lawrenceville+GA+30043" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-semibold">
                📍 Lawrenceville Scout Shop <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <a href={signupUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold">
            📅 Schedule Eagle Board Appointment via Etowah District SignUpGenius <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )
    },
  ];

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="bg-[#1a2744] text-white py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">Life to Eagle Rank</h1>
          <p className="text-white/70 mt-2">Earning the rank of Eagle, the highest rank in Scouting, takes considerable time and effort.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <p className="text-gray-700 leading-relaxed">
          In addition to Merit Badges and leadership requirements in the Troop, the Life Scout is required to complete an Eagle Scout Service Project, which is completed in multiple steps.
        </p>

        {steps.map((step, i) => (
          <div key={step.title} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center shrink-0`}>
                <step.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-[#1a2744] text-lg mb-3">Step {i + 1}: {step.title}</h2>
                {step.content}
              </div>
            </div>
          </div>
        ))}

        {/* Checklist */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-bold text-[#1a2744] text-lg mb-4">📋 Eagle Preparation Checklist</h2>
          <div className="space-y-2">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 border-2 border-gray-300 rounded shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Request BOR */}
        <div className="bg-[#1a2744] rounded-lg p-6 text-white text-center">
          <p className="font-semibold mb-2">Ready to request your Eagle Board of Review?</p>
          <Link to="/advancement" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-semibold text-sm">
            Go to Advancement Center
          </Link>
        </div>
      </div>
    </div>
  );
}