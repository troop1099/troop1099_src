import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format, parseISO } from 'date-fns';
import { Plus, X, Upload } from 'lucide-react';

const HISTORICAL_EAGLES = [
  { name: 'Richard Folea', date: '2006-04-11' },
  { name: 'Tyler Grant', date: '2007-01-25' },
  { name: 'Justin Stephens', date: '2008-03-12' },
  { name: 'Andrew Wright', date: '2008-06-26' },
  { name: 'Chris Folea', date: '2008-09-01' },
  { name: 'Chris Brown', date: '2008-10-30' },
  { name: 'T.J. Goff', date: '2008-10-30' },
  { name: 'Andrew Wild', date: '2009-02-26' },
  { name: 'Matt Avera Jr.', date: '2009-07-23' },
  { name: 'Braxton T. Bodenhamer', date: '2009-09-30' },
  { name: 'Kraig Barrett', date: '2009-10-22' },
  { name: 'Chris Heard', date: '2009-11-19' },
  { name: 'Andrew Kratzer', date: '2009-12-18' },
  { name: 'Christopher J. Davisson', date: '2010-02-25' },
  { name: 'Ian C. Miller', date: '2010-03-25' },
  { name: 'Austin Morgan', date: '2010-12-16' },
  { name: 'Hugh Stephens', date: '2011-05-12' },
  { name: 'Dalton Corbin', date: '2011-05-26' },
  { name: 'Trevor J. Grant', date: '2011-05-26' },
  { name: 'Michael Hanson', date: '2011-06-23' },
  { name: 'Nick Kratzer', date: '2011-07-29' },
  { name: 'Phillip Reynolds', date: '2011-08-25' },
  { name: 'Jonathan Murphy', date: '2011-10-27' },
  { name: 'Andrew King', date: '2011-11-17' },
  { name: 'Kevin Brown', date: '2011-12-13' },
  { name: 'Tyler Webb', date: '2012-01-27' },
  { name: 'Micah Salmon', date: '2012-03-22' },
  { name: 'Cal Lieb', date: '2012-04-26' },
  { name: 'Jason Lieb', date: '2012-04-26' },
  { name: 'Nicholas Rodriguez', date: '2012-10-25' },
  { name: 'Clark S. Heys', date: '2013-03-28' },
  { name: 'Mathew Hanson', date: '2013-05-23' },
  { name: 'Zac Benton', date: '2013-07-25' },
  { name: 'Eric Danielsson', date: '2013-07-25' },
  { name: 'David King', date: '2013-07-25' },
  { name: 'Tommy Jenkins', date: '2013-12-17' },
  { name: 'Andy Cline', date: '2014-02-25' },
  { name: 'Harrison Humphries', date: '2014-02-25' },
  { name: 'Jack Flikeid', date: '2014-06-24' },
  { name: 'Connor Trembley', date: '2014-10-28' },
  { name: 'Michael DiRusso', date: '2015-02-24' },
  { name: 'Cameron Hancock', date: '2015-02-24' },
  { name: 'Drew Brown', date: '2015-03-24' },
  { name: 'Will Brown', date: '2015-03-24' },
  { name: 'Ryan Greenlow', date: '2015-03-24' },
  { name: 'Jay Brown', date: '2015-04-28' },
  { name: 'Grant Robertson', date: '2015-08-25' },
  { name: 'Brent Lieb', date: '2016-02-22' },
  { name: 'Dillon Hemphill', date: '2016-02-22' },
  { name: 'Jared Bennett', date: '2016-02-22' },
  { name: 'Austin Griffin', date: '2016-02-22' },
  { name: 'Travis Eastin', date: '2016-03-22' },
  { name: 'Milo Hampson', date: '2016-03-22' },
  { name: 'James Collinson', date: '2016-05-24' },
  { name: 'Christopher Johnson', date: '2016-07-26' },
  { name: 'Austin Odom', date: '2017-02-28' },
  { name: 'Shaun McManus', date: '2017-03-28' },
  { name: 'Ethan Karp', date: '2017-04-26' },
  { name: 'Tommy Kashin', date: '2017-10-24' },
  { name: 'Steven Brauckman', date: '2017-10-24' },
  { name: 'Samuel Schleif', date: '2017-10-24' },
  { name: 'Clay Wells', date: '2017-10-24' },
  { name: 'Peyton Hancock', date: '2018-03-27' },
  { name: 'Ted Shipley', date: '2018-03-27' },
  { name: 'Nolan McGinley', date: '2018-05-22' },
  { name: 'Reid Collinson', date: '2018-06-26' },
  { name: 'Matthew King', date: '2018-07-24' },
  { name: 'Logan Trembley', date: '2018-11-27' },
  { name: 'Logan Griffin', date: '2018-11-27' },
  { name: 'Luke Knoerr', date: '2019-01-29' },
  { name: 'Reese Lofgren', date: '2019-02-26' },
  { name: 'Cameron Williams', date: '2019-07-16' },
  { name: 'Addison Alsobrook', date: '2020-01-28' },
  { name: 'Alex Carroll', date: '2020-06-23' },
  { name: 'Aditya Voota', date: '2020-12-15' },
  { name: 'Jay Ariga', date: '2021-02-23' },
  { name: 'Riley Lofgren', date: '2021-06-22' },
  { name: 'Jack Elliott', date: '2021-08-24' },
  { name: 'Will Carroll', date: '2021-10-19' },
  { name: 'Tarun Ramesh', date: '2021-10-19' },
  { name: 'Benton Lee', date: '2022-02-28' },
  { name: 'Ian Causseaux', date: '2022-02-28' },
  { name: 'Henry Kashin', date: '2022-06-28' },
  { name: 'Mohan Nellutla', date: '2022-06-28' },
  { name: 'Likhith Vallabhaneni', date: '2022-09-27' },
  { name: 'Justin Guillory', date: '2022-12-27' },
  { name: 'Patrick Gannon, Jr', date: '2023-09-26' },
  { name: 'Walker Williams', date: '2023-10-17' },
  { name: 'Aditya Harathi', date: '2023-12-19' },
  { name: 'Ajay Murugappan', date: '2023-12-19' },
  { name: 'Matthew Van Velsor', date: '2024-03-26' },
  { name: 'Vedant Naik', date: '2024-03-26' },
  { name: 'Praful Musty', date: '2024-08-27' },
  { name: 'Dhruv Anupindi', date: '2024-09-24' },
  { name: 'Arjun Puvvada', date: '2026-01-27' },
  { name: 'Prajeeth Eskala', date: '2026-02-24' },
  { name: 'John Barr Kashin / Jack', date: '2026-04-28' },
  { name: 'Mark Alejandro Romero', date: '2026-05-26' },
];

