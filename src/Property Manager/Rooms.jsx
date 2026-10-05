import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Building2,
  CircleCheck,
  Clock3,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ClipboardCheck,
  Sparkles,
  Home,
  Circle,
  X,
} from "lucide-react";

const initialRooms = [
  {
    id: 1,
    roomNumber: "101",
    floor: 1,
    type: "Shared",
    status: "GOOD",
    condition: {
      furniture: "GOOD",
      electricity: "GOOD",
      plumbing: "GOOD",
      doors: "GOOD",
      cleanliness: "GOOD",
    },
    lastInspection: "28 Sep 2026",
    timeline: [
      {
        id: 1,
        date: "28 Sep 2026",
        type: "inspection",
        title: "Room inspection completed",
        description: "Everything looks good.",
      },
      {
        id: 2,
        date: "20 Sep 2026",
        type: "cleaning",
        title: "Cleaning completed",
        description: "Regular room cleaning completed.",
      },
      {
        id: 3,
        date: "12 Sep 2026",
        type: "maintenance",
        title: "Window handle repaired",
        description: "Damaged window handle was replaced.",
      },
      {
        id: 4,
        date: "01 Sep 2026",
        type: "setup",
        title: "Room setup completed",
        description: "Room became ready for residents.",
      },
    ],
  },
  {
    id: 2,
    roomNumber: "102",
    floor: 1,
    type: "Shared",
    status: "GOOD",
    condition: {
      furniture: "GOOD",
      electricity: "GOOD",
      plumbing: "GOOD",
      doors: "GOOD",
      cleanliness: "GOOD",
    },
    lastInspection: "25 Sep 2026",
    timeline: [
      {
        id: 1,
        date: "25 Sep 2026",
        type: "inspection",
        title: "Room inspection completed",
        description: "No issues found.",
      },
    ],
  },
  {
    id: 3,
    roomNumber: "103",
    floor: 1,
    type: "Private",
    status: "NEEDS_REPAIR",
    condition: {
      furniture: "GOOD",
      electricity: "GOOD",
      plumbing: "NEEDS_REPAIR",
      doors: "GOOD",
      cleanliness: "GOOD",
    },
    lastInspection: "22 Sep 2026",
    timeline: [
      {
        id: 1,
        date: "22 Sep 2026",
        type: "inspection",
        title: "Plumbing issue detected",
        description: "Bathroom tap requires attention.",
      },
    ],
  },
  {
    id: 4,
    roomNumber: "104",
    floor: 2,
    type: "Shared",
    status: "NEEDS_INSPECTION",
    condition: {
      furniture: "GOOD",
      electricity: "GOOD",
      plumbing: "GOOD",
      doors: "GOOD",
      cleanliness: "GOOD",
    },
    lastInspection: "01 Sep 2026",
    timeline: [],
  },
  {
    id: 5,
    roomNumber: "105",
    floor: 2,
    type: "Private",
    status: "GOOD",
    condition: {
      furniture: "GOOD",
      electricity: "GOOD",
      plumbing: "GOOD",
      doors: "GOOD",
      cleanliness: "GOOD",
    },
    lastInspection: "27 Sep 2026",
    timeline: [],
  },
];

/* =========================================================
   ROOMS PAGE
========================================================= */

