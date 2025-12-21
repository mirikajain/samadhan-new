import { Route, Switch } from "wouter";

import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";

import VolunteerDashboard from "./pages/volunteer/dashboard";
import Attendance from "./pages/volunteer/attendance";
import Assignment from "./pages/volunteer/assignment";
import Material from "./pages/volunteer/material";
import Report from "./pages/volunteer/report";

import AdminDashboard from "./pages/admin/dashboard";
import AddStudent from "./pages/admin/addStudent.jsx";
import AddVolunteer from "./pages/admin/addVolunteer.jsx";
import ViewReport from "./pages/admin/viewReport.jsx";
import DonationHistory from "./pages/admin/donationHistory.jsx";
import Schedule from "./pages/admin/schedule.jsx";

import DonorDashboard from "./pages/donor/dashboard";
import StudentDashboard from "./pages/student/dashboard";
import StudentAssignment from "./pages/student/assignment";
import StudentMaterial from "./pages/student/material";

import VoiceAssistant from "./components/voiceAssistant";

import homehero from "./assets/home-hero.jpg"
import person1 from "./assets/person1.jpg"
import person2 from "./assets/person2.jpg"
import person3 from "./assets/person3.jpg"
import DownloadAppButton from "./components/downloadButton.jsx";
import Donate from "./pages/donor/donate.jsx";
import History from "./pages/donor/donationHistory.jsx";





