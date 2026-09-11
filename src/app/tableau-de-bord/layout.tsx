import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { DashboardMain } from "@/components/dashboard/DashboardMain";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "oklch(0.98 0.008 276)" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar />
        <DashboardMain>
          {children}
        </DashboardMain>
      </div>
    </div>
  );
}
