import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#FFFFFF',
      color: '#000000',
      textAlign: 'center',
    }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: '#525252', marginBottom: '2rem' }}>Could not find requested resource</p>
      <Link href="/" className="button-20" role="button">
        Return to Home
      </Link>
    </div>
  );
}
