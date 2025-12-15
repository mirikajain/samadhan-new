import React, { useState } from "react";
import { useLocation } from "wouter";
import { Mic, Square } from "lucide-react";

export default function VoiceAssistant() {
  const [, navigate] = useLocation();
  const [listening, setListening] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toLowerCase();

  let recognition;
  if ("webkitSpeechRecognition" in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
  }

  // 🎯 Attendance action keywords (NO navigation)
  const attendanceActions = {
    markAllPresent: [
      "mark all present",
      "everyone present",
      "all students present",
    ],
    markAllAbsent: [
      "mark all absent",
      "everyone absent",
      "all students absent",
    ],
  };

  // 1️⃣ MULTIPLE KEYWORDS for each feature
  const roleBasedKeywordGroups = {
    report: ["report", "weekly report", "open report", "show report"],
    dashboard: ["dashboard", "home", "go home", "open dashboard"],
    attendance: ["attendance", "mark attendance", "view attendance"],
    assignment: ["assignment", "homework", "task"],
    material: ["material", "resources", "study material"],
    history: ["history", "donation history"],
    addStudent: ["add student", "new student"],
    addVolunteer: ["add volunteer", "new volunteer"],
    schedule: ["schedule", "time table"],
  };

  // 2️⃣ ROLE-BASED PAGES
  const roleBasedPages = {
    report: {
      volunteer: "/volunteer/report",
      admin: "/admin/report",
    },
    dashboard: {
      volunteer: "/volunteer/dashboard",
      admin: "/admin/dashboard",
      student: "/student/dashboard",
      donor: "/donor/dashboard",
    },
    attendance: {
      volunteer: "/volunteer/attendance",
    },
    assignment: {
      volunteer: "/volunteer/assignment",
      student: "/student/dashboard",
    },
    material: {
      volunteer: "/volunteer/material",
      student: "/student/material",
    },
    history: {
      donor: "/donor/donationHistory",
      admin: "/admin/donationHistory",
    },
    addStudent: {
      admin: "/admin/addStudent",
    },
    addVolunteer: {
      admin: "/admin/addVolunteer",
    },
    schedule: {
      admin: "/admin/schedule",
    },
  };

  // 3️⃣ FIXED COMMANDS
  const fixedCommands = [
    { keywords: ["login", "logout"], path: "/login" },
    { keywords: ["events", "show events"], path: "/events" },
  ];

  // 4️⃣ MATCHING LOGIC
  function findPathFromSpeech(text) {
    // 🟢 Attendance actions
    if (role === "volunteer") {
      for (const action in attendanceActions) {
        if (attendanceActions[action].some((p) => text.includes(p))) {
          window.dispatchEvent(
            new CustomEvent("attendance-action", { detail: action })
          );
          return "__ACTION__";
        }
      }
    }

    // 🔵 Role-based navigation
    for (const key in roleBasedKeywordGroups) {
      if (roleBasedKeywordGroups[key].some((p) => text.includes(p))) {
        const path = roleBasedPages[key]?.[role];
        if (path) return path;
      }
    }

    // 🔴 Fixed navigation
    for (let cmd of fixedCommands) {
      if (cmd.keywords.some((k) => text.includes(k))) {
        return cmd.path;
      }
    }

    return null;
  }

  // 5️⃣ LISTENING LOGIC (✅ FIXED)
  const startListening = () => {
    if (!recognition) return alert("Speech recognition not supported!");

    setListening(true);
    recognition.start();

    recognition.onresult = (e) => {
      const raw = e.results?.[0]?.[0]?.transcript;
      const text = typeof raw === "string" ? raw.toLowerCase() : "";

      console.log("Heard:", text);

      if (!text) return;

      const path = findPathFromSpeech(text);

      if (path === "__ACTION__") return;

      if (path) {
        navigate(path);
      } else {
        alert("Sorry, I didn't understand that command.");
      }
    };

    recognition.onend = () => setListening(false);
  };

  const stopListening = () => {
    if (recognition) recognition.stop();
    setListening(false);
  };

  // 6️⃣ UI
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!listening ? (
        <button
          onClick={startListening}
          className="p-4 rounded-full bg-blue-600 text-white shadow-lg hover:scale-105 transition"
        >
          <Mic />
        </button>
      ) : (
        <button
          onClick={stopListening}
          className="p-4 rounded-full bg-red-600 text-white shadow-lg hover:scale-105 transition"
        >
          <Square />
        </button>
      )}
    </div>
  );
}