const Rooms = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [selectedRoomId, setSelectedRoomId] = useState(1);

  const [search, setSearch] = useState("");
  const [floor, setFloor] = useState("all");

  const [showInspection, setShowInspection] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);

  const selectedRoom = rooms.find(
    (room) => room.id === selectedRoomId
  );

  /* Filter rooms */
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch = room.roomNumber
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFloor =
        floor === "all" || room.floor === Number(floor);

      return matchesSearch && matchesFloor;
    });
  }, [rooms, search, floor]);

  /* Room statistics */
  const stats = {
    good: rooms.filter((r) => r.status === "GOOD").length,
    inspection: rooms.filter(
      (r) => r.status === "NEEDS_INSPECTION"
    ).length,
    repair: rooms.filter(
      (r) => r.status === "NEEDS_REPAIR"
    ).length,
    critical: rooms.filter(
      (r) => r.status === "CRITICAL"
    ).length,
  };

  /* Save inspection */
  const handleInspectionSave = (inspection) => {
    if (!selectedRoom) return;

    setRooms((currentRooms) =>
      currentRooms.map((room) => {
        if (room.id !== selectedRoom.id) {
          return room;
        }

        return {
          ...room,
          status: inspection.status,
          condition: inspection.condition,
          lastInspection: "05 Oct 2026",
          timeline: [
            {
              id: Date.now(),
              date: "05 Oct 2026",
              type: "inspection",
              title: "Room inspection completed",
              description:
                inspection.notes || "Inspection completed.",
            },
            ...room.timeline,
          ],
        };
      })
    );

    setShowInspection(false);
  };

  /* Add new room */
  const handleAddRoom = (newRoom) => {
    const id = Date.now();

    setRooms((current) => [
      ...current,
      {
        id,
        ...newRoom,
        status: "GOOD",
        condition: {
          furniture: "GOOD",
          electricity: "GOOD",
          plumbing: "GOOD",
          doors: "GOOD",
          cleanliness: "GOOD",
        },
        lastInspection: "Not inspected",
        timeline: [
          {
            id: Date.now() + 1,
            date: "05 Oct 2026",
            type: "setup",
            title: "Room setup completed",
            description:
              "Room became ready for residents.",
          },
        ],
      },
    ]);

    setSelectedRoomId(id);
    setShowAddRoom(false);
  };

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Rooms
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage room condition, inspections and history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddRoom(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          <Plus size={18} />
          Add Room
        </button>

      </div>


      {/* =====================================================
          SEARCH + FLOOR FILTER
      ===================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row">

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-teal-500"
          />

        </div>

        <select
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-teal-500"
        >
          <option value="all">All Floors</option>
          <option value="1">Floor 1</option>
          <option value="2">Floor 2</option>
          <option value="3">Floor 3</option>
        </select>

      </div>


      {/* =====================================================
          STATUS SUMMARY
      ===================================================== */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <StatusCard
          icon={CircleCheck}
          label="Good"
          value={stats.good}
          iconClass="bg-teal-50 text-teal-600"
        />

        <StatusCard
          icon={Clock3}
          label="Needs Inspection"
          value={stats.inspection}
          iconClass="bg-amber-50 text-amber-600"
        />

        <StatusCard
          icon={Wrench}
          label="Needs Repair"
          value={stats.repair}
          iconClass="bg-orange-50 text-orange-600"
        />

        <StatusCard
          icon={AlertTriangle}
          label="Critical"
          value={stats.critical}
          iconClass="bg-red-50 text-red-600"
        />

      </div>


      {/* =====================================================
          ROOM SELECTOR
      ===================================================== */}

      <RoomSelector
        rooms={filteredRooms}
        selectedRoomId={selectedRoomId}
        onSelect={setSelectedRoomId}
      />


      {/* =====================================================
          SELECTED ROOM
      ===================================================== */}

      {selectedRoom && (
        <>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* Room Information */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <Building2 size={28} />
              </div>

              <p className="mt-6 text-sm text-slate-400">
                Selected Room
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                Room {selectedRoom.roomNumber}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Floor {selectedRoom.floor} ·{" "}
                {selectedRoom.type} Room
              </p>

              <div className="mt-6">
                <RoomStatus
                  status={selectedRoom.status}
                />
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Last Inspection
                </p>

                <p className="mt-2 text-sm font-medium text-slate-800">
                  {selectedRoom.lastInspection}
                </p>

              </div>

            </div>


            {/* Condition */}

            <div className="xl:col-span-2">

              <RoomCondition
                room={selectedRoom}
                onInspect={() =>
                  setShowInspection(true)
                }
              />

            </div>

          </div>


          {/* Timeline */}

          <RoomTimeline
            timeline={selectedRoom.timeline}
          />

        </>
      )}


      {/* =====================================================
          INSPECTION MODAL
      ===================================================== */}

      {showInspection && selectedRoom && (
        <InspectionModal
          room={selectedRoom}
          onClose={() =>
            setShowInspection(false)
          }
          onSave={handleInspectionSave}
        />
      )}


      {/* =====================================================
          ADD ROOM MODAL
      ===================================================== */}

      {showAddRoom && (
        <AddRoomModal
          onClose={() =>
            setShowAddRoom(false)
          }
          onSave={handleAddRoom}
        />
      )}

    </div>
  );
};


