import QuizCard from "./QuizCard";

export default function QuizModal({ data, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-10">
      <div className="bg-white w-4/5 max-h-[85vh] overflow-y-auto p-6 rounded shadow">
        <button
          onClick={onClose}
          className="mb-4 bg-red-500 text-white px-3 py-1 rounded"
        >
          Close
        </button>

        <QuizCard data={data} />
      </div>
    </div>
  );
}
