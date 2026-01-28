import { useState } from "react";
import GenerateQuiz from "./pages/GenerateQuiz";
import History from "./pages/History";

export default function App() {
  const [tab, setTab] = useState<"generate" | "history">("generate");

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200">
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-slate-800">
            Wiki Quiz App
          </h1>

          <div className="space-x-2">
            <button
              onClick={() => setTab("generate")}
              className={`px-4 py-2 rounded font-medium ${
                tab === "generate"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200"
              }`}
            >
              Generate Quiz
            </button>
            <button
              onClick={() => setTab("history")}
              className={`px-4 py-2 rounded font-medium ${
                tab === "history"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200"
              }`}
            >
              History
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {tab === "generate" ? <GenerateQuiz /> : <History />}
      </main>
    </div>
  );
}