/* =========================================================
   STATUS CARD
========================================================= */

const StatusCard = ({
  icon: Icon,
  label,
  value,
  iconClass,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center gap-3">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={20} />
        </div>

        <div>

          <p className="text-xs text-slate-500">
            {label}
          </p>

          <p className="text-xl font-bold text-slate-900">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
};


/* =========================================================
   ROOM STATUS
========================================================= */

const RoomStatus = ({ status }) => {

  const styles = {
    GOOD: "bg-teal-50 text-teal-700",
    NEEDS_INSPECTION:
      "bg-amber-50 text-amber-700",
    NEEDS_REPAIR:
      "bg-orange-50 text-orange-700",
    CRITICAL:
      "bg-red-50 text-red-700",
  };

  const labels = {
    GOOD: "Good Condition",
    NEEDS_INSPECTION: "Needs Inspection",
    NEEDS_REPAIR: "Needs Repair",
    CRITICAL: "Critical",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status] || styles.GOOD
      }`}
    >
      {labels[status] || "Unknown"}
    </span>
  );
};


/* =========================================================
   ROOM SELECTOR
========================================================= */

const RoomSelector = ({
  rooms,
  selectedRoomId,
  onSelect,
}) => {

  const statusConfig = {
    GOOD: {
      label: "Good",
      icon: CircleCheck,
      badge:
        "bg-teal-50 text-teal-700 border-teal-100",
      dot: "bg-teal-500",
    },

    NEEDS_INSPECTION: {
      label: "Inspect",
      icon: Clock3,
      badge:
        "bg-amber-50 text-amber-700 border-amber-100",
      dot: "bg-amber-500",
    },

    NEEDS_REPAIR: {
      label: "Repair",
      icon: Wrench,
      badge:
        "bg-orange-50 text-orange-700 border-orange-100",
      dot: "bg-orange-500",
    },

    CRITICAL: {
      label: "Critical",
      icon: AlertTriangle,
      badge:
        "bg-red-50 text-red-700 border-red-100",
      dot: "bg-red-500",
    },
  };

  if (!rooms.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
        <p className="text-sm text-slate-500">
          No rooms match your filters.
        </p>
      </div>
    );
  }

  return (
    <div>

      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Your Rooms
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

        {rooms.map((room) => {

          const config =
            statusConfig[room.status] ||
            statusConfig.GOOD;

          const isSelected =
            room.id === selectedRoomId;

          return (
            <button
              key={room.id}
              type="button"
              onClick={() => onSelect(room.id)}
              className={`
                group relative flex flex-col items-center gap-2
                rounded-2xl border p-4 text-center transition
                ${
                  isSelected
                    ? "border-teal-500 bg-teal-50 shadow-sm ring-2 ring-teal-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }
              `}
            >

              <span
                className={`
                  absolute right-3 top-3 h-2.5 w-2.5 rounded-full
                  ${config.dot}
                `}
              />

              <span
                className={`
                  text-2xl font-bold tracking-tight
                  ${
                    isSelected
                      ? "text-teal-800"
                      : "text-slate-900"
                  }
                `}
              >
                {room.roomNumber}
              </span>

              <span
                className={`
                  inline-flex items-center gap-1 rounded-full
                  border px-2.5 py-0.5 text-[11px] font-semibold
                  ${config.badge}
                `}
              >
                {config.label}
              </span>

            </button>
          );
        })}

      </div>

    </div>
  );
};


/* =========================================================
   ROOM CONDITION
========================================================= */

const RoomCondition = ({
  room,
  onInspect,
}) => {

  const conditionLabels = {
    furniture: "Furniture",
    electricity: "Electricity",
    plumbing: "Plumbing",
    doors: "Doors",
    cleanliness: "Cleanliness",
  };

  const statusStyles = {
    GOOD: {
      icon: CheckCircle2,
      className: "text-teal-600",
      label: "Good",
    },

    NEEDS_REPAIR: {
      icon: Wrench,
      className: "text-orange-600",
      label: "Needs Repair",
    },

    NEEDS_INSPECTION: {
      icon: AlertCircle,
      className: "text-amber-600",
      label: "Needs Inspection",
    },

    CRITICAL: {
      icon: AlertCircle,
      className: "text-red-600",
      label: "Critical",
    },
  };

  const items = Object.entries(
    room.condition || {}
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <h3 className="text-lg font-semibold text-slate-900">
            Room Condition
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Last inspected · {room.lastInspection}
          </p>

        </div>

        <button
          type="button"
          onClick={onInspect}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          <ClipboardCheck size={18} />
          Run Inspection
        </button>

      </div>


      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

        {items.map(([key, value]) => {

          const style =
            statusStyles[value] ||
            statusStyles.GOOD;

          const Icon = style.icon;

          return (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3"
            >

              <span className="text-sm font-medium text-slate-700">
                {conditionLabels[key] || key}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 text-sm font-semibold ${style.className}`}
              >
                <Icon size={16} />
                {style.label}
              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
};


