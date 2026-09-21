import Link from "next/link";
import { Navbar } from "../../../components/Navbar";
import { createBorrower } from "../../actions/borrowers";

const fieldStyle = {
  width: "100%",
  padding: "0.55rem",
  border: "1px solid #98a2b3",
  borderRadius: 6,
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const labelStyle = {
  display: "block",
  marginBottom: "0.35rem",
  fontWeight: 600,
  color: "#344054",
};

export default function NewBorrowerPage({ searchParams }) {
  const returnTo =
    searchParams?.return_to === "/loans/new"
      ? "/loans/new"
      : "/borrowers";

  const backLabel =
    returnTo === "/loans/new"
      ? "← Back to New Loan"
      : "← Back to Borrowers";

  return (
    <div>
      <Navbar />

      <main
        style={{
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <Link
          href={returnTo}
          style={{
            display: "inline-block",
            marginBottom: "1rem",
            color: "#175cd3",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          {backLabel}
        </Link>

        <section
          style={{
            border: "1px solid #d0d5dd",
            borderRadius: 10,
            background: "#fff",
            padding: "1.25rem",
          }}
        >
          <h1 style={{ margin: 0 }}>Add Borrower</h1>
          <p style={{ margin: "0.5rem 0 0", color: "#667085" }}>
            Save contact details for a person who may borrow tools.
          </p>

          <form action={createBorrower} style={{ marginTop: "1.5rem" }}>
            <input type="hidden" name="return_to" value={returnTo} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <label style={labelStyle}>Full Name</label>
                <input name="name" required style={fieldStyle} />
              </div>

              <div>
                <label style={labelStyle}>Phone</label>
                <input name="phone" type="tel" style={fieldStyle} />
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input name="email" type="email" style={fieldStyle} />
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={labelStyle}>Address</label>
              <textarea name="address" rows="3" style={fieldStyle} />
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={labelStyle}>Notes</label>
              <textarea
                name="notes"
                rows="4"
                placeholder="Preferred contact method, company, or other useful information."
                style={fieldStyle}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
              <button type="submit" style={primaryButtonStyle}>
                Save Borrower
              </button>

              <Link href={returnTo} style={{ textDecoration: "none" }}>
                <button type="button" style={secondaryButtonStyle}>
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </section>
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

const secondaryButtonStyle = {
  padding: "0.6rem 1rem",
  cursor: "pointer",
  border: "1px solid #98a2b3",
  borderRadius: 6,
  background: "#fff",
  color: "#344054",
  fontWeight: 600,
};
