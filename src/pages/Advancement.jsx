import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Award } from 'lucide-react';

const ranks = [
  {
    name: 'Scout',
    color: '#8B7355',
    description: 'The beginning of the trail. Learn the Scout Oath, Law, and basic outdoor skills.',
    requirements: ['Learn the Scout Oath and Law', 'Understand the patrol method', 'Demonstrate the Scout sign, salute, and handshake', 'Tie a square knot', 'Describe and identify the BSA uniform'],
  },
  {
    name: 'Tenderfoot',
    color: '#6B8E23',
    description: 'First steps into outdoor skills, fitness, and citizenship.',
    requirements: ['Participate in a campout', 'Cook a meal on a campout', 'Demonstrate first aid for simple injuries', 'Complete a 1-mile hike', 'Identify local poisonous plants'],
  },
  {
    name: 'Second Class',
    color: '#4682B4',
    description: 'Building competence in navigation, cooking, and nature.',
    requirements: ['Use a compass to take a bearing', 'Complete a 5-mile hike', 'Cook a full meal without utensils', 'Identify 10 native plants', 'Earn a swimming merit badge requirement', 'Demonstrate knife safety'],
  },
  {
    name: 'First Class',
    color: '#CD853F',
    description: 'A skilled scout ready to lead patrols and teach others.',
    requirements: ['Complete a 10-mile day hike', 'Plan and lead a patrol campout', 'Use a map and compass together on a hike', 'Demonstrate rescue breathing', 'Identify local constellations', 'Complete a service project'],
  },
  {
    name: 'Star',
    color: '#DAA520',
    description: 'Stepping into leadership through merit badges and service.',
    requirements: ['Earn 6 merit badges (4 Eagle-required)', 'Serve actively in a troop leadership position for 4 months', 'Complete 6 hours of community service', 'Plan a community service project'],
  },
  {
    name: 'Life',
    color: '#B22222',
    description: 'A proven leader with deep commitment to service and growth.',
    requirements: ['Earn 11 merit badges (7 Eagle-required)', 'Serve in a leadership position for 6 months', 'Complete 6 additional hours of service', 'Participate in a Scoutmaster conference'],
  },
  {
    name: 'Eagle',
    color: '#D95D39',
    description: 'The pinnacle of Scouting achievement. A leader for life.',
    requirements: ['Earn 21 merit badges (13 Eagle-required)', 'Serve in a leadership position for 6 months', 'Plan and lead an Eagle service project', 'Complete an Eagle board of review', 'Demonstrate Scout spirit throughout your journey'],
  },
];

export default function Advancement() {
  const [selectedRank, setSelectedRank] = useState(null);

  return (
    <div className="pt-14">
      {/* Header */}
      <section className="px-[5vw] md:px-[10vw] pb-16 md:pb-24 topo-pattern">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-4">
            Advancement
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight">
            Trail to Eagle
          </h1>
          <p className="font-body text-lg text-muted-foreground mt-4 max-w-xl leading-relaxed">
            The path from Scout to Eagle is a journey of growth, leadership, and service.
            Click on any rank to see the requirements.
          </p>
        </motion.div>
      </section>

      {/* Progress Ribbon */}
      <section className="px-[5vw] md:px-[10vw] pb-24 md:pb-36">
        {/* Horizontal ribbon - desktop */}
        <div className="hidden md:block relative">
          {/* The trail line */}
          <div className="absolute top-12 left-0 right-0 h-px bg-border" />
          <motion.div
            className="absolute top-12 left-0 h-px bg-accent"
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />

          <div className="grid grid-cols-7 gap-4">
            {ranks.map((rank, i) => (
              <motion.button
                key={rank.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                onClick={() => setSelectedRank(rank)}
                className="group flex flex-col items-center text-center pt-4"
              >
                <div
                  className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:shadow-lg bg-background"
                  style={{ borderColor: rank.color }}
                >
                  <Award className="w-6 h-6" style={{ color: rank.color }} />
                </div>
                <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-accent transition-colors">
                  {rank.name}
                </h3>
                <p className="font-heading text-[10px] tracking-wider text-muted-foreground mt-1 uppercase">
                  Rank {i + 1}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Vertical ribbon - mobile */}
        <div className="md:hidden relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-6">
            {ranks.map((rank, i) => (
              <motion.button
                key={rank.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={() => setSelectedRank(rank)}
                className="group relative flex items-center gap-5 w-full text-left"
              >
                <div
                  className="relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center bg-background shrink-0"
                  style={{ borderColor: rank.color }}
                >
                  <Award className="w-4 h-4" style={{ color: rank.color }} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground group-hover:text-accent transition-colors">
                    {rank.name}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    {rank.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0 ml-auto" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Rank Detail Cards (Desktop) */}
        <div className="hidden md:grid grid-cols-7 gap-4 mt-6">
          {ranks.map((rank) => (
            <div key={rank.name} className="text-center">
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                {rank.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Rank Modal */}
      <AnimatePresence>
        {selectedRank && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#142319]/70 flex items-center justify-center p-4"
            onClick={() => setSelectedRank(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-background rounded-sm max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: selectedRank.color }}
                    >
                      <Award className="w-6 h-6" style={{ color: selectedRank.color }} />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-2xl text-foreground">
                        {selectedRank.name}
                      </h2>
                      <p className="font-body text-sm text-muted-foreground">
                        {selectedRank.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRank(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="border-t border-border pt-6">
                  <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-4">
                    Key Requirements
                  </p>
                  <ul className="space-y-3">
                    {selectedRank.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center shrink-0 mt-0.5">
                          <span className="font-heading text-[10px] text-muted-foreground">{i + 1}</span>
                        </div>
                        <span className="font-body text-foreground leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}