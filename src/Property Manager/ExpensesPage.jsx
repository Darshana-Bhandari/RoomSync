import React, { useState } from "react";
import { Eye, Edit, Trash2, Plus, X } from "lucide-react";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      name: "Groceries",
      category: "Food",
      paidBy: "Darshana",
      amount: 3000,
      date: "2025-09-01",
      status: "Settled",
      description: "",
    },
    {
      id: 2,
      name: "Internet",
      category: "Utilities",
      paidBy: "Ram",
      amount: 1500,
      date: "2025-08-29",
      status: "Pending",
      description: "",
    },
    {
      id: 3,
      name: "Cleaning Supplies",
      category: "Household",
      paidBy: "Sita",
      amount: 800,
      date: "2025-08-27",
      status: "Settled",
      description: "",
    },
    {
      id: 4,
      name: "Gas",
      category: "Utilities",
      paidBy: "Hari",
      amount: 2200,
      date: "2025-08-25",
      status: "Pending",
      description: "",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newExpense, setNewExpense] = useState({
    name: "",
    category: "Food",
    amount: "",
    paidBy: "",
    date: "",
    description: "",
  });

  const categories = ["All", "Food", "Utilities", "Household", "Other"];
  const statuses = ["All", "Settled", "Pending"];

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.paidBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || expense.category === categoryFilter;
    const matchesStatus =
      statusFilter === "All" || expense.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.name || !newExpense.amount || !newExpense.paidBy || !newExpense.date) {
      return;
    }
    const expenseToAdd = {
      id: Date.now(),
      name: newExpense.name,
      category: newExpense.category,
      paidBy: newExpense.paidBy,
      amount: Number(newExpense.amount),
      date: newExpense.date,
      status: "Pending",
      description: newExpense.description,
    };
    setExpenses([expenseToAdd, ...expenses]);
    setNewExpense({
      name: "",
      category: "Food",
      amount: "",
      paidBy: "",
      date: "",
      description: "",
    });
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage property and shared expenses
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Expenses</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">Rs. 24,500</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">This Month</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">Rs. 8,500</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Pending</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">Rs. 4,000</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All Categories" : cat}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === "All" ? "All Status" : status}
            </option>
          ))}
        </select>
      </div>

      {/* Expenses Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-600">Expense</th>
                <th className="px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 font-medium text-gray-600">Paid By</th>
                <th className="px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No expenses found
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3.5 font-medium text-gray-900">
                      {expense.name}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {expense.category}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {expense.paidBy}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-gray-900">
                      Rs. {expense.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          expense.status === "Settled"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete"
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
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Add Expense
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Expense Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newExpense.name}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, name: e.target.value })
                    }
                    placeholder="e.g. Groceries"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Food">Food</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Household">Household</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Amount (Rs.)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    placeholder="e.g. 1500"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Paid By
                  </label>
                  <input
                    type="text"
                    required
                    value={newExpense.paidBy}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, paidBy: e.target.value })
                    }
                    placeholder="e.g. Ram"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newExpense.date}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, date: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
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
                    placeholder="Optional notes..."
                    rows={2}
                    className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;