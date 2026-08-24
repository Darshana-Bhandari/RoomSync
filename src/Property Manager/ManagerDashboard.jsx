import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Building2,
  DoorOpen,
  Users,
  DollarSign,
  Receipt,
  Wallet,
  ClipboardList,
  BarChart3,
  LineChart,
  Bell,
  Settings,
  Plus,
  MapPin,
  BedDouble,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  ChevronLeft,
  Zap,
  TrendingDown,
  Activity,
} from "lucide-react";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);

  const navItems = [
    {
      section: "MAIN",
      items: [
        {
          icon: Home,
          label: "Dashboard",
          active: true,
          path: "/manager-dashboard",
        },
      ],
    },
    {
      section: "PROPERTY",
      items: [
        { icon: Building2, label: "Properties", path: "/property" },
        { icon: DoorOpen, label: "Rooms", path: "/manager/rooms" },
        { icon: Users, label: "Residents", path: "/manager/residents" },
      ],
    },
    {
      section: "FINANCE",
      items: [
        { icon: DollarSign, label: "Rent", path: "/manager/rent" },
        { icon: Receipt, label: "Bills", path: "/manager/bills" },
        { icon: Wallet, label: "Expenses", path: "/manager/expenses" },
      ],
    },
    {
      section: "MANAGEMENT",
      items: [
        { icon: ClipboardList, label: "Chores", path: "/manager/chores" },
        { icon: BarChart3, label: "Reports", path: "/manager/reports" },
        { icon: LineChart, label: "Analytics", path: "/manager/analytics" },
      ],
    },
    {
      section: "SYSTEM",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          path: "/manager/notifications",
        },
        { icon: Settings, label: "Settings", path: "/manager/settings" },
      ],
    },
  ];

  // Properties array for carousel
  const properties = [
    {
      id: 1,
      name: "Green Valley House",
      location: "Kathmandu",
      type: "Shared House",
      rooms: 6,
      residents: 7,
      totalRent: 42000,
      occupancyRate: 83,
      color: "from-teal-100 via-emerald-50 to-slate-100",
    },
    {
      id: 2,
      name: "Sunset Apartment",
      location: "Lalitpur",
      type: "Apartment",
      rooms: 4,
      residents: 5,
      totalRent: 28000,
      occupancyRate: 90,
      color: "from-teal-100 via-cyan-50 to-slate-100",
    },
    {
      id: 3,
      name: "Mountain View Villa",
      location: "Bhaktapur",
      type: "Villa",
      rooms: 8,
      residents: 6,
      totalRent: 56000,
      occupancyRate: 75,
      color: "from-green-100 via-emerald-50 to-slate-100",
    },
  ];

  const currentProperty = properties[currentPropertyIndex];

  const nextProperty = () => {
    setCurrentPropertyIndex((prev) => (prev + 1) % properties.length);
  };

  const prevProperty = () => {
    setCurrentPropertyIndex((prev) =>
      prev === 0 ? properties.length - 1 : prev - 1
    );
  };

  // ...existing code...
  const stats = [
    {
      icon: Building2,
      value: "3",
      label: "Properties",
      sub: "12 Rooms",
      color: "bg-teal-50 text-teal-600",
      bgGradient: "from-teal-50 to-teal-100",
      trend: "+2.5%",
      trendUp: true,
    },
    {
      icon: Users,
      value: "18",
      label: "Residents",
      sub: "16 Active",
      color: "bg-emerald-50 text-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      trend: "+3.2%",
      trendUp: true,
    },
    {
      icon: BedDouble,
      value: "85%",
      label: "Occupancy",
      sub: "avg. occupancy",
      color: "bg-cyan-50 text-cyan-600",
      bgGradient: "from-cyan-50 to-cyan-100",
      trend: "+5.2%",
      trendUp: true,
    },
    {
      icon: DollarSign,
      value: "₹24,000",
      label: "Rent Due",
      sub: "3 Pending",
      color: "bg-amber-50 text-amber-600",
      bgGradient: "from-amber-50 to-amber-100",
      trend: "-1.8%",
      trendUp: false,
    },
  ];

  const recentPayments = [
    { name: "Darshana", amount: "₹10,000", status: "paid", daysAgo: "Today" },
    { name: "Ram", amount: "₹10,000", status: "paid", daysAgo: "Yesterday" },
    { name: "Sita", amount: "₹12,000", status: "pending", daysAgo: "Overdue" },
    { name: "Anish", amount: "₹9,000", status: "paid", daysAgo: "2 days" },
  ];

  const rooms = [
    { name: "Room 101", status: "full", fill: 100, residents: 2 },
    { name: "Room 102", status: "full", fill: 100, residents: 2 },
    { name: "Room 103", status: "full", fill: 100, residents: 2 },
    { name: "Room 104", status: "partial", fill: 66, residents: 1 },
    { name: "Room 105", status: "full", fill: 100, residents: 2 },
    { name: "Room 106", status: "empty", fill: 0, residents: 0 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* ── Fixed Sidebar ── */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-sm">
        {/* Logo */}
        <div
          className="flex cursor-pointer items-center gap-2.5 border-b border-slate-100 px-5 py-5 transition-all duration-200 hover:bg-slate-50"
          onClick={() => navigate("/manager-dashboard")}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-teal-600 to-teal-700 text-white shadow-md transition-transform hover:scale-105">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              RoomSync
            </span>
            <p className="text-[10px] text-slate-400">Property Manager</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navItems.map((group) => (
            <div key={group.section} className="mb-5">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {group.section}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => navigate(item.path)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                          item.active
                            ? "bg-teal-50 text-teal-700 shadow-sm"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <Icon
                          className={`h-4.5 w-4.5 transition-colors ${
                            item.active ? "text-teal-600" : "text-slate-400"
                          }`}
                        />
                        <span>{item.label}</span>
                        {item.active && (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-100 px-3 py-4">
          <div className="rounded-lg bg-linear-to-r from-teal-50 to-emerald-50 p-3">
            <p className="text-xs font-semibold text-slate-700">Version 1.0</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Manage all your properties in one place
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="ml-64 flex flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/80 px-8 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-teal-600 to-teal-700 text-white shadow-md">
              <Home className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold text-slate-800">
              RoomSync
            </span>
            <span className="ml-2 hidden rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-700 sm:inline-block">
              Live
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search properties, rooms, residents..."
                className="w-72 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-teal-400 focus:ring-2 focus:ring-teal-100 focus:bg-white"
              />
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button className="relative rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            </button>
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 transition-all hover:bg-slate-100">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-teal-600 text-xs font-semibold text-white shadow-sm">
                DB
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-900">
                  Darshana Bhandari
                </p>
                <p className="text-[10px] text-slate-500">Manager</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 p-8">
          {/* Greeting */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Good evening, Darshana 👋
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Here's what's happening with your properties today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-teal-400">
                <option>All Properties</option>
                <option>Green Valley House</option>
              </select>
              <button
                onClick={() => navigate("/property")}
                className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700"
              >
                <Plus className="h-4 w-4" />
                Create Property
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-slate-900">
                        {stat.value}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-slate-600">
                        {stat.label}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-slate-400">{stat.sub}</p>
                        <div className={`flex items-center gap-1 text-xs font-semibold ${stat.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                          {stat.trendUp ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {stat.trend}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 ${stat.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Property Highlight + Overview */}
          <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col lg:flex-row">
              {/* Image Placeholder with Carousel */}
              <div className="relative flex h-64 w-full items-center justify-center overflow-hidden bg-linear-to-br from-teal-100 via-emerald-50 to-slate-100 lg:h-auto lg:w-2/5">
                <div className={`absolute inset-0 bg-linear-to-br transition-all duration-500 ${currentProperty.color}`} />
                <Building2 className="relative z-10 h-16 w-16 text-teal-300" />
                
                {/* Carousel Controls */}
                <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
                  <button
                    onClick={prevProperty}
                    className="rounded-full bg-white/80 p-2 shadow-lg transition-all hover:bg-white hover:shadow-xl"
                  >
                    <ChevronLeft className="h-5 w-5 text-slate-700" />
                  </button>
                  <button
                    onClick={nextProperty}
                    className="rounded-full bg-white/80 p-2 shadow-lg transition-all hover:bg-white hover:shadow-xl"
                  >
                    <ChevronRight className="h-5 w-5 text-slate-700" />
                  </button>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                  {properties.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPropertyIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentPropertyIndex
                          ? "w-6 bg-teal-600"
                          : "w-2 bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Property Info */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-start justify-between">
                    <h2 className="text-xl font-bold text-slate-900">
                      🏡 {currentProperty.name}
                    </h2>
                    <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
                      {currentProperty.type}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-xs font-medium text-slate-400">
                        LOCATION
                      </span>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 text-teal-600" />
                        {currentProperty.location}
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-xs font-medium text-slate-400">
                        TYPE
                      </span>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Home className="h-4 w-4 text-teal-600" />
                        {currentProperty.type}
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-xs font-medium text-slate-400">
                        ROOMS
                      </span>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <BedDouble className="h-4 w-4 text-teal-600" />
                        {currentProperty.rooms} Rooms
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-xs font-medium text-slate-400">
                        RESIDENTS
                      </span>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="h-4 w-4 text-teal-600" />
                        {currentProperty.residents}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        TOTAL RENT
                      </p>
                      <span className="text-2xl font-bold text-slate-900">
                        ₹{currentProperty.totalRent.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-400">
                          OCCUPANCY
                        </p>
                        <span className="text-xs font-semibold text-teal-600">
                          {currentProperty.occupancyRate}%
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-teal-500 to-teal-600 transition-all duration-500"
                          style={{ width: `${currentProperty.occupancyRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/property")}
                  className="mt-5 flex w-fit items-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-700 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg hover:from-teal-700 hover:to-teal-800"
                >
                  View Property
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Middle Row: Rent Collection + Needs Attention */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Rent Collection Chart */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800">
                    <TrendingUp className="h-5 w-5 text-teal-600" />
                    Rent Collection Trend
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Last 5 months performance
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 px-3 py-1">
                  <p className="text-xs font-semibold text-emerald-700">
                    ↑ 15% improvement
                  </p>
                </div>
              </div>
              <div className="flex h-48 items-end justify-between gap-3 px-2">
                {[
                  { month: "Jul", h: "45%", collected: "₹18k" },
                  { month: "Aug", h: "70%", collected: "₹28k" },
                  { month: "Sep", h: "85%", collected: "₹34k" },
                  { month: "Oct", h: "60%", collected: "₹24k" },
                  { month: "Nov", h: "40%", collected: "₹16k" },
                ].map((bar) => (
                  <div
                    key={bar.month}
                    className="flex flex-1 flex-col items-center gap-3 group"
                  >
                    <div
                      className="w-full max-w-10 rounded-t-lg bg-linear-to-t from-teal-600 to-teal-400 shadow-md transition-all group-hover:shadow-lg"
                      style={{ height: bar.h }}
                      title={bar.collected}
                    />
                    <span className="text-xs font-semibold text-slate-600">
                      {bar.month}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between text-xs text-slate-500">
                <span>₹0</span>
                <span className="font-semibold">₹50k</span>
              </div>
            </div>

            {/* Needs Attention */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Needs Attention
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 rounded-lg border border-red-100 bg-red-50 px-3 py-3 transition-all hover:bg-red-100">
                  <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-red-900">
                      Sita rent
                    </p>
                    <p className="text-xs text-red-700">₹12,000 - Overdue 5 days</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-red-600" />
                </li>
                <li className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-3 transition-all hover:bg-amber-100">
                  <span className="h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-amber-900">
                      Join request
                    </p>
                    <p className="text-xs text-amber-700">Awaiting approval</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-amber-600" />
                </li>
                <li className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-3 transition-all hover:bg-amber-100">
                  <span className="h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-amber-900">
                      Bill pending
                    </p>
                    <p className="text-xs text-amber-700">Due within 2 days</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-amber-600" />
                </li>
              </ul>
            </div>
          </div>
          {/* Bottom Row */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {/* Recent Rent Payments */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
                <DollarSign className="h-5 w-5 text-teal-600" />
                Recent Rent
              </h3>
              <ul className="space-y-3">
                {recentPayments.map((p) => (
                  <li
                    key={p.name}
                    className="flex items-center justify-between rounded-lg bg-slate-50 p-3 transition-all hover:bg-slate-100"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.daysAgo}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="font-semibold text-slate-700">
                        {p.amount}
                      </span>
                      {p.status === "paid" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <button className="mt-4 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                View All →
              </button>
            </div>

            {/* Occupancy */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
                <BedDouble className="h-5 w-5 text-teal-600" />
                Occupancy
              </h3>
              <ul className="space-y-2.5">
                {rooms.map((room) => (
                  <li
                    key={room.name}
                    className="flex items-center gap-3 rounded-lg bg-slate-50 px-2 py-2 transition-all hover:bg-slate-100"
                  >
                    <span className="w-20 text-xs font-semibold text-slate-700">
                      {room.name}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full transition-all ${
                          room.status === "full"
                            ? "bg-linear-to-r from-emerald-500 to-emerald-600"
                            : room.status === "partial"
                            ? "bg-linear-to-r from-amber-400 to-amber-500"
                            : "bg-slate-300"
                        }`}
                        style={{ width: `${room.fill}%` }}
                      />
                    </div>
                    <span className="w-16 text-right text-xs font-semibold text-slate-600">
                      {room.status === "full"
                        ? "Full"
                        : room.status === "partial"
                        ? "Partial"
                        : "Empty"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Household Health */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-teal-600" />
                Health Score
              </h3>
              <div className="mb-4 text-center">
                <p className="text-4xl font-bold text-slate-900">87%</p>
                <p className="text-xs text-slate-500 font-medium">Overall Health</p>
                <div className="mx-auto mt-3 h-2.5 w-full max-w-40 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-teal-500 to-teal-600"
                    style={{ width: "87%" }}
                  />
                </div>
              </div>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2">
                  <span className="text-slate-600">Rent</span>
                  <span className="font-semibold text-emerald-600">✓ 92%</span>
                </li>
                <li className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2">
                  <span className="text-slate-600">Bills</span>
                  <span className="font-semibold text-emerald-600">✓ 88%</span>
                </li>
                <li className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2">
                  <span className="text-slate-600">Occupancy</span>
                  <span className="font-semibold text-emerald-600">✓ 83%</span>
                </li>
                <li className="flex items-center justify-between rounded-lg bg-red-50 px-2.5 py-2">
                  <span className="text-slate-600">Settlements</span>
                  <span className="font-semibold text-red-600">⚠ 2</span>
                </li>
              </ul>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
                <Activity className="h-5 w-5 text-teal-600" />
                Recent Activity
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3 rounded-lg bg-emerald-50 p-3 transition-all hover:bg-emerald-100">
                  <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-emerald-900">
                      Rent paid
                    </p>
                    <p className="text-xs text-emerald-700">10 mins ago</p>
                  </div>
                </li>
                <li className="flex gap-3 rounded-lg bg-teal-50 p-3 transition-all hover:bg-teal-100">
                  <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-teal-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-teal-900">
                      New resident
                    </p>
                    <p className="text-xs text-teal-700">1 hour ago</p>
                  </div>
                </li>
                <li className="flex gap-3 rounded-lg bg-amber-50 p-3 transition-all hover:bg-amber-100">
                  <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-amber-900">
                      Bill added
                    </p>
                    <p className="text-xs text-amber-700">3 hours ago</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-sm">
            <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-slate-800">
              <Zap className="h-5 w-5 text-teal-600" />
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/property")}
                className="flex items-center gap-2 rounded-lg border border-teal-200 bg-linear-to-r from-teal-50 to-teal-100 px-4 py-2.5 text-sm font-semibold text-teal-700 transition-all hover:border-teal-300 hover:shadow-md hover:from-teal-100 hover:to-teal-200"
              >
                <Plus className="h-4 w-4" />
                Property
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-linear-to-r from-emerald-50 to-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-all hover:border-emerald-300 hover:shadow-md hover:from-emerald-100 hover:to-emerald-200">
                <Plus className="h-4 w-4" />
                Resident
              </button>
              <button
                onClick={() => navigate("/manager/rent")}
                className="flex items-center gap-2 rounded-lg border border-cyan-200 bg-linear-to-r from-cyan-50 to-cyan-100 px-4 py-2.5 text-sm font-semibold text-cyan-700 transition-all hover:border-cyan-300 hover:shadow-md hover:from-cyan-100 hover:to-cyan-200"
              >
                <Plus className="h-4 w-4" />
                Rent
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-amber-200 bg-linear-to-r from-amber-50 to-amber-100 px-4 py-2.5 text-sm font-semibold text-amber-700 transition-all hover:border-amber-300 hover:shadow-md hover:from-amber-100 hover:to-amber-200">
                <Plus className="h-4 w-4" />
                Bill
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;