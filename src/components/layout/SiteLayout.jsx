import React from 'react';
import { Outlet } from 'react-router-dom';
import TacticalNav from '../navigation/TacticalNav';
import Footer from './Footer';

export default function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <TacticalNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}