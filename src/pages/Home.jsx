import React from 'react';
import HeroSection from '../components/home/HeroSection';
import MissionSection from '../components/home/MissionSection';
import AdventurePreview from '../components/home/AdventurePreview';
import UpcomingEvents from '../components/home/UpcomingEvents';
import CTASection from '../components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <MissionSection />
      <AdventurePreview />
      <UpcomingEvents />
      <CTASection />
    </>
  );
}