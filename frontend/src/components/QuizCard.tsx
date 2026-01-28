import { useState } from "react";

export default function QuizCard({ data }: { data: any }) {
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = data.quiz.reduce((acc: number, q: any, i: number) => {
    return selected[i] === q.answer ? acc + 1 : acc;
  }, 0);

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold">{data.title}</h2>
        <p className="text-gray-600 mt-2">{data.summary}</p>
      </div>

      {data.quiz.map((q: any, i: number) => (
        <div key={i} className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">
              Q{i + 1}. {q.question}
            </h3>
            <span className={`px-2 py-1 text-xs rounded ${
              q.difficulty === "easy"
                ? "bg-green-200"
                : q.difficulty === "medium"
                ? "bg-yellow-200"
                : "bg-red-200"
            }`}>
              {q.difficulty}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {q.options.map((opt: string, idx: number) => (
              <div
                key={idx}
                onClick={() =>
                  !submitted &&
                  setSelected({ ...selected, [i]: opt })
                }
                className={`border p-2 rounded cursor-pointer
                  ${
                    selected[i] === opt
                      ? "bg-blue-100 border-blue-400"
                      : "hover:bg-gray-100"
                  }
                `}
              >
                {opt}
              </div>
            ))}
          </div>

          {submitted && (
            <div className="mt-3">
              <div className="text-green-700 font-medium">
                Correct Answer: {q.answer}
              </div>
              <div className="text-gray-500 text-sm">
                {q.explanation}
              </div>
            </div>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-xl font-bold">
            Your Score: {score} / {data.quiz.length}
          </h3>
        </div>
      )}

      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-2">Related Topics</h3>
        <div className="flex flex-wrap gap-2">
          {data.related_topics.map((t: string, i: number) => (
            <span key={i} className="bg-gray-200 px-3 py-1 rounded">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
