import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  X,
  House,
  Search,
  Wallet,
  Clock,
  TrendingUp,
  Users,
  Receipt,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// =========================================================
// CONSTANTS & MOCK DATA
// =========================================================
const ROOMMATES = ["Darshana", "Ram", "Sita", "Hari"];
const CURRENT_USER = "Darshana";

const CATEGORIES = [
  "Utilities",
  "Electricity",
  "Water",
  "Internet",
  "Maintenance",
  "Cleaning",
  "Food",
  "Household",
  "Furniture",
  "Other",
];

const EXPENSE_TYPES = ["Property Expense", "Shared Expense"];
const STATUSES = ["Pending", "Partial", "Settled"];

const INITIAL_EXPENSES = [
  {
    id: 1,
    name: "Electricity Bill",
    category: "Utilities",
    type: "Property Expense",
    paidBy: "Darshana",
    amount: 2500,
    date: "2026-09-02",
    status: "Settled",
    description: "Monthly electricity bill",
    splitBetween: [],
    settledBy: [],
  },
  {
    id: 2,
    name: "Groceries",
    category: "Food",
    type: "Shared Expense",
    paidBy: "Darshana",
    amount: 3000,
    date: "2026-09-01",
    status: "Partial",
    description: "Monthly grocery shopping",
    splitBetween: ["Darshana", "Ram", "Sita", "Hari"],
    settledBy: ["Darshana", "Sita"],
  },
  {
    id: 3,
    name: "Internet",
    category: "Internet",
    type: "Property Expense",
    paidBy: "Ram",
    amount: 1500,
    date: "2026-08-29",
    status: "Settled",
    description: "Monthly internet bill",
    splitBetween: [],
    settledBy: [],
  },
  {
    id: 4,
    name: "Cleaning Supplies",
    category: "Cleaning",
    type: "Shared Expense",
    paidBy: "Sita",
    amount: 800,
    date: "2026-08-27",
    status: "Settled",
    description: "Cleaning products for common areas",
    splitBetween: ["Darshana", "Ram", "Sita", "Hari"],
    settledBy: ["Darshana", "Ram", "Sita", "Hari"],
  },
  {
    id: 5,
    name: "Gas Refill",
    category: "Household",
    type: "Shared Expense",
    paidBy: "Hari",
    amount: 2200,
    date: "2026-08-25",
    status: "Pending",
    description: "Cooking gas refill",
    splitBetween: ["Darshana", "Ram", "Sita", "Hari"],
    settledBy: [],
  },
];

