import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DayTabs from "../components/DayTabs";
import ClassList from "../components/ClassList";
import useStorage from "../hooks/useStorage";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Timetable() {
  const [timetable] = useStorage("ae_timetable", {});
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "short" })
    .slice(0, 3);
  const [activeDay, setActiveDay] = useState(
    DAYS.includes(today) ? today : "Mon",
  );
  const navigate = useNavigate();

  const hasAnyData = Object.values(timetable).some((d) => d.length > 0);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex justify-between items-center px-5 pt-10 pb-4">
        <h1 className="text-xl font-medium tracking-tight">AttendEase</h1>
        <span className="text-xs text-gray-500 bg-[#1e1e24] px-3 py-1 rounded-full">
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>

      <DayTabs days={DAYS} activeDay={activeDay} onSelect={setActiveDay} />

      {!hasAnyData ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <p className="text-gray-600 text-sm">No timetable set up yet.</p>
          <button
            onClick={() => navigate("/settings")}
            className="text-violet-400 text-sm border border-violet-800 px-4 py-2 rounded-xl hover:bg-violet-900 transition-colors"
          >
            Go to Settings →
          </button>
        </div>
      ) : (
        <ClassList classes={timetable[activeDay] || []} />
      )}
    </div>
  );
}

export default Timetable;
