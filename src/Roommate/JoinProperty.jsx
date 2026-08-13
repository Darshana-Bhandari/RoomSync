import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Key,
  ArrowRight,
  AlertCircle,
  MapPin,
  Users,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Clock,
} from "lucide-react";

const FEATURES = [
  { icon: Building2, label: "Find your property" },
  { icon: Users, label: "See property information" },
  { icon: CheckCircle2, label: "Send a join request" },
  { icon: Home, label: "Get assigned to a room" },
];

// Simulated API – replace with real calls later
const mockFindProperty = async (code) => {
  await new Promise((r) => setTimeout(r, 1200));

  // Demo: only accept GREEN-82K4
  if (code.toUpperCase() === "GREEN-82K4") {
    return {
      id: "prop_1",
      name: "Green Valley House",
      location: "Kathmandu, Nepal",
      description: "Shared rental house with modern amenities",
      roomsOccupied: 5,
      totalRooms: 6,
      managerName: "Ram Sharma",
    };
  }
  throw new Error("No property found with this invitation code.");
};

const mockSendJoinRequest = async (propertyId) => {
  await new Promise((r) => setTimeout(r, 1400));
  return { requestId: "req_123", status: "PENDING" };
};

const JoinProperty = () => {
  const [step, setStep] = useState("code"); // "code" | "preview" | "success"
  const [code, setCode] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [property, setProperty] = useState(null);

  const validateCode = (value) => {
    if (!value.trim()) return "Enter the invitation code.";
    if (value.trim().length < 6) return "Invitation code looks too short.";
    return "";
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase();
    setCode(value);
    if (touched) {
      setError(validateCode(value));
    }
  };

  const handleFindProperty = async (e) => {
    e.preventDefault();
    setTouched(true);
    const validationError = validateCode(code);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const found = await mockFindProperty(code.trim());
      setProperty(found);
      setStep("preview");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!property) return;
    setIsLoading(true);
    setError("");

    try {
      await mockSendJoinRequest(property.id);
      setStep("success");
    } catch (err) {
      setError(err.message || "Failed to send request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDifferentCode = () => {
    setStep("code");
    setProperty(null);
    setCode("");
    setTouched(false);
    setError("");
  };

  const codeInvalid = Boolean(touched && error);

  return (
    <div className="min-h-screen flex bg-[#F6F8F7]">
      {/* ──────────────── Left Side – Branding ──────────────── */}
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

          {/* Main content */}
          <div className="space-y-7 max-w-lg -mt-6">
            <div>
              <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.08] mb-5">
                Join your
                <br />
                shared home
              </h1>
              <p className="text-base xl:text-lg leading-8 text-teal-50/80">
                Enter the invitation code provided by your property manager to
                find the house and send a join request.
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

            <div className="pt-2">
              <p className="text-sm text-teal-100/70 mb-1.5">Example code</p>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5">
                <Key className="w-4 h-4 text-teal-200" />
                <span className="font-mono text-sm tracking-wider text-white">
                  GREEN-82K4
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-teal-200/70">
            Free to start • No credit card required
          </p>
        </div>
      </div>

      {/* ──────────────── Right Side – Interaction ──────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-[0_24px_70px_-25px_rgba(15,23,42,0.22)] animate-[fadeIn_0.6s_ease-out]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">RoomSync</span>
          </div>

          {/* ──────────── STEP 1: Enter Code ──────────── */}
          {step === "code" && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Join a Property
                </h2>
                <p className="text-slate-500">
                  Enter the invitation code shared by your property manager.
                </p>
              </div>

              <form onSubmit={handleFindProperty} noValidate className="space-y-5">
                <div>
                  <label
                    htmlFor="inviteCode"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Invitation Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Key
                        className={`h-5 w-5 ${
                          codeInvalid ? "text-red-400" : "text-slate-400"
                        }`}
                      />
                    </div>
                    <input
                      id="inviteCode"
                      name="inviteCode"
                      type="text"
                      autoComplete="off"
                      value={code}
                      onChange={handleCodeChange}
                      onBlur={() => setTouched(true)}
                      placeholder="GREEN-82K4"
                      aria-invalid={codeInvalid}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 font-mono tracking-wider uppercase ${
                        codeInvalid
                          ? "border-red-300 bg-white focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:ring-teal-500/10"
                      }`}
                    />
                  </div>
                  {codeInvalid && (
                    <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-2xl transition-all duration-200 shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Finding property...
                    </>
                  ) : (
                    <>
                      Find Property
                      <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Back to sign in
                </Link>
              </p>
            </>
          )}

          {/* ──────────── STEP 2: Property Preview ──────────── */}
          {step === "preview" && property && (
            <>
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleUseDifferentCode}
                  className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Use a different code
                </button>
                <h2 className="text-2xl font-bold text-slate-900">
                  Property Found
                </h2>
                <p className="text-slate-500 mt-1">
                  Review the details before sending your request.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 truncate">
                      {property.name}
                    </h3>
                    <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      {property.location}
                    </p>
                  </div>
                </div>

                {property.description && (
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                    {property.description}
                  </p>
                )}

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white border border-slate-200 px-3.5 py-3">
                    <p className="text-xs text-slate-500 mb-0.5">Rooms</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {property.roomsOccupied}/{property.totalRooms} occupied
                    </p>
                  </div>
                  <div className="rounded-xl bg-white border border-slate-200 px-3.5 py-3">
                    <p className="text-xs text-slate-500 mb-0.5">Managed by</p>
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {property.managerName}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSendRequest}
                disabled={isLoading}
                className="group w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-2xl transition-all duration-200 shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending request...
                  </>
                ) : (
                  <>
                    Send Join Request
                    <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </>
          )}

          {/* ──────────── STEP 3: Success / Pending ──────────── */}
          {step === "success" && property && (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-teal-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Request Sent!
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Your join request has been sent to the property manager.
                You’ll be notified once they approve it and assign you a room.
              </p>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-left mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {property.name}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {property.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <span className="text-sm text-slate-500">Status</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
                    <Clock className="w-3.5 h-3.5" />
                    PENDING
                  </span>
                </div>
              </div>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3.5 px-4 rounded-2xl transition-all duration-200"
              >
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

export default JoinProperty;