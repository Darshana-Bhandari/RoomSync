import { useState, useMemo } from "react";

import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  IndianRupee,
  Users,
  Calendar,
  CreditCard,
  FileText,
  Send,
  House,
} from "lucide-react";

// ==================== MOCK DATA ====================
const MOCK_RESIDENTS = [
  { id: 1, name: "Darshana Bhandari", room: "101", rentAmount: 10000 },
  { id: 2, name: "Ram Sharma", room: "101", rentAmount: 10000 },
  { id: 3, name: "Sita Thapa", room: "102", rentAmount: 12000 },
  { id: 4, name: "Hari Gurung", room: "103", rentAmount: 10000 },
];

const INITIAL_RENTS = [
  {
    id: 1,
    residentId: 1,
    residentName: "Darshana Bhandari",
    room: "101",
    amount: 10000,
    dueDate: "2026-08-10",
    paidOn: "2026-08-05",
    paidAmount: 10000,
    paymentMethod: "Cash",
    note: "",
    month: "2026-08",
  },
  {
    id: 2,
    residentId: 2,
    residentName: "Ram Sharma",
    room: "101",
    amount: 10000,
    dueDate: "2026-08-10",
    paidOn: "2026-08-06",
    paidAmount: 5000, // partial example
    paymentMethod: "Bank Transfer",
    note: "Partial payment",
    month: "2026-08",
  },
  {
    id: 3,
    residentId: 3,
    residentName: "Sita Thapa",
    room: "102",
    amount: 12000,
    dueDate: "2026-08-10",
    paidOn: null,
    paidAmount: 0,
    paymentMethod: null,
    note: "",
    month: "2026-08",
  },
  {
    id: 4,
    residentId: 4,
    residentName: "Hari Gurung",
    room: "103",
    amount: 10000,
    dueDate: "2026-08-10",
    paidOn: null,
    paidAmount: 0,
    paymentMethod: null,
    note: "",
    month: "2026-08",
  },
];

const PAYMENT_METHODS = ["Cash", "Bank Transfer", "eSewa", "Khalti", "Card"];

// ==================== HELPERS ====================
const formatCurrency = (amount) =>
  `Rs. ${Number(amount).toLocaleString("en-NP")}`;

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const formatShortDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
};

const getMonthLabel = (monthStr) => {
  const [year, month] = monthStr.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

/** Automatically determines status. Never trust a stored status field. */
const getRentStatus = (rent) => {
  const paid = Number(rent.paidAmount) || 0;
  if (paid >= rent.amount) return "PAID";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(rent.dueDate);
  due.setHours(0, 0, 0, 0);

  if (today > due) return "OVERDUE";
  return "PENDING";
};

const getRemaining = (rent) =>
  Math.max(Number(rent.amount) - (Number(rent.paidAmount) || 0), 0);

const StatusBadge = ({ status }) => {
  const styles = {
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    OVERDUE: "bg-red-50 text-red-700 border-red-200",
  };
  const icons = {
    PAID: <CheckCircle2 className="w-3.5 h-3.5" />,
    PENDING: <Clock className="w-3.5 h-3.5" />,
    OVERDUE: <AlertCircle className="w-3.5 h-3.5" />,
  };
  const labels = { PAID: "Paid", PENDING: "Pending", OVERDUE: "Overdue" };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {icons[status]}
      {labels[status]}
    </span>
  );
};

