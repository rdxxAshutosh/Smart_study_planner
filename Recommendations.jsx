import { useState } from "react";
const API = "http://localhost:5000";

export default function Recommendations({ todos }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const ask = async () => {
    setLoading(true);
    setResult(null);
    const res = await fetch(`${API}/api/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todos, preferences: { dailyStudyMinutes: 120 } }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="mt-6">
      <button
        onClick={ask}
        disabled={loading || !todos?.length}
        className={`px-4 py-2 rounded-md font-medium transition ${
          loading || !todos?.length
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {loading ? "Thinking..." : "Get Smart Recommendations"}
      </button>

      {/* Parsed Recommendations */}
      {result?.parsed && (
        <div className="mt-5">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Smart Study Recommendations
          </h3>
          <div className="grid gap-4">
            {result.parsed.map((rec, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition"
              >
                <h4 className="text-lg font-bold text-gray-800 mb-2">{rec.title}</h4>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Recommended Minutes:</span> {rec.recommendedMinutes}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Priority Score:</span> {rec.priorityScore}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Study Technique:</span> {rec.studyTechnique}
                </p>
                {rec.resources?.length > 0 && (
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Resources:</span> {rec.resources.join(", ")}
                  </p>
                )}
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Scheduled Slot:</span> {rec.scheduledSlot}
                </p>
                {rec.notes && (
                  <p className="text-gray-500 text-sm">{rec.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback: Raw JSON */}
      {result && !result.parsed && (
        <div className="mt-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Raw Gemini Response</h3>
          <pre className="bg-gray-100 p-3 rounded-md max-h-80 overflow-auto text-sm text-gray-700">
            {result.raw}
          </pre>
        </div>
      )}
    </div>
  );
}
