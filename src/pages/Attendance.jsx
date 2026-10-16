import { useNavigate } from "react-router-dom";
import useStorage from "../hooks/useStorage";

function getColor(percent) {
  if (percent >= 75)
    return { bar: "#7c6ff7", text: "text-violet-400", warn: false };
  if (percent >= 60)
    return { bar: "#D85A30", text: "text-orange-400", warn: true };
  return { bar: "#E24B4A", text: "text-red-400", warn: true };
}

// summary card per subject showing full semester %
function SubjectSummary({ name, data }) {
  const percent =
    data.total === 0 ? 0 : (data.present / data.total) * 100;
  const color = getColor(percent);

  return (
    <div className="bg-[#1a1a22] rounded-2xl p-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-gray-100">{name}</p>
        <span className={`text-sm font-semibold ${color.text}`}>
          {percent.toFixed(2)}%
        </span>
      </div>
      <div className="h-1.5 bg-[#2a2a35] rounded-full mb-1">
        <div
          className="h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${percent}%`, background: color.bar }}
        />
      </div>
      <p className="text-xs text-gray-600">
        {data.present} / {data.total} classes
      </p>
      {color.warn && (
        <p className="text-xs text-orange-500 mt-1">⚠ Below 75%</p>
      )}
    </div>
  );
}

// card for each class slot today
function TodayClassCard({ slot, status, onMark }) {
  const statusStyles = {
    present: "bg-violet-600 text-white",
    absent: "bg-red-700 text-white",
    holiday: "bg-[#2a2a35] text-gray-500",
    unmarked: "",
  };

  return (
    <div
      className={`bg-[#1a1a22] rounded-2xl p-4 ${status === "holiday" ? "opacity-60" : ""}`}
    >
      {/* Class info */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm font-medium text-gray-100">{slot.subject}</p>
          <p className="text-xs text-gray-600 mt-0.5">
            {slot.start} – {slot.end} · {slot.room}
          </p>
        </div>
        {status !== "unmarked" && (
          <span
            className={`text-xs px-2 py-1 rounded-lg capitalize font-medium ${statusStyles[status]}`}
          >
            {status}
          </span>
        )}
      </div>

      {/* Action buttons */}
      {status === "holiday" ? (
        <button
          onClick={() => onMark(slot.id, "unmarked")}
          className="w-full py-2 rounded-xl text-xs font-medium bg-[#2a2a35] text-gray-500 hover:text-gray-300 transition-colors"
        >
          Undo Holiday
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => onMark(slot.id, "present")}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors
                ${
                  status === "present"
                    ? "bg-violet-600 text-white"
                    : "bg-[#2a2040] text-violet-300 hover:bg-violet-700 hover:text-white"
                }`}
          >
            Present
          </button>
          <button
            onClick={() => onMark(slot.id, "absent")}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors
                ${
                  status === "absent"
                    ? "bg-red-700 text-white"
                    : "bg-[#2a1a1a] text-red-400 hover:bg-red-700 hover:text-white"
                }`}
          >
            Absent
          </button>
          <button
            onClick={() => onMark(slot.id, "holiday")}
            className="flex-1 py-2 rounded-xl text-xs font-medium bg-[#1e1e24] text-gray-500 hover:text-gray-300 transition-colors"
          >
            Holiday
          </button>
        </div>
      )}
    </div>
  );
}

function PredictorCard({ subjects, attendance }) {
  // per subject prediction
  const rows = subjects.map((name) => {
    const d = attendance[name] || { present: 0, total: 0 };
    const percent = d.total === 0 ? 0 : (d.present / d.total) * 100;

    if (d.total === 0) return { name, status: "nodata" };

    if (percent >= 75) {
      const canSkip = Math.floor((d.present - 0.75 * d.total) / 0.75);
      return { name, status: "safe", canSkip };
    } else {
      const mustAttend = Math.ceil((0.75 * d.total - d.present) / 0.25);
      return { name, status: "danger", mustAttend };
    }
  });

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => {
        if (row.status === "nodata")
          return (
            <div
              key={row.name}
              className="bg-[#1a1a22] rounded-2xl px-4 py-3 flex justify-between items-center"
            >
              <span className="text-sm text-gray-200">{row.name}</span>
              <span className="text-xs text-gray-600">No data yet</span>
            </div>
          );

        if (row.status === "safe")
          return (
            <div key={row.name} className="bg-[#1a1a22] rounded-2xl px-4 py-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-200">{row.name}</span>
                <span className="text-xs bg-[#2a2040] text-violet-300 px-2 py-1 rounded-lg font-medium">
                  Safe
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                You can skip{" "}
                <span className="text-violet-400 font-medium">
                  {row.canSkip} more {row.canSkip === 1 ? "class" : "classes"}
                </span>{" "}
                and stay above 75%
              </p>
            </div>
          );

        return (
          <div key={row.name} className="bg-[#1a1a22] rounded-2xl px-4 py-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-200">{row.name}</span>
              <span className="text-xs bg-[#2e1010] text-red-400 px-2 py-1 rounded-lg font-medium">
                Danger
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Attend next{" "}
              <span className="text-red-400 font-medium">
                {row.mustAttend} {row.mustAttend === 1 ? "class" : "classes"}
              </span>{" "}
              consecutively to reach 75%
            </p>
          </div>
        );
      })}
    </div>
  );
}

