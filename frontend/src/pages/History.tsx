import { useEffect, useState } from "react";
import API from "../api";
import QuizModal from "../components/QuizModal";

export default function History() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);

  useEffect(() => {
    API.get("/history").then((res) => {
      setItems(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading history...</p>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-xl p-6"
          >
            <h3 className="font-semibold text-lg">{item.title}</h3>

            <button
              onClick={async () => {
                const res = await API.get(`/quiz/${item.id}`);
                setSelectedQuiz(res.data);
              }}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Open Quiz
            </button>

          </div>
        ))}
      </div>

      {selectedQuiz && (
        <QuizModal
          data={selectedQuiz}
          onClose={() => setSelectedQuiz(null)}
        />
      )}
    </>
  );
}
