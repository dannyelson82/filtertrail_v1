import { Navbar } from "../../components/Navbar";

export default function BackupsPage() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: "1.5rem", fontFamily: "system-ui, sans-serif" }}>
        <h1>Backups</h1>
        <section style={{ marginBottom: "1.5rem" }}>
          <h2>Run backup</h2>
          <p>
            Manual backup trigger and status will appear here once the API is connected.
          </p>
          <button
            disabled
            style={{
              padding: "0.5rem 0.8rem",
              borderRadius: 4,
              border: "1px solid #ccc",
              background: "#eee",
              cursor: "not-allowed",
            }}
          >
            Run backup now (coming soon)
          </button>
        </section>

        <section>
          <h2>Backup history</h2>
          <p>List of backups, sizes, and restore options will appear here.</p>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: "1rem",
              background: "#fafafa",
            }}
          >
            <em>No backups shown yet (API not implemented).</em>
          </div>
        </section>
      </main>
    </div>
  );
}
