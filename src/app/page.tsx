'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HeroPreview from '../components/HeroPreview';
import EditorialStatement from '../components/EditorialStatement';
import CurvedMarquee from '../components/CurvedMarquee';
import WorkflowSection from '../components/WorkflowSection';
import FeatureAccordion from '../components/FeatureAccordion';
import PricingSection from '../components/PricingSection';
import BentoGrid from '../components/BentoGrid';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        color: '#141414',
        overflowX: 'clip',
      }}
    >
      <Navbar />
      <Hero />
      <HeroPreview />
      <EditorialStatement />
      <CurvedMarquee />
      <WorkflowSection />
      <FeatureAccordion />
      <PricingSection />
      <BentoGrid />
      <Footer />
    </main>
  );
}
