import { createFileRoute, Link } from "@tanstack/react-router";
import { Stethoscope, CalendarCheck, FlaskConical, Bot, Activity } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-800" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Navbar */}
      <header className="border-b border-slate-200">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-blue-600 font-semibold text-lg">
            <Activity className="h-6 w-6" />
            MediSphere
          </Link>
          <ul className="hidden md:flex items-center gap-8 text-sm text-slate-600">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li><a href="#about" className="hover:text-blue-600">About</a></li>
            <li><Link to="/login" className="hover:text-blue-600">Login</Link></li>
            <li><Link to="/register" className="hover:text-blue-600">Register</Link></li>
          </ul>
          <div className="md:hidden flex gap-3 text-sm">
            <Link to="/login" className="text-blue-600">Login</Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
            MediSphere - Healthcare Management System
          </h1>
          <p className="mt-4 text-slate-600 leading-relaxed">
            A simple, practical platform for hospitals and clinics to manage doctors,
            appointments, patient records and laboratory reports in one place.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/login"
              className="rounded-md bg-blue-600 px-5 py-2 text-white text-sm font-medium hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-md border border-blue-600 px-5 py-2 text-blue-600 text-sm font-medium hover:bg-blue-50"
            >
              Register
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          <svg viewBox="0 0 400 300" className="w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="40" width="360" height="220" rx="12" fill="#EFF6FF" stroke="#BFDBFE" />
            <rect x="170" y="80" width="60" height="140" fill="#2563EB" />
            <rect x="130" y="130" width="140" height="40" fill="#2563EB" />
            <circle cx="200" cy="60" r="14" fill="#2563EB" />
            <path d="M60 240 Q100 200 140 240 T220 240 T300 240 T380 240" stroke="#93C5FD" strokeWidth="3" fill="none" />
            <text x="200" y="290" textAnchor="middle" fill="#64748B" fontSize="12" fontFamily="Inter">Healthcare, organized.</text>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section id="about" className="bg-slate-50 border-y border-slate-200 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold text-slate-900 text-center">What MediSphere Offers</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Stethoscope, title: "Doctor Management", desc: "Manage doctor profiles, availability and schedules." },
              { icon: CalendarCheck, title: "Appointment Management", desc: "Book, track and update patient appointments." },
              { icon: FlaskConical, title: "Laboratory Reports", desc: "Request and view lab tests and their results." },
              { icon: Bot, title: "AI Assistant", desc: "Helpful mock AI actions to support doctors." },
            ].map((f) => (
              <div key={f.title} className="rounded-lg bg-white p-5 shadow-sm border border-slate-200">
                <f.icon className="h-6 w-6 text-blue-600" />
                <h3 className="mt-3 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row justify-between gap-2 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} MediSphere. Academic project.</p>
          <p>Contact: support@medisphere.local &middot; +91 00000 00000</p>
        </div>
      </footer>
    </div>
  );
}
