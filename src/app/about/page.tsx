import Link from "next/link";

export default function About() {
  return (
    <main style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>About Page</h1>
        <p>This is a simple Next.js application demonstrating routing.</p>
        <p>Feel free to explore the code and learn more about Next.js!</p>
      <Link href="/">
        <button style={{ padding: '10px 20px', fontSize: '16px' }}>
          Back to Home
        </button>
      </Link>
    </main>
  );
}
