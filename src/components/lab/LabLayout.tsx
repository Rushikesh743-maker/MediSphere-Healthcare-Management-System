import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FlaskConical,
  Loader2,
  CheckCircle2,
  Upload,
  Search,
  UserCircle,
  LogOut,
  Menu,
  X,
  Activity,
} from "lucide-react";
import { getCurrentUser, logout } from "@/lib/auth";

const navItems: { to: string; label: string; icon: any; exact?: boolean }[] = [
  { to: "/lab", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/lab/pending", label: "Pending Tests", icon: FlaskConical },
  { to: "/lab/in-progress", label: "In Progress", icon: Loader2 },
  { to: "/lab/completed", label: "Completed Tests", icon: CheckCircle2 },
  { to: "/lab/upload", label: "Upload Reports", icon: Upload },
  { to: "/lab/profile", label: "Profile", icon: UserCircle },
];

export default function LabLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [user, setUser] = useState(() => getCurrentUser());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "lab") {
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
          <Link to="/lab" className="flex items-center gap-2 text-blue-600 font-semibold">
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
            <div className="flex-1 text-sm text-slate-500">
              Laboratory Portal
            </div>
            <Link to="/lab/profile" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white grid place-items-center text-sm font-semibold">
                {user.name.split(" ")[0][0]}
              </div>
              <div className="hidden md:block text-sm">
                <div className="text-slate-900 font-medium leading-tight">{user.name}</div>
                <div className="text-slate-500 text-xs">Lab Staff</div>
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
