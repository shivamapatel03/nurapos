'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

export default function HomePage() {
  const features = [
    { icon: <PointOfSaleOutlinedIcon />, number: '01', title: 'Checkout without friction', text: 'A faster register for busy counters, clean handoffs, and confident service.' },
    { icon: <Inventory2OutlinedIcon />, number: '02', title: 'Inventory that stays current', text: 'Know what is moving, what is low, and what deserves attention next.' },
    { icon: <InsightsOutlinedIcon />, number: '03', title: 'Clarity after every shift', text: 'Turn daily transactions into decisions your whole team can act on.' },
    { icon: <GroupsOutlinedIcon />, number: '04', title: 'One team, one workspace', text: 'Keep managers, cashiers, and operators working from the same source of truth.' },
  ];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F7F7F5', color: '#141414' }}>
      <Navbar />
      <Hero />

      <section id="features" className="landing-bento-section" style={{ padding: 'clamp(4rem, 9vw, 8rem) 1.5rem' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div className="landing-reveal" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 0.65rem', fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#777' }}>The operating system for your store</p>
              <h2 style={{ maxWidth: '600px', margin: 0, fontSize: 'clamp(2.2rem, 5vw, 4.6rem)', fontWeight: 500, lineHeight: 0.98, letterSpacing: '-0.055em' }}>Less noise.<br />More control.</h2>
            </div>
            <p style={{ maxWidth: '310px', margin: 0, color: '#666', fontSize: '14px', lineHeight: 1.55 }}>Everything your team needs to move from first order to end-of-day clarity.</p>
          </div>

          <div className="landing-bento-grid">
            {features.map((feature, index) => (
              <article key={feature.number} className={`landing-bento-card landing-reveal landing-reveal-delay-${index + 1}`} style={{ backgroundColor: index === 0 ? '#121212' : '#FFFFFF', color: index === 0 ? '#FFFFFF' : '#141414', border: '1px solid #DCDCD8', borderRadius: '1rem', padding: 'clamp(1.35rem, 3vw, 2rem)', minHeight: index === 0 ? '330px' : '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', border: `1px solid ${index === 0 ? '#444' : '#D8D8D4'}`, borderRadius: '0.7rem' }}>{React.cloneElement(feature.icon, { sx: { fontSize: 22 } })}</span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: index === 0 ? '#999' : '#999' }}>{feature.number}</span>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 0.6rem', fontSize: 'clamp(1.35rem, 2.5vw, 2rem)', fontWeight: 600, letterSpacing: '-0.04em' }}>{feature.title}</h3>
                  <p style={{ maxWidth: '340px', margin: 0, color: index === 0 ? '#B7B7B7' : '#707070', fontSize: '13px', lineHeight: 1.55 }}>{feature.text}</p>
                </div>
              </article>
            ))}
            <article className="landing-bento-card landing-reveal landing-reveal-delay-5" style={{ gridColumn: 'span 2', backgroundColor: '#E6E6E1', border: '1px solid #D1D1CB', borderRadius: '1rem', padding: 'clamp(1.35rem, 3vw, 2rem)', minHeight: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <p style={{ margin: '0 0 0.6rem', fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6F6F6A' }}>Built to grow with you</p>
                <h3 style={{ maxWidth: '500px', margin: 0, fontSize: 'clamp(1.7rem, 3.5vw, 3rem)', fontWeight: 500, lineHeight: 1, letterSpacing: '-0.05em' }}>A sharper day starts<br />with a simpler system.</h3>
              </div>
              <a href="/signup" className="button-20" role="button">Get started <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} /></a>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-reveal" style={{ padding: '1.25rem 1.5rem 5rem', maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ borderTop: '1px solid #DCDCD8', borderBottom: '1px solid #DCDCD8', padding: '1.25rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#858580' }}>A calmer operating rhythm for</span>
          <div style={{ display: 'flex', gap: 'clamp(1rem, 4vw, 3.5rem)', alignItems: 'center', flexWrap: 'wrap', color: '#444' }}>
            {['Cafes', 'Retail stores', 'Restaurants', 'Service counters'].map((label) => <span key={label} style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '-0.02em' }}>{label}</span>)}
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(4rem, 9vw, 8rem) 1.5rem', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 0.8fr) minmax(0, 1.2fr)', gap: 'clamp(2rem, 7vw, 7rem)', alignItems: 'center' }}>
          <div className="landing-reveal">
            <p style={{ margin: '0 0 0.75rem', fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#777' }}>From first scan to final report</p>
            <h2 style={{ margin: '0 0 1rem', fontSize: 'clamp(2.2rem, 5vw, 4.6rem)', fontWeight: 500, lineHeight: 0.98, letterSpacing: '-0.055em' }}>Your whole day,<br />in one view.</h2>
            <p style={{ maxWidth: '390px', margin: '0 0 1.5rem', color: '#666', fontSize: '14px', lineHeight: 1.65 }}>Nuradesk connects the counter to the back office, so every action is visible, useful, and ready for the next decision.</p>
            <a href="/signup" className="button-20" role="button">Explore the workspace <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} /></a>
          </div>
          <div className="landing-image-frame landing-reveal landing-reveal-delay-2" style={{ minHeight: '420px', position: 'relative', overflow: 'hidden', borderRadius: '1rem', backgroundColor: '#E9E9E4' }}>
            <img src="/dashimages/card2dash.png" alt="Nuradesk POS workspace" style={{ width: '80%', height: '80%', objectFit: 'contain', position: 'absolute', inset: 0, margin: 'auto' }} />
            <span style={{ position: 'absolute', left: '1.25rem', bottom: '1.25rem', padding: '0.5rem 0.7rem', backgroundColor: '#FFFFFF', borderRadius: '9999px', fontSize: '11px', fontWeight: 800 }}>Live register, clear decisions</span>
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(4rem, 9vw, 8rem) 1.5rem', backgroundColor: '#141414', color: '#FFFFFF' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div className="landing-reveal" style={{ maxWidth: '620px', marginBottom: '2.5rem' }}>
            <p style={{ margin: '0 0 0.75rem', fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#929292' }}>Signal, not noise</p>
            <h2 style={{ margin: 0, fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', fontWeight: 500, lineHeight: 0.98, letterSpacing: '-0.055em' }}>Make better calls<br />between the rush.</h2>
          </div>
          <div className="landing-bento-grid landing-bento-grid-dark">
            <div className="landing-bento-card landing-reveal landing-reveal-delay-1" style={{ gridColumn: 'span 2', minHeight: '300px', padding: 'clamp(1.5rem, 4vw, 2.5rem)', border: '1px solid #353535', borderRadius: '1rem', backgroundColor: '#1E1E1E', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8F8F8F', fontSize: '12px', fontWeight: 700 }}><span>Daily operations</span><span>Nuradesk / 01</span></div>
              <div><div style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', lineHeight: 0.85, letterSpacing: '-0.08em', fontWeight: 500 }}>−31%</div><p style={{ maxWidth: '300px', margin: '1rem 0 0', color: '#B9B9B9', fontSize: '13px', lineHeight: 1.5 }}>less time spent searching for stock, orders, and answers.</p></div>
            </div>
            <div className="landing-bento-card landing-reveal landing-reveal-delay-2" style={{ minHeight: '300px', padding: 'clamp(1.5rem, 4vw, 2.5rem)', border: '1px solid #353535', borderRadius: '1rem', backgroundColor: '#B9E4D0', color: '#14211B', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 800 }}>Live stock signal</span><div><strong style={{ display: 'block', fontSize: '3.4rem', lineHeight: 0.9, letterSpacing: '-0.07em' }}>98.2%</strong><p style={{ margin: '1rem 0 0', fontSize: '13px', lineHeight: 1.5 }}>of active products are ready to sell.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(4rem, 9vw, 8rem) 1.5rem' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="landing-reveal"><p style={{ margin: '0 0 0.65rem', fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#777' }}>Simple, transparent plans</p><h2 style={{ margin: 0, fontSize: 'clamp(2.2rem, 5vw, 4.4rem)', fontWeight: 500, letterSpacing: '-0.055em', lineHeight: 0.98 }}>SaleSolution™ plans<br />for every counter.</h2></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {[['Starter', '₹1,900', 'For a single counter finding its rhythm.', ['1 register', 'Core inventory', 'Daily sales view']], ['Scale', '₹2,800', 'For teams ready to see the whole picture.', ['Unlimited products', 'Staff permissions', 'Reports & insights']]].map(([name, price, text, items], index) => <div key={String(name)} className={`landing-bento-card landing-reveal landing-reveal-delay-${index + 1}`} style={{ padding: '1.5rem', border: `1px solid ${index === 1 ? '#141414' : '#DCDCD8'}`, borderRadius: '1rem', backgroundColor: index === 1 ? '#141414' : '#FFFFFF', color: index === 1 ? '#FFFFFF' : '#141414' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{name}</h3><span style={{ fontSize: '11px', color: index === 1 ? '#B9B9B9' : '#777' }}>{index === 1 ? 'Most chosen' : 'Start here'}</span></div><div style={{ margin: '2.5rem 0 0.5rem', fontSize: '2.6rem', letterSpacing: '-0.06em', fontWeight: 600 }}>{price}<small style={{ fontSize: '12px', letterSpacing: 0, color: index === 1 ? '#B9B9B9' : '#777' }}>/month</small></div><p style={{ minHeight: '42px', margin: '0 0 1.5rem', color: index === 1 ? '#B9B9B9' : '#777', fontSize: '13px', lineHeight: 1.5 }}>{text}</p><a href="/signup" className={index === 1 ? 'button-20-secondary' : 'button-20'} role="button" style={index === 1 ? { width: '100%', backgroundColor: '#FFFFFF', color: '#141414', borderColor: '#FFFFFF' } : { width: '100%' }}>Choose {name}</a><div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.6rem' }}>{(items as string[]).map((item) => <span key={item} style={{ fontSize: '12px', color: index === 1 ? '#D5D5D5' : '#666' }}>＋ {item}</span>)}</div></div>)}
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) 1.5rem', backgroundColor: '#E6E6E1' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }} className="landing-reveal"><p style={{ margin: '0 0 0.75rem', fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#777' }}>A note from the counter</p><blockquote style={{ margin: 0, fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', lineHeight: 1.02, letterSpacing: '-0.05em', fontWeight: 500 }}>“We stopped asking where the answer was. Nuradesk made it visible.”</blockquote><p style={{ margin: '1.5rem 0 0', color: '#666', fontSize: '13px' }}>Maya Patel · Operations lead, Ahmedabad</p></div>
      </section>

      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}><div className="landing-reveal" style={{ textAlign: 'center', marginBottom: '2rem' }}><p style={{ margin: '0 0 0.65rem', fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#777' }}>Need to know</p><h2 style={{ margin: 0, fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 500, letterSpacing: '-0.055em' }}>Frequently asked<br />questions</h2></div>{['Can I start with one counter?', 'Does Nuradesk work for cafes and retail?', 'Can my team use different roles?', 'Can I connect my existing product catalog?'].map((question) => <details key={question} style={{ borderTop: '1px solid #DCDCD8', padding: '1rem 0' }}><summary className="product-details-summary" style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '14px', fontWeight: 700 }}>{question}<span>＋</span></summary><p style={{ margin: '0.75rem 2rem 0 0', color: '#666', fontSize: '13px', lineHeight: 1.6 }}>Yes. Nuradesk is designed to start simply and grow with your store as your team and catalog become more complex.</p></details>)}</div>
      </section>

      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) 1.5rem', backgroundColor: '#141414', color: '#FFFFFF' }}><div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }} className="landing-reveal"><p style={{ margin: '0 0 0.75rem', fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#929292' }}>Ready when you are</p><h2 style={{ margin: '0 0 1.5rem', fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 0.92, letterSpacing: '-0.07em', fontWeight: 500 }}>Make the next shift<br />feel lighter.</h2><a href="/signup" className="button-20-secondary" role="button" style={{ backgroundColor: '#B9E4D0', borderColor: '#B9E4D0', color: '#14211B' }}>Start with Nuradesk <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} /></a></div></section>

      <footer style={{ padding: '1.5rem', borderTop: '1px solid #DCDCD8', color: '#777', fontSize: '12px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <span>© {new Date().getFullYear()} Nuradesk</span>
          <span>Made for better store days.</span>
        </div>
      </footer>
    </main>
  );
}
