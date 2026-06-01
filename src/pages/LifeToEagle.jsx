import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, CheckSquare, FileText, Users, Calendar } from 'lucide-react';

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
          <a href="https://filestore.scouting.org/filestore/pdf/512-927_WEB.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
            📄 Download Eagle Scout Service Project Workbook <ExternalLink className="w-3 h-3" />
          </a>
          <a href="https://www.atlantabsa.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
            📅 Schedule Project Approval Appointment (select "project approval") <ExternalLink className="w-3 h-3" />
          </a>
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
        <a href="https://filestore.scouting.org/filestore/pdf/512-728_WEB.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
          📄 Download Eagle Rank Application <ExternalLink className="w-3 h-3" />
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
        <p>Your completed application must be submitted to the Jefferson Service Center a <strong>minimum of TWO weeks</strong> prior to your scheduled Eagle Board appointment.</p>
        <a href="https://www.atlantabsa.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
          📅 Schedule Eagle Board Appointment (select "board of review") <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    )
  },
];

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

        {/* Steps */}
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