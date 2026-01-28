import { useEffect, useState } from "react";
import API from "../api";

export default function TakeQuiz({ originalData }: any) {
  const [quizData, setQuizData] = useState<any>(null);
  const [selected, setSelected] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    API.post("/generate-quiz", { url: originalData.url }).then((res) =>
      setQuizData(res.data)
    );
  }, []);

  if (!quizData) return <p className="mt-4">Preparing your quiz...</p>;

  const score = quizData.quiz.filter(
    (q: any, i: number) => selected[i] === q.answer
  ).length;

  return (
    <div className="mt-8 bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Attempt Quiz</h3>

      {quizData.quiz.map((q: any, i: number) => (
        <div key={i} className="mb-6">
          <p className="font-medium">
            Q{i + 1}. {q.question}
          </p>

          {q.options.map((opt: string, idx: number) => (
            <div
              key={idx}
              onClick={() =>
                !submitted && setSelected({ ...selected, [i]: opt })
              }
              className={`border p-2 mt-2 rounded cursor-pointer ${
                selected[i] === opt ? "bg-blue-100" : ""
              }`}
            >
              {opt}
            </div>
          ))}

          {submitted && (
            <p className="text-green-600 mt-2">
              Correct Answer: {q.answer}
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="text-xl font-bold">
          Your Score: {score} / {quizData.quiz.length}
        </div>
      )}
    </div>
  );
}
