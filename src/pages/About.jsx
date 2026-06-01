import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, Compass, TreePine } from 'lucide-react';

const KNOT_IMAGE = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/3634f29c4_generated_f1f9d9a2.png';
const COMPASS_IMAGE = 'https://media.base44.com/images/public/6a1da1101f26862b7b863a4a/ee891a942_generated_3427581d.png';

const values = [
  { icon: Shield, title: 'Trustworthy', description: 'A Scout tells the truth. They are honest and can always be counted on.' },
  { icon: Heart, title: 'Helpful', description: 'A Scout is concerned about other people. They volunteer to help without expecting reward.' },
  { icon: Compass, title: 'Brave', description: 'A Scout faces danger even if afraid. They stand for what is right even when it is difficult.' },
  { icon: TreePine, title: 'Reverent', description: 'A Scout is reverent toward God, faithful in religious duties, and respectful of others\' beliefs.' },
];

export default function About() {
  return (
    <div className="pt-24 md:pt-32">
      {/* Header */}
      <section className="px-[5vw] md:px-[10vw] pb-16 md:pb-24 topo-pattern">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-12"
        >
          <div className="md:col-span-6">
            <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-4">
              About Us
            </p>
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-foreground leading-tight">
              Our Story
            </h1>
            <p className="font-body text-lg text-muted-foreground mt-6 leading-[1.65]">
              Chartered in 2005, BSA Troop 1099 has grown from a small group of
              dedicated families into one of the most active and accomplished troops
              in the council. Our scouts have summited peaks, paddled wild rivers,
              served thousands of community hours, and — most importantly — grown into
              men of character.
            </p>
            <p className="font-body text-lg text-muted-foreground mt-4 leading-[1.65]">
              We believe that the best classroom has no ceiling. Every trail, every
              campfire, every challenge in the wilderness is an opportunity to build
              the leaders our world needs.
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <div className="aspect-square rounded-sm overflow-hidden">
              <img
                src={KNOT_IMAGE}
                alt="Perfectly tied bowline knot on weathered rope in golden hour lighting"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Scout Law Values */}
      <section className="py-24 md:py-36 bg-secondary text-secondary-foreground">
        <div className="px-[5vw] md:px-[10vw]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-4">
              Our Values
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-5xl">
              The Scout Law Guides Us
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{value.title}</h3>
                <p className="font-body text-sm text-secondary-foreground/60 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 md:py-36 px-[5vw] md:px-[10vw] topo-pattern">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5">
            <div className="aspect-[4/3] rounded-sm overflow-hidden">
              <img
                src={COMPASS_IMAGE}
                alt="Vintage brass compass on a worn topographic map in warm golden lighting"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-4">
                Leadership
              </p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground leading-tight mb-6">
                Guided by Experienced Hands
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-[1.65]">
                Our adult leaders bring decades of scouting experience and a passion for
                mentoring young men. Every leader is trained in Youth Protection, Wilderness
                First Aid, and outdoor leadership skills.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <p className="font-heading font-bold text-2xl text-foreground">12+</p>
                  <p className="font-heading text-xs tracking-wider text-muted-foreground uppercase mt-1">Adult Leaders</p>
                </div>
                <div>
                  <p className="font-heading font-bold text-2xl text-foreground">100%</p>
                  <p className="font-heading text-xs tracking-wider text-muted-foreground uppercase mt-1">YPT Certified</p>
                </div>
                <div>
                  <p className="font-heading font-bold text-2xl text-foreground">8</p>
                  <p className="font-heading text-xs tracking-wider text-muted-foreground uppercase mt-1">Eagle Mentors</p>
                </div>
                <div>
                  <p className="font-heading font-bold text-2xl text-foreground">40+</p>
                  <p className="font-heading text-xs tracking-wider text-muted-foreground uppercase mt-1">Years Combined Experience</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}