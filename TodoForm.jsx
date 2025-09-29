import { useState } from "react";
const API = "http://localhost:5000";

export default function TodoForm({ onAdded }) {
  const [title, setTitle] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(`${API}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    onAdded && onAdded();
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-center space-x-3 mb-6 bg-white shadow-sm border rounded-lg p-3"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add todo (e.g., Read ch 3 of Algorithms)"
        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
      >
        Add
      </button>
    </form>
  );
}