export default function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  

  return (
    <>

      {/* -------------------- ANIMATION STYLES -------------------- */}
      <style>
        {`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out both;
          }
        `}
      </style>
      

      <Switch>

        {/* AUTH ROUTES */}
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />

        {/* VOLUNTEER ROUTES */}
        <Route path="/volunteer/dashboard" component={VolunteerDashboard} />
        <Route path="/volunteer/attendance">
          <Attendance user={user} />
        </Route>
        <Route path="/volunteer/assignment">
          <Assignment user={user} />
        </Route>
        <Route path="/volunteer/material">
          <Material user={user} />
        </Route>
        <Route path="/volunteer/report">
          <Report user={user} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/add-student" component={AddStudent} />
        <Route path="/admin/add-volunteer" component={AddVolunteer} />
        <Route path="/admin/view-report" component={ViewReport} />
        <Route path="/admin/donations" component={DonationHistory} />
        <Route path="/admin/schedule" component={Schedule} />


        {/* DONOR ROUTES */}
        <Route path="/donor/dashboard" component={DonorDashboard} />
        <Route path="/donor/donate" component={Donate}/>
        <Route path="/donor/history" component={History}/>

        {/* STUDENT ROUTES */}
        <Route path="/student/dashboard" component={StudentDashboard} />
        <Route path="/student/assignment/:level" component={StudentAssignment} />
        <Route path="/student/material/:level" component={StudentMaterial} />


        {/* ====================== HOME PAGE ====================== */}
        <Route path="/">
          <div className="w-full min-h-screen bg-white text-gray-800" id="home">

            {/* NAVBAR */}
            <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
              <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 md:px-10">

                <a href="#home" className="text-2xl font-bold text-gray-900">
                  Prerna <br/><DownloadAppButton/>
                </a>

                <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
                  <a href="#home" className="hover:text-black">Home</a>
                  <a href="#vision" className="hover:text-black">Vision</a>
                  <a href="#about" className="hover:text-black">About</a>
                  <a href="#services" className="hover:text-black">Services</a>
                </nav>
                

                {/* LESS-COLORFUL BUTTONS */}
                <div className="hidden md:flex items-center gap-4">
                  <a
                    href="/login"
                    className="px-6 py-2 rounded-full bg-gray-200 text-gray-800 font-medium shadow-sm hover:bg-gray-300 transition"
                  >
                    Login
                  </a>

                  <a
                    href="/signup"
                    className="px-6 py-2 rounded-full bg-gray-900 text-white font-medium shadow-sm hover:bg-black transition"
                  >
                    Signup
                  </a>
                </div>

                <button
                  className="md:hidden flex flex-col gap-1.5"
                  onClick={() => document.getElementById("mobile-menu").classList.toggle("hidden")}
                >
                  <span className="w-6 h-0.5 bg-black"></span>
                  <span className="w-6 h-0.5 bg-black"></span>
                  <span className="w-6 h-0.5 bg-black"></span>
                </button>
              </div>

              {/* MOBILE MENU */}
              <div id="mobile-menu" className="hidden md:hidden bg-white shadow-md px-6 py-4">
                <nav className="flex flex-col gap-4 text-gray-700 text-lg">
                  <a href="#home" className="hover:text-black">Home</a>
                  <a href="#vision" className="hover:text-black">Vision</a>
                  <a href="#about" className="hover:text-black">About</a>
                  <a href="#services" className="hover:text-black">Services</a>

                  <a
                    href="/login"
                    className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 text-center font-medium"
                  >
                    Login
                  </a>

                  <a
                    href="/signup"
                    className="px-4 py-2 rounded-full bg-gray-900 text-white text-center font-medium"
                  >
                    Signup
                  </a>
                </nav>
              </div>
            </header>

            {/* PAGE OFFSET */}
            <div className="pt-24"></div>


            {/* HERO SECTION */}
            <section
              id="home"
              className="relative overflow-hidden px-8 md:px-20 py-28 bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100"
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-0 w-72 h-72 bg-yellow-300 opacity-40 blur-3xl rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 opacity-30 blur-3xl rounded-full"></div>
              </div>

              <div className="relative flex flex-col lg:flex-row items-center justify-between">
                <div className="max-w-xl animate-fade-in-up">
                  <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
                    Empowering NGOs Through <br /> Digital Collaboration
                  </h1>

                  <p className="mt-6 text-gray-700 text-lg">
                    Prerna simplifies NGO operations, enhances transparency, and strengthens community impact.
                  </p>

                  <a href="/signup">
                    <button className="mt-8 px-8 py-3 rounded-full bg-black text-white text-lg hover:bg-gray-900">
                      Join Now
                    </button>
                  </a>
                </div>

                {/* HERO IMAGE — NOW WITH GOLDEN GLOW HOVER EFFECT */}
                <img
                  src={homehero}
                  className="w-[450px] rounded-full shadow-2xl mt-10 lg:mt-0 border-8 border-white
                             transition duration-300 hover:shadow-[0_0_35px_10px_rgba(255,215,0,0.6)] hover:border-yellow-400"
                />
              </div>
            </section>


            {/* VISION */}
            <section id="vision" className="py-20 px-8 md:px-20 bg-gradient-to-br from-orange-50 to-yellow-50 text-center">
              <h2 className="text-3xl font-bold mb-12 animate-fade-in-up">Our Vision & Mission</h2>

              <div className="max-w-3xl mx-auto mb-16 animate-fade-in-up">
                <h3 className="text-2xl font-semibold mb-4">OUR VISION</h3>
                <p className="text-gray-700 text-lg italic">
                  “A future where every child has a dignified childhood and equal opportunity to Live, Learn and Grow.”
                </p>
              </div>

              <div className="max-w-3xl mx-auto animate-fade-in-up">
                <h3 className="text-2xl font-semibold mb-4">OUR MISSION</h3>
                <p className="text-gray-700 text-lg italic">
                  “To develop a sustainable ecosystem for the underprivileged community in India by Enabling,
                  Educating, and Empowering its children.”
                </p>
              </div>
            </section>


            {/* IMPACT */}
            <section className="py-16 px-8 md:px-20 text-center bg-gradient-to-br from-yellow-100 to-orange-100">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 animate-fade-in-up">Our Impact</h2>

              <p className="text-lg text-gray-800 mb-10 font-medium animate-fade-in-up">
                Proudly collaborating with <strong>UPAY NGO</strong> to impact more than <strong>1.2k lives</strong>.
              </p>

              <div className="flex justify-center gap-20 text-gray-700 font-semibold text-xl animate-fade-in-up">
                <div>
                  <span className="text-4xl font-bold text-black">1.2k</span><br />
                  Lives Impacted
                </div>
                <div>
                  <span className="text-4xl font-bold text-black">1</span><br />
                  NGO Partner
                </div>
              </div>
            </section>


            {/* ABOUT + PROBLEM + SOLUTION */}
            <section
              id="about"
              className="py-28 px-8 md:px-28 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50"
            >
              <h2 className="text-4xl font-bold mb-10 text-center animate-fade-in-up">About Prerna</h2>

              <p className="text-lg leading-relaxed text-gray-700 max-w-4xl mx-auto text-center mb-10 animate-fade-in-up">
                Prerna is a digital platform designed to support NGOs, volunteers, students, and donors.  
                We simplify daily tasks, enhance transparency, and empower organizations to focus on what matters —
                creating meaningful change in communities.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto mt-12">

                {/* PROBLEM — WITH ANIMATION */}
                <div className="p-8 bg-white rounded-2xl shadow-lg border-t-4 border-red-400
                                transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-xl animate-fade-in-up">
                  <h3 className="text-xl font-semibold mb-4 text-red-600">The Problem</h3>
                  <p className="text-gray-700 leading-relaxed">
                    NGOs face scattered data, manual work, lack of structure,
                    limited transparency, and difficulty coordinating volunteers and student activities.
                  </p>
                </div>

                {/* SOLUTION — WITH ANIMATION */}
                <div className="p-8 bg-white rounded-2xl shadow-lg border-t-4 border-green-400
                                transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-xl animate-fade-in-up">
                  <h3 className="text-xl font-semibold mb-4 text-green-600">Our Solution</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Prerna provides automated attendance, digital materials,
                    centralized reports, progress dashboards, and real-time impact tracking —
                    all in one unified platform.
                  </p>
                </div>

              </div>
            </section>


            {/* SERVICES PROVIDED */}
            <section
              id="services"
              className="py-24 px-8 md:px-20 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100"
            >
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-14 animate-fade-in-up">
                Services We Provide
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-purple-400 hover:scale-105 transition duration-300">
                  <div className="text-5xl mb-4">🤝</div>
                  <h3 className="text-xl font-semibold mb-3">Volunteer Support</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Automated attendance, assignments, and activity tracking reduce manual work.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-400 hover:scale-105 transition duration-300">
                  <div className="text-5xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold mb-3">Admin Dashboard</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Reports, analytics, student data, volunteer logs, and insights — all in one place.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-400 hover:scale-105 transition duration-300">
                  <div className="text-5xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold mb-3">Student E-Learning</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Access to study materials, assignments, and individual progress tracking.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-yellow-500 hover:scale-105 transition duration-300">
                  <div className="text-5xl mb-4">💛</div>
                  <h3 className="text-xl font-semibold mb-3">Donor Transparency</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Donors can track real-time impact and understand how contributions help.
                  </p>
                </div>

              </div>
            </section>


            {/* TESTIMONIALS — NOW ANIMATED */}
            <section className="py-24 px-8 md:px-20 bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100">
              <h2 className="text-4xl font-bold text-center mb-14 animate-fade-in-up">What People Say</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* Volunteer */}
                <div className="bg-white p-8 shadow-lg rounded-2xl text-center 
                                transition duration-500 hover:scale-[1.03] hover:shadow-xl animate-fade-in-up">
                  <img
                    src={person1}
                    alt="Riya Sharma"
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <p className="text-gray-700 italic mb-4">
                    “Prerna made volunteer management so easy. Attendance and reports take seconds now.”
                  </p>
                  <h4 className="font-semibold">— Riya Sharma, Volunteer</h4>
                </div>

                {/* Admin */}
                <div className="bg-white p-8 shadow-lg rounded-2xl text-center
                                transition duration-500 hover:scale-[1.03] hover:shadow-xl animate-fade-in-up">
                  <img
                    src={person3}
                    alt="Anju Pandey"
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <p className="text-gray-700 italic mb-4">
                    “Our NGO's reporting accuracy improved dramatically. Everything is in one place.”
                  </p>
                  <h4 className="font-semibold">— Anju Pandey, Admin</h4>
                </div>

                {/* Teacher */}
                <div className="bg-white p-8 shadow-lg rounded-2xl text-center
                                transition duration-500 hover:scale-[1.03] hover:shadow-xl animate-fade-in-up">
                  <img
                    src={person2}
                    alt="Aman Verma"
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <p className="text-gray-700 italic mb-4">
                    “Students love the digital access to materials. Their engagement has increased so much.”
                  </p>
                  <h4 className="font-semibold">— Aman Verma, Teacher</h4>
                </div>

              </div>
            </section>


            {/* CTA SECTION */}
            <section className="py-28 text-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
              <h2 className="text-4xl font-bold mb-6 animate-fade-in-up">Ready to Make an Impact?</h2>
              <p className="text-lg text-gray-700 mb-8 animate-fade-in-up">
                Join Prerna today and help transform communities with the power of technology.
              </p>

              <a href="/signup">
                <button className="px-10 py-4 bg-black text-white text-lg rounded-full shadow-lg hover:scale-105 transition">
                  Get Started
                </button>
              </a>
            </section>


            {/* FOOTER */}
            <footer className="bg-gray-900 text-gray-300 py-10 px-8 md:px-20">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Prerna</h3>
                  <p className="text-gray-400">
                    Empowering NGOs with digital tools to scale their impact and transform communities.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-white mb-3">Contact</h4>
                  <p className="text-gray-400">📞 +91 9876543210</p>
                  <p className="text-gray-400">📧 contact@prerna.org</p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-white mb-3">Quick Links</h4>
                  <a href="#home" className="block text-gray-400 hover:text-white">Home</a>
                  <a href="#vision" className="block text-gray-400 hover:text-white">Vision</a>
                  <a href="#about" className="block text-gray-400 hover:text-white">About</a>
                  <a href="#services" className="block text-gray-400 hover:text-white">Services</a>
                </div>

              </div>

              <div className="text-center text-gray-500 mt-10 text-sm">
                © {new Date().getFullYear()} Prerna — Empowering NGOs for a better tomorrow.
              </div>
            </footer>

          </div>
        </Route>
      </Switch>

      <VoiceAssistant />
    </>
  );
}
