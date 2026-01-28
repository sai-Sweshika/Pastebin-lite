export default async function PastePage({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${params.id}`, {
    cache: "no-store"
  });

  if (!res.ok) {
    return <h1>404 – Paste not available</h1>;
  }

  const data = await res.json();

  return (
    <pre style={{ whiteSpace: "pre-wrap", padding: 20 }}>
      {data.content}
    </pre>
  );
}
