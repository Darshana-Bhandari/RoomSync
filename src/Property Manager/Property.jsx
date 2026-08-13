import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  MapPin,
  Building2,
  Hash,
  FileText,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  User,
} from "lucide-react";

const PROPERTY_TYPES = [
  "Shared House",
  "Apartment",
  "Hostel",
  "PG / Paying Guest",
  "Villa",
  "Other",
];

const Property = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "",
    rooms: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [createdProperty, setCreatedProperty] = useState(null);

  const validate = (data) => {
    const next = {};

    if (!data.name.trim()) {
      next.name = "Enter a property name.";
    } else if (data.name.trim().length < 2) {
      next.name = "Name must be at least 2 characters.";
    }

    if (!data.address.trim()) {
      next.address = "Enter the property address.";
    }

    if (!data.type) {
      next.type = "Select a property type.";
    }

    if (!data.rooms) {
      next.rooms = "Enter the number of rooms.";
    } else if (Number(data.rooms) < 1) {
      next.rooms = "Must have at least 1 room.";
    } else if (Number(data.rooms) > 100) {
      next.rooms = "Maximum 100 rooms allowed.";
    }

    return next;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextData = { ...formData, [name]: value };
    setFormData(nextData);

    if (touched[name]) {
      setErrors(validate(nextData));
    }
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
    setTouched({
      name: true,
      address: true,
      type: true,
      rooms: true,
      description: true,
    });

    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);

    try {
      // Replace with your real API call later
      // await api.createProperty({ ...formData, rooms: Number(formData.rooms) });
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setCreatedProperty({
        name: formData.name.trim(),
        address: formData.address.trim(),
        type: formData.type,
        rooms: Number(formData.rooms),
        description: formData.description.trim(),
      });
      setIsCreated(true);
    } catch (err) {
      setErrors({
        submit: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/add-room");
  };

  const nameInvalid = Boolean(touched.name && errors.name);
  const addressInvalid = Boolean(touched.address && errors.address);
  const typeInvalid = Boolean(touched.type && errors.type);
  const roomsInvalid = Boolean(touched.rooms && errors.rooms);

  // ── Success State ──────────────────────────────────────────
  if (isCreated && createdProperty) {
    return (
      <div className="min-h-screen bg-[#F6F8F7] flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">RoomSync</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
              <User className="w-4 h-4 text-teal-700" />
            </div>
            <span className="hidden sm:inline font-medium">Manager</span>
          </div>
        </header>

        {/* Success content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-[0_24px_70px_-25px_rgba(15,23,42,0.22)] text-center animate-[fadeIn_0.5s_ease-out]">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-teal-50 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-teal-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Property Created Successfully
            </h2>
            <p className="text-slate-500 mb-8">
              Your property is ready. Next, add the rooms.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-left mb-8 space-y-3">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">
                    {createdProperty.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {createdProperty.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <p className="text-sm text-slate-600">
                  {createdProperty.address}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <p className="text-sm text-slate-600">
                  {createdProperty.rooms}{" "}
                  {createdProperty.rooms === 1 ? "Room" : "Rooms"}
                </p>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="group w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 px-4 rounded-2xl transition-all duration-200 shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              Continue
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
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
  }

  // ── Form State ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F6F8F7] flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">RoomSync</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
            <User className="w-4 h-4 text-teal-700" />
          </div>
          <span className="hidden sm:inline font-medium">Manager</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-lg">
          {/* Heading */}
          <div className="text-center mb-8 animate-[fadeIn_0.5s_ease-out]">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Create Your Property
            </h1>
            <p className="text-slate-500 max-w-sm mx-auto">
              Set up your property to manage your rooms and residents in one
              place.
            </p>
          </div>

          {/* Form card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-[0_24px_70px_-25px_rgba(15,23,42,0.22)] animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                <Home className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-base font-semibold text-slate-800">
                Property Information
              </h2>
            </div>

            {errors.submit && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{errors.submit}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Property Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Property Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Building2
                      className={`h-5 w-5 ${
                        nameInvalid ? "text-red-400" : "text-slate-400"
                      }`}
                    />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Green Valley House"
                    aria-invalid={nameInvalid}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                      nameInvalid
                        ? "border-red-300 bg-white focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:ring-teal-500/10"
                    }`}
                  />
                </div>
                {nameInvalid && (
                  <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Property Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Property Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MapPin
                      className={`h-5 w-5 ${
                        addressInvalid ? "text-red-400" : "text-slate-400"
                      }`}
                    />
                  </div>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Kathmandu, Nepal"
                    aria-invalid={addressInvalid}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                      addressInvalid
                        ? "border-red-300 bg-white focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:ring-teal-500/10"
                    }`}
                  />
                </div>
                {addressInvalid && (
                  <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Type + Rooms (side by side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Property Type */}
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Property Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={typeInvalid}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 focus:bg-white focus:ring-2 appearance-none ${
                      typeInvalid
                        ? "border-red-300 bg-white focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:ring-teal-500/10"
                    } ${!formData.type ? "text-slate-400" : "text-slate-800"}`}
                  >
                    <option value="" disabled>
                      Select type
                    </option>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {typeInvalid && (
                    <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      {errors.type}
                    </p>
                  )}
                </div>

                {/* Number of Rooms */}
                <div>
                  <label
                    htmlFor="rooms"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Number of Rooms
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Hash
                        className={`h-5 w-5 ${
                          roomsInvalid ? "text-red-400" : "text-slate-400"
                        }`}
                      />
                    </div>
                    <input
                      id="rooms"
                      name="rooms"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.rooms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="6"
                      aria-invalid={roomsInvalid}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                        roomsInvalid
                          ? "border-red-300 bg-white focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:ring-teal-500/10"
                      }`}
                    />
                  </div>
                  {roomsInvalid && (
                    <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      {errors.rooms}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Description{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3.5 left-3.5 pointer-events-none">
                    <FileText className="h-5 w-5 text-slate-400" />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Shared living property for students..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 resize-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-2xl transition-all duration-200 shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] mt-2"
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
                    Creating property...
                  </>
                ) : (
                  <>
                    Create Property
                    <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>
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

export default Property;