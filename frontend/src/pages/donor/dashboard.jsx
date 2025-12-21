import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import ProfileCard from "../../components/profileCard.jsx";

import {
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";

import heroImage from "../../assets/donation-hero.jpg";
import BackButton from "../../components/backButton.jsx";

export default function DonorDashboard() {
  const [, navigate] = useLocation();

  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Donor User",
    centreId: "N/A",
  };

  const [openProfile, setOpenProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [donations, setDonations] = useState([]);
  const [impact, setImpact] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------------- CLOSE PROFILE DROPDOWN ---------------- */
  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* ---------------- FETCH DONATIONS ---------------- */
  useEffect(() => {
    fetch("https://samadhan-new-2.onrender.com/api/donor/get-donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ donorName: user.username }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDonations(data.donations);
          setImpact(data.donations.length * 3);
        }
      });
  }, []);

  /* ---------------- SEARCH ---------------- */
  const removeHighlights = () => {
    document.querySelectorAll("mark.search-highlight").forEach((m) => {
      const p = m.parentNode;
      p.replaceChild(document.createTextNode(m.textContent), m);
      p.normalize();
    });
  };

  const highlightText = (term) => {
    if (!term) return;

    const walker = document.createTreeWalker(
      document.querySelector("main"),
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let firstMatch = null;

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.nodeValue;
      const idx = text.toLowerCase().indexOf(term.toLowerCase());

      if (idx !== -1) {
        const mark = document.createElement("mark");
        mark.className = "search-highlight bg-yellow-300 px-1 rounded";

        const before = document.createTextNode(text.slice(0, idx));
        const match = document.createTextNode(text.slice(idx, idx + term.length));
        const after = document.createTextNode(text.slice(idx + term.length));

        mark.appendChild(match);

        const parent = node.parentNode;
        parent.replaceChild(after, node);
        parent.insertBefore(mark, after);
        parent.insertBefore(before, mark);

        if (!firstMatch) firstMatch = mark;
      }
    }

    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSearch = () => {
    removeHighlights();
    if (!searchTerm.trim()) return alert("Enter something to search");
    highlightText(searchTerm);
  };

  /* ---------------- CHART DATA ---------------- */
  const CAUSE_COLORS = {
    "Education Support": "#4B7BE5",
    "Feeding Program": "#2ECC71",
    "Girls Empowerment": "#E74C3C",
    "Health & Hygiene": "#9B59B6",
    "Community Development": "#F1C40F",
  };

 // 1️⃣ Collect all months first


  // ---------------- MONTH-WISE TOTAL DONATION ----------------
const donationByMonth = {};

donations.forEach((d) => {
  if (!d.date || !d.amount) return;

  const month = new Date(d.date).toLocaleString("default", {
    month: "short",
    year:"numeric"
  });

  if (!donationByMonth[month]) {
    donationByMonth[month] = {
      month,
      amount: 0,
    };
  }

  donationByMonth[month].amount += d.amount;
});

// Final data for line chart
const monthwiseDonationData = Object.values(donationByMonth);



  const totalsByCause = {};
  donations.forEach((d) => {
    totalsByCause[d.cause] = (totalsByCause[d.cause] || 0) + d.amount;
  });

  const pieData = Object.keys(totalsByCause).map((cause) => ({
    name: cause,
    value: totalsByCause[cause],
    color: CAUSE_COLORS[cause],
  }));

  return (
    <div className="flex min-h-screen bg-[#fff7ef]">
      {/* ---------------- SIDEBAR ---------------- */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-screen md:h-auto
          w-56
          bg-[#d55b1f] text-white p-6 flex flex-col
          rounded-r-3xl
          transform transition-transform duration-300
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Close button (mobile only) */}
        <button
          className="md:hidden text-xl mb-4 self-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          ✕
        </button>

        <BackButton />
        <h1 className="text-2xl font-semibold mb-8">Prerna</h1>

        <nav className="space-y-4">
          <button onClick={() => navigate("/donor/dashboard")}>📊 Dashboard</button><br/>
          <button onClick={() => navigate("/donor/donate")}>💝 Donate</button><br/>
          <button onClick={() => navigate("/donor/history")}>📜 History</button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="mt-8 bg-white text-[#d55b1f] py-2 px-4 rounded-xl shadow"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ---------------- OVERLAY (mobile) ---------------- */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ---------------- CONTENT ---------------- */}
      <main className="flex-1 p-6 md:p-10 md:ml-27">
        {/* ---------------- TOP BAR ---------------- */}
        <div className="flex justify-between items-center mb-10">
          {/* Hamburger */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMobileMenuOpen(true)}
          >
            ☰
          </button>

          {/* Search */}
          <div className="w-80 relative">
            <input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-4 py-2 rounded-xl border shadow-sm"
            />
          </div>

          {/* Profile */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center text-xl font-bold text-orange-700 shadow"
            >
              {user.username[0]}
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-4 w-72 bg-white rounded-xl shadow-xl border p-4">
                <ProfileCard user={user} />
              </div>
            )}
          </div>
        </div>

        {/* ---------------- HERO ---------------- */}
        <div className="bg-white rounded-3xl p-8 shadow flex items-center gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-[#d55b1f]">
              Welcome Back, {user.username}!
            </h1>
            <p className="text-gray-600 mt-3">
              Your kindness is creating real impact every day ❤️
            </p>

            <button
              onClick={() => navigate("/donor/donate")}
              className="mt-5 px-7 py-3 bg-[#d55b1f] text-white rounded-xl shadow"
            >
              ❤️ Donate Again
            </button>
          </div>

          <img src={heroImage} className="w-72 rounded-xl shadow-xl" />
        </div>

        {/* ---------------- STATS ---------------- */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <Stat title="Total Donated" value={`₹${donations.reduce((s, d) => s + d.amount, 0)}`} />
          <Stat title="Total Donations" value={donations.length} />
          <Stat title="Students Impacted" value={impact} />
        </div>

        {/* ---------------- CHARTS ---------------- */}
        <div className="grid md:grid-cols-2 gap-10 mt-12">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">
              Donation Distribution by Cause
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={120}>
                  {pieData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
  <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
    Month-wise Total Donation
  </h3>

  {monthwiseDonationData.length === 0 ? (
    <p className="text-center text-gray-500 mt-20">
      No donation data available
    </p>
  ) : (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={monthwiseDonationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(v) => `₹${v}`} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#d55b1f"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )}
</div>

        </div>
      </main>
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */
function Stat({ title, value }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow text-center">
      <p className="text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-[#d55b1f] mt-2">{value}</p>
    </div>
  );
}
