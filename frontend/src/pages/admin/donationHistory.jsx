import React, { useState } from "react";

export default function DonationHistory() {
  const [filterType, setFilterType] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");

  const [donations, setDonations] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const API = "http://localhost:5000";

  // -------------------------------
  // FETCH REPORT
  // -------------------------------
  const fetchReport = async () => {
    if (!filterType) return alert("Please select report type");

    const payload = {
      filterType,
      month: Number(month),
      year: Number(year),
      date,
    };

    const res = await fetch(`${API}/api/admin/filter-donations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      setDonations(data.donations);
      setTotalAmount(data.donations.reduce((sum, d) => sum + d.amount, 0));
    } else {
      alert("No records found");
      setDonations([]);
      setTotalAmount(0);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg border border-green-300 relative">

      {/* PRINT CSS */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #report-section, #report-section * { visibility: visible; }
            #report-section { position: absolute; top: 0; left: 0; width: 100%; }
          }
        `}
      </style>

      <h2 className="text-3xl font-bold text-green-700 mb-6">
        Admin Donation Report
      </h2>

      {/* FILTERS */}
      <div className="bg-green-50 p-5 rounded-xl border border-green-200 mb-8">
        <h3 className="font-semibold text-green-800 mb-3">Select Report Type</h3>

        <div className="flex flex-wrap gap-4 mb-4">

          <button
            onClick={() => setFilterType("date")}
            className={`px-4 py-2 rounded-lg shadow ${
              filterType === "date" ? "bg-green-600 text-white" : "bg-white border"
            }`}
          >
            By Date
          </button>

          <button
            onClick={() => setFilterType("month")}
            className={`px-4 py-2 rounded-lg shadow ${
              filterType === "month" ? "bg-green-600 text-white" : "bg-white border"
            }`}
          >
            Full Month
          </button>

          <button
            onClick={() => setFilterType("year")}
            className={`px-4 py-2 rounded-lg shadow ${
              filterType === "year" ? "bg-green-600 text-white" : "bg-white border"
            }`}
          >
            Full Year
          </button>

        </div>

        {/* FILTER INPUT FIELDS */}
        <div className="grid md:grid-cols-3 gap-4">

          {filterType === "date" && (
            <input
              type="date"
              className="p-2 rounded-lg border"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          )}

          {filterType === "month" && (
            <>
              <select
                className="p-2 rounded-lg border"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Select Month</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <input
                type="number"
                className="p-2 rounded-lg border"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </>
          )}

          {filterType === "year" && (
            <input
              type="number"
              className="p-2 rounded-lg border"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          )}

        </div>

        <button
          onClick={fetchReport}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          Fetch Report
        </button>
      </div>

      {/* REPORT SECTION */}
      <div id="report-section">
        {donations.length > 0 && (
          <>
            {/* SUMMARY */}
            <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-xl">
              <h3 className="text-xl font-bold text-green-800">Summary</h3>
              <p className="text-lg mt-2">
                <b>Total Donations:</b> {donations.length}
              </p>
              <p className="text-lg">
                <b>Total Amount:</b> ₹{totalAmount}
              </p>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full border border-green-300 rounded-xl overflow-hidden">
                <thead className="bg-green-200 text-green-900">
                  <tr>
                    <th className="border p-2">Full Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Phone</th>
                    <th className="border p-2">Cause</th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Payment</th>
                    <th className="border p-2">Recurring</th>
                    <th className="border p-2">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {donations.map((d, i) => (
                    <tr key={i} className="text-center hover:bg-green-50">
                      <td className="border p-2">{d.title} {d.donorName}</td>
                      <td className="border p-2">{d.email}</td>
                      <td className="border p-2">{d.phone}</td>
                      <td className="border p-2">{d.cause}</td>
                      <td className="border p-2 font-bold text-green-700">₹{d.amount}</td>
                      <td className="border p-2">{d.paymentMethod}</td>
                      <td className="border p-2">{d.recurring ? "Yes" : "No"}</td>
                      <td className="border p-2">
                        {new Date(d.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PRINT BUTTON */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
              >
                Print / Export PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
