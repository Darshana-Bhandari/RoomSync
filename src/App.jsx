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
import BillPage from "./Property Manager/BillPage";
import ReportPage from "./Property Manager/ReportPage";
import Rooms from "./Property Manager/Rooms";

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

        <Route
          path="/manager-dashboard"
          element={<ManagerDashboard />}
        />

        <Route
          path="/property"
          element={<Property />}
        />

        <Route
          path="/rent"
          element={<RentPage />}
        />

        <Route
          path="/manager/expenses"
          element={<ExpensesPage />}
        />

        <Route
          path="/manager/bills"
          element={<BillPage />}
        />

        <Route
          path="/manager/reports"
          element={<ReportPage />}
        />

        {/* Rooms */}
        <Route
          path="/manager/rooms"
          element={<Rooms />}
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