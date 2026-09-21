import Link from "next/link";

export function EntityCard({
  href,
  title,
  subtitle,
  status,
  details,
  imagePlaceholder = true,
}) {
  const {
    label: statusLabel,
    color: statusColor,
    background: statusBackground,
    border: statusBorder,
  } = status || {};

  return (
    <article style={cardStyle}>
      <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
        <div style={{ cursor: "pointer" }}>
          {imagePlaceholder && (
            <div style={imagePlaceholderStyle}>
              <span style={imageIconStyle}>📷</span>
              <span style={imageTextStyle}>Photo</span>
            </div>
          )}

          <div style={cardHeaderStyle}>
            <div>
              <h2 style={titleStyle}>{title}</h2>
              {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
            </div>

            {status && (
              <span
                style={{
                  flexShrink: 0,
                  border: `1px solid ${statusBorder || "#d0d5dd"}`,
                  borderRadius: 999,
                  padding: "0.22rem 0.55rem",
                  background: statusBackground || "#f9fafb",
                  color: statusColor || "#475467",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                }}
              >
                {statusLabel}
              </span>
            )}
          </div>

          {details && details.length > 0 && (
            <div style={detailGridStyle}>
              {details.map(([label, value], index) => (
                <>
                  <div key={`${label}-${index}-label`} style={detailLabelStyle}>
                    {label}
                  </div>
                  <div
                    key={`${label}-${index}-value`}
                    style={detailValueStyle}
                  >
                    {value || "—"}
                  </div>
                </>
              ))}
            </div>
          )}

          <div style={footerStyle}>View details →</div>
        </div>
      </Link>
    </article>
  );
}

const cardStyle = {
  height: "100%",
  boxSizing: "border-box",
  border: "1px solid #d0d5dd",
  borderRadius: 10,
  background: "#fff",
  padding: "1rem",
  boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
};

const imagePlaceholderStyle = {
  width: "100%",
  height: "140px",
  marginBottom: "1rem",
  border: "2px dashed #d0d5dd",
  borderRadius: 8,
  background: "#f9fafb",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.25rem",
};

const imageIconStyle = {
  fontSize: "2rem",
};

const imageTextStyle = {
  color: "#667085",
  fontSize: "0.85rem",
  fontWeight: 600,
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "0.75rem",
  marginBottom: "1rem",
};

const titleStyle = {
  margin: 0,
  fontSize: "1.1rem",
  color: "#101828",
  fontWeight: 700,
};

const subtitleStyle = {
  margin: "0.35rem 0 0",
  color: "#667085",
  fontSize: "0.9rem",
};

const detailGridStyle = {
  display: "grid",
  gridTemplateColumns: "100px 1fr",
  gap: "0.5rem 0.75rem",
  fontSize: "0.9rem",
};

const detailLabelStyle = {
  color: "#667085",
};

const detailValueStyle = {
  color: "#344054",
  overflowWrap: "anywhere",
};

const footerStyle = {
  marginTop: "1rem",
  color: "#175cd3",
  fontSize: "0.86rem",
  fontWeight: 600,
};
