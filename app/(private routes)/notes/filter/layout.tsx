import React from "react";

export default function FilterLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <aside>{sidebar}</aside>
      <section>{children}</section>
    </div>
  );
}
