import { Route, Switch } from "wouter";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import VolunteerDashboard from "./pages/volunteer/dashboard";


export default function App() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/volunteer/dashboard" component={VolunteerDashboard} />
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
