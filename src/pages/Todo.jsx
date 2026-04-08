import { useState } from "react";
import useStorage from "../hooks/useStorage";

function Todo() {
  const [todos, saveTodos] = useStorage("ae_todos", []);
  const [input, setInput] = useState("");

  function addTodo() {
    if (input.trim() === "") return;
    saveTodos([...todos, { id: Date.now(), text: input.trim(), done: false }]);
    setInput("");
  }

  function toggleTodo(id) {
    saveTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTodo(id) {
    saveTodos(todos.filter((t) => t.id !== id));
  }

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex justify-between items-center px-5 pt-10 pb-4">
        <h1 className="text-xl font-medium tracking-tight">Todo</h1>
        {todos.length > 0 && (
          <span className="text-xs text-gray-500 bg-[#1e1e24] px-3 py-1 rounded-full">
            {remaining} remaining
          </span>
        )}
      </div>

      <div className="flex gap-2 px-4 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a task..."
          className="flex-1 bg-[#1a1a22] text-sm text-gray-200 placeholder-gray-600 px-4 py-3 rounded-xl border border-[#2a2a35] focus:outline-none focus:border-violet-500"
        />
        <button
          onClick={addTodo}
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-3 rounded-xl transition-colors"
        >
          Add
        </button>
      </div>

      {todos.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 text-sm">No tasks yet. Add one above!</p>
        </div>
      )}

      <div className="flex flex-col gap-2 px-4 pb-6">
        {todos
          .filter((t) => !t.done)
          .map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 bg-[#1a1a22] px-4 py-3 rounded-xl"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className="w-5 h-5 rounded-full border border-[#3a3a45] flex-shrink-0 hover:border-violet-500 transition-colors"
              />
              <span className="flex-1 text-sm text-gray-200">{todo.text}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-700 hover:text-red-400 text-xs transition-colors px-1"
              >
                ✕
              </button>
            </div>
          ))}

        {todos.some((t) => t.done) && (
          <div className="flex items-center gap-3 mt-2 mb-1">
            <div className="flex-1 h-px bg-[#2a2a35]" />
            <span className="text-xs text-gray-700">completed</span>
            <div className="flex-1 h-px bg-[#2a2a35]" />
          </div>
        )}

        {todos
          .filter((t) => t.done)
          .map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 bg-[#161618] px-4 py-3 rounded-xl"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className="w-5 h-5 rounded-full bg-violet-600 flex-shrink-0 flex items-center justify-center"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5l2.5 2.5L8 3"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="flex-1 text-sm text-gray-600 line-through">
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-700 hover:text-red-400 text-xs transition-colors px-1"
              >
                ✕
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Todo;
