import { useState } from "react";
import useStorage from "../hooks/useStorage";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TYPES = ["Lecture", "Practical", "Tutorial"];

function EmptyNote({ text }) {
  return <p className="text-xs text-gray-600 text-center py-4">{text}</p>;
}

function SubjectsTab({ subjects, saveSubjects }) {
  const [input, setInput] = useState("");

  function addSubject() {
    if (input.trim() === "" || subjects.includes(input.trim())) return;
    saveSubjects([...subjects, input.trim()]);
    setInput("");
  }

  function ClearData() {
    localStorage.clear();
    window.location.reload();
  }

  function deleteSubject(name) {
    saveSubjects(subjects.filter((s) => s !== name));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSubject()}
          placeholder="Subject name..."
          className="flex-1 bg-[#1a1a22] text-sm text-gray-200 placeholder-gray-600 px-4 py-3 rounded-xl border border-[#2a2a35] focus:outline-none focus:border-violet-500"
        />
        <button
          onClick={addSubject}
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 rounded-xl transition-colors"
        >
          Add
        </button>
      </div>

      <button
        className="h-14 w-full bg-red-500 rounded-2xl"
        onClick={ClearData}
      >
        Clear Data
      </button>

      {subjects.length === 0 ? (
        <EmptyNote text="No subjects yet. Add one above." />
      ) : (
        subjects.map((s) => (
          <div
            key={s}
            className="flex justify-between items-center bg-[#1a1a22] px-4 py-3 rounded-xl"
          >
            <span className="text-sm text-gray-200">{s}</span>
            <button
              onClick={() => deleteSubject(s)}
              className="text-gray-600 hover:text-red-400 text-xs transition-colors"
            >
              ✕
            </button>
          </div>
        ))
      )}
    </div>
  );
}

