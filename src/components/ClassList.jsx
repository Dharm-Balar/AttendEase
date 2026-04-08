const typeColors = {
  Lecture: { accent: "#7c6ff7", badge: "bg-[#2a2040] text-[#a99eff]" },
  Practical: { accent: "#D85A30", badge: "bg-[#2e1a0e] text-[#F0997B]" },
  Tutorial: { accent: "#1D9E75", badge: "bg-[#0d2e22] text-[#5DCAA5]" },
};

function ClassCard({ subject, room, type, start, end }) {
  const color = typeColors[type] || typeColors.Lecture;

  return (
    <div className="flex gap-3 items-stretch">
      {/* Time column */}
      <div className="flex flex-col items-end min-w-[44px] pt-1 gap-1">
        <span className="text-xs text-gray-400 font-medium">{start}</span>
        <span className="text-xs text-gray-600">{end}</span>
      </div>

      {/* Accent line */}
      <div
        className="w-[3px] rounded-full flex-shrink-0"
        style={{ background: color.accent }}
      />

      {/* Card */}
      <div className="flex-1 bg-[#1a1a22] rounded-xl px-3 py-2 mb-1">
        <p className="text-sm font-medium text-gray-100 mb-1">{subject}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">{room}</span>
          <span
            className={`text-[10px] font-medium px-2 py-[2px] rounded-md ${color.badge}`}
          >
            {type}
          </span>
        </div>
      </div>
    </div>
  );
}

function ClassList({ classes }) {
  if (classes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-600 text-sm">No classes today</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 pt-2">
      <p className="text-[11px] text-gray-600 uppercase tracking-widest font-medium">
        Classes — {classes.length} today
      </p>
      {classes.map((cls) => (
        <ClassCard key={cls.id} {...cls} />
      ))}
    </div>
  );
}

export default ClassList;
