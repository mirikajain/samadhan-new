import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ProfileCard from "../../components/profileCard.jsx";
import BackButton from "../../components/backButton.jsx";

export default function StudentDashboard() {
  const [, navigate] = useLocation();
  const [openProfile, setOpenProfile] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {
    id: "stu001",
    username: "Student User",
    role: "student",
    centreId: "CEN-001",
    levels: [2],
  };

  // --- SEARCH STATE ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- HIGHLIGHT FUNCTIONS ---
  const removeHighlights = () => {
    const marks = document.querySelectorAll("mark.search-highlight");
    marks.forEach((mark) => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  };

  const highlightText = (term) => {
    if (!term.trim()) return;
    const walker = document.createTreeWalker(
      document.querySelector("main"),
      NodeFilter.SHOW_TEXT
    );

    let firstMatch = null;

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.nodeValue;
      const index = text.toLowerCase().indexOf(term.toLowerCase());

      if (index !== -1) {
        const before = text.slice(0, index);
        const match = text.slice(index, index + term.length);
        const after = text.slice(index + term.length);

        const mark = document.createElement("mark");
        mark.className =
          "search-highlight bg-yellow-300 text-black px-1 rounded";
        mark.appendChild(document.createTextNode(match));

        const beforeNode = document.createTextNode(before);
        const afterNode = document.createTextNode(after);

        const parent = node.parentNode;
        parent.replaceChild(afterNode, node);
        parent.insertBefore(mark, afterNode);
        parent.insertBefore(beforeNode, mark);

        if (!firstMatch) firstMatch = mark;
      }
    }

    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSearch = () => {
    removeHighlights();
    if (!searchTerm.trim()) {
      alert("Please enter text to search.");
      return;
    }
    highlightText(searchTerm);
  };

  // --- STATES ---
  const [attendance, setAttendance] = useState({});
  const [overall, setOverall] = useState({ present: 0, total: 0 });
  const [performanceStatus, setPerformanceStatus] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState([]);



  // WEEKLY SCHEDULE
  async function loadWeeklySchedule() {
  try {
    const res = await fetch(
      `https://samadhan-new-2.onrender.com/api/student/schedule/${user.levels?.[0]}`
    );
    const data = await res.json();

    if (data.success) {
      setWeeklySchedule(data.schedules);
    }
  } catch (err) {
    console.error("Weekly Schedule Error:", err);
  }
}


  // NOTIFICATIONS


  // PERFORMANCE
  const [, setWeeklyReport] = useState(null);

  // LOAD ATTENDANCE + WEEKLY REPORT
  useEffect(() => {
    loadAttendance();
    loadWeeklyReport();
    loadNotifications();
    loadWeeklySchedule(); 
  });

  async function loadAttendance() {
    try {
      const res = await fetch(
        `https://samadhan-new-2.onrender.com/api/student/attendance/${user.id}`
      );
      const data = await res.json();
      if (data.success) {
        setAttendance(data.attendance);
        calculateOverall(data.attendance);
      }
    } catch (err) {
      console.error("Attendance Error:", err);
    }
  }

  async function loadWeeklyReport() {
    try {
      const res = await fetch(
        `https://samadhan-new-2.onrender.com/api/student/weekly-report/${user.id}`
      );
      const data = await res.json();

      if (data.success && data.report) {
        setWeeklyReport(data.report);

        if (data.report.topperStudent?.studentId === user.id) {
          setPerformanceStatus("topper");
        } else if (
          data.report.weakStudents?.some((ws) => ws.studentId === user.id)
        ) {
          setPerformanceStatus("weak");
        }
      }
    } catch (err) {
      console.error("Weekly Report Error:", err);
    }
  }

  async function loadNotifications() {
  try {
    const res = await fetch(
      `https://samadhan-new-2.onrender.com/api/student/notifications/${user.id}`
    );
    const data = await res.json();
    console.log("NOTIFICATIONS API RESPONSE:", data.notifications);

    if (data.success) {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const recent = data.notifications.filter(
        (n) =>
          new Date(n.createdAt) >= twoDaysAgo &&
          n.level === user.levels?.[0]
      );

      setNotifications(recent);
    }
  } catch (err) {
    console.error("Notification Error:", err);}
  }


  const calculateOverall = (attendanceData) => {
    let present = 0;
    let total = 0;

    Object.values(attendanceData).forEach((subjectEntries) => {
      subjectEntries.forEach((entry) => {
        total++;
        if (entry.status === "Present") present++;
      });
    });

    setOverall({ present, total });
  };



  const attendancePercent =
    overall.total > 0 ? Math.round((overall.present / overall.total) * 100) : 0;
  

  return (
    <div className="flex min-h-screen bg-[#ffe9e9]">
      {/* ---------------- LEFT SIDEBAR ---------------- */}
      <aside className="w-64 bg-[#b83250] p-6 text-white flex flex-col rounded-r-3xl">
        <BackButton/>
        <h1 className="text-2xl font-semibold mb-10">Prerna</h1>

        <nav className="space-y-5 text-md">
          <button className="flex items-center gap-3 bg-[#c84563] rounded-xl p-3">
            🎓 Dashboard
          </button>

          <button
            onClick={() => navigate(`/student/assignment/${user.levels?.[0]}`)}
            className="flex items-center gap-3 hover:bg-[#c84563] rounded-xl p-3"
          >
            📘 Assignments
          </button>

          <button
            onClick={() => navigate(`/student/material/${user.levels?.[0]}`)}
            className="flex items-center gap-3 hover:bg-[#c84563] rounded-xl p-3"
          >
            📚 Study Materials
          </button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="flex items-center gap-3 mt-10 bg-white text-[#b83250] py-2 px-4 rounded-xl shadow"
          >
            🚪 Log Out
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 p-10">

        {/* ---------------- TOP BAR ---------------- */}
        <div className="flex justify-between items-center mb-10">
          <div className="w-96 relative">
            <input
              placeholder="Search…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-4 py-2 rounded-xl border shadow-sm"
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer"
              onClick={handleSearch}
            >
              🔍
            </span>
          </div>

          {/* Profile Hover */}
          <div className="relative group">
            <button>
              <div className="w-12 h-12 rounded-full bg-pink-300 flex items-center justify-center text-xl font-bold text-pink-800 shadow">
                {user.username[0]}
              </div>
            </button>

            <div className="absolute right-0 top-14 opacity-0 group-hover:opacity-100 transition bg-white shadow-xl rounded-xl p-4 w-48 z-50">
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-gray-500 mb-3">
                Class: {user.levels?.[0]}
              </p>
              <button
                onClick={() => setOpenProfile(true)}
                className="w-full py-2 bg-pink-600 text-white rounded-lg"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* HELLO BANNER */}
        <div className="bg-white rounded-3xl p-8 shadow flex items-center gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold">Welcome Back, {user.username}!</h2>
            <p className="text-gray-600 mt-1">
              You're studying in <b>Class {user.levels?.[0]}</b> at{" "}
              <b>Scottish Centre 57, Gurugram</b>
            </p>
          </div>

          <img
            src="https://cdn-icons-png.flaticon.com/512/2995/2995620.png"
            alt="student hero"
            className="w-40"
          />
        </div>

        {/* ---------------- GRID SECTION ---------------- */}
        <div className="mt-10 grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* ATTENDANCE CIRCLE */}
          <div className="bg-white rounded-3xl p-6 shadow flex flex-col items-center">
            <h3 className="font-bold mb-4">Your Attendance (Overall %)</h3>

            <div className="relative w-full h-64 flex items-center justify-center">
              <div className="absolute text-4xl font-bold text-pink-700">
                {attendancePercent}%
              </div>

              <div className="w-48 h-48 rounded-full border-[14px] border-pink-200 relative">
                <div
                  className="absolute top-0 left-0 w-full h-full rounded-full border-[14px] border-pink-500"
                  style={{
                    clipPath: `inset(${100 - attendancePercent}% 0 0 0)`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* WEEKLY SCHEDULE */}
          {/* WEEKLY SCHEDULE */}
<div className="bg-white rounded-3xl p-6 shadow">
  <h3 className="font-bold mb-4">Weekly Class Schedule</h3>

  {weeklySchedule.length === 0 ? (
    <p className="text-gray-500 text-sm">
      No schedule published yet.
    </p>
  ) : (
    <ul className="space-y-3">
      {weeklySchedule.map((event) => (
        <li
          key={event._id}
          className="p-4 rounded-xl bg-red-50 hover:bg-red-100 transition shadow-sm"
        >
          <p className="font-medium">{event.subject}</p>
          <p className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}{" "}
            • {event.time}
          </p>
          <p className="text-xs text-gray-400">
            Class {event.level}
          </p>
        </li>
      ))}
    </ul>
  )}
</div>


          {/* NOTIFICATIONS */}
          <div className="bg-white rounded-3xl p-6 shadow">
            <h3 className="font-bold mb-4">Notifications</h3>
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No new notifications in the last 2 days.
                </p>
  ) : (
    <ul className="space-y-3">
  {notifications.map((note) => (
    <li
      key={note._id}
      className={`p-3 rounded border-l-4 ${
        note.type === "assignment"
          ? "bg-blue-50 border-blue-400"
          : "bg-yellow-50 border-yellow-400"
      }`}
    >
      <p className="font-medium">{note.title}</p>
      <p className="text-xs text-gray-600">
        {note.subject}
      </p>
    </li>
  ))}
</ul>

  )}

          </div>
        </div>
        

        {/* ---------------- SUBJECT-WISE ATTENDANCE ---------------- */}
        <div className="bg-white rounded-3xl p-6 shadow mt-10">
          <h3 className="font-bold mb-4">Subject-wise Attendance</h3>

          {Object.keys(attendance).length === 0 ? (
            <p className="text-gray-600">No attendance records found.</p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-red-100 text-red-700">
                <tr>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Present</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">%</th>
                  <th className="p-3">Review</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(attendance).map(([subject, entries]) => {
                  const present = entries.filter(
                    (e) => e.status === "Present"
                  ).length;
                  const total = entries.length;
                  const percent = Math.round((present / total) * 100);

                  let reviewClass = "";
                  if (percent >= 80)
                    reviewClass = "bg-green-200 text-green-800";
                  else if (percent >= 60)
                    reviewClass = "bg-yellow-200 text-yellow-800";
                  else reviewClass = "bg-red-200 text-red-800";

                  return (
                    <tr key={subject} className="border-b">
                      <td className="p-3">{subject}</td>
                      <td className="p-3">{present}</td>
                      <td className="p-3">{total}</td>
                      <td className="p-3">{percent}%</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${reviewClass}`}
                        >
                          {percent >= 80
                            ? "Good"
                            : percent >= 60
                            ? "Average"
                            : "Poor"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ---------------- PERFORMANCE MESSAGE ---------------- */}
        <div className="mt-10">
          {performanceStatus === "topper" && (
            <div className="bg-green-100 p-6 rounded-3xl shadow border border-green-300">
              <h3 className="text-xl font-bold text-green-700">
                🏆 Great Performance!
              </h3>
              <p className="text-green-700 mt-2">
                You are the <strong>Top Performer of the Week!</strong> Keep shining!
              </p>
            </div>
          )}

          {performanceStatus === "weak" && (
            <div className="bg-yellow-100 p-6 rounded-3xl shadow border border-yellow-300">
              <h3 className="text-xl font-bold text-yellow-700">
                ⚠ Improvement Needed
              </h3>
              <p className="text-yellow-700 mt-2">
                Stay consistent — you can improve with focus and effort!
              </p>
            </div>
          )}

          {!performanceStatus && (
            <div className="bg-red-100 p-6 rounded-3xl shadow border border-red-300">
              <h3 className="text-xl font-bold text-red-700">🌟 Keep Going!</h3>
              <p className="text-red-700 mt-2">
                You're doing well — stay regular with your studies!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ---------------- PROFILE PANEL ---------------- */}
      {openProfile && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl p-6 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-pink-700">My Profile</h3>
            <button onClick={() => setOpenProfile(false)}>✕</button>
          </div>

          <ProfileCard user={user} />

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
