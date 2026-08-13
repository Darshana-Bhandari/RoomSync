import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Home,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Wallet,
  Receipt,
  Users,
} from "lucide-react";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const FEATURES = [
  { icon: Home, label: "Simplify property management" },
  { icon: Wallet, label: "Stay ahead of rent & bills" },
  { icon: Receipt, label: "Split shared expenses effortlessly" },
  { icon: Users, label: "Keep your household in sync" },
];

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Gets token from URL:
  // /reset-password?token=abc123
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [authError, setAuthError] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!password.trim()) {
      newErrors.password = "Enter your new password.";
    } else if (!PASSWORD_REGEX.test(password)) {
      newErrors.password =
        "Password must contain at least 8 characters, one uppercase, one lowercase, and one number.";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm your new password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAuthError("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      // Connect your real backend API here later.
      //
      // Example:
      //
      // const response = await fetch(
      //   "http://localhost:3000/api/auth/reset-password",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       token,
      //       password,
      //     }),
      //   }
      // );

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitted(true);
    } catch (err) {
      setAuthError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength =
    password.length === 0
      ? ""
      : PASSWORD_REGEX.test(password)
      ? "Strong password"
      : "Password needs improvement";

  return (
    <div className="min-h-screen flex bg-[#F6F8F7]">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-16 left-16 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-24 right-16 w-64 h-64 bg-emerald-300 rounded-full blur-3xl" />
        </div>

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          {/* Logo */}
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

          {/* Main Content */}
          <div className="space-y-7 max-w-lg -mt-6">
            <div>
              <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.08] mb-5">
                Create a new
                <br />
                password.
                <br />
                Stay secure.
              </h1>

              <p className="text-base xl:text-lg leading-8 text-teal-50/80">
                Choose a strong password to protect your RoomSync account
                and keep your shared living information secure.
              </p>
            </div>

            <div className="space-y-3">
              {FEATURES.map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-teal-50/90 text-sm">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-teal-200/70">
            Secure password recovery • Keep your account protected
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-[0_24px_70px_-25px_rgba(15,23,42,0.22)]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>

            <span className="text-xl font-bold text-slate-900">
              RoomSync
            </span>
          </div>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Create new password
                </h2>

                <p className="text-slate-500">
                  Enter a new password for your RoomSync account.
                </p>
              </div>

              {/* Backend Error */}
              {authError && (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
              >
                {/* New Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    New password
                  </label>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);

                        if (errors.password) {
                          setErrors((prev) => ({
                            ...prev,
                            password: "",
                          }));
                        }
                      }}
                      placeholder="Enter new password"
                      className={`w-full pl-11 pr-12 py-3 rounded-xl border outline-none transition-all duration-200 ${
                        errors.password
                          ? "border-red-300 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {password && (
                    <p
                      className={`mt-1.5 text-xs ${
                        PASSWORD_REGEX.test(password)
                          ? "text-teal-600"
                          : "text-slate-500"
                      }`}
                    >
                      {passwordStrength}
                    </p>
                  )}

                  {errors.password && (
                    <p className="mt-1.5 flex items-start gap-1 text-sm text-red-600">
                      <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Confirm new password
                  </label>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword ? "text" : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);

                        if (errors.confirmPassword) {
                          setErrors((prev) => ({
                            ...prev,
                            confirmPassword: "",
                          }));
                        }
                      }}
                      placeholder="Confirm new password"
                      className={`w-full pl-11 pr-12 py-3 rounded-xl border outline-none transition-all duration-200 ${
                        errors.confirmPassword
                          ? "border-red-300 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="mt-1.5 flex items-start gap-1 text-sm text-red-600">
                      <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Password requirements:
                  </p>

                  <ul className="text-xs text-slate-500 space-y-1">
                    <li>• At least 8 characters</li>
                    <li>• At least one uppercase letter</li>
                    <li>• At least one lowercase letter</li>
                    <li>• At least one number</li>
                  </ul>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-2xl transition-all duration-200 shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40 hover:-translate-y-0.5"
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

                      Updating password...
                    </>
                  ) : (
                    <>
                      Reset password
                      <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <p className="mt-8 text-center text-sm text-slate-600">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Link>
              </p>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-teal-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Password updated!
              </h2>

              <p className="text-slate-500 mb-8">
                Your password has been successfully reset. You can
                now sign in using your new password.
              </p>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center gap-2 w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 px-4 rounded-2xl transition-all duration-200 shadow-lg shadow-teal-600/25"
              >
                Go to sign in
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;