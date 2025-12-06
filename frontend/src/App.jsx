import { Route, Switch } from "wouter";

import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";

import VolunteerDashboard from "./pages/volunteer/dashboard";
import Attendance from "./pages/volunteer/attendance";
import Assignment from "./pages/volunteer/assignment";
import Material from "./pages/volunteer/material";
import Report from "./pages/volunteer/report";

import AdminDashboard from "./pages/admin/dashboard";
import DonorDashboard from "./pages/donor/dashboard";

export default function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <Switch>

      {/* AUTH ROUTES */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />

      {/* VOLUNTEER ROUTES */}
      <Route path="/volunteer/dashboard" component={VolunteerDashboard} />
      <Route path="/volunteer/attendance">
        <Attendance user={user} />   {/* ★ now works */}
      </Route>
      <Route path="/volunteer/assignment" >
        <Assignment user={user}/>
      </Route>
      <Route path="/volunteer/material" >
        <Material user={user} />
      </Route>
      <Route path="/volunteer/report" >
        <Report user={user}/>
      </Route>

      {/* ADMIN ROUTES */}
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/donor/dashboard" component={DonorDashboard} />

      {/* DEFAULT / HOME */}
      <Route path="/">
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <a href="/login" className="text-blue-600 text-lg underline">
            Go to Login
          </a>
        </div>
      </Route>

    </Switch>
  );
}
