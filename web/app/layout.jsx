import "./globals.css";

export const metadata = {
  title: "Filter Trail",
  description: "Vehicle, tool, and inventory maintenance tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
