import React, { useState } from "react";

export default function Donate() {
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "",
    centreId: "N/A",
  };

  const quickAmounts = [100, 250, 500, 1000];

  const causes = [
    "Education Support",
    "Feeding Program",
    "Girls Empowerment",
    "Health & Hygiene",
    "Community Development",
  ];

  const paymentMethods = ["UPI", "Cash", "Bank Transfer"];

  const [amount, setAmount] = useState("");
  const [cause, setCause] = useState("");
  const [payment, setPayment] = useState("");
  const [recurring, setRecurring] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  // NEW FIELDS
  const [title, setTitle] = useState("Mr");
  const [fullName, setFullName] = useState(user.username || "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const impactMessage = (() => {
    if (!amount) return "Your donation will create a meaningful impact.";
    if (amount < 200) return "Your kindness helps provide nutritious snacks for a child.";
    if (amount < 500) return "Your support funds 2–3 days of meals.";
    if (amount < 1000) return "Your generosity provides a complete school kit.";
    return "Your donation transforms multiple young lives.";
  })();

  const handleDonate = async () => {
    if (!amount || !cause || !payment || !fullName || !email || !phone) {
      alert("Please fill all required fields.");
      return;
    }

    const donationData = {
      title,
      donorName: fullName,
      email,
      phone,
      centreId: user.centreId || "N/A",

      amount: Number(amount),
      cause,
      paymentMethod: payment,
      recurring,
      date: new Date(),
    };

    const res = await fetch("http://localhost:5000/api/donor/save-donation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donationData),
    });

    const data = await res.json();

    if (data.success) {
      setShowPopup(true);
    } else {
      alert("Error saving donation");
    }
  };

  return (
    <div className="relative">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-orange-200">
        
        <h2 className="text-3xl font-bold text-[#f58a1f] mb-6 text-center">
          Make a Donation
        </h2>

        {/* ---------------- PERSONAL DETAILS ---------------- */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Title */}
          <div>
            <label className="text-orange-800 font-semibold">Title</label>
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-orange-50 border border-orange-300 rounded-lg"
            >
              <option>Mr</option>
              <option>Ms</option>
            </select>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-orange-800 font-semibold">Full Name *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              className="w-full p-3 bg-orange-50 border border-orange-300 rounded-lg"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-orange-800 font-semibold">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full p-3 bg-orange-50 border border-orange-300 rounded-lg"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-orange-800 font-semibold">Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit phone number"
              className="w-full p-3 bg-orange-50 border border-orange-300 rounded-lg"
            />
          </div>
        </div>

        {/* ---------------- AMOUNT SECTION ---------------- */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-orange-800 mb-2">Donation Amount</h3>

          <div className="flex flex-wrap gap-3 mb-3">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`px-5 py-2 rounded-lg border font-semibold transition ${
                  amount == amt
                    ? "bg-[#f58a1f] text-white"
                    : "bg-orange-100 text-orange-900 border-orange-300 hover:bg-orange-200"
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          <input
            type="number"
            placeholder="Enter custom amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border border-orange-300 rounded-lg bg-orange-50"
          />
        </div>

        {/* ---------------- CAUSE SECTION ---------------- */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-orange-800 mb-2">Choose a Cause</h3>

          <select
            className="w-full p-3 rounded-lg border border-orange-300 bg-orange-50"
            value={cause}
            onChange={(e) => setCause(e.target.value)}
          >
            <option value="">Select a cause</option>
            {causes.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* ---------------- PAYMENT METHODS ---------------- */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-orange-800 mb-2">Payment Method</h3>

          <div className="flex flex-col gap-2">
            {paymentMethods.map((pm) => (
              <label key={pm} className="flex items-center gap-3 p-3 rounded-lg border bg-orange-50">
                <input
                  type="radio"
                  name="payment"
                  value={pm}
                  onChange={(e) => setPayment(e.target.value)}
                />
                {pm}
              </label>
            ))}
          </div>
        </div>

        {/* ---------------- EMOTIONAL IMPACT ---------------- */}
        <div className="mb-8 bg-orange-50 border border-orange-200 p-4 rounded-xl">
          <h3 className="font-bold text-orange-700 text-lg mb-1">Your Impact</h3>
          <p className="text-orange-800">{impactMessage}</p>
        </div>

        {/* ---------------- RECURRING ---------------- */}
        <div className="mb-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={recurring}
            onChange={() => setRecurring(!recurring)}
          />
          <span className="text-orange-900 font-medium">
            Make this a monthly recurring donation 💛
          </span>
        </div>

        {/* ---------------- DONATE BUTTON ---------------- */}
        <button
          onClick={handleDonate}
          className="w-full bg-[#f58a1f] text-white py-3 rounded-xl font-semibold hover:bg-[#e27810] shadow text-lg"
        >
          Donate Now →
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          You can download your receipt later from Donation History.
        </p>
      </div>

      {/* ---------------- SUCCESS POPUP ---------------- */}
      {showPopup && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow-xl w-80 border border-orange-300 text-center">
            <h2 className="text-2xl font-bold text-[#f58a1f] mb-3">🎉 Thank You!</h2>
            <p className="text-gray-700 mb-2">
              Your donation of <b>₹{amount}</b> was received.
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Receipt available in Donation History.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-6 py-2 bg-[#f58a1f] text-white rounded-lg hover:bg-[#e27810]"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
