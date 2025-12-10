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
import DonorDashboard from "./pages/donor/dashboard";
import StudentDashboard from "./pages/student/dashboard";
import StudentAssignment from "./pages/student/assignment";
import StudentMaterial from "./pages/student/material";
import Donate from "./pages/donor/donate.jsx";
import DonorHistory from "./pages/donor/donationHistory.jsx";

import VoiceAssistant from "./components/voiceAssistant";

export default function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
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
        <Route path="/donor/dashboard" component={DonorDashboard} />
        <Route path="/student/dashboard" component={StudentDashboard} />
        <Route path="/student/assignment/:level" component={StudentAssignment} />
        <Route path="/student/material/:level" component={StudentMaterial} />

        <Route path="/admin/dashboard" component={AdminDashboard} />

        <Route path="/admin/add-student" component={AddStudent} />

        <Route path="/admin/add-volunteer" component={AddVolunteer} />

        <Route path="/admin/view-report" component={ViewReport} />

        <Route path="/admin/donations" component={DonationHistory} />

        <Route path="/donor/donate" component={Donate} />
        <Route path="/donor/history" component={DonorHistory} />


        {/* DEFAULT / HOME */}
        <Route path="/">
          <div className="flex items-center justify-center h-screen bg-gray-50">
            <a href="/login" className="text-blue-600 text-lg underline">
              Go to Login
            </a>
          </div>
        </Route>

      </Switch>

      {/* Voice Assistant is outside the Switch but inside the fragment */}
      <VoiceAssistant />
    </>
  );
}