function groupByYear(eagles) {
  const grouped = {};
  eagles.forEach(e => {
    const year = new Date(e.date).getFullYear();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(e);
  });
  return grouped;
}

function AddEagleModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', date: '', photo_url: '', project: '' });
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, photo_url: file_url }));
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1a2744] text-lg">Add Eagle Scout</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name *</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Date Earned *</label>
            <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Photo</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
            {uploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
            {form.photo_url && <img src={form.photo_url} className="w-16 h-16 rounded-full object-cover mt-2" />}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Project (optional)</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" value={form.project} onChange={e => setForm(f => ({...f, project: e.target.value}))} />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded text-sm">Cancel</button>
          <button onClick={() => onSave(form)} disabled={!form.name || !form.date} className="flex-1 py-2 bg-[#1a2744] text-white rounded text-sm font-semibold disabled:opacity-50">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function EaglesNest() {
  const [showAdd, setShowAdd] = useState(false);
  const queryClient = useQueryClient();

  const { data: dbEagles = [] } = useQuery({
    queryKey: ['eagles'],
    queryFn: () => base44.entities.Eagle.list('-date', 200),
  });

  const addMutation = useMutation({
    mutationFn: (data) => base44.entities.Eagle.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['eagles']); setShowAdd(false); }
  });

  // Combine historical + DB eagles, sorted by date
  const allEagles = [
    ...HISTORICAL_EAGLES.map(e => ({ ...e, isHistorical: true })),
    ...dbEagles.map(e => ({ ...e, isHistorical: false }))
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  const grouped = groupByYear(allEagles);
  const years = Object.keys(grouped).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2744] text-white py-10 px-6 text-center">
        <h1 className="text-3xl font-bold">Eagle Scouts of Troop 1099</h1>
        <p className="text-white/70 mt-2 max-w-xl mx-auto">The highest rank in Scouting. These young men have demonstrated exceptional leadership and service.</p>
        <p className="text-[#FFD700] font-bold text-xl mt-3">{allEagles.length} Eagle Scouts</p>
        <button
          onClick={() => setShowAdd(true)}
          className="mt-4 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-semibold text-sm"
        >
          <Plus className="w-4 h-4" /> Add Eagle Scout
        </button>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#1a2744]/20 -translate-x-1/2" />

          {years.map(year => (
            <div key={year} className="mb-10">
              {/* Year badge */}
              <div className="relative flex justify-center mb-6">
                <span className="relative z-10 bg-[#FFD700] text-[#1a2744] font-bold text-sm px-4 py-1 rounded-full shadow">
                  {year}
                </span>
              </div>

              <div className="space-y-4">
                {grouped[year].map((eagle, idx) => {
                  const isLeft = idx % 2 === 0;
                  return (
                    <div key={eagle.name + eagle.date} className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                      {/* Card */}
                      <div className={`w-5/12 bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-3 ${isLeft ? 'mr-auto' : 'ml-auto'}`}>
                        <div className="w-12 h-12 rounded-full bg-[#1a2744]/10 flex items-center justify-center shrink-0 overflow-hidden border-2 border-[#1a2744]/20">
                          {eagle.photo_url ? (
                            <img src={eagle.photo_url} alt={`${eagle.name} — Eagle Scout`} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[#1a2744] font-bold text-lg">{eagle.name[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1a2744] text-sm">{eagle.name}</p>
                          <p className="text-xs text-gray-500">{format(new Date(eagle.date), 'MMM d, yyyy')}</p>
                          {eagle.project && <p className="text-xs text-gray-400 mt-0.5">{eagle.project}</p>}
                        </div>
                      </div>

                      {/* Center connector */}
                      <div className="flex-shrink-0 w-2/12 flex justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#1a2744] border-2 border-white shadow" />
                      </div>

                      {/* Spacer */}
                      <div className="w-5/12" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <AddEagleModal
          onClose={() => setShowAdd(false)}
          onSave={(data) => addMutation.mutate(data)}
        />
      )}
    </div>
  );
}