// =========================================================
// HELPERS
// =========================================================
const getCategoryIcon = (category) => {
  const map = {
    Utilities: "💡",
    Electricity: "💡",
    Water: "💧",
    Internet: "🌐",
    Maintenance: "🔧",
    Cleaning: "🧹",
    Food: "🍔",
    Household: "🏠",
    Furniture: "🪑",
  };
  return map[category] || "📦";
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString()}`;

const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const getMonthLabel = (key) => {
  if (key === "All") return "All Months";
  const [year, month] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const getShortMonthLabel = (key) => {
  if (key === "All") return "All";
  const [year, month] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
};

/** Last 12 months (including current) */
const getLast12Months = () => {
  const months = [];
  const today = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push(key);
  }
  return months; // newest first
};

const deriveStatus = (expense) => {
  if (expense.type === "Property Expense") return expense.status;
  const total = expense.splitBetween?.length || 0;
  if (total === 0) return "Pending";
  const settledCount = expense.settledBy?.length || 0;
  if (settledCount === 0) return "Pending";
  if (settledCount === total) return "Settled";
  return "Partial";
};

const getShareAmount = (expense) => {
  const people = expense.splitBetween?.length || 0;
  if (people === 0) return 0;
  return Math.round(Number(expense.amount) / people);
};

// =========================================================
// COMPONENT
// =========================================================
const ExpensesPage = () => {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All"); // "All" or "YYYY-MM"
  const [sortBy, setSortBy] = useState("date-desc");

  // Custom month dropdown
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const monthDropdownRef = useRef(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const emptyExpense = {
    name: "",
    category: "Utilities",
    type: "Property Expense",
    amount: "",
    paidBy: "",
    date: "",
    status: "Pending",
    description: "",
    splitBetween: [],
    settledBy: [],
  };

  const [newExpense, setNewExpense] = useState(emptyExpense);
  const [formErrors, setFormErrors] = useState({});

  const currentMonthKey = getCurrentMonthKey();
  const last12Months = useMemo(() => getLast12Months(), []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(e.target)
      ) {
        setIsMonthDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =========================================================
  // DERIVED DATA
  // =========================================================
  const expensesWithStatus = useMemo(
    () =>
      expenses.map((e) => ({
        ...e,
        status: deriveStatus(e),
      })),
    [expenses]
  );

  // All expenses that belong to the selected period (for dashboard)
  const periodExpenses = useMemo(() => {
    if (monthFilter === "All") return expensesWithStatus;
    return expensesWithStatus.filter((e) => e.date.startsWith(monthFilter));
  }, [expensesWithStatus, monthFilter]);

  // Month summary for the dropdown
  const monthSummaries = useMemo(() => {
    const map = {};
    last12Months.forEach((key) => {
      map[key] = { total: 0, count: 0 };
    });

    expenses.forEach((e) => {
      const key = e.date.slice(0, 7);
      if (map[key]) {
        map[key].total += Number(e.amount);
        map[key].count += 1;
      }
    });

    return map;
  }, [expenses, last12Months]);

  // Filtered + sorted list for the table
  const filteredExpenses = useMemo(() => {
    let list = periodExpenses.filter((expense) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        expense.name.toLowerCase().includes(search) ||
        expense.paidBy.toLowerCase().includes(search) ||
        expense.category.toLowerCase().includes(search) ||
        expense.type.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "All" || expense.category === categoryFilter;
      const matchesType = typeFilter === "All" || expense.type === typeFilter;
      const matchesStatus =
        statusFilter === "All" || expense.status === statusFilter;

      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "date-desc") return b.date.localeCompare(a.date);
      if (sortBy === "date-asc") return a.date.localeCompare(b.date);
      if (sortBy === "amount-desc") return b.amount - a.amount;
      if (sortBy === "amount-asc") return a.amount - b.amount;
      return 0;
    });

    return list;
  }, [
    periodExpenses,
    searchTerm,
    categoryFilter,
    typeFilter,
    statusFilter,
    sortBy,
  ]);

  // ---- Dashboard numbers (respect selected month) ----
  const totalExpenses = useMemo(
    () => periodExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [periodExpenses]
  );

  const thisMonthExpenses = useMemo(() => {
    // When "All" is selected we still show the real current month total
    const source =
      monthFilter === "All"
        ? expensesWithStatus.filter((e) => e.date.startsWith(currentMonthKey))
        : periodExpenses;
    return source.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [periodExpenses, expensesWithStatus, monthFilter, currentMonthKey]);

  const pendingAmount = useMemo(() => {
    return periodExpenses.reduce((sum, e) => {
      if (e.type === "Property Expense") {
        return e.status === "Pending" ? sum + Number(e.amount) : sum;
      }
      const share = getShareAmount(e);
      const unsettledCount =
        (e.splitBetween?.length || 0) - (e.settledBy?.length || 0);
      return sum + share * unsettledCount;
    }, 0);
  }, [periodExpenses]);

  const settledAmount = useMemo(
    () => totalExpenses - pendingAmount,
    [totalExpenses, pendingAmount]
  );

  const propertyExpenseTotal = useMemo(
    () =>
      periodExpenses
        .filter((e) => e.type === "Property Expense")
        .reduce((sum, e) => sum + Number(e.amount), 0),
    [periodExpenses]
  );

  const sharedExpenseTotal = useMemo(
    () =>
      periodExpenses
        .filter((e) => e.type === "Shared Expense")
        .reduce((sum, e) => sum + Number(e.amount), 0),
    [periodExpenses]
  );

  const categoryTotals = useMemo(() => {
    const totals = {};
    periodExpenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
    });
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage:
          totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      }));
  }, [periodExpenses, totalExpenses]);

  // Balances (only from selected period)
  const balances = useMemo(() => {
    const net = Object.fromEntries(ROOMMATES.map((r) => [r, 0]));

    periodExpenses.forEach((expense) => {
      if (expense.type !== "Shared Expense") return;
      const share = getShareAmount(expense);
      const payer = expense.paidBy;

      expense.splitBetween.forEach((person) => {
        if (person === payer) return;
        const isSettled = expense.settledBy?.includes(person);
        if (!isSettled) {
          net[payer] += share;
          net[person] -= share;
        }
      });
    });

    return net;
  }, [periodExpenses]);

  const youOwe = Math.max(0, -balances[CURRENT_USER] || 0);
  const youAreOwed = Math.max(0, balances[CURRENT_USER] || 0);

  // Monthly spending chart data (always last 6 months)
  const monthlyChartData = useMemo(() => {
    const last6 = last12Months.slice(0, 6).reverse(); // oldest → newest
    return last6.map((key) => ({
      key,
      label: getShortMonthLabel(key),
      total: monthSummaries[key]?.total || 0,
      count: monthSummaries[key]?.count || 0,
    }));
  }, [last12Months, monthSummaries]);

  const maxChartValue = Math.max(
    ...monthlyChartData.map((d) => d.total),
    1
  );

  // =========================================================
  // HANDLERS
  // =========================================================
  const validateForm = () => {
    const errors = {};
    if (!newExpense.name.trim()) errors.name = "Name is required";
    if (!newExpense.amount || Number(newExpense.amount) <= 0)
      errors.amount = "Valid amount is required";
    if (!newExpense.paidBy) errors.paidBy = "Select who paid";
    if (!newExpense.date) errors.date = "Date is required";
    if (
      newExpense.type === "Shared Expense" &&
      newExpense.splitBetween.length === 0
    ) {
      errors.splitBetween = "Select at least one person";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitExpense = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalExpense = {
      ...newExpense,
      amount: Number(newExpense.amount),
      splitBetween:
        newExpense.type === "Shared Expense" ? newExpense.splitBetween : [],
      settledBy:
        newExpense.type === "Shared Expense" ? newExpense.settledBy || [] : [],
      status:
        newExpense.type === "Property Expense"
          ? newExpense.status
          : deriveStatus({
              ...newExpense,
              amount: Number(newExpense.amount),
            }),
    };

    if (editingExpenseId) {
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === editingExpenseId ? { ...exp, ...finalExpense } : exp
        )
      );
    } else {
      setExpenses((prev) => [
        { id: Date.now(), ...finalExpense },
        ...prev,
      ]);
    }

    setNewExpense(emptyExpense);
    setEditingExpenseId(null);
    setFormErrors({});
    setIsModalOpen(false);
  };

  const handleEdit = (expense) => {
    setEditingExpenseId(expense.id);
    setNewExpense({
      name: expense.name,
      category: expense.category,
      type: expense.type,
      amount: expense.amount,
      paidBy: expense.paidBy,
      date: expense.date,
      status: expense.status,
      description: expense.description || "",
      splitBetween: expense.splitBetween || [],
      settledBy: expense.settledBy || [],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleView = (expense) => {
    setSelectedExpense(expense);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!expenseToDelete) return;
    setExpenses((prev) => prev.filter((e) => e.id !== expenseToDelete.id));
    setExpenseToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const toggleSettled = (expenseId, person) => {
    setExpenses((prev) =>
      prev.map((exp) => {
        if (exp.id !== expenseId) return exp;
        const settledBy = exp.settledBy || [];
        const already = settledBy.includes(person);
        const nextSettled = already
          ? settledBy.filter((p) => p !== person)
          : [...settledBy, person];
        return {
          ...exp,
          settledBy: nextSettled,
          status: deriveStatus({ ...exp, settledBy: nextSettled }),
        };
      })
    );

    if (selectedExpense?.id === expenseId) {
      setSelectedExpense((prev) => {
        if (!prev) return prev;
        const settledBy = prev.settledBy || [];
        const already = settledBy.includes(person);
        const nextSettled = already
          ? settledBy.filter((p) => p !== person)
          : [...settledBy, person];
        return {
          ...prev,
          settledBy: nextSettled,
          status: deriveStatus({ ...prev, settledBy: nextSettled }),
        };
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setTypeFilter("All");
    setStatusFilter("All");
    // keep monthFilter as is – user usually wants to stay in the same period
  };

  const goToPreviousMonth = () => {
    if (monthFilter === "All") {
      setMonthFilter(currentMonthKey);
      return;
    }
    const idx = last12Months.indexOf(monthFilter);
    if (idx < last12Months.length - 1) {
      setMonthFilter(last12Months[idx + 1]);
    }
  };

  const goToNextMonth = () => {
    if (monthFilter === "All") return;
    const idx = last12Months.indexOf(monthFilter);
    if (idx > 0) {
      setMonthFilter(last12Months[idx - 1]);
    } else {
      // already at newest → stay
    }
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 shadow-sm">
              <House className="h-7 w-7 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage property and shared expenses
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingExpenseId(null);
              setNewExpense(emptyExpense);
              setFormErrors({});
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700"
          >
            <Plus size={18} />
            Add Expense
          </button>
        </div>

        {/* PERIOD SELECTOR (improved month filter) */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {/* Prev / Next */}
            <button
              onClick={goToPreviousMonth}
              className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition hover:bg-gray-50"
              title="Previous month"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Custom Dropdown */}
            <div className="relative" ref={monthDropdownRef}>
              <button
                onClick={() => setIsMonthDropdownOpen((o) => !o)}
                className="flex min-w-[220px] items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-left shadow-sm transition hover:border-teal-300"
              >
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-teal-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {getMonthLabel(monthFilter)}
                    </p>
                    {monthFilter !== "All" && (
                      <p className="text-xs text-gray-500">
                        {formatCurrency(monthSummaries[monthFilter]?.total || 0)}{" "}
                        • {monthSummaries[monthFilter]?.count || 0} expenses
                      </p>
                    )}
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition ${
                    isMonthDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isMonthDropdownOpen && (
                <div className="absolute left-0 top-full z-30 mt-2 w-72 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                  {/* All Months */}
                  <button
                    onClick={() => {
                      setMonthFilter("All");
                      setIsMonthDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-gray-50 ${
                      monthFilter === "All" ? "bg-teal-50" : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">All Months</p>
                      <p className="text-xs text-gray-500">
                        All recorded expenses
                      </p>
                    </div>
                    {monthFilter === "All" && (
                      <Check size={16} className="text-teal-600" />
                    )}
                  </button>

                  <div className="border-t border-gray-100" />

                  {/* Last 12 months */}
                  <div className="max-h-72 overflow-y-auto">
                    {last12Months.map((key) => {
                      const summary = monthSummaries[key] || {
                        total: 0,
                        count: 0,
                      };
                      const isCurrent = key === currentMonthKey;
                      const isSelected = monthFilter === key;

                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setMonthFilter(key);
                            setIsMonthDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-gray-50 ${
                            isSelected ? "bg-teal-50" : ""
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">
                                {getMonthLabel(key)}
                              </p>
                              {isCurrent && (
                                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-700">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {formatCurrency(summary.total)} • {summary.count}{" "}
                              expense{summary.count !== 1 ? "s" : ""}
                            </p>
                          </div>
                          {isSelected && (
                            <Check size={16} className="text-teal-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={goToNextMonth}
              disabled={
                monthFilter === "All" ||
                last12Months.indexOf(monthFilter) === 0
              }
              className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              title="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {monthFilter !== "All" && (
            <button
              onClick={() => setMonthFilter("All")}
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              View all months
            </button>
          )}
        </div>

        {/* SUMMARY CARDS */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {monthFilter === "All" ? "Total Expenses" : "Period Total"}
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {formatCurrency(totalExpenses)}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {periodExpenses.length} transaction
                  {periodExpenses.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
                <Wallet className="h-5 w-5 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {formatCurrency(thisMonthExpenses)}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp size={13} />
                  {getMonthLabel(currentMonthKey)}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">You Owe</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {formatCurrency(youOwe)}
                </p>
                <p className="mt-1 text-xs text-red-600">Outstanding</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                <ArrowUpRight className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">You're Owed</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {formatCurrency(youAreOwed)}
                </p>
                <p className="mt-1 text-xs text-green-600">To receive</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                <ArrowDownRight className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* MONTHLY SPENDING CHART + OVERVIEW */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Monthly Chart */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-1">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Monthly Spending
            </h2>
            <div className="space-y-3">
              {monthlyChartData.map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                  <span className="w-12 shrink-0 text-xs font-medium text-gray-500">
                    {item.label}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.key === currentMonthKey
                          ? "bg-teal-500"
                          : "bg-teal-300"
                      }`}
                      style={{
                        width: `${(item.total / maxChartValue) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs font-medium text-gray-700">
                    {item.total > 0
                      ? `Rs. ${(item.total / 1000).toFixed(1)}k`
                      : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Property vs Shared */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Expense Overview
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {monthFilter === "All"
                  ? "All time"
                  : getMonthLabel(monthFilter)}
              </p>
            </div>
            <div className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50">
                      <Building2 size={18} className="text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Property
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(propertyExpenseTotal)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-teal-500"
                    style={{
                      width: `${
                        totalExpenses > 0
                          ? (propertyExpenseTotal / totalExpenses) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
                      <Users size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Shared</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(sharedExpenseTotal)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{
                      width: `${
                        totalExpenses > 0
                          ? (sharedExpenseTotal / totalExpenses) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Top Categories
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {monthFilter === "All"
                  ? "All time"
                  : getMonthLabel(monthFilter)}
              </p>
            </div>
            <div className="space-y-4">
              {categoryTotals.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No expenses in this period.
                </p>
              ) : (
                categoryTotals.map((item) => (
                  <div key={item.category}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getCategoryIcon(item.category)}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {item.category}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(item.amount)}
                        </span>
                        <span className="ml-2 text-xs text-gray-400">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-teal-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* FILTERS (Category / Type / Status / Sort) */}
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search expense, category or roommate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pr-9 text-sm text-gray-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 xl:w-40"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Type */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pr-9 text-sm text-gray-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 xl:w-44"
              >
                <option value="All">All Types</option>
                {EXPENSE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Status */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pr-9 text-sm text-gray-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 xl:w-36"
              >
                <option value="All">All Status</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pr-9 text-sm text-gray-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 xl:w-40"
              >
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
                <option value="amount-desc">Highest amount</option>
                <option value="amount-asc">Lowest amount</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {(searchTerm ||
              categoryFilter !== "All" ||
              typeFilter !== "All" ||
              statusFilter !== "All") && (
              <button
                onClick={clearFilters}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Expense Transactions
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Showing {filteredExpenses.length} of {periodExpenses.length}{" "}
                expenses
                {monthFilter !== "All" && (
                  <span> in {getMonthLabel(monthFilter)}</span>
                )}
              </p>
            </div>
            <div className="hidden items-center gap-2 text-sm text-gray-500 sm:flex">
              <Users size={16} />
              {ROOMMATES.length} residents
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 font-medium text-gray-600">
                    Expense
                  </th>
                  <th className="px-5 py-3 font-medium text-gray-600">
                    Category
                  </th>
                  <th className="px-5 py-3 font-medium text-gray-600">Type</th>
                  <th className="px-5 py-3 font-medium text-gray-600">
                    Paid By
                  </th>
                  <th className="px-5 py-3 font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="px-5 py-3 font-medium text-gray-600">Date</th>
                  <th className="px-5 py-3 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-5 py-3 text-right font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <Receipt className="mb-3 h-12 w-12 text-gray-300" />
                        <p className="font-medium text-gray-600">
                          No expenses found
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          {monthFilter !== "All"
                            ? `Nothing recorded for ${getMonthLabel(
                                monthFilter
                              )}.`
                            : "Try changing your search or filters."}
                        </p>
                        {monthFilter !== "All" && (
                          <button
                            onClick={() => {
                              setEditingExpenseId(null);
                              setNewExpense({
                                ...emptyExpense,
                                date: `${monthFilter}-01`,
                              });
                              setIsModalOpen(true);
                            }}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                          >
                            <Plus size={16} />
                            Add Expense for this month
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b border-gray-50 last:border-0 transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg">
                            {getCategoryIcon(expense.category)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {expense.name}
                            </p>
                            <p className="mt-0.5 max-w-[180px] truncate text-xs text-gray-400">
                              {expense.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                            expense.type === "Property Expense"
                              ? "bg-teal-50 text-teal-700"
                              : "bg-purple-50 text-purple-700"
                          }`}
                        >
                          {expense.type === "Property Expense"
                            ? "Property"
                            : "Shared"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700">
                            {expense.paidBy.charAt(0)}
                          </div>
                          <span className="text-gray-700">
                            {expense.paidBy}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={expense.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleView(expense)}
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(expense)}
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-teal-50 hover:text-teal-600"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(expense)}
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-gray-100 md:hidden">
            {filteredExpenses.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Receipt className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="font-medium text-gray-600">No expenses found</p>
                <p className="mt-1 text-sm text-gray-400">
                  {monthFilter !== "All"
                    ? `Nothing for ${getMonthLabel(monthFilter)}`
                    : "Try adjusting filters"}
                </p>
              </div>
            ) : (
              filteredExpenses.map((expense) => (
                <div key={expense.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg">
                        {getCategoryIcon(expense.category)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {expense.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {expense.category} · {formatDate(expense.date)}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={expense.status} />
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          expense.type === "Property Expense"
                            ? "bg-teal-50 text-teal-700"
                            : "bg-purple-50 text-purple-700"
                        }`}
                      >
                        {expense.type === "Property Expense"
                          ? "Property"
                          : "Shared"}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleView(expense)}
                        className="rounded-lg p-2 text-gray-400"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(expense)}
                        className="rounded-lg p-2 text-gray-400"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(expense)}
                        className="rounded-lg p-2 text-gray-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ===================== ADD / EDIT MODAL ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingExpenseId ? "Edit Expense" : "Add Expense"}
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Record a property or shared expense
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingExpenseId(null);
                  setFormErrors({});
                }}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitExpense} className="space-y-5 p-6">
              {/* Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Expense Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setNewExpense({
                        ...newExpense,
                        type: "Property Expense",
                        splitBetween: [],
                        settledBy: [],
                      })
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      newExpense.type === "Property Expense"
                        ? "border-teal-300 bg-teal-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Building2
                      size={20}
                      className={
                        newExpense.type === "Property Expense"
                          ? "text-teal-600"
                          : "text-gray-400"
                      }
                    />
                    <p className="mt-2 text-sm font-semibold text-gray-800">
                      Property Expense
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Bills, repairs, services
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewExpense({
                        ...newExpense,
                        type: "Shared Expense",
                        splitBetween: [...ROOMMATES],
                        settledBy: [],
                      })
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      newExpense.type === "Shared Expense"
                        ? "border-purple-300 bg-purple-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Users
                      size={20}
                      className={
                        newExpense.type === "Shared Expense"
                          ? "text-purple-600"
                          : "text-gray-400"
                      }
                    />
                    <p className="mt-2 text-sm font-semibold text-gray-800">
                      Shared Expense
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Shared by residents
                    </p>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Expense Name
                </label>
                <input
                  type="text"
                  value={newExpense.name}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, name: e.target.value })
                  }
                  placeholder={
                    newExpense.type === "Property Expense"
                      ? "e.g. Electricity Bill"
                      : "e.g. Groceries"
                  }
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-100 ${
                    formErrors.name
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-teal-500"
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
                )}
              </div>

              {/* Category + Amount */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Amount (Rs.)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    placeholder="e.g. 2500"
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-100 ${
                      formErrors.amount
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-teal-500"
                    }`}
                  />
                  {formErrors.amount && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.amount}
                    </p>
                  )}
                </div>
              </div>

              {/* Paid By + Date */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Paid By
                  </label>
                  <select
                    value={newExpense.paidBy}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, paidBy: e.target.value })
                    }
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-100 ${
                      formErrors.paidBy
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-teal-500"
                    }`}
                  >
                    <option value="">Select person</option>
                    {ROOMMATES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {formErrors.paidBy && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.paidBy}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, date: e.target.value })
                    }
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-100 ${
                      formErrors.date
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-teal-500"
                    }`}
                  />
                  {formErrors.date && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.date}
                    </p>
                  )}
                </div>
              </div>

              {newExpense.type === "Property Expense" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Settlement Status
                  </label>
                  <select
                    value={newExpense.status}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, status: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Settled">Settled</option>
                  </select>
                </div>
              )}

              {newExpense.type === "Shared Expense" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Split Between
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROOMMATES.map((person) => {
                      const selected =
                        newExpense.splitBetween.includes(person);
                      return (
                        <label
                          key={person}
                          className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition ${
                            selected
                              ? "border-purple-200 bg-purple-50 text-purple-700"
                              : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => {
                              if (selected) {
                                setNewExpense({
                                  ...newExpense,
                                  splitBetween:
                                    newExpense.splitBetween.filter(
                                      (n) => n !== person
                                    ),
                                  settledBy: (
                                    newExpense.settledBy || []
                                  ).filter((n) => n !== person),
                                });
                              } else {
                                setNewExpense({
                                  ...newExpense,
                                  splitBetween: [
                                    ...newExpense.splitBetween,
                                    person,
                                  ],
                                });
                              }
                            }}
                            className="accent-purple-600"
                          />
                          {person}
                        </label>
                      );
                    })}
                  </div>
                  {formErrors.splitBetween && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.splitBetween}
                    </p>
                  )}
                  {newExpense.amount &&
                    newExpense.splitBetween.length > 0 && (
                      <div className="mt-3 rounded-lg bg-purple-50 p-3">
                        <p className="text-xs text-purple-700">
                          Each selected resident pays approximately
                        </p>
                        <p className="mt-1 text-lg font-bold text-purple-800">
                          {formatCurrency(
                            Number(newExpense.amount) /
                              newExpense.splitBetween.length
                          )}
                        </p>
                      </div>
                    )}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                  placeholder="Add optional notes..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingExpenseId(null);
                    setFormErrors({});
                  }}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
                >
                  {editingExpenseId ? "Save Changes" : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== VIEW MODAL ===================== */}
      {isViewModalOpen && selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Expense Details
                </h2>
                <p className="text-xs text-gray-500">Transaction information</p>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-xl">
                  {getCategoryIcon(selectedExpense.category)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedExpense.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedExpense.category}
                  </p>
                </div>
              </div>

              <div>
                <span
                  className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${
                    selectedExpense.type === "Property Expense"
                      ? "bg-teal-50 text-teal-700"
                      : "bg-purple-50 text-purple-700"
                  }`}
                >
                  {selectedExpense.type}
                </span>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-xs font-medium text-gray-500">Total Amount</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {formatCurrency(selectedExpense.amount)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Paid By</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedExpense.paidBy}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatDate(selectedExpense.date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedExpense.status} />
                  </div>
                </div>
              </div>

              {selectedExpense.type === "Shared Expense" &&
                selectedExpense.splitBetween?.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Settlement Breakdown
                    </p>
                    <div className="space-y-2">
                      {selectedExpense.splitBetween.map((person) => {
                        const share = getShareAmount(selectedExpense);
                        const isSettled =
                          selectedExpense.settledBy?.includes(person);
                        const isPayer = person === selectedExpense.paidBy;

                        return (
                          <div
                            key={person}
                            className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${
                              isSettled ? "bg-green-50" : "bg-amber-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-800">
                                {person}
                                {isPayer && (
                                  <span className="ml-1 text-xs text-gray-500">
                                    (paid)
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-gray-900">
                                {formatCurrency(share)}
                              </span>
                              <button
                                onClick={() =>
                                  toggleSettled(selectedExpense.id, person)
                                }
                                className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
                                  isSettled
                                    ? "bg-green-600 text-white"
                                    : "bg-white border border-amber-300 text-amber-600 hover:bg-amber-100"
                                }`}
                              >
                                {isSettled ? (
                                  <Check size={14} />
                                ) : (
                                  <Clock size={14} />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {(() => {
                      const share = getShareAmount(selectedExpense);
                      const unsettled = selectedExpense.splitBetween.filter(
                        (p) =>
                          p !== selectedExpense.paidBy &&
                          !selectedExpense.settledBy?.includes(p)
                      );
                      const toReceive = unsettled.length * share;

                      if (toReceive > 0) {
                        return (
                          <div className="mt-3 rounded-lg bg-teal-50 p-3">
                            <p className="text-xs text-teal-700">
                              {selectedExpense.paidBy} should still receive
                            </p>
                            <p className="mt-1 text-lg font-bold text-teal-800">
                              {formatCurrency(toReceive)}
                            </p>
                          </div>
                        );
                      }
                      return (
                        <div className="mt-3 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-700">
                          Fully settled ✓
                        </div>
                      );
                    })()}
                  </div>
                )}

              {selectedExpense.description && (
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-700">
                    Description
                  </p>
                  <p className="rounded-lg bg-gray-50 p-3 text-sm leading-6 text-gray-600">
                    {selectedExpense.description}
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEdit(selectedExpense);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
              >
                <Edit size={16} />
                Edit Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== DELETE CONFIRMATION ===================== */}
      {isDeleteModalOpen && expenseToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="mt-4 text-center text-lg font-semibold text-gray-900">
              Delete Expense?
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">
                {expenseToDelete.name}
              </span>
              ?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setExpenseToDelete(null);
                  setIsDeleteModalOpen(false);
                }}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Status badge
const StatusBadge = ({ status }) => {
  const styles = {
    Settled: "bg-green-50 text-green-700",
    Partial: "bg-blue-50 text-blue-700",
    Pending: "bg-amber-50 text-amber-700",
  };
  const icons = {
    Settled: <CheckCircle2 size={13} />,
    Partial: <Clock size={13} />,
    Pending: <Clock size={13} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] || styles.Pending
      }`}
    >
      {icons[status] || icons.Pending}
      {status}
    </span>
  );
};

export default ExpensesPage;