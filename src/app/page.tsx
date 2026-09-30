'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HeroPreview from '../components/HeroPreview';
import WorkflowSection from '../components/WorkflowSection';
import BentoGrid from '../components/BentoGrid';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        color: '#141414',
        overflowX: 'hidden',
      }}
    >
      <Navbar />
      <Hero />
      <HeroPreview />
      <WorkflowSection />
      <BentoGrid />
      <Footer />
    </main>
  );
}
