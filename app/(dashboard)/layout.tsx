"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useRequireAuth } from "@/hooks/useAuth";
import { LoaderIcon } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading, logout } = useRequireAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoaderIcon className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        user={user}
        onLogout={logout}
      />

      {/* Main content — offset on desktop */}
      <div className="md:ml-[var(--sidebar-width)]">
        <Header onMenuClick={() => setMobileOpen(true)} user={user} />
        <main className="p-4 sm:p-6 page-enter">{children}</main>
      </div>
    </div>
  );
}
