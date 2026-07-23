import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  FlaskConical,
  UserCircle,
  LogOut,
  Search,
  Activity,
  Menu,
  X,
} from "lucide-react";
import { getCurrentUser, logout } from "@/lib/auth";

const navItems: { to: string; label: string; icon: any; exact?: boolean }[] = [
  { to: "/doctor", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/doctor/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/doctor/patients", label: "Patients", icon: Users },
  { to: "/doctor/medical-records", label: "Medical Records", icon: FileText },
  { to: "/doctor/lab-requests", label: "Lab Requests", icon: FlaskConical },
  { to: "/doctor/profile", label: "Profile", icon: UserCircle },
];

type Availability = "Available" | "In Consultation" | "Offline";

export default function DoctorLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [user, setUser] = useState(() => getCurrentUser());
  const [availability, setAvailability] = useState<Availability>("Available");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "doctor") {
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  const onLogout = () => {
    logout();
    setUser(null);
    navigate({ to: "/login" });
  };

  const availabilityColor: Record<Availability, string> = {
    Available: "bg-green-100 text-green-700 border-green-200",
    "In Consultation": "bg-amber-100 text-amber-700 border-amber-200",
    Offline: "bg-slate-100 text-slate-600 border-slate-200",
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <Link to="/doctor" className="flex items-center gap-2 text-blue-600 font-semibold">
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

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="flex items-center gap-3 px-4 md:px-6 py-3">
            <button className="md:hidden text-slate-600" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex-1 max-w-md relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patients, appointments..."
                className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-slate-500">Availability:</span>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as Availability)}
                  className={`rounded-md border px-2 py-1 text-xs font-medium ${availabilityColor[availability]}`}
                >
                  <option>Available</option>
                  <option>In Consultation</option>
                  <option>Offline</option>
                </select>
              </label>

              <Link to="/doctor/profile" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white grid place-items-center text-sm font-semibold">
                  {user.name.split(" ").slice(-1)[0][0]}
                </div>
                <div className="hidden md:block text-sm">
                  <div className="text-slate-900 font-medium leading-tight">{user.name}</div>
                  <div className="text-slate-500 text-xs">Doctor</div>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}