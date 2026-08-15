import { useState, useRef, useEffect } from "react";
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
  Camera,
  Star,
  X,
  Plus,
  Images,
  BedDouble,
  Users,
  Wallet,
  Info,
} from "lucide-react";

const PROPERTY_TYPES = [
  "Shared House",
  "Apartment",
  "Hostel",
  "PG / Paying Guest",
  "Villa",
  "Other",
];

const SETUP_STEPS = [
  { key: "details", label: "Details" },
  { key: "photos", label: "Photos" },
  { key: "rooms", label: "Rooms" },
  { key: "complete", label: "Complete" },
];

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/* ──────────────── Small building blocks ──────────────── */

const SetupProgress = ({ currentKey }) => {
  const currentIndex = SETUP_STEPS.findIndex((s) => s.key === currentKey);

  return (
    <div className="flex items-center max-w-xl mx-auto mb-2">
      {SETUP_STEPS.map((s, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={s.key} className="flex items-center flex-1 last:flex-none">
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
                {s.label}
              </span>
            </div>
            {i < SETUP_STEPS.length - 1 && (
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

const PropertyPreviewCard = ({ formData, photos }) => {
  const hasCore = formData.name || formData.address || formData.type || formData.rooms;

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-[0_24px_70px_-25px_rgba(15,23,42,0.22)] sticky top-6">
      <div className="aspect-[16/10] bg-slate-100 relative">
        {photos.length > 0 ? (
          <img
            src={photos[0].url}
            alt="Property cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
            <Images className="w-10 h-10 mb-2" />
            <span className="text-xs text-slate-400">No cover photo yet</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-3">
          Property Preview
        </p>

        {hasCore ? (
          <>
            <h3 className="text-lg font-bold text-slate-900 truncate">
              {formData.name || "Your property name"}
            </h3>
            <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              {formData.address || "Property address"}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              {formData.type && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {formData.type}
                </span>
              )}
              {formData.rooms && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
                  <BedDouble className="w-3.5 h-3.5" />
                  {formData.rooms} {Number(formData.rooms) === 1 ? "room" : "rooms"}
                </span>
              )}
              {formData.peoplePerRoom && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {formData.peoplePerRoom}{" "}
                  {Number(formData.peoplePerRoom) === 1 ? "person" : "people"}/room
                </span>
              )}
              {formData.rent && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-1.5">
                  <Wallet className="w-3.5 h-3.5" />
                  Rs. {Number(formData.rent).toLocaleString("en-IN")}/room
                </span>
              )}
            </div>

            {formData.description && (
              <p className="text-sm text-slate-500 leading-relaxed mt-4 line-clamp-3">
                {formData.description}
              </p>
            )}

            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                {photos.length} photo{photos.length === 1 ? "" : "s"} added
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-2.5 py-1">
                Ready for roommates
              </span>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400 leading-relaxed">
            Your property preview will appear here as you fill in the details.
            This is what your roommates will see when they get your invitation
            code.
          </p>
        )}
      </div>
    </div>
  );
};

const Property = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "",
    rooms: "",
    description: "",
    peoplePerRoom: "",
    rent: "",
  });
  // photos: [{ file, url }]
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [createdProperty, setCreatedProperty] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Revoke object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    if (!data.peoplePerRoom) {
      next.peoplePerRoom = "Enter how many people can live in each room.";
    } else if (Number(data.peoplePerRoom) < 1) {
      next.peoplePerRoom = "Must allow at least 1 person.";
    } else if (Number(data.peoplePerRoom) > 10) {
      next.peoplePerRoom = "Maximum 10 people per room.";
    }

    if (!data.rent) {
      next.rent = "Enter the monthly rent per room.";
    } else if (Number(data.rent) < 0) {
      next.rent = "Rent can't be negative.";
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

  /* ──────────────── Photo handling ──────────────── */

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList);
    if (incoming.length === 0) return;

    let photoError = "";
    const accepted = [];

    for (const file of incoming) {
      if (photos.length + accepted.length >= MAX_PHOTOS) {
        photoError = `You can upload up to ${MAX_PHOTOS} photos.`;
        break;
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        photoError = "Only JPG, PNG or WEBP images are allowed.";
        continue;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        photoError = `Each image must be under ${MAX_FILE_SIZE_MB}MB.`;
        continue;
      }
      accepted.push({ file, url: URL.createObjectURL(file) });
    }

    if (accepted.length > 0) {
      setPhotos((prev) => [...prev, ...accepted]);
    }
    setErrors((prev) => ({ ...prev, images: photoError }));
  };

  const handleFileInputChange = (e) => {
    addFiles(e.target.files);
    e.target.value = ""; // allow re-selecting the same file
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  /* ──────────────── Submit ──────────────── */

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors((prev) => ({ ...prev, ...validationErrors }));
    setTouched({
      name: true,
      address: true,
      type: true,
      rooms: true,
      description: true,
      peoplePerRoom: true,
      rent: true,
    });

    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);

    try {
      // Replace with your real API call later
      // await api.createProperty({
      //   ...formData,
      //   rooms: Number(formData.rooms),
      //   peoplePerRoom: Number(formData.peoplePerRoom),
      //   rent: Number(formData.rent),
      //   images: photos.map((p) => p.file),
      // });
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setCreatedProperty({
        name: formData.name.trim(),
        address: formData.address.trim(),
        type: formData.type,
        rooms: Number(formData.rooms),
        description: formData.description.trim(),
        peoplePerRoom: Number(formData.peoplePerRoom),
        rent: Number(formData.rent),
        photoCount: photos.length,
        coverUrl: photos[0]?.url || null,
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
  const peopleInvalid = Boolean(touched.peoplePerRoom && errors.peoplePerRoom);
  const rentInvalid = Boolean(touched.rent && errors.rent);
  const hasCoreDetails =
    formData.name.trim() && formData.address.trim() && formData.type && formData.rooms;

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

        <div className="px-6 pt-8">
          <SetupProgress currentKey="rooms" />
        </div>

        {/* Success content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-[0_24px_70px_-25px_rgba(15,23,42,0.22)] text-center animate-[fadeIn_0.5s_ease-out]">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-teal-50 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-teal-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Your property is ready! 🎉
            </h2>
            <p className="text-slate-500 mb-8">
              Great! Your property has been created. Now let's set up the
              rooms and get your home ready for residents.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 overflow-hidden text-left mb-8">
              {createdProperty.coverUrl && (
                <img
                  src={createdProperty.coverUrl}
                  alt={createdProperty.name}
                  className="w-full h-36 object-cover"
                />
              )}
              <div className="p-5 space-y-3">
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
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <p className="text-sm text-slate-600">
                    {createdProperty.peoplePerRoom}{" "}
                    {createdProperty.peoplePerRoom === 1 ? "Person" : "People"} per room
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <p className="text-sm text-slate-600">
                    Rs. {createdProperty.rent.toLocaleString("en-IN")} / room / month
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <p className="text-sm text-slate-600">
                    {createdProperty.photoCount}{" "}
                    {createdProperty.photoCount === 1 ? "Photo" : "Photos"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="group w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 px-4 rounded-2xl transition-all duration-200 shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              Continue to Room Setup
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
      <div className="flex-1 flex flex-col items-center p-6 sm:p-10">
        <div className="w-full max-w-5xl">
          {/* Progress + Heading */}
          <div className="text-center mb-8 animate-[fadeIn_0.5s_ease-out]">
            <SetupProgress currentKey={hasCoreDetails ? "photos" : "details"} />
            <h1 className="text-3xl font-bold text-slate-900 mb-2 mt-6">
              Create Your Property
            </h1>
            <p className="text-slate-500 max-w-md mx-auto">
              Set up your property, photos, and room information all in one
              place.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
            {/* Form card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-[0_24px_70px_-25px_rgba(15,23,42,0.22)] animate-[fadeIn_0.5s_ease-out] space-y-8">
              {errors.submit && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{errors.submit}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-8">
                {/* ── Section: Property Information ── */}
                <div>
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                      <Home className="w-5 h-5 text-teal-600" />
                    </div>
                    <h2 className="text-base font-semibold text-slate-800">
                      Property Information
                    </h2>
                  </div>

                  <div className="space-y-5">
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
                          placeholder="Describe your property..."
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Section: Property Photos ── */}
                <div className="pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-teal-600" />
                    </div>
                    <h2 className="text-base font-semibold text-slate-800">
                      Property Photos
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 ml-11">
                    Upload photos so roommates can see your property.
                  </p>

                  {photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {photos.map((photo, i) => (
                        <div
                          key={photo.url}
                          className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group"
                        >
                          <img
                            src={photo.url}
                            alt={`Property photo ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {i === 0 && (
                            <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 bg-white/95 text-amber-600 text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(i)}
                            aria-label="Remove photo"
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {photos.length < MAX_PHOTOS && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 flex flex-col items-center justify-center text-slate-400 hover:text-teal-600 transition-colors"
                        >
                          <Plus className="w-5 h-5 mb-1" />
                          <span className="text-[11px] font-medium">Add photo</span>
                        </button>
                      )}
                    </div>
                  )}

                  {photos.length === 0 && (
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                      className={`flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed px-4 py-10 cursor-pointer transition-colors duration-200 ${
                        isDragging
                          ? "border-teal-400 bg-teal-50/60"
                          : "border-slate-200 bg-slate-50/50 hover:border-teal-300 hover:bg-teal-50/30"
                      }`}
                    >
                      <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3 shadow-sm">
                        <Camera className="w-5 h-5 text-teal-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        Upload property photos
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Click to browse • Max {MAX_PHOTOS} photos
                      </p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {errors.images ? (
                    <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      {errors.images}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-slate-400">
                      The first photo will be used as your property cover.
                    </p>
                  )}
                </div>

                {/* ── Section: Room Information ── */}
                <div className="pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                      <BedDouble className="w-5 h-5 text-teal-600" />
                    </div>
                    <h2 className="text-base font-semibold text-slate-800">
                      Room Information
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mb-5 ml-11">
                    How many people can live in each room?
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* People per Room */}
                    <div>
                      <label
                        htmlFor="peoplePerRoom"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        Number of People per Room
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Users
                            className={`h-5 w-5 ${
                              peopleInvalid ? "text-red-400" : "text-slate-400"
                            }`}
                          />
                        </div>
                        <input
                          id="peoplePerRoom"
                          name="peoplePerRoom"
                          type="number"
                          min="1"
                          max="10"
                          value={formData.peoplePerRoom}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="2"
                          aria-invalid={peopleInvalid}
                          className={`w-full pl-11 pr-16 py-3 rounded-xl border outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                            peopleInvalid
                              ? "border-red-300 bg-white focus:border-red-500 focus:ring-red-500/20"
                              : "border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:ring-teal-500/10"
                          }`}
                        />
                        <span className="absolute inset-y-0 right-3.5 flex items-center text-sm text-slate-400 pointer-events-none">
                          people
                        </span>
                      </div>
                      {peopleInvalid && (
                        <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                          {errors.peoplePerRoom}
                        </p>
                      )}
                    </div>

                    {/* Monthly Rent */}
                    <div>
                      <label
                        htmlFor="rent"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        Monthly Rent
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Wallet
                            className={`h-5 w-5 ${
                              rentInvalid ? "text-red-400" : "text-slate-400"
                            }`}
                          />
                        </div>
                        <input
                          id="rent"
                          name="rent"
                          type="number"
                          min="0"
                          step="100"
                          value={formData.rent}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="12000"
                          aria-invalid={rentInvalid}
                          className={`w-full pl-11 pr-20 py-3 rounded-xl border outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                            rentInvalid
                              ? "border-red-300 bg-white focus:border-red-500 focus:ring-red-500/20"
                              : "border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:ring-teal-500/10"
                          }`}
                        />
                        <span className="absolute inset-y-0 right-3.5 flex items-center text-sm text-slate-400 pointer-events-none">
                          /month
                        </span>
                      </div>
                      {rentInvalid && (
                        <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                          {errors.rent}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mt-4 rounded-xl bg-teal-50/70 border border-teal-100 px-3.5 py-2.5">
                    <Info className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-teal-800">
                      This rent and capacity will apply to each room in this
                      property.
                    </p>
                  </div>
                </div>

                {/* Submit */}
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

            {/* Live preview */}
            <div className="animate-[fadeIn_0.5s_ease-out] hidden lg:block">
              <PropertyPreviewCard formData={formData} photos={photos} />
            </div>
          </div>

          {/* Mobile preview (shown below form on small screens) */}
          <div className="lg:hidden mt-6 animate-[fadeIn_0.5s_ease-out]">
            <PropertyPreviewCard formData={formData} photos={photos} />
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
