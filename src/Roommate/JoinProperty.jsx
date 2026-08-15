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
  ChevronLeft,
  ChevronRight,
  BedDouble,
  ShieldCheck,
  User,
  ClipboardPaste,
  Circle,
} from "lucide-react";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Enter invitation code",
    detail: "Find your property",
  },
  {
    step: "02",
    title: "Review property",
    detail: "Check photos and details",
  },
  {
    step: "03",
    title: "Send request",
    detail: "Wait for manager approval",
  },
];

const STEPS = [
  { key: "code", label: "Find Property" },
  { key: "preview", label: "Review" },
  { key: "success", label: "Request" },
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
      propertyType: "Shared House",
      images: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      ],
      roomsOccupied: 5,
      totalRooms: 6,
      manager: {
        name: "Ram Sharma",
        avatar: null,
      },
    };
  }
  throw new Error("No property found with this invitation code.");
};

const mockSendJoinRequest = async (propertyId) => {
  await new Promise((r) => setTimeout(r, 1400));
  return { requestId: "req_123", status: "PENDING" };
};

/* ──────────────── Small building blocks ──────────────── */

const ProgressSteps = ({ current }) => {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center mb-8">
      {STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors duration-300 ${
                  isDone
                    ? "bg-teal-600 text-white"
                    : isCurrent
                    ? "bg-teal-600 text-white ring-4 ring-teal-100"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-[11px] font-medium whitespace-nowrap ${
                  isCurrent ? "text-teal-700" : isDone ? "text-slate-600" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 -mt-4 rounded-full transition-colors duration-300 ${
                  isDone ? "bg-teal-600" : "bg-slate-100"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const PropertyGallery = ({ images, name }) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="mb-5">
      <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-100">
        <img
          key={index}
          src={images[index]}
          alt={`${name} photo ${index + 1}`}
          className="w-full h-full object-cover animate-[fadeIn_0.35s_ease-out]"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur flex items-center justify-center text-slate-700 hover:bg-white transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur flex items-center justify-center text-slate-700 hover:bg-white transition-colors shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-teal-600" : "w-1.5 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
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

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const value = text.toUpperCase().trim();
      setCode(value);
      if (touched) setError(validateCode(value));
    } catch {
      // Clipboard access denied — silently ignore, user can type manually
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
  const availableRooms = property ? property.totalRooms - property.roomsOccupied : 0;

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
          {property ? (
            /* Once a property is found, show the real property instead of generic copy */
            <div className="space-y-5 max-w-lg -mt-6 animate-[fadeIn_0.5s_ease-out]">
              <div>
                <p className="text-xs uppercase tracking-widest text-teal-200/80 mb-2">
                  You're about to join
                </p>
                <h1 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight mb-1">
                  {property.name}
                </h1>
                <p className="flex items-center gap-1.5 text-teal-100/80 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  {property.location}
                </p>
              </div>

              {property.images?.[0] && (
                <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-black/20">
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-full h-56 object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {property.roomsOccupied} residents
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
                  <BedDouble className="w-3.5 h-3.5" />
                  {property.totalRooms} rooms
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 border ${
                    availableRooms > 0
                      ? "bg-emerald-400/15 border-emerald-300/30 text-emerald-100"
                      : "bg-red-400/15 border-red-300/30 text-red-100"
                  }`}
                >
                  <Circle className="w-2 h-2 fill-current" />
                  {availableRooms > 0 ? `${availableRooms} available` : "Full"}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-7 max-w-lg -mt-6">
              <div>
                <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.08] mb-5">
                  Find your place.
                  <br />
                  Join your people.
                </h1>
                <p className="text-base xl:text-lg leading-8 text-teal-50/80">
                  Enter the invitation code from your property manager and
                  discover your shared home before requesting access.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Building2, label: "Find your property" },
                  { icon: Users, label: "See property information" },
                  { icon: CheckCircle2, label: "Send a join request" },
                  { icon: Home, label: "Get assigned to a room" },
                ].map(({ icon: Icon, label }, i) => (
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
          )}

          <p className="text-sm text-teal-200/70">
            Free to start • No credit card required
          </p>
        </div>
      </div>

      {/* ──────────────── Right Side – Interaction ──────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-[0_24px_70px_-25px_rgba(15,23,42,0.22)] animate-[fadeIn_0.6s_ease-out]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">RoomSync</span>
          </div>

          <ProgressSteps current={step} />

          {/* ──────────── STEP 1: Enter Code ──────────── */}
          {step === "code" && (
            <div className="animate-[fadeIn_0.4s_ease-out]">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Join a Property
                </h2>
                <p className="text-slate-500">
                  Enter the invitation code shared by your property manager.
                </p>
              </div>

              <form onSubmit={handleFindProperty} noValidate className="space-y-4">
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
                      className={`w-full pl-11 pr-11 py-3.5 rounded-xl border outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 font-mono text-base tracking-wider uppercase ${
                        codeInvalid
                          ? "border-red-300 bg-white focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:ring-teal-500/10"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handlePasteCode}
                      aria-label="Paste invitation code"
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-teal-600 transition-colors"
                    >
                      <ClipboardPaste className="h-4.5 w-4.5" />
                    </button>
                  </div>
                  {codeInvalid ? (
                    <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      {error}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-400">
                      Example: GREEN-82K4
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3">
                  <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>Only users with a valid invitation can request access.</span>
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
                      Find my property
                      <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-9 pt-7 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  How joining works
                </p>
                <div className="space-y-4">
                  {HOW_IT_WORKS.map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <span className="text-xs font-bold text-teal-600/70 font-mono pt-0.5 w-6 flex-shrink-0">
                        {item.step}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-7 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Back to sign in
                </Link>
              </p>
            </div>
          )}

          {/* ──────────── STEP 2: Property Preview ──────────── */}
          {step === "preview" && property && (
            <div className="animate-[fadeIn_0.4s_ease-out]">
              <button
                type="button"
                onClick={handleUseDifferentCode}
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Use a different code
              </button>

              <PropertyGallery images={property.images} name={property.name} />

              <div className="mb-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {property.name}
                    </h2>
                    <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      {property.location}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1.5 border ${
                      availableRooms > 0
                        ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                        : "text-red-700 bg-red-50 border-red-200"
                    }`}
                  >
                    <Circle className="w-2 h-2 fill-current" />
                    {availableRooms > 0
                      ? `${availableRooms} room${availableRooms > 1 ? "s" : ""} available`
                      : "Currently full"}
                  </span>
                </div>

                {property.description && (
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {property.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-3">
                  <p className="text-xs text-slate-500 mb-0.5 flex items-center gap-1">
                    <BedDouble className="w-3.5 h-3.5" /> Rooms
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {property.totalRooms} total
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-3">
                  <p className="text-xs text-slate-500 mb-0.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Residents
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {property.roomsOccupied} living here
                  </p>
                </div>
              </div>

              {property.propertyType && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    {property.propertyType}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Invitation-only property
                  </span>
                </div>
              )}

              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Property manager
                </p>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3">
                  <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {property.manager?.avatar ? (
                      <img
                        src={property.manager.avatar}
                        alt={property.manager.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4.5 h-4.5 text-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {property.manager?.name}
                    </p>
                    <p className="text-xs text-slate-500">Property Manager</p>
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

              <div className="rounded-2xl border border-teal-100 bg-teal-50/60 px-4 py-4 mb-4">
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  Ready to join this home?
                </p>
                <p className="text-xs text-slate-500">
                  Your request will be sent to {property.manager?.name} for
                  approval.
                </p>
              </div>

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
            </div>
          )}

          {/* ──────────── STEP 3: Success / Pending ──────────── */}
          {step === "success" && property && (
            <div className="text-center animate-[fadeIn_0.4s_ease-out]">
              <div className="mx-auto w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-teal-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                You're almost home! 🎉
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Your request has been sent to {property.manager?.name}.
                You'll be notified as soon as it's reviewed.
              </p>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-left mb-6">
                <div className="flex items-center gap-3 mb-5">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                  )}
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

                {/* Request progress timeline */}
                <div className="space-y-0">
                  {[
                    { label: "Request submitted", state: "done" },
                    { label: "Waiting for manager approval", state: "current" },
                    { label: "Room assignment", state: "upcoming" },
                    { label: "You're officially in", state: "upcoming" },
                  ].map((item, i, arr) => (
                    <div key={item.label} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            item.state === "done"
                              ? "bg-teal-600"
                              : item.state === "current"
                              ? "bg-teal-100 ring-2 ring-teal-500"
                              : "bg-slate-200"
                          }`}
                        >
                          {item.state === "done" && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>
                        {i < arr.length - 1 && (
                          <div
                            className={`w-0.5 flex-1 min-h-[18px] ${
                              item.state === "done" ? "bg-teal-600" : "bg-slate-200"
                            }`}
                          />
                        )}
                      </div>
                      <p
                        className={`text-sm pb-4 ${
                          item.state === "upcoming"
                            ? "text-slate-400"
                            : item.state === "current"
                            ? "text-slate-800 font-medium"
                            : "text-slate-600"
                        }`}
                      >
                        {item.label}
                      </p>
                    </div>
                  ))}
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
