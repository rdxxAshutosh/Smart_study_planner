const API = "http://localhost:5000";

export default function TodoList({ todos, onChanged }) {
  const toggleComplete = async (t) => {
    await fetch(`${API}/api/todos/${t._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...t, completed: !t.completed }),
    });
    onChanged && onChanged();
  };

  const remove = async (id) => {
    await fetch(`${API}/api/todos/${id}`, { method: "DELETE" });
    onChanged && onChanged();
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Todos</h2>
      {todos.length === 0 ? (
        <p className="text-gray-500 italic">No todos yet. Add one above!</p>
      ) : (
        <ul className="space-y-3">
          {todos.map((t) => (
            <li
              key={t._id}
              className="flex items-center justify-between bg-white px-4 py-2 rounded-md shadow-sm border hover:shadow-md transition"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleComplete(t)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span
                  className={`${
                    t.completed ? "line-through text-gray-400" : "text-gray-800"
                  } font-medium`}
                >
                  {t.title}
                </span>
                {t.subject && (
                  <span className="text-sm text-gray-500 italic">
                    ({t.subject})
                  </span>
                )}
              </div>

              <button
                onClick={() => remove(t._id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
