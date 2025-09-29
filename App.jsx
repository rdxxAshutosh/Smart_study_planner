import { useEffect, useState } from "react";
import Recommendations from "./components/Recommendations";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

const API = import.meta.env.DEV ? "http://localhost:5000" : "";

export default function App() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    const res = await fetch(`${API}/api/todos`);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Smart Study Planner
        </h1>

        {/* Todo Form */}
        <div className="mb-6">
          <TodoForm onAdded={fetchTodos} />
        </div>

        {/* Todo List */}
        <div className="mb-6">
          <TodoList todos={todos} onChanged={fetchTodos} />
        </div>

        {/* AI Recommendations */}
        <div className="mt-6">
          <Recommendations todos={todos} />
        </div>
      </div>
    </div>
  );
}
