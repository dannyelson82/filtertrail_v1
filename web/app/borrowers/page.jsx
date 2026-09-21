import Link from "next/link";
import { Navbar } from "../../components/Navbar";

const API_BASE = process.env.API_BASE_URL || "http://192.168.50.37:8001";

async function getBorrowers() {
  const response = await fetch(`${API_BASE}/api/borrowers/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load borrowers.");
  }

  return response.json();
}

export default async function BorrowersPage() {
  const borrowers = await getBorrowers();

  return (
    <div>
      <Navbar />

      <main
        style={{
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ marginBottom: "0.25rem" }}>Borrowers</h1>
            <p style={{ marginTop: 0, color: "#667085" }}>
              Contact information for people who borrow tools.
            </p>
          </div>

          <Link href="/borrowers/new" style={{ textDecoration: "none" }}>
            <button style={primaryButtonStyle}>Add Borrower</button>
          </Link>
        </div>

        {borrowers.length === 0 ? (
          <section style={emptyStateStyle}>
            <p style={{ marginTop: 0 }}>No borrowers have been added yet.</p>
            <Link href="/borrowers/new">Add your first borrower</Link>
          </section>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
              <thead>
                <tr>
                  {["Name", "Phone", "Email", "Address", "Notes"].map((heading) => (
                    <th key={heading} style={headerCellStyle}>{heading}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {borrowers.map((borrower) => (
                  <tr key={borrower.id}>
                    <td style={{ ...cellStyle, fontWeight: 700 }}>{borrower.name}</td>
                    <td style={cellStyle}>{borrower.phone || "—"}</td>
                    <td style={cellStyle}>
                      {borrower.email ? (
                        <a href={`mailto:${borrower.email}`} style={{ color: "#175cd3" }}>
                          {borrower.email}
                        </a>
                      ) : "—"}
                    </td>
                    <td style={{ ...cellStyle, maxWidth: 240, whiteSpace: "pre-wrap" }}>
                      {borrower.address || "—"}
                    </td>
                    <td style={{ ...cellStyle, maxWidth: 260, whiteSpace: "pre-wrap" }}>
                      {borrower.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

const primaryButtonStyle = {
  padding: "0.6rem 1rem",
  cursor: "pointer",
  border: "1px solid #175cd3",
  borderRadius: 6,
  background: "#175cd3",
  color: "#fff",
  fontWeight: 600,
};

const emptyStateStyle = {
  marginTop: "1.5rem",
  border: "1px dashed #cbd5e1",
  borderRadius: 8,
  padding: "2rem",
  textAlign: "center",
  color: "#667085",
};

const headerCellStyle = {
  textAlign: "left",
  padding: "0.7rem",
  borderBottom: "2px solid #ddd",
  color: "#444",
  whiteSpace: "nowrap",
};

const cellStyle = {
  padding: "0.7rem",
  borderBottom: "1px solid #eee",
  color: "#344054",
  verticalAlign: "top",
};
