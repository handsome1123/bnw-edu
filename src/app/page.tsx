export default function Home() {
  return (
    <main style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to My Simple Next.js App</h1>
      <a href="/about">
        <button style={{ padding: '10px 20px', fontSize: '16px' }}>
          Go to About Page
        </button>
      </a>
    </main>
  );
}
