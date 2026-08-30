import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Loader2,
} from "lucide-react";
import { loadProperties } from "../utils/propertyStorage"; // adjust path

// ---------- helpers ----------
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const formatCurrency = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN")}`;

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load + live refresh when Property page saves
  useEffect(() => {
    const refresh = () => {
      try {
        setLoading(true);
        setError(null);
        const data = loadProperties();
        setProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Unable to load properties.");
      } finally {
        setLoading(false);
      }
    };

    refresh();
    window.addEventListener("propertiesUpdated", refresh);
    return () => window.removeEventListener("propertiesUpdated", refresh);
  }, []);

  // Keep selectedPropertyId valid
  useEffect(() => {
    if (properties.length === 0) {
      setSelectedPropertyId(null);
      return;
    }
    const exists = properties.some(
      (p) => String(p.id) === String(selectedPropertyId)
    );
    if (!selectedPropertyId || !exists) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties, selectedPropertyId]);

  const currentProperty = useMemo(() => {
    if (!selectedPropertyId) return null;
    return (
      properties.find((p) => String(p.id) === String(selectedPropertyId)) ||
      null
    );
  }, [properties, selectedPropertyId]);

  const hasProperties = properties.length > 0;

  // ---------- Aggregate stats across all properties ----------
  const totalRooms = useMemo(
    () => properties.reduce((s, p) => s + (Number(p.rooms) || 0), 0),
    [properties]
  );

  const totalCapacity = useMemo(
    () =>
      properties.reduce(
        (s, p) =>
          s +
          (p.totalCapacity ||
            Number(p.rooms || 0) * Number(p.peoplePerRoom || 1)),
        0
      ),
    [properties]
  );

  const occupiedCapacity = useMemo(
    () =>
      properties.reduce(
        (s, p) => s + (Number(p.occupiedCapacity) || (p.residents?.length || 0)),
        0
      ),
    [properties]
  );

  const occupancyRate =
    totalCapacity > 0
      ? Math.round((occupiedCapacity / totalCapacity) * 100)
      : 0;

  // ---------- Rent stats (from residents) ----------
  const rentStats = useMemo(() => {
    let expected = 0;
    let collected = 0;
    let pending = 0;
    let overdue = 0;
    const recentPayments = [];

    properties.forEach((property) => {
      (property.residents || []).forEach((resident) => {
        const rent = Number(resident.rent || 0);
        expected += rent;

        if (resident.rentStatus === "PAID") {
          collected += rent;
          recentPayments.push({
            id: resident.id,
            name: resident.name,
            amount: rent,
            status: "paid",
            propertyName: property.name,
          });
        } else if (resident.rentStatus === "PENDING") {
          pending += rent;
        } else if (resident.rentStatus === "OVERDUE") {
          overdue += rent;
        }
      });
    });

    const collectionRate =
      expected > 0 ? Math.round((collected / expected) * 100) : 0;

    return {
      expected,
      collected,
      pending,
      overdue,
      collectionRate,
      recentPayments: recentPayments.slice(0, 5),
    };
  }, [properties]);

  // ---------- Bills ----------
  const billStats = useMemo(() => {
    let total = 0;
    let paid = 0;
    properties.forEach((p) => {
      (p.bills || []).forEach((b) => {
        total += 1;
        if (b.status === "PAID") paid += 1;
      });
    });
    return { total, paid };
  }, [properties]);

  // ---------- Health Score ----------
  const healthScore = useMemo(() => {
    const rentScore = rentStats.collectionRate;
    const occupancyScore = occupancyRate;
    const billsScore =
      billStats.total > 0
        ? Math.round((billStats.paid / billStats.total) * 100)
        : 100;
    const overduePenalty = rentStats.overdue > 0 ? 10 : 0;

    const score = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          rentScore * 0.4 + occupancyScore * 0.3 + billsScore * 0.3 - overduePenalty
        )
      )
    );

    return {
      score,
      rentScore,
      occupancyScore,
      billsScore,
    };
  }, [rentStats, occupancyRate, billStats]);

  // ---------- Needs Attention ----------
  const attentionItems = useMemo(() => {
    const items = [];

    properties.forEach((property) => {
      (property.residents || []).forEach((resident) => {
        if (resident.rentStatus === "OVERDUE") {
          items.push({
            id: `rent-${resident.id}`,
            type: "rent",
            title: `${resident.name} rent`,
            description: `${formatCurrency(resident.rent)} · Overdue · ${property.name}`,
            severity: "high",
            path: "/rent",
          });
        } else if (resident.rentStatus === "PENDING") {
          items.push({
            id: `rent-p-${resident.id}`,
            type: "rent",
            title: `${resident.name} rent`,
            description: `${formatCurrency(resident.rent)} · Pending · ${property.name}`,
            severity: "medium",
            path: "/rent",
          });
        }
      });

      (property.bills || []).forEach((bill) => {
        if (bill.status === "PENDING") {
          items.push({
            id: `bill-${bill.id}`,
            type: "bill",
            title: `${bill.type || "Bill"} pending`,
            description: `${formatCurrency(bill.amount)} · ${property.name}`,
            severity: "medium",
            path: "/manager/bills",
          });
        }
      });
    });

    // Sort high severity first
    return items.sort((a, b) =>
      a.severity === "high" && b.severity !== "high" ? -1 : 1
    );
  }, [properties]);

  // ---------- Occupancy rooms for current property ----------
  const occupancyRooms = useMemo(() => {
    if (!currentProperty) return [];
    const list = currentProperty.roomsList || [];
    if (list.length > 0) {
      return list.map((r) => {
        const fill =
          r.capacity > 0
            ? Math.round(((r.residentsCount || 0) / r.capacity) * 100)
            : 0;
        let status = "empty";
        if (fill >= 100) status = "full";
        else if (fill > 0) status = "partial";
        return {
          name: r.name,
          status,
          fill,
          residents: r.residentsCount || 0,
        };
      });
    }
    // Fallback: empty rooms from property.rooms count
    return Array.from({ length: Number(currentProperty.rooms) || 0 }, (_, i) => ({
      name: `Room ${101 + i}`,
      status: "empty",
      fill: 0,
      residents: 0,
    }));
  }, [currentProperty]);

  // ---------- Recent activities ----------
  const recentActivities = useMemo(() => {
    const all = [];
    properties.forEach((p) => {
      (p.activities || []).forEach((a) => {
        all.push({ ...a, propertyName: p.name });
      });
    });
    // newest first (simple)
    return all.slice(0, 6);
  }, [properties]);

  // ---------- Top stats cards ----------
  const stats = useMemo(
    () => [
      {
        icon: Building2,
        value: String(properties.length),
        label: "Properties",
        sub: `${totalRooms} Rooms`,
        color: "bg-teal-50 text-teal-600",
        trend: properties.length > 0 ? "Active" : "None yet",
        trendUp: properties.length > 0,
      },
      {
        icon: Users,
        value: String(totalCapacity),
        label: "Capacity",
        sub: `${occupiedCapacity} occupied`,
        color: "bg-emerald-50 text-emerald-600",
        trend: occupiedCapacity > 0 ? "In use" : "Empty",
        trendUp: occupiedCapacity > 0,
      },
      {
        icon: BedDouble,
        value: `${occupancyRate}%`,
        label: "Occupancy",
        sub: `${occupiedCapacity}/${totalCapacity} spaces`,
        color: "bg-cyan-50 text-cyan-600",
        trend: occupancyRate >= 80 ? "Healthy" : occupancyRate > 0 ? "Low" : "—",
        trendUp: occupancyRate >= 80,
      },
      {
        icon: DollarSign,
        value: formatCurrency(rentStats.expected),
        label: "Expected Rent",
        sub: `${rentStats.collectionRate}% collected`,
        color: "bg-amber-50 text-amber-600",
        trend:
          rentStats.overdue > 0
            ? `${formatCurrency(rentStats.overdue)} overdue`
            : "On track",
        trendUp: rentStats.overdue === 0,
      },
    ],
    [
      properties.length,
      totalRooms,
      totalCapacity,
      occupiedCapacity,
      occupancyRate,
      rentStats,
    ]
  );

  // ---------- Nav ----------
  const navItems = [
    {
      section: "MAIN",
      items: [
        { icon: Home, label: "Dashboard", path: "/manager-dashboard" },
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
        { icon: DollarSign, label: "Rent", path: "/rent" },
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
        { icon: Bell, label: "Notifications", path: "/manager/notifications" },
        { icon: Settings, label: "Settings", path: "/manager/settings" },
      ],
    },
  ];

  const quickActions = [
    { label: "Property", icon: Building2, path: "/property" },
    { label: "Resident", icon: Users, path: "/manager/residents" },
    { label: "Rent", icon: DollarSign, path: "/rent" },
    { label: "Bill", icon: Receipt, path: "/manager/bills" },
  ];

  // ---------- Loading / Error ----------
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <p className="text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
          <p className="mt-3 font-semibold text-red-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-sm">
        <div
          className="flex cursor-pointer items-center gap-2.5 border-b border-slate-100 px-5 py-5 hover:bg-slate-50"
          onClick={() => navigate("/manager-dashboard")}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-md">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              RoomSync
            </span>
            <p className="text-[10px] text-slate-400">Property Manager</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navItems.map((group) => (
            <div key={group.section} className="mb-5">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {group.section}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => navigate(item.path)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? "bg-teal-50 text-teal-700 shadow-sm"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <Icon
                          className={`h-4.5 w-4.5 ${
                            isActive ? "text-teal-600" : "text-slate-400"
                          }`}
                        />
                        <span>{item.label}</span>
                        {isActive && (
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

        <div className="border-t border-slate-100 px-3 py-4">
          <div className="rounded-lg bg-gradient-to-r from-teal-50 to-emerald-50 p-3">
            <p className="text-xs font-semibold text-slate-700">Version 1.0</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Manage all your properties in one place
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-64 flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/80 px-8 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-md">
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
            <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              {attentionItems.length > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-xs font-semibold text-white">
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

        <main className="flex-1 p-8">
          {/* Greeting */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {getGreeting()}, Darshana 👋
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {hasProperties
                  ? "Here's what's happening with your properties today."
                  : "Create your first property to get started."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {hasProperties && (
                <select
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-teal-400"
                  value={selectedPropertyId || ""}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={() => navigate("/property")}
                className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700"
              >
                <Plus className="h-4 w-4" />
                Create Property
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-lg"
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
                        <div
                          className={`flex items-center gap-1 text-xs font-semibold ${
                            stat.trendUp ? "text-emerald-600" : "text-slate-400"
                          }`}
                        >
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
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

         {/* Property overview or empty */}
{hasProperties && currentProperty ? (
  <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
    <div className="flex flex-col lg:flex-row">
      {/* LEFT: Cover / placeholder — always visible */}
      <div className="relative flex h-56 w-full shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-teal-100 via-emerald-50 to-slate-100 lg:h-auto lg:min-h-[240px] lg:w-2/5">
        {currentProperty.coverUrl ? (
          <img
            src={currentProperty.coverUrl}
            alt={currentProperty.name}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}

        {!currentProperty.coverUrl && (
          <div className="relative z-10 flex flex-col items-center gap-2">
            <Building2 className="h-16 w-16 text-teal-300" />
            <span className="text-xs font-medium text-teal-600/70">
              No cover photo
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
      </div>

      {/* RIGHT: Details */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">
              🏡 {currentProperty.name}
            </h2>
            <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
              {currentProperty.type || "Property"}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Location
              </span>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <MapPin className="h-4 w-4 shrink-0 text-teal-600" />
                <span className="truncate">
                  {currentProperty.address || "—"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Rooms
              </span>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <BedDouble className="h-4 w-4 shrink-0 text-teal-600" />
                {currentProperty.rooms || 0} Rooms
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Capacity
              </span>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Users className="h-4 w-4 shrink-0 text-teal-600" />
                {currentProperty.totalCapacity ||
                  (currentProperty.rooms || 0) *
                    (currentProperty.peoplePerRoom || 1)}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Rent / Room
              </span>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <DollarSign className="h-4 w-4 shrink-0 text-teal-600" />
                {formatCurrency(currentProperty.rent)}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Expected Monthly Rent (This Property)
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatCurrency(
                currentProperty.totalPotentialRent ||
                  (currentProperty.rooms || 0) * (currentProperty.rent || 0)
              )}
            </p>

            {currentProperty.inviteCode && (
              <p className="mt-2 text-xs text-slate-500">
                Invite code:{" "}
                <span className="rounded bg-teal-50 px-1.5 py-0.5 font-mono font-semibold text-teal-700">
                  {currentProperty.inviteCode}
                </span>
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate("/property")}
          className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:from-teal-700 hover:to-teal-800 hover:shadow-lg"
        >
          View Property
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
) : (
  <div className="mb-8 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
    <Building2 className="mx-auto h-12 w-12 text-slate-300" />
    <h3 className="mt-4 text-lg font-semibold text-slate-800">
      No properties yet
    </h3>
    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
      Create your first property to see live stats, occupancy, rent and
      health score.
    </p>
    <button
      onClick={() => navigate("/property")}
      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
    >
      <Plus className="h-4 w-4" />
      Create Your First Property
    </button>
  </div>
)}

          {/* Rent summary + Needs Attention */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800">
                    <TrendingUp className="h-5 w-5 text-teal-600" />
                    Rent Overview
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Across all properties this month
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 px-3 py-1">
                  <p className="text-xs font-semibold text-emerald-700">
                    {rentStats.collectionRate}% collected
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Expected</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {formatCurrency(rentStats.expected)}
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3">
                  <p className="text-xs text-emerald-700">Collected</p>
                  <p className="mt-1 text-lg font-bold text-emerald-800">
                    {formatCurrency(rentStats.collected)}
                  </p>
                </div>
                <div className="rounded-lg bg-amber-50 p-3">
                  <p className="text-xs text-amber-700">Pending</p>
                  <p className="mt-1 text-lg font-bold text-amber-800">
                    {formatCurrency(rentStats.pending)}
                  </p>
                </div>
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="text-xs text-red-700">Overdue</p>
                  <p className="mt-1 text-lg font-bold text-red-800">
                    {formatCurrency(rentStats.overdue)}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Collection progress</span>
                  <span>{rentStats.collectionRate}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all"
                    style={{ width: `${Math.min(rentStats.collectionRate, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Needs Attention */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Needs Attention
              </h3>
              {attentionItems.length === 0 ? (
                <div className="rounded-lg bg-emerald-50 p-4 text-center">
                  <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-600" />
                  <p className="mt-2 text-sm font-semibold text-emerald-900">
                    Everything looks good
                  </p>
                  <p className="mt-1 text-xs text-emerald-700">
                    No urgent issues need your attention.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {attentionItems.slice(0, 5).map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => navigate(item.path)}
                        className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${
                          item.severity === "high"
                            ? "border-red-100 bg-red-50 hover:bg-red-100"
                            : "border-amber-100 bg-amber-50 hover:bg-amber-100"
                        }`}
                      >
                        <span
                          className={`h-3 w-3 shrink-0 rounded-full ${
                            item.severity === "high"
                              ? "bg-red-500"
                              : "bg-amber-500"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-semibold ${
                              item.severity === "high"
                                ? "text-red-900"
                                : "text-amber-900"
                            }`}
                          >
                            {item.title}
                          </p>
                          <p
                            className={`text-xs ${
                              item.severity === "high"
                                ? "text-red-700"
                                : "text-amber-700"
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                        <ChevronRight
                          className={`h-4 w-4 ${
                            item.severity === "high"
                              ? "text-red-600"
                              : "text-amber-600"
                          }`}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Bottom row */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {/* Recent Rent */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
                <DollarSign className="h-5 w-5 text-teal-600" />
                Recent Rent
              </h3>
              {rentStats.recentPayments.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">
                  No payments recorded yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {rentStats.recentPayments.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-500">
                          {p.propertyName}
                        </p>
                      </div>
                      <div className="ml-2 flex items-center gap-2">
                        <span className="font-semibold text-slate-700">
                          {formatCurrency(p.amount)}
                        </span>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => navigate("/rent")}
                className="mt-4 text-xs font-semibold text-teal-600 hover:text-teal-700"
              >
                View All →
              </button>
            </div>

            {/* Occupancy */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
                <BedDouble className="h-5 w-5 text-teal-600" />
                Occupancy
                {currentProperty && (
                  <span className="ml-auto text-xs font-normal text-slate-400">
                    {currentProperty.name}
                  </span>
                )}
              </h3>
              {occupancyRooms.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">
                  No rooms yet.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {occupancyRooms.slice(0, 6).map((room) => (
                    <li
                      key={room.name}
                      className="flex items-center gap-3 rounded-lg bg-slate-50 px-2 py-2"
                    >
                      <span className="w-20 text-xs font-semibold text-slate-700">
                        {room.name}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full ${
                            room.status === "full"
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                              : room.status === "partial"
                              ? "bg-gradient-to-r from-amber-400 to-amber-500"
                              : "bg-slate-300"
                          }`}
                          style={{ width: `${room.fill}%` }}
                        />
                      </div>
                      <span className="w-14 text-right text-xs font-semibold text-slate-600">
                        {room.status === "full"
                          ? "Full"
                          : room.status === "partial"
                          ? "Partial"
                          : "Empty"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Health Score */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-teal-600" />
                Health Score
              </h3>
              <div className="mb-4 text-center">
                <p className="text-4xl font-bold text-slate-900">
                  {healthScore.score}%
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Overall Health
                </p>
                <div className="mx-auto mt-3 h-2.5 w-full max-w-40 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-600"
                    style={{ width: `${healthScore.score}%` }}
                  />
                </div>
              </div>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2">
                  <span className="text-slate-600">Rent</span>
                  <span className="font-semibold text-emerald-600">
                    {healthScore.rentScore}%
                  </span>
                </li>
                <li className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2">
                  <span className="text-slate-600">Occupancy</span>
                  <span className="font-semibold text-emerald-600">
                    {healthScore.occupancyScore}%
                  </span>
                </li>
                <li className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2">
                  <span className="text-slate-600">Bills</span>
                  <span className="font-semibold text-emerald-600">
                    {healthScore.billsScore}%
                  </span>
                </li>
                <li className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2">
                  <span className="text-slate-600">Overdue rent</span>
                  <span
                    className={`font-semibold ${
                      rentStats.overdue > 0 ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {rentStats.overdue > 0
                      ? formatCurrency(rentStats.overdue)
                      : "None"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
                <Activity className="h-5 w-5 text-teal-600" />
                Recent Activity
              </h3>
              {recentActivities.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">
                  No activity yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {recentActivities.map((a) => (
                    <li
                      key={a.id}
                      className="flex gap-3 rounded-lg bg-slate-50 p-3"
                    >
                      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-teal-500" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">
                          {a.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {a.description || a.propertyName}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {a.time}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
            <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-slate-800">
              <Zap className="h-5 w-5 text-teal-600" />
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-2 rounded-lg border border-teal-200 bg-gradient-to-r from-teal-50 to-teal-100 px-4 py-2.5 text-sm font-semibold text-teal-700 transition hover:border-teal-300 hover:shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;