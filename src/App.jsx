import { BrowserRouter, Routes, Route } from "react-router-dom";

// Authentication
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Property Manager
import ManagerDashboard from "./Property Manager/ManagerDashboard";
import Property from "./Property Manager/Property";
import RentPage from "./Property Manager/RentPage";
import ExpensesPage from "./Property Manager/ExpensesPage";

// Roommate
import JoinProperty from "./Roommate/JoinProperty";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            Authentication
        ========================= */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

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

        {/* Rent */}
        <Route
          path="/rent"
          element={<RentPage />}
        />

        {/* Expenses */}
        <Route
          path="/manager/expenses"
          element={<ExpensesPage />}
        />

        {/* =========================
            Roommate
        ========================= */}
        <Route
          path="/join-property"
          element={<JoinProperty />}
        />

        {/* =========================
            Default
        ========================= */}
        <Route
          path="/"
          element={<Login />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;