import React, { useState, useEffect } from "react";
import BackButton from "../../components/backButton";

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

  useEffect(() => {
    // optional: auto-fetch last month on mount
    // fetchReport();
  }, []);

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
          <BackButton/>

      <h2 className="text-3xl font-bold text-green-700 mb-6">Admin Donation Report</h2>

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

        {/* FILTER INPUTS */}
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
                  <option key={m} value={m}>
                    {m}
                  </option>
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
                    <th className="border p-2">Donor Name</th>
                    <th className="border p-2">Cause</th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Photo</th>
                    <th className="border p-2">Details</th>
                  </tr>
                </thead>

                <tbody>
                  {donations.map((d, index) => (
                    <Row
                      key={index}
                      donation={d}
                      onPhotoUpdated={(updatedDonation) => {
                        // update local state with new photoUrl
                        setDonations((prev) =>
                          prev.map((p) => (p._id === updatedDonation._id ? updatedDonation : p))
                        );
                      }}
                    />
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

/* -----------------------------------
   REUSABLE ROW COMPONENT (with photo upload)
----------------------------------- */
function Row({ donation, onPhotoUpdated }) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const API = "http://localhost:5000";

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Select a photo first");

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("photo", selectedFile);

      const res = await fetch(`${API}/api/admin/donation/${donation._id}/photo`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (data.success) {
        // updated donation returned
        onPhotoUpdated(data.donation);
        setSelectedFile(null);
        alert("Photo uploaded successfully");
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* COLLAPSED ROW */}
      <tr className="text-center hover:bg-green-50">
        <td className="border p-2">{donation.donorName}</td>
        <td className="border p-2">{donation.cause}</td>
        <td className="border p-2 font-bold text-green-700">₹{donation.amount}</td>

        {/* Photo column: show small thumbnail if exists */}
        <td className="border p-2">
          {donation.photoUrl ? (
            <img
              src={donation.photoUrl}
              alt="donation"
              className="w-16 h-12 object-cover rounded"
            />
          ) : (
            <span className="text-sm text-gray-500">No photo</span>
          )}
        </td>

        <td className="border p-2">
          <button
            onClick={() => setOpen(!open)}
            className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm"
          >
            {open ? "Hide" : "View"} Details
          </button>
        </td>
      </tr>

      {/* EXPANDED DETAILS */}
      {open && (
        <tr className="bg-green-50">
          <td colSpan="5" className="p-4 text-left border">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p>
                  <b>Email:</b> {donation.email || "—"}
                </p>
                <p>
                  <b>Phone:</b> {donation.phone || "—"}
                </p>
                <p>
                  <b>Payment Method:</b> {donation.paymentMethod || "—"}
                </p>
                <p>
                  <b>Recurring:</b> {donation.recurring ? "Yes" : "No"}
                </p>
                <p>
                  <b>Date:</b> {new Date(donation.date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="font-semibold mb-2">Photo</p>

                {donation.photoUrl ? (
                  <div className="mb-3">
                    <img
                      src={donation.photoUrl}
                      alt="donation"
                      className="w-48 h-32 object-cover rounded shadow"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 mb-3">No photo uploaded yet.</p>
                )}

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-sm"
                  />
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
                  >
                    {uploading ? "Uploading..." : "Upload Photo"}
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
