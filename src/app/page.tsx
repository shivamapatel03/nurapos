'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import EditorialStatement from '../components/EditorialStatement';
import CurvedMarquee from '../components/CurvedMarquee';
import FeatureAccordion from '../components/FeatureAccordion';
import PricingSection from '../components/PricingSection';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        color: '#141414',
        overflowX: 'clip',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Navbar />
      <Hero />
      <EditorialStatement />
      <CurvedMarquee />
      <FeatureAccordion />
      <PricingSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
