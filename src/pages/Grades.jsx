import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStorage from "../hooks/useStorage";

function getGradeColor(percent) {
  if (percent >= 80)
    return { text: "text-violet-400", bg: "bg-[#2a2040]", bar: "#7c6ff7" };
  if (percent >= 60)
    return { text: "text-teal-400", bg: "bg-[#0d2e22]", bar: "#1D9E75" };
  if (percent >= 40)
    return { text: "text-orange-400", bg: "bg-[#2e1a0e]", bar: "#D85A30" };
  return { text: "text-red-400", bg: "bg-[#2e1010]", bar: "#E24B4A" };
}

function SubjectCard({ name, exams }) {
  const [expanded, setExpanded] = useState(false);

  const totalMarks = exams.reduce((sum, e) => sum + e.marks, 0);
  const totalPossible = exams.reduce((sum, e) => sum + e.total, 0);
  const percent =
    totalPossible === 0 ? 0 : Math.round((totalMarks / totalPossible) * 100);
  const color = getGradeColor(percent);

  return (
    <div className="bg-[#1a1a22] rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-between items-center p-4"
      >
        <div className="text-left">
          <p className="text-sm font-medium text-gray-100">{name}</p>
          <p className="text-xs text-gray-600 mt-0.5">
            {exams.length === 0
              ? "No exams yet"
              : `${totalMarks} / ${totalPossible} marks`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {exams.length > 0 && (
            <span
              className={`text-xs font-medium px-2 py-1 rounded-lg ${color.bg} ${color.text}`}
            >
              {percent}%
            </span>
          )}
          <span className="text-gray-600 text-xs">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {exams.length > 0 && (
        <div className="h-1 bg-[#2a2a35] mx-4">
          <div
            className="h-1 rounded-full transition-all"
            style={{ width: `${percent}%`, background: color.bar }}
          />
        </div>
      )}

      {expanded && (
        <div className="px-4 pt-3 pb-4 flex flex-col gap-2 mt-1">
          {exams.length === 0 ? (
            <p className="text-xs text-gray-600 text-center py-2">
              No exams added yet.
            </p>
          ) : (
            exams.map((exam) => {
              const ep = Math.round((exam.marks / exam.total) * 100);
              const ec = getGradeColor(ep);
              return (
                <div
                  key={exam.id}
                  className="flex justify-between items-center py-2 border-t border-[#2a2a35]"
                >
                  <span className="text-xs text-gray-500">{exam.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {exam.marks}/{exam.total}
                    </span>
                    <span className={`text-xs font-medium ${ec.text}`}>
                      {ep}%
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function Grades() {
  const [subjects] = useStorage("ae_subjects", []);
  const [exams] = useStorage("ae_exams", {});
  const navigate = useNavigate();

  const allExams = subjects.flatMap((s) => exams[s] || []);
  const totalMarks = allExams.reduce((sum, e) => sum + e.marks, 0);
  const totalPoss = allExams.reduce((sum, e) => sum + e.total, 0);
  const overall =
    totalPoss === 0 ? 0 : Math.round((totalMarks / totalPoss) * 100);
  const oc = getGradeColor(overall);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex justify-between items-center px-5 pt-10 pb-4">
        <h1 className="text-xl font-medium tracking-tight">Grades</h1>
        {subjects.length > 0 && allExams.length > 0 && (
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${oc.bg} ${oc.text}`}
          >
            Overall {overall}%
          </span>
        )}
      </div>

      {subjects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <p className="text-gray-600 text-sm">No subjects added yet.</p>
          <button
            onClick={() => navigate("/settings")}
            className="text-violet-400 text-sm border border-violet-800 px-4 py-2 rounded-xl hover:bg-violet-900 transition-colors"
          >
            Go to Settings →
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-4 pb-6">
          {subjects.map((name) => (
            <SubjectCard key={name} name={name} exams={exams[name] || []} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Grades;
