import { useEffect, useMemo, useState } from "react";
import { Receipt } from "lucide-react";
import { loadProperties } from "../Utils/propertyStorage";

const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString()}`;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const BillPage = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const refresh = () => setProperties(loadProperties());
    refresh();
    window.addEventListener("propertiesUpdated", refresh);
    return () => window.removeEventListener("propertiesUpdated", refresh);
  }, []);

  const bills = useMemo(
    () =>
      properties.flatMap((property) =>
        (Array.isArray(property.bills) ? property.bills : []).map((bill) => ({
          ...bill,
          propertyName: property.name || "Unnamed property",
        }))
      ),
    [properties]
  );

  const pendingCount = bills.filter(
    (bill) => String(bill.status || "").toUpperCase() === "PENDING"
  ).length;
  const paidAmount = bills
    .filter((bill) => String(bill.status || "").toUpperCase() === "PAID")
    .reduce((total, bill) => total + Number(bill.amount || 0), 0);

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-teal-100 p-3 text-teal-700">
              <Receipt className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Bills</h1>
              <p className="mt-1 text-sm text-slate-500">
                Review bills across your properties.
              </p>
            </div>
          </div>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total bills</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{bills.length}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Pending bills</p>
            <p className="mt-2 text-2xl font-bold text-amber-600">{pendingCount}</p>
            <p className="mt-1 text-xs text-slate-500">
              Paid total: {formatCurrency(paidAmount)}
            </p>
          </article>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Property bills</h2>
          </div>
          {bills.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <Receipt className="mx-auto h-9 w-9 text-slate-300" />
              <p className="mt-3 font-medium text-slate-700">No bills yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Bills added to your properties will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Bill</th>
                    <th className="px-5 py-3 font-semibold">Property</th>
                    <th className="px-5 py-3 font-semibold">Due date</th>
                    <th className="px-5 py-3 font-semibold">Amount</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bills.map((bill, index) => {
                    const status = String(bill.status || "PENDING").toUpperCase();
                    const isPaid = status === "PAID";
                    return (
                      <tr key={bill.id || `${bill.propertyName}-${index}`}>
                        <td className="px-5 py-4 font-medium text-slate-800">
                          {bill.type || bill.name || "Bill"}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {bill.propertyName}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {formatDate(bill.dueDate || bill.date)}
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-800">
                          {formatCurrency(bill.amount)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              isPaid
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default BillPage;
