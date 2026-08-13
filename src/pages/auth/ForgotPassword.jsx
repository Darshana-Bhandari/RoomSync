import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Home,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [authError, setAuthError] = useState("");

  const validate = (value) => {
    if (!value.trim()) return "Enter your email address.";
    if (!EMAIL_REGEX.test(value)) return "Enter a valid email address.";
    return "";
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched) setError(validate(value));
    if (authError) setAuthError("");
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validate(email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate(email);
    setError(validationError);
    setTouched(true);

    if (validationError) return;

    setIsLoading(true);
    setAuthError("");

    try {
      // Replace with your real API call later
      // await fetch("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (err) {
      setAuthError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const emailInvalid = Boolean(touched && error);

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
                Forgot your
                <br />
                password?
                <br />
                No problem.
              </h1>
              <p className="text-base xl:text-lg leading-8 text-teal-50/80">
                Enter the email associated with your account and we’ll send you
                a link to reset your password securely.
              </p>
            </div>

            <div className="space-y-3">
              {FEATURES.map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-teal-50/90 text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-teal-200/70">
            Secure password recovery • Takes less than a minute
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-[0_24px_70px_-25px_rgba(15,23,42,0.22)] animate-[fadeIn_0.6s_ease-out]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">RoomSync</span>
          </div>

          {!isSubmitted ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Reset password
                </h2>
                <p className="text-slate-500">
                  Enter your email and we’ll send you a reset link
                </p>
              </div>

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
                      value={email}
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
                      {error}
                    </p>
                  )}
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
                      Sending link...
                    </>
                  ) : (
                    <>
                      Send reset link
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
                Check your email
              </h2>
              <p className="text-slate-500 mb-2">
                We’ve sent a password reset link to
              </p>
              <p className="font-medium text-slate-800 mb-8">{email}</p>

              <p className="text-sm text-slate-500 mb-8">
                Didn’t receive the email? Check your spam folder or{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                    setTouched(false);
                    setError("");
                  }}
                  className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  try another email
                </button>
              </p>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 px-4 rounded-2xl transition-all duration-200 shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to sign in
              </Link>
            </div>
          )}
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

export default ForgotPassword;