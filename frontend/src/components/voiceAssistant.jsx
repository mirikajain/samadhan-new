import React, { useState } from "react";
import { useLocation } from "wouter";
import { Mic, Square } from "lucide-react";

export default function VoiceAssistant() {
  const [, navigate] = useLocation();
  const [listening, setListening] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toLowerCase(); // "admin", "volunteer", "student", etc.

  let recognition;
  if ("webkitSpeechRecognition" in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
  }

  // 1️⃣ MULTIPLE KEYWORDS for each feature
  const roleBasedKeywordGroups = {
    report: ["report", "weekly report", "open report", "show report", "reports"],
    dashboard: ["dashboard", "home", "main page", "go home", "open dashboard"],
    attendance: ["attendance", "mark attendance", "view attendance"],
    assignment: ["assignment", "homework", "task", "open assignment"],
    material: ["material", "resources", "study material", "open material"],
    history: ["history", "donation history", "view history"],
    addStudent: ["add student", "new student", "register student"],
    addVolunteer: ["add volunteer", "new volunteer", "register volunteer"]
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
      volunteer: "/volunteer/attendance"
    },
    assignment: {
      volunteer: "/volunteer/assignment",
      student: "/student/dashboard"
    },
    material: {
      volunteer: "/volunteer/material",
      student: "/student/material"
    },
    history: {
      donor: "/donor/donationHistory",
      admin: "/admin/donationHistory"
    },
    addStudent: {
      admin: "/admin/addStudent"
    },
    addVolunteer: {
      admin: "/admin/addVolunteer"
    }
  };

  // 3️⃣ FIXED NON-ROLE COMMANDS
  const fixedCommands = [
    { keywords: ["login", "logout"], path: "/login" },
    { keywords: ["events", "show events"], path: "/events" }
  ];

  // 4️⃣ INTELLIGENT MATCHING LOGIC
  function findPathFromSpeech(text) {
    text = text.toLowerCase();

    // Check multi-keyword role-based commands
    for (const key in roleBasedKeywordGroups) {
      const triggers = roleBasedKeywordGroups[key];

      if (triggers.some((phrase) => text.includes(phrase))) {
        const path = roleBasedPages[key]?.[role];
        if (path) return path;
      }
    }

    // Check fixed commands
    for (let cmd of fixedCommands) {
      if (cmd.keywords.some((k) => text.includes(k))) {
        return cmd.path;
      }
    }

    return null;
  }

  // 5️⃣ LISTENING LOGIC
  const startListening = () => {
    if (!recognition) return alert("Speech recognition not supported!");

    setListening(true);
    recognition.start();

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      console.log("Heard:", text);

      const path = findPathFromSpeech(text);

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

  // 6️⃣ UI — Mic Button
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
