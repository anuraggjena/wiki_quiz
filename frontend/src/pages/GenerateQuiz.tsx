import { useState } from "react";
import API from "../api";
import QuizPreview from "../components/QuizPreview";

export default function GenerateQuiz() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [data, setData] = useState<any>(null);

  const handlePreview = async () => {
    setLoadingPreview(true);
    const res = await API.post("/preview-url", { url });
    setTitle(res.data.title);
    setLoadingPreview(false);
  };

  const handleGenerate = async () => {
    setLoadingQuiz(true);
    const res = await API.post("/generate-quiz", { url });
    setData(res.data);
    setLoadingQuiz(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Create Quiz from Wikipedia
        </h2>

        <div className="flex gap-3">
          <input
            className="flex-1 border rounded-lg p-3 focus:outline-blue-500"
            placeholder="Paste Wikipedia URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handlePreview}
            className="bg-slate-800 text-white px-4 rounded-lg"
          >
            {loadingPreview ? "Checking..." : "Validate"}
          </button>
        </div>

        {title && (
          <div className="mt-4 bg-slate-100 p-3 rounded-lg">
            <b>Article:</b> {title}
          </div>
        )}

        {title && (
          <button
            onClick={handleGenerate}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            {loadingQuiz ? "Generating..." : "Generate Quiz"}
          </button>
        )}
      </div>

      {data && <QuizPreview data={data} />}
    </div>
  );
}
