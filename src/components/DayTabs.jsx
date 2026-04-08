function DayTabs({ days, activeDay, onSelect }) {
  return (
    <div className="flex gap-2 px-4 pb-4 overflow-x-auto">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => onSelect(day)}
          className={`flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-xl transition-colors
            ${
              activeDay === day
                ? "bg-violet-600 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
        >
          <span className="text-xs font-medium">{day}</span>
        </button>
      ))}
    </div>
  );
}

export default DayTabs;