function Attendance() {
  const [subjects] = useStorage("ae_subjects", []);
  const [timetable] = useStorage("ae_timetable", {});
  const [attendance, saveAttendance] = useStorage("ae_attendance", {});
  // sessions = { "2024-04-05": { slotId: "present"|"absent"|"holiday" } }
  const [sessions, saveSessions] = useStorage("ae_sessions", {});
  const navigate = useNavigate();

  // get today's key and slots
  const todayKey = new Date().toISOString().split("T")[0];
  const todayName = new Date()
    .toLocaleDateString("en-US", { weekday: "short" })
    .slice(0, 3);
  const todaySlots = timetable[todayName] || [];
  const todaySession = sessions[todayKey] || {};
  const isHoliday =
    todaySlots.length > 0 &&
    todaySlots.every((s) => todaySession[s.id] === "holiday");

  // mark a single class
  function markClass(slotId, status) {
    const slot = todaySlots.find((s) => s.id === slotId);
    if (!slot) return;

    const prev = todaySession[slotId];
    const updated = { ...todaySession, [slotId]: status };
    saveSessions({ ...sessions, [todayKey]: updated });

    // reverse previous mark first
    const subjectData = attendance[slot.subject] || { present: 0, total: 0 };
    let { present, total } = subjectData;

    if (prev === "present") {
      present -= 1;
      total -= 1;
    }
    if (prev === "absent") {
      total -= 1;
    }

    // apply new mark (holiday and unmarked = don't count)
    if (status === "present") {
      present += 1;
      total += 1;
    }
    if (status === "absent") {
      total += 1;
    }
    // status === "holiday" or "unmarked" → nothing added

    saveAttendance({
      ...attendance,
      [slot.subject]: { present, total },
    });
  }

  // mark whole day holiday
  function markWholeHoliday() {
    const updated = {};
    todaySlots.forEach((s) => {
      updated[s.id] = "holiday";
    });

    // reverse any attendance already marked today
    const newAttendance = { ...attendance };
    todaySlots.forEach((slot) => {
      const prev = todaySession[slot.id];
      if (prev === "present" || prev === "absent") {
        const d = newAttendance[slot.subject] || { present: 0, total: 0 };
        let { present, total } = d;
        if (prev === "present") {
          present -= 1;
          total -= 1;
        }
        if (prev === "absent") {
          total -= 1;
        }
        newAttendance[slot.subject] = { present, total };
      }
    });

    saveSessions({ ...sessions, [todayKey]: updated });
    saveAttendance(newAttendance);
  }

  // undo whole day holiday
  function undoWholeHoliday() {
    const updated = {};
    todaySlots.forEach((s) => {
      updated[s.id] = "unmarked";
    });
    saveSessions({ ...sessions, [todayKey]: updated });
  }

  // overall stats
  const totalPresent = subjects.reduce(
    (sum, s) => sum + (attendance[s]?.present || 0),
    0,
  );
  const totalClasses = subjects.reduce(
    (sum, s) => sum + (attendance[s]?.total || 0),
    0,
  );
  // const overall =
  //   totalClasses === 0 ? 0 : Math.round((totalPresent / totalClasses) * 100);
   const overall =
    totalClasses === 0 ? 0 : (totalPresent / totalClasses) * 100;

console.log({
  totalPresent,
  totalClasses,
  overall,
  formatted: overall.toFixed(2)
});
  
  if (subjects.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-600 text-sm">No subjects added yet.</p>
        <button
          onClick={() => navigate("/settings")}
          className="text-violet-400 text-sm border border-violet-800 px-4 py-2 rounded-xl hover:bg-violet-900 transition-colors"
        >
          Go to Settings →
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center px-5 pt-10 pb-4">
        <h1 className="text-xl font-medium tracking-tight">Attendance</h1>
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium
          ${overall >= 75 ? "bg-[#2a2040] text-violet-300" : "bg-[#2e1a0e] text-orange-400"}`}
        >
          Overall {overall.toFixed(2)}%
        </span>
      </div>

      {/* TODAY'S CLASSES */}
      {todaySlots.length > 0 && (
        <div className="px-4 mb-6">
          {/* Section header + whole day holiday btn */}
          <div className="flex justify-between items-center mb-3">
            <p className="text-[11px] text-gray-600 uppercase tracking-widest font-medium">
              Today — {todayName}
            </p>
            <button
              onClick={isHoliday ? undoWholeHoliday : markWholeHoliday}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-medium
                ${
                  isHoliday
                    ? "bg-[#2a2a35] text-gray-500 hover:text-gray-300"
                    : "bg-[#1e1e24] text-gray-500 hover:text-yellow-400 border border-[#2a2a35]"
                }`}
            >
              {isHoliday ? "Undo Holiday" : "🎉 Whole Day Off"}
            </button>
          </div>

          {/* Class cards */}
          <div className="flex flex-col gap-3">
            {todaySlots.map((slot) => (
              <TodayClassCard
                key={slot.id}
                slot={slot}
                status={todaySession[slot.id] || "unmarked"}
                onMark={markClass}
              />
            ))}
          </div>
        </div>
      )}

      {todaySlots.length === 0 && (
        <div className="px-4 mb-6">
          <div className="bg-[#1a1a22] rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-600">No classes today</p>
          </div>
        </div>
      )}

      {/* SEMESTER OVERVIEW */}
      <div className="px-4 pb-6">
        <p className="text-[11px] text-gray-600 uppercase tracking-widest font-medium mb-3">
          Semester Overview
        </p>
        <div className="flex flex-col gap-3">
          {subjects.map((name) => (
            <SubjectSummary
              key={name}
              name={name}
              data={attendance[name] || { present: 0, total: 0 }}
            />
          ))}
        </div>
      </div>
      {/* PREDICTOR */}
      {subjects.length > 0 && (
        <div className="px-4 pb-6">
          <p className="text-[11px] text-gray-600 uppercase tracking-widest font-medium mb-3">
            Predictor
          </p>
          <PredictorCard subjects={subjects} attendance={attendance} />
        </div>
      )}
    </div>
  );
}

export default Attendance;