function TimetableTab({ subjects, timetable, saveTimetable }) {
  const [activeDay, setActiveDay] = useState("Mon");
  const [form, setForm] = useState({
    subject: "",
    room: "",
    type: "Lecture",
    start: "",
    end: "",
  });

  function addSlot() {
    if (!form.subject || !form.start || !form.end) return;
    const daySlots = timetable[activeDay] || [];
    const newSlot = { ...form, id: Date.now() };
    saveTimetable({ ...timetable, [activeDay]: [...daySlots, newSlot] });
    setForm({ subject: "", room: "", type: "Lecture", start: "", end: "" });
  }

  function deleteSlot(id) {
    const daySlots = (timetable[activeDay] || []).filter((s) => s.id !== id);
    saveTimetable({ ...timetable, [activeDay]: daySlots });
  }

  const inputCls =
    "bg-[#1a1a22] text-sm text-gray-200 placeholder-gray-600 px-3 py-2.5 rounded-xl border border-[#2a2a35] focus:outline-none focus:border-violet-500";

  return (
    <div className="flex flex-col gap-4">
      {/* Day picker */}
      <div className="flex gap-2 flex-wrap">
        {DAYS.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${activeDay === d ? "bg-violet-600 text-white" : "bg-[#1a1a22] text-gray-500 hover:text-gray-300"}`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Form */}
      {subjects.length === 0 ? (
        <EmptyNote text="Add subjects first before adding timetable slots." />
      ) : (
        <div className="flex flex-col gap-2">
          <select
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className={inputCls + " w-full"}
          >
            <option value="">Select subject...</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            value={form.room}
            onChange={(e) => setForm({ ...form, room: e.target.value })}
            placeholder="Room (e.g. Room 101)"
            className={inputCls + " w-full"}
          />

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={inputCls + " w-full"}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <div className="flex gap-2 w-full">
            <input
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
              placeholder="Start (9:00)"
              className={inputCls + " flex-1 w-1/2"}
            />
            <input
              value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
              placeholder="End (10:00)"
              className={inputCls + " flex-1 w-1/2"}
            />
          </div>

          <button
            onClick={addSlot}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white text-sm py-2.5 rounded-xl transition-colors"
          >
            Add to {activeDay}
          </button>
        </div>
      )}

      {/* Slots list */}
      <div className="flex flex-col gap-2">
        {(timetable[activeDay] || []).length === 0 ? (
          <EmptyNote text={`No classes on ${activeDay} yet.`} />
        ) : (
          (timetable[activeDay] || []).map((slot) => (
            <div
              key={slot.id}
              className="flex justify-between items-center bg-[#1a1a22] px-4 py-3 rounded-xl"
            >
              <div>
                <p className="text-sm text-gray-200">{slot.subject}</p>
                <p className="text-xs text-gray-600">
                  {slot.start} – {slot.end} · {slot.room} · {slot.type}
                </p>
              </div>
              <button
                onClick={() => deleteSlot(slot.id)}
                className="text-gray-600 hover:text-red-400 text-xs transition-colors ml-2"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ExamsTab({ subjects, exams, saveExams }) {
  const [activeSubject, setActiveSubject] = useState("");
  const [form, setForm] = useState({ name: "", marks: "", total: "" });

  function addExam() {
    if (!activeSubject || !form.name || !form.marks || !form.total) return;
    const subjectExams = exams[activeSubject] || [];
    const newExam = {
      id: Date.now(),
      name: form.name,
      marks: Number(form.marks),
      total: Number(form.total),
    };
    saveExams({ ...exams, [activeSubject]: [...subjectExams, newExam] });
    setForm({ name: "", marks: "", total: "" });
  }

  function deleteExam(subject, id) {
    const updated = (exams[subject] || []).filter((e) => e.id !== id);
    saveExams({ ...exams, [subject]: updated });
  }

  const inputCls =
    "bg-[#1a1a22] text-sm text-gray-200 placeholder-gray-600 px-3 py-2.5 rounded-xl border border-[#2a2a35] focus:outline-none focus:border-violet-500";

  return (
    <div className="flex flex-col gap-4">
      {subjects.length === 0 ? (
        <EmptyNote text="Add subjects first before adding exams." />
      ) : (
        <>
          {/* Subject picker */}
          <select
            value={activeSubject}
            onChange={(e) => setActiveSubject(e.target.value)}
            className={inputCls + " w-full"}
          >
            <option value="">Select subject...</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Exam form */}
          {activeSubject && (
            <div className="flex flex-col gap-2">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Exam name (e.g. Unit Test 1)"
                className={inputCls + " w-full"}
              />
              <div className="flex gap-2">
                <input
                  value={form.marks}
                  onChange={(e) => setForm({ ...form, marks: e.target.value })}
                  placeholder="Marks got"
                  type="number"
                  className={inputCls + " flex-1"}
                />
                <input
                  value={form.total}
                  onChange={(e) => setForm({ ...form, total: e.target.value })}
                  placeholder="Total marks"
                  type="number"
                  className={inputCls + " flex-1"}
                />
              </div>
              <button
                onClick={addExam}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white text-sm py-2.5 rounded-xl transition-colors"
              >
                Add Exam
              </button>
            </div>
          )}

          {/* Exams list */}
          {activeSubject && (
            <div className="flex flex-col gap-2">
              {(exams[activeSubject] || []).length === 0 ? (
                <EmptyNote text="No exams added for this subject yet." />
              ) : (
                (exams[activeSubject] || []).map((exam) => (
                  <div
                    key={exam.id}
                    className="flex justify-between items-center bg-[#1a1a22] px-4 py-3 rounded-xl"
                  >
                    <div>
                      <p className="text-sm text-gray-200">{exam.name}</p>
                      <p className="text-xs text-gray-600">
                        {exam.marks} / {exam.total}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteExam(activeSubject, exam.id)}
                      className="text-gray-600 hover:text-red-400 text-xs transition-colors ml-2"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Settings() {
  const [subjects, saveSubjects] = useStorage("ae_subjects", []);
  const [timetable, saveTimetable] = useStorage("ae_timetable", {});
  const [exams, saveExams] = useStorage("ae_exams", {});
  const [activeTab, setActiveTab] = useState("subjects");

  const tabs = ["subjects", "timetable", "exams"];

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-10 pb-4">
        <h1 className="text-xl font-medium tracking-tight">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-colors
              ${
                activeTab === tab
                  ? "bg-violet-600 text-white"
                  : "bg-[#1a1a22] text-gray-500 hover:text-gray-300"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-4 pb-6">
        {activeTab === "subjects" && (
          <SubjectsTab subjects={subjects} saveSubjects={saveSubjects} />
        )}
        {activeTab === "timetable" && (
          <TimetableTab
            subjects={subjects}
            timetable={timetable}
            saveTimetable={saveTimetable}
          />
        )}
        {activeTab === "exams" && (
          <ExamsTab subjects={subjects} exams={exams} saveExams={saveExams} />
        )}
      </div>
    </div>
  );
}

export default Settings;
