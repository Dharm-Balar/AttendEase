import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Timetable from "./pages/Timetable";
import Attendance from "./pages/Attendance";
import Grades from "./pages/Grades";
import Todo from "./pages/Todo";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="fixed inset-0 bg-[#111318] text-white flex justify-center">
        <div className="w-full max-w-sm flex flex-col h-full">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Timetable />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/grades" element={<Grades />} />
              <Route path="/todo" element={<Todo />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>

          {/* Always fixed at bottom */}
          <BottomNav />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
