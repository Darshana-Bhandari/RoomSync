import { BrowserRouter, Routes, Route } from "react-router-dom";

// Authentication Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Property Manager Pages
import Property from "./Property Manager/Property";

// Roommate Pages
import JoinProperty from "./Roommate/JoinProperty";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Property Manager */}
        <Route path="/property" element={<Property />} />

        {/* Roommate */}
        <Route path="/join-property" element={<JoinProperty />} />

        {/* Default */}
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;