/* =========================================================
   ROOM TIMELINE
========================================================= */

const RoomTimeline = ({
  timeline = [],
}) => {

  const typeConfig = {
    inspection: {
      icon: ClipboardCheck,
      color: "bg-teal-500",
      ring: "ring-teal-100",
    },

    cleaning: {
      icon: Sparkles,
      color: "bg-sky-500",
      ring: "ring-sky-100",
    },

    maintenance: {
      icon: Wrench,
      color: "bg-orange-500",
      ring: "ring-orange-100",
    },

    setup: {
      icon: Home,
      color: "bg-slate-500",
      ring: "ring-slate-100",
    },
  };

  if (!timeline.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h3 className="text-lg font-semibold text-slate-900">
          Room Timeline
        </h3>

        <p className="mt-4 text-sm text-slate-500">
          No activity recorded yet for this room.
        </p>

      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h3 className="text-lg font-semibold text-slate-900">
        Room Timeline
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Inspection, cleaning and maintenance history
      </p>

      <div className="relative mt-8 space-y-0">

        {timeline.map((event, index) => {

          const config =
            typeConfig[event.type] || {
              icon: Circle,
              color: "bg-slate-400",
              ring: "ring-slate-100",
            };

          const Icon = config.icon;

          const isLast =
            index === timeline.length - 1;

          return (
            <div
              key={event.id}
              className="relative flex gap-4 pb-8 last:pb-0"
            >

              {!isLast && (
                <div className="absolute left-[15px] top-8 h-[calc(100%-8px)] w-px bg-slate-200" />
              )}

              <div
                className={`
                  relative z-10 flex h-8 w-8 shrink-0
                  items-center justify-center rounded-full
                  ${config.color}
                  text-white ring-4 ${config.ring}
                `}
              >
                <Icon size={14} />
              </div>

              <div className="min-w-0 flex-1 pt-0.5">

                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">

                  <p className="text-sm font-semibold text-slate-900">
                    {event.title}
                  </p>

                  <p className="text-xs text-slate-400">
                    {event.date}
                  </p>

                </div>

                {event.description && (
                  <p className="mt-1 text-sm text-slate-500">
                    {event.description}
                  </p>
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};


/* =========================================================
   INSPECTION MODAL
========================================================= */

const InspectionModal = ({
  room,
  onClose,
  onSave,
}) => {

  const [condition, setCondition] =
    useState({ ...room.condition });

  const [notes, setNotes] =
    useState("");

  const conditionKeys = [
    {
      key: "furniture",
      label: "Furniture",
    },
    {
      key: "electricity",
      label: "Electricity",
    },
    {
      key: "plumbing",
      label: "Plumbing",
    },
    {
      key: "doors",
      label: "Doors",
    },
    {
      key: "cleanliness",
      label: "Cleanliness",
    },
  ];

  const options = [
    {
      value: "GOOD",
      label: "Good",
      icon: CheckCircle2,
      active:
        "border-teal-500 bg-teal-50 text-teal-700",
    },
    {
      value: "NEEDS_REPAIR",
      label: "Needs Repair",
      icon: Wrench,
      active:
        "border-orange-500 bg-orange-50 text-orange-700",
    },
    {
      value: "CRITICAL",
      label: "Critical",
      icon: AlertCircle,
      active:
        "border-red-500 bg-red-50 text-red-700",
    },
  ];

  const deriveOverallStatus = (condition) => {

    const values = Object.values(condition);

    if (values.includes("CRITICAL")) {
      return "CRITICAL";
    }

    if (values.includes("NEEDS_REPAIR")) {
      return "NEEDS_REPAIR";
    }

    return "GOOD";
  };

  const handleConditionChange = (
    key,
    value
  ) => {
    setCondition((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    const status =
      deriveOverallStatus(condition);

    onSave({
      condition,
      status,
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">

      {/* Overlay */}

      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />


      {/* Modal */}

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Run Inspection
            </h2>

            <p className="text-sm text-slate-500">
              Room {room.roomNumber}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>

        </div>


        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">

            {conditionKeys.map(
              ({ key, label }) => (

                <div key={key}>

                  <p className="mb-2 text-sm font-medium text-slate-700">
                    {label}
                  </p>

                  <div className="grid grid-cols-3 gap-2">

                    {options.map((opt) => {

                      const Icon = opt.icon;

                      const isActive =
                        condition[key] ===
                        opt.value;

                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            handleConditionChange(
                              key,
                              opt.value
                            )
                          }
                          className={`
                            flex flex-col items-center gap-1
                            rounded-xl border px-2 py-3
                            text-xs font-semibold transition
                            ${
                              isActive
                                ? opt.active
                                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                            }
                          `}
                        >
                          <Icon size={18} />
                          {opt.label}
                        </button>
                      );
                    })}

                  </div>

                </div>
              )
            )}


            {/* Notes */}

            <div>

              <label
                htmlFor="inspection-notes"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Notes (optional)
              </label>

              <textarea
                id="inspection-notes"
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                rows={3}
                placeholder="Any observations or follow-up actions..."
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />

            </div>

          </div>


          {/* Footer */}

          <div className="flex gap-3 border-t border-slate-100 px-5 py-4">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Save Inspection
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};


/* =========================================================
   ADD ROOM MODAL
========================================================= */

const AddRoomModal = ({
  onClose,
  onSave,
}) => {

  const [roomNumber, setRoomNumber] =
    useState("");

  const [floor, setFloor] =
    useState("1");

  const [type, setType] =
    useState("Shared");

  const [error, setError] =
    useState("");

  const handleSubmit = (e) => {

    e.preventDefault();

    const trimmed =
      roomNumber.trim();

    if (!trimmed) {
      setError(
        "Room number is required."
      );
      return;
    }

    onSave({
      roomNumber: trimmed,
      floor: Number(floor),
      type,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">

      {/* Overlay */}

      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />


      {/* Modal */}

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <h2 className="text-lg font-semibold text-slate-900">
            Add Room
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>

        </div>


        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-5 py-5"
        >

          {/* Room Number */}

          <div>

            <label
              htmlFor="room-number"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Room Number
            </label>

            <input
              id="room-number"
              value={roomNumber}
              onChange={(e) => {
                setRoomNumber(
                  e.target.value
                );
                setError("");
              }}
              placeholder="e.g. 106"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              autoFocus
            />

            {error && (
              <p className="mt-1.5 text-xs text-red-600">
                {error}
              </p>
            )}

          </div>


          {/* Floor */}

          <div>

            <label
              htmlFor="floor"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Floor
            </label>

            <select
              id="floor"
              value={floor}
              onChange={(e) =>
                setFloor(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="1">
                Floor 1
              </option>

              <option value="2">
                Floor 2
              </option>

              <option value="3">
                Floor 3
              </option>
            </select>

          </div>


          {/* Room Type */}

          <div>

            <label
              htmlFor="type"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Room Type
            </label>

            <select
              id="type"
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="Shared">
                Shared
              </option>

              <option value="Private">
                Private
              </option>
            </select>

          </div>


          {/* Buttons */}

          <div className="flex gap-3 pt-1">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Add Room
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};


/* =========================================================
   EXPORT
========================================================= */

export default Rooms;