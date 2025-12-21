import React, { useEffect, useState } from "react";
import BackButton from "../../components/backButton";

export default function History() {
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Donor User",
    centreId: "N/A",
  };

  const [donations, setDonations] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selected, setSelected] = useState(null);

  // NEW: Photo popup states
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoToShow, setPhotoToShow] = useState(null);

  // Fetch donations for this donor
  useEffect(() => {
    fetch("https://samadhan-new-2.onrender.com/api/donor/get-donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ donorName: user.username }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDonations(data.donations);
      });
  });

  return (
    <div className="relative">

      {/* PRINT CSS (only receipt prints) */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #receipt-preview, #receipt-preview * { visibility: visible; }
            #receipt-preview { 
              position: fixed; 
              top: 0; 
              left: 0; 
              width: 100%; 
              padding: 20px; 
              background: white;
            }
          }
        `}
      </style>

      {/* MAIN CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-orange-200">
          <BackButton/>
        <h2 className="text-3xl font-bold text-[#f58a1f] mb-6 text-center">
          Donation History
        </h2>

        {donations.length === 0 ? (
          <p className="text-center text-gray-600 py-6">No donations yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-orange-300 rounded-xl overflow-hidden">
              <thead className="bg-orange-100 text-orange-900">
                <tr>
                  <th className="border p-3">Name</th>
                  <th className="border p-3">Centre</th>
                  <th className="border p-3">Amount</th>
                  <th className="border p-3">Cause</th>
                  <th className="border p-3">Payment</th>
                  <th className="border p-3">Recurring</th>
                  <th className="border p-3">Date</th>
                  <th className="border p-3">Photo</th>
                  <th className="border p-3">Receipt</th>
                </tr>
              </thead>

              <tbody>
                {donations.map((d, i) => (
                  <tr key={i} className="text-center hover:bg-orange-50">
                    <td className="border p-3">{d.donorName}</td>
                    <td className="border p-3">{d.centreId}</td>
                    <td className="border p-3 text-[#f58a1f] font-bold">₹{d.amount}</td>
                    <td className="border p-3">{d.cause}</td>
                    <td className="border p-3">{d.paymentMethod}</td>
                    <td className="border p-3">{d.recurring ? "Yes" : "No"}</td>
                    <td className="border p-3">
                      {new Date(d.date).toLocaleDateString()}
                    </td>

                    {/* PHOTO COLUMN */}
                    <td className="border p-3">
                      {d.photoUrl ? (
                        <button
                          onClick={() => {
                            setPhotoToShow(d.photoUrl);
                            setPhotoModalOpen(true);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          See Photo
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm italic">
                          Not added yet
                        </span>
                      )}
                    </td>

                    {/* RECEIPT BUTTON */}
                    <td className="border p-3">
                      <button
                        onClick={() => {
                          setSelected(d);
                          setShowReceipt(true);
                        }}
                        className="px-4 py-1 bg-[#f58a1f] text-white rounded-lg hover:bg-[#e27810]"
                      >
                        View / Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* ---------------- RECEIPT POPUP ---------------- */}
      {showReceipt && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">

          <div
            id="receipt-preview"
            className="bg-white p-8 rounded-2xl shadow-xl w-[480px] border border-orange-300"
          >
            <h2 className="text-2xl font-bold text-[#f58a1f] text-center mb-4">
              Donation Receipt
            </h2>

            <div className="text-gray-800 space-y-2 text-lg">

              <p><b>Receipt ID:</b> {selected._id}</p>

              <p>
                <b>Donor Name:</b> {selected.title} {selected.donorName}
              </p>

              <p><b>Email:</b> {selected.email}</p>

              <p><b>Phone:</b> {selected.phone}</p>

              <p><b>Centre ID:</b> {selected.centreId}</p>

              <hr className="my-3" />

              <p><b>Amount Donated:</b> ₹{selected.amount}</p>

              <p><b>Cause:</b> {selected.cause}</p>

              <p><b>Payment Method:</b> {selected.paymentMethod}</p>

              <p><b>Recurring Donation:</b> {selected.recurring ? "Yes" : "No"}</p>

              <p><b>Date:</b> {new Date(selected.date).toLocaleDateString()}</p>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowReceipt(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#f58a1f] text-white rounded-lg hover:bg-[#e27810]"
              >
                Print / Save PDF
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ---------------- PHOTO MODAL POPUP ---------------- */}
      {photoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

          <div className="bg-white p-5 rounded-xl shadow-xl max-w-lg w-full relative">

            <h3 className="text-xl font-bold mb-3 text-center">Donation Photo</h3>

            <img
              src={photoToShow}
              alt="Donation proof"
              className="w-full h-auto rounded-lg shadow"
            />

            <div className="flex justify-center mt-4">
              <button
                onClick={() => setPhotoModalOpen(false)}
                className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
