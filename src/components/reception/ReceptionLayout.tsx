import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarPlus,
  UserPlus,
  Users,
  ListOrdered,
  Receipt,
  UserCircle,
  LogOut,
  Menu,
  X,
  Activity,
  Search,
} from "lucide-react";
import { getCurrentUser, logout } from "@/lib/auth";

const navItems: { to: string; label: string; icon: any; exact?: boolean }[] = [
  { to: "/reception", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/reception/requests", label: "Appointment Requests", icon: ClipboardList },
  { to: "/reception/schedule", label: "Schedule Appointments", icon: CalendarPlus },
  { to: "/reception/patients", label: "Patient Directory", icon: Users },
  { to: "/reception/queue", label: "Queue Management", icon: ListOrdered },
  { to: "/reception/billing", label: "Billing", icon: Receipt },
  { to: "/reception/profile", label: "Profile", icon: UserCircle },
];

export default function ReceptionLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [user, setUser] = useState(() => getCurrentUser());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "reception") {
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  const onLogout = () => {
    logout();
    setUser(null);
    navigate({ to: "/login" });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex" style={{ fontFamily: "Inter, sans-serif" }}>
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <Link to="/reception" className="flex items-center gap-2 text-blue-600 font-semibold">
            <Activity className="h-6 w-6" />
            MediSphere
          </Link>
          <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                  active ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={onLogout}
            className="mt-4 w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="flex items-center gap-3 px-4 md:px-6 py-3">
            <button className="md:hidden text-slate-600" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex-1 max-w-md relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patients, requests..."
                className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <Link to="/reception/profile" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white grid place-items-center text-sm font-semibold">
                {user.name.split(" ")[0][0]}
              </div>
              <div className="hidden md:block text-sm">
                <div className="text-slate-900 font-medium leading-tight">{user.name}</div>
                <div className="text-slate-500 text-xs">Reception</div>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