// ==================== MAIN COMPONENT ====================
export default function RentPage() {
  const [rents, setRents] = useState(INITIAL_RENTS);
  const [selectedMonth, setSelectedMonth] = useState("2026-08");
  const [searchQuery, setSearchQuery] = useState("");
  const [roomFilter, setRoomFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRent, setSelectedRent] = useState(null);

  // Generate form
  const [generateDueDay, setGenerateDueDay] = useState(10);
  const [selectedResidents, setSelectedResidents] = useState(
    MOCK_RESIDENTS.map((r) => r.id)
  );

  // Record payment form
  const [paymentForm, setPaymentForm] = useState({
    residentId: "",
    paidAmount: "",
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMethod: "Cash",
    note: "",
  });

  // Simple toast (replace with real toast library later)
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  // ---------- Derived data ----------
  const monthRents = useMemo(
    () => rents.filter((r) => r.month === selectedMonth),
    [rents, selectedMonth]
  );

  // Enrich with live status + remaining
  const enrichedMonthRents = useMemo(
    () =>
      monthRents.map((r) => ({
        ...r,
        status: getRentStatus(r),
        remaining: getRemaining(r),
      })),
    [monthRents]
  );

  const filteredRents = useMemo(() => {
    return enrichedMonthRents.filter((r) => {
      const matchesSearch =
        r.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.room.includes(searchQuery);
      const matchesRoom = roomFilter === "all" || r.room === roomFilter;
      const matchesStatus =
        statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesRoom && matchesStatus;
    });
  }, [enrichedMonthRents, searchQuery, roomFilter, statusFilter]);

  const summary = useMemo(() => {
    const expected = enrichedMonthRents.reduce((s, r) => s + r.amount, 0);
    const collected = enrichedMonthRents.reduce(
      (s, r) => s + (Number(r.paidAmount) || 0),
      0
    );
    const outstanding = Math.max(expected - collected, 0);

    const paidCount = enrichedMonthRents.filter((r) => r.status === "PAID").length;
    const pendingCount = enrichedMonthRents.filter(
      (r) => r.status === "PENDING"
    ).length;
    const overdueCount = enrichedMonthRents.filter(
      (r) => r.status === "OVERDUE"
    ).length;

    const pendingAmount = enrichedMonthRents
      .filter((r) => r.status === "PENDING")
      .reduce((s, r) => s + r.remaining, 0);
    const overdueAmount = enrichedMonthRents
      .filter((r) => r.status === "OVERDUE")
      .reduce((s, r) => s + r.remaining, 0);

    const percent =
      expected > 0 ? Math.round((collected / expected) * 1000) / 10 : 0;

    return {
      expected,
      collected,
      outstanding,
      pending: pendingAmount,
      overdue: overdueAmount,
      paidCount,
      pendingCount,
      overdueCount,
      totalResidents: enrichedMonthRents.length,
      percent,
    };
  }, [enrichedMonthRents]);

  // Only unpaid residents for the selected month (for Record Payment)
  const unpaidResidents = useMemo(
    () => enrichedMonthRents.filter((r) => r.status !== "PAID"),
    [enrichedMonthRents]
  );

  // Recent payments belonging to the selected month
  const recentPayments = useMemo(() => {
    return rents
      .filter(
        (r) =>
          r.month === selectedMonth &&
          (Number(r.paidAmount) || 0) > 0 &&
          r.paidOn
      )
      .sort((a, b) => new Date(b.paidOn) - new Date(a.paidOn))
      .slice(0, 5);
  }, [rents, selectedMonth]);

  const uniqueRooms = useMemo(
    () => [...new Set(MOCK_RESIDENTS.map((r) => r.room))].sort(),
    []
  );

  // Residents that already have a rent record for the selected month
  const existingResidentIds = useMemo(
    () => new Set(monthRents.map((r) => r.residentId)),
    [monthRents]
  );

  const residentsToGenerate = useMemo(
    () =>
      MOCK_RESIDENTS.filter(
        (r) =>
          selectedResidents.includes(r.id) && !existingResidentIds.has(r.id)
      ),
    [selectedResidents, existingResidentIds]
  );

  const alreadyGeneratedCount = useMemo(
    () =>
      MOCK_RESIDENTS.filter(
        (r) =>
          selectedResidents.includes(r.id) && existingResidentIds.has(r.id)
      ).length,
    [selectedResidents, existingResidentIds]
  );

  // ---------- Month navigation ----------
  const changeMonth = (direction) => {
    const [y, m] = selectedMonth.split("-").map(Number);
    const date = new Date(y, m - 1 + direction, 1);
    const next = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    setSelectedMonth(next);
  };

  // ---------- Handlers ----------
  const openDetails = (rent) => {
    setSelectedRent(rent);
    setShowDetailsModal(true);
  };

  const openRecordFromDetails = () => {
    if (!selectedRent) return;
    const remaining = getRemaining(selectedRent);
    setPaymentForm({
      residentId: String(selectedRent.residentId),
      paidAmount: String(remaining),
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMethod: "Cash",
      note: "",
    });
    setShowDetailsModal(false);
    setShowRecordModal(true);
  };

  const handleGenerateRent = () => {
    if (residentsToGenerate.length === 0) {
      showToast("No new residents to generate rent for.", "error");
      return;
    }

    const confirmMsg =
      alreadyGeneratedCount > 0
        ? `${alreadyGeneratedCount} resident(s) already have rent for ${getMonthLabel(
            selectedMonth
          )}.\n\nOnly ${residentsToGenerate.length} new record(s) will be created. Continue?`
        : `Generate rent for ${residentsToGenerate.length} resident(s) in ${getMonthLabel(
            selectedMonth
          )}?`;

    if (!window.confirm(confirmMsg)) return;

    const newRents = residentsToGenerate.map((r, idx) => ({
      id: Date.now() + idx,
      residentId: r.id,
      residentName: r.name,
      room: r.room,
      amount: r.rentAmount,
      dueDate: `${selectedMonth}-${String(generateDueDay).padStart(2, "0")}`,
      paidOn: null,
      paidAmount: 0,
      paymentMethod: null,
      note: "",
      month: selectedMonth,
    }));

    setRents((prev) => [...prev, ...newRents]);
    setShowGenerateModal(false);
    showToast(
      `Generated ${newRents.length} rent record(s) for ${getMonthLabel(
        selectedMonth
      )}`
    );
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    const residentId = Number(paymentForm.residentId);
    const target = monthRents.find((r) => r.residentId === residentId);

    if (!target) {
      showToast("No rent record found for this resident in the selected month.", "error");
      return;
    }

    const currentStatus = getRentStatus(target);
    if (currentStatus === "PAID") {
      showToast("This rent is already fully paid.", "error");
      return;
    }

    const paymentAmount = Number(paymentForm.paidAmount);
    const remaining = getRemaining(target);

    if (paymentAmount <= 0) {
      showToast("Payment amount must be greater than zero.", "error");
      return;
    }
    if (paymentAmount > remaining) {
      showToast(
        `Cannot pay more than remaining amount (${formatCurrency(remaining)}).`,
        "error"
      );
      return;
    }

    const newPaidAmount = (Number(target.paidAmount) || 0) + paymentAmount;

    setRents((prev) =>
      prev.map((r) =>
        r.id === target.id
          ? {
              ...r,
              paidAmount: newPaidAmount,
              paidOn: paymentForm.paymentDate,
              paymentMethod: paymentForm.paymentMethod,
              note: paymentForm.note || r.note,
            }
          : r
      )
    );

    setShowRecordModal(false);
    setPaymentForm({
      residentId: "",
      paidAmount: "",
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMethod: "Cash",
      note: "",
    });
    showToast(`Payment of ${formatCurrency(paymentAmount)} recorded successfully`);
  };

  const handleReminder = (rent) => {
    const remaining = getRemaining(rent);
    // In a real app this would call POST /rents/:id/reminder
    showToast(
      `Reminder sent to ${rent.residentName} for ${formatCurrency(remaining)}`
    );
  };

  const toggleResident = (id) => {
    setSelectedResidents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allSelected =
    selectedResidents.length === MOCK_RESIDENTS.length &&
    MOCK_RESIDENTS.length > 0;

  const toggleSelectAll = () => {
    setSelectedResidents(
      allSelected ? [] : MOCK_RESIDENTS.map((r) => r.id)
    );
  };

  // Remaining amount for the currently selected resident in the payment form
  const selectedPaymentRent = monthRents.find(
    (r) => String(r.residentId) === paymentForm.residentId
  );
  const remainingForSelected = selectedPaymentRent
    ? getRemaining(selectedPaymentRent)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
       

       {/* ========== HEADER ========== */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

  {/* Logo + Title */}
  <div className="flex items-center gap-4">

    {/* RoomSync Logo */}
    <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm">
      <House className="w-7 h-7 text-white" strokeWidth={2} />
    </div>

    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Rent Management
      </h1>

      <p className="text-sm text-slate-500 mt-1">
        Manage monthly rent, payments & payment history
      </p>
    </div>

  </div>

  {/* Month + Buttons */}
  <div className="flex items-center gap-3 flex-wrap">

    {/* Month Selector */}
    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 shadow-sm">

      <button
        onClick={() => changeMonth(-1)}
        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <span className="text-sm font-medium text-slate-800 min-w-[120px] text-center">
        {getMonthLabel(selectedMonth)}
      </span>

      <button
        onClick={() => changeMonth(1)}
        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

    </div>

    {/* Generate Rent */}
    <button
      onClick={() => {
        setSelectedResidents(MOCK_RESIDENTS.map((r) => r.id));
        setShowGenerateModal(true);
      }}
      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
    >
      <Plus className="w-4 h-4" />
      Generate Rent
    </button>

    {/* Record Payment */}
    <button
      onClick={() => {
        setPaymentForm({
          residentId: "",
          paidAmount: "",
          paymentDate: new Date().toISOString().slice(0, 10),
          paymentMethod: "Cash",
          note: "",
        });

        setShowRecordModal(true);
      }}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-sm transition"
    >
      <CreditCard className="w-4 h-4" />
      Record Payment
    </button>

  </div>

</div>

        {/* ========== SUMMARY CARDS ========== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Expected */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Expected</p>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <IndianRupee className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {formatCurrency(summary.expected)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {summary.totalResidents} residents
            </p>
          </div>

          {/* Collected */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Collected</p>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {formatCurrency(summary.collected)}
            </p>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>{summary.percent}%</span>
                <span>{summary.paidCount} paid</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(summary.percent, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Pending</p>
              <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {formatCurrency(summary.pending)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {summary.pendingCount} resident{summary.pendingCount !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Overdue */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Overdue</p>
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {formatCurrency(summary.overdue)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {summary.overdueCount} late
            </p>
          </div>

          {/* Outstanding */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Outstanding</p>
              <div className="p-2 bg-slate-100 rounded-lg">
                <Users className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {formatCurrency(summary.outstanding)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {summary.pendingCount + summary.overdueCount} unpaid
            </p>
          </div>
        </div>

        {/* ========== RENT COLLECTION TABLE ========== */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">
              Rent Collection
            </h2>
          </div>

          {/* Filters */}
          <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search resident..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Rooms</option>
              {uniqueRooms.map((room) => (
                <option key={room} value={room}>
                  Room {room}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Resident</th>
                  <th className="px-5 py-3">Room</th>
                  <th className="px-5 py-3">Rent</th>
                  <th className="px-5 py-3">Paid</th>
                  <th className="px-5 py-3">Remaining</th>
                  <th className="px-5 py-3">Due Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      {monthRents.length === 0 ? (
                        <div className="space-y-3">
                          <p className="text-slate-500 font-medium">
                            No Rent Generated
                          </p>
                          <p className="text-sm text-slate-400">
                            Rent hasn’t been generated for{" "}
                            {getMonthLabel(selectedMonth)} yet.
                          </p>
                          <button
                            onClick={() => {
                              setSelectedResidents(
                                MOCK_RESIDENTS.map((r) => r.id)
                              );
                              setShowGenerateModal(true);
                            }}
                            className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg"
                          >
                            <Plus className="w-4 h-4" />
                            Generate {getMonthLabel(selectedMonth)} Rent
                          </button>
                        </div>
                      ) : (
                        <p className="text-slate-400">
                          No rent records match your filters.
                        </p>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredRents.map((rent) => (
                    <tr
                      key={rent.id}
                      className="hover:bg-slate-50/50 transition"
                    >
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        {rent.residentName}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{rent.room}</td>
                      <td className="px-5 py-3.5 text-slate-900 font-medium">
                        {formatCurrency(rent.amount)}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">
                        {formatCurrency(rent.paidAmount || 0)}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">
                        {formatCurrency(rent.remaining)}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {formatShortDate(rent.dueDate)}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={rent.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => openDetails(rent)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========== BOTTOM SECTION ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Monthly Collection
            </h3>
            <div className="flex items-end justify-between mb-2">
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(summary.collected)}
              </p>
              <p className="text-sm text-slate-500">
                of {formatCurrency(summary.expected)}
              </p>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(summary.percent, 100)}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600">
                  Paid <strong>{summary.paidCount}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-slate-600">
                  Pending <strong>{summary.pendingCount}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-slate-600">
                  Overdue <strong>{summary.overdueCount}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Recent Payments ({getMonthLabel(selectedMonth)})
              </h3>
              <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                View Full History →
              </button>
            </div>
            <div className="space-y-3">
              {recentPayments.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">
                  No payments recorded for this month yet.
                </p>
              ) : (
                recentPayments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {p.residentName} · {formatCurrency(p.paidAmount)}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {p.paymentMethod} · Room {p.room}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500">
                      {formatDate(p.paidOn)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========== GENERATE RENT MODAL ========== */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">
                Generate Monthly Rent
              </h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Month
                </label>
                <div className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800">
                  {getMonthLabel(selectedMonth)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Due Date (day of month)
                </label>
                <input
                  type="number"
                  min={1}
                  max={28}
                  value={generateDueDay}
                  onChange={(e) => setGenerateDueDay(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Active Residents
                  </label>
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    {allSelected ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {MOCK_RESIDENTS.map((r) => {
                    const alreadyHas = existingResidentIds.has(r.id);
                    return (
                      <label
                        key={r.id}
                        className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer ${
                          alreadyHas
                            ? "bg-slate-50 opacity-70"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedResidents.includes(r.id)}
                          onChange={() => toggleResident(r.id)}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-800 flex-1">
                          {r.name}
                          {alreadyHas && (
                            <span className="ml-2 text-xs text-amber-600">
                              (already generated)
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-slate-500">
                          Room {r.room} · {formatCurrency(r.rentAmount)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {alreadyGeneratedCount > 0 && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  ⚠ {alreadyGeneratedCount} resident(s) already have rent for
                  this month. Only {residentsToGenerate.length} new record(s)
                  will be created.
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Residents selected</span>
                  <span className="font-medium text-slate-800">
                    {selectedResidents.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">New records to create</span>
                  <span className="font-medium text-slate-800">
                    {residentsToGenerate.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total Expected (new)</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(
                      residentsToGenerate.reduce((s, r) => s + r.rentAmount, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateRent}
                disabled={residentsToGenerate.length === 0}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Rent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== RECORD PAYMENT MODAL ========== */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">
                Record Rent Payment
              </h3>
              <button
                onClick={() => setShowRecordModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Resident (unpaid only)
                </label>
                <select
                  required
                  value={paymentForm.residentId}
                  onChange={(e) => {
                    const id = e.target.value;
                    const rent = unpaidResidents.find(
                      (r) => String(r.residentId) === id
                    );
                    setPaymentForm((f) => ({
                      ...f,
                      residentId: id,
                      paidAmount: rent ? String(rent.remaining) : "",
                    }));
                  }}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select resident</option>
                  {unpaidResidents.length === 0 ? (
                    <option disabled>No unpaid rents this month</option>
                  ) : (
                    unpaidResidents.map((r) => (
                      <option key={r.residentId} value={r.residentId}>
                        {r.residentName} — Room {r.room} (Remaining{" "}
                        {formatCurrency(r.remaining)})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {paymentForm.residentId && selectedPaymentRent && (
                <>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Room</p>
                      <p className="font-medium text-slate-800">
                        {selectedPaymentRent.room}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Total Rent</p>
                      <p className="font-medium text-slate-800">
                        {formatCurrency(selectedPaymentRent.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Already Paid</p>
                      <p className="font-medium text-slate-800">
                        {formatCurrency(selectedPaymentRent.paidAmount || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Remaining</p>
                      <p className="font-medium text-indigo-600">
                        {formatCurrency(remainingForSelected)}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Paid Amount
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={remainingForSelected || undefined}
                  value={paymentForm.paidAmount}
                  onChange={(e) =>
                    setPaymentForm((f) => ({
                      ...f,
                      paidAmount: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {paymentForm.residentId && (
                  <p className="text-xs text-slate-500 mt-1">
                    Maximum: {formatCurrency(remainingForSelected)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Payment Date
                </label>
                <input
                  type="date"
                  required
                  value={paymentForm.paymentDate}
                  onChange={(e) =>
                    setPaymentForm((f) => ({
                      ...f,
                      paymentDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Payment Method
                </label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) =>
                    setPaymentForm((f) => ({
                      ...f,
                      paymentMethod: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Note (optional)
                </label>
                <textarea
                  rows={2}
                  value={paymentForm.note}
                  onChange={(e) =>
                    setPaymentForm((f) => ({ ...f, note: e.target.value }))
                  }
                  placeholder="Optional note..."
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={unpaidResidents.length === 0}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== RENT DETAILS MODAL ========== */}
      {showDetailsModal && selectedRent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">
                Rent Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  {selectedRent.residentName}
                </p>
                <p className="text-sm text-slate-500">
                  Room {selectedRent.room} · {getMonthLabel(selectedRent.month)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Monthly Rent</p>
                  <p className="font-medium text-slate-900 mt-0.5">
                    {formatCurrency(selectedRent.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Due Date</p>
                  <p className="font-medium text-slate-900 mt-0.5">
                    {formatDate(selectedRent.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Paid Amount</p>
                  <p className="font-medium text-slate-900 mt-0.5">
                    {formatCurrency(selectedRent.paidAmount || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Remaining</p>
                  <p className="font-medium text-slate-900 mt-0.5">
                    {formatCurrency(getRemaining(selectedRent))}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={getRentStatus(selectedRent)} />
                  </div>
                </div>
                {selectedRent.paidOn && (
                  <>
                    <div>
                      <p className="text-slate-500">Last Paid On</p>
                      <p className="font-medium text-slate-900 mt-0.5">
                        {formatDate(selectedRent.paidOn)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Payment Method</p>
                      <p className="font-medium text-slate-900 mt-0.5">
                        {selectedRent.paymentMethod || "—"}
                      </p>
                    </div>
                  </>
                )}
              </div>
              {selectedRent.note && (
                <div>
                  <p className="text-sm text-slate-500">Note</p>
                  <p className="text-sm text-slate-700 mt-0.5">
                    {selectedRent.note}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              {getRentStatus(selectedRent) !== "PAID" ? (
                <>
                  <button
                    onClick={openRecordFromDetails}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    <CreditCard className="w-4 h-4" />
                    Record Payment
                  </button>
                  <button
                    onClick={() => handleReminder(selectedRent)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <Send className="w-4 h-4" />
                    Reminder
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}