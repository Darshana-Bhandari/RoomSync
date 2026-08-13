import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Home,
  ArrowRight,
  AlertCircle,
  Wallet,
  Receipt,
  Users,
} from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FEATURES = [
  { icon: Home, label: "Simplify property management" },
  { icon: Wallet, label: "Stay ahead of rent & bills" },
  { icon: Receipt, label: "Split shared expenses effortlessly" },
  { icon: Users, label: "Keep your household in sync" },
];

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const validate = (data) => {
    const next = {};
    if (!data.email.trim()) {
      next.email = "Enter your email address.";
    } else if (!EMAIL_REGEX.test(data.email)) {
      next.email = "Enter a valid email address.";
    }

    if (!data.password) {
      next.password = "Enter your password.";
    } else if (data.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }

    return next;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData(nextData);

    if (touched[name]) {
      setErrors(validate(nextData));
    }
    if (authError) setAuthError("");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setTouched({ email: true, password: true });

    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);
    setAuthError("");

    try {
      // Call your auth API here, e.g.:
      // const res = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      // if (!res.ok) throw new Error("Invalid email or password.");
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (err) {
      setAuthError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google OAuth later
    console.log("Continue with Google clicked");
  };

  const emailInvalid = Boolean(touched.email && errors.email);
  const passwordInvalid = Boolean(touched.password && errors.password);

  return (
    <div className="min-h-screen flex bg-[#F6F8F7]">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-16 left-16 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-24 right-16 w-64 h-64 bg-emerald-300 rounded-full blur-3xl"></div>
        </div>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        ></div>

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full animate-[fadeIn_0.6s_ease-out]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/10 backdrop-blur border border-white/20 rounded-2xl flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight block leading-none">
                RoomSync
              </span>
              <span className="text-xs text-teal-100/70">
                Smart living, beautifully organized.
              </span>
            </div>
          </div>

          <div className="space-y-8 max-w-lg">
            <div>
              <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.08] mb-5">
                Your space.
                <br />
                Your people.
                <br />
                Everything in sync.
              </h1>
              <p className="text-base xl:text-lg leading-8 text-teal-50/80">
                Take the stress out of shared living. Manage properties,
                coordinate roommates, track rent and bills, split expenses,
                and keep household responsibilities organized — all in one
                place.
              </p>
            </div>

            <div className="space-y-3">
              {FEATURES.map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-teal-50/90 text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-teal-200/70">
            Designed for better shared living.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-[0_24px_70px_-25px_rgba(15,23,42,0.22)] animate-[fadeIn_0.6s_ease-out]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">RoomSync</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back
            </h2>
            <p className="text-slate-500">
              Sign in to continue to your RoomSync account
            </p>
          </div>

          {/* Auth error banner */}
          {authError && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail
                    className={`h-5 w-5 ${
                      emailInvalid ? "text-red-400" : "text-slate-400"
                    }`}
                  />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  aria-invalid={emailInvalid}
                  aria-describedby={emailInvalid ? "email-error" : undefined}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                    emailInvalid
                      ? "border-red-300 bg-white focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:ring-teal-500/10"
                  }`}
                />
              </div>
              {emailInvalid && (
                <p
                  id="email-error"
                  className="mt-1.5 flex items-center gap-1 text-sm text-red-600"
                >
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock
                    className={`h-5 w-5 ${
                      passwordInvalid ? "text-red-400" : "text-slate-400"
                    }`}
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  aria-invalid={passwordInvalid}
                  aria-describedby={
                    passwordInvalid ? "password-error" : undefined
                  }
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                    passwordInvalid
                      ? "border-red-300 bg-white focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:ring-teal-500/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordInvalid && (
                <p
                  id="password-error"
                  className="mt-1.5 flex items-center gap-1 text-sm text-red-600"
                >
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={formData.remember}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <label
                htmlFor="remember"
                className="ml-2.5 block text-sm text-slate-600"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-2xl transition-all duration-200 shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">or</span>
            </div>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md text-slate-700 font-medium py-3.5 px-4 rounded-2xl transition-all duration-200 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Register Link */}
          <p className="mt-8 text-center text-sm text-slate-600">
            New to RoomSync?{" "}
            <Link
              to="/register"
              className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;
