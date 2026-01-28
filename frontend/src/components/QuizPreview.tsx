import { useState } from "react";
import TakeQuiz from "./TakeQuiz";

export default function QuizPreview({ data }: any) {
  const [startQuiz, setStartQuiz] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold">{data.title}</h2>
        <p className="text-slate-600 mt-2">{data.summary}</p>
      </div>

      <div className="space-y-4">
        {data.quiz.map((q: any, i: number) => (
          <div key={i} className="bg-white shadow rounded-xl p-6">
            <div className="flex justify-between">
              <p className="font-semibold text-lg">
                Q{i + 1}. {q.question}
              </p>
              <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                {q.difficulty}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {q.options.map((opt: string, idx: number) => (
                <div key={idx} className="border p-2 rounded">
                  {opt}
                </div>
              ))}
            </div>

            <p className="mt-3 text-green-700 font-medium">
              Answer: {q.answer}
            </p>
            <p className="text-sm text-slate-500">
              {q.explanation}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold mb-2">Related Topics</h3>
        <div className="flex flex-wrap gap-2">
          {data.related_topics.map((t: string, i: number) => (
            <span key={i} className="bg-slate-200 px-3 py-1 rounded-full">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => setStartQuiz(true)}
          className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg"
        >
          Take a Quiz
        </button>
      </div>

      {startQuiz && <TakeQuiz originalData={data} />}
    </div>
  );
}
