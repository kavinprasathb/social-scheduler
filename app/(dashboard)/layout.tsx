"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content — offset on desktop */}
      <div className="md:ml-[var(--sidebar-width)]">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 sm:p-6 page-enter">{children}</main>
      </div>
    </div>
  );
}
