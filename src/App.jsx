import { BrowserRouter, Routes, Route } from "react-router-dom";

// Authentication
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Property Manager
import ManagerDashboard from "./Property Manager/ManagerDashboard";
import Property from "./Property Manager/Property";
import Rooms from "./Property Manager/Rooms";
import Residents from "./Property Manager/Residents";
import Rent from "./Property Manager/Rent";
import Bills from "./Property Manager/Bills";
import Expenses from "./Property Manager/Expenses";
import Chores from "./Property Manager/Chores";
import Reports from "./Property Manager/Reports";

// Roommate
import JoinProperty from "./Roommate/JoinProperty";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            Authentication
        ========================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* =========================
            Property Manager
        ========================= */}

        {/* Dashboard */}
        <Route
          path="/manager-dashboard"
          element={<ManagerDashboard />}
        />

        {/* Property */}
        <Route
          path="/property"
          element={<Property />}
        />

        {/* Rooms */}
        <Route
          path="/rooms"
          element={<Rooms />}
        />

        {/* Residents */}
        <Route
          path="/residents"
          element={<Residents />}
        />

        {/* Rent */}
        <Route
          path="/rent"
          element={<Rent />}
        />

        {/* Bills */}
        <Route
          path="/bills"
          element={<Bills />}
        />

        {/* Expenses */}
        <Route
          path="/expenses"
          element={<Expenses />}
        />

        {/* Chores */}
        <Route
          path="/chores"
          element={<Chores />}
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={<Reports />}
        />

        {/* =========================
            Roommate
        ========================= */}
        <Route
          path="/join-property"
          element={<JoinProperty />}
        />

        {/* Default Route */}
        <Route
          path="/"
          element={<Login />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;