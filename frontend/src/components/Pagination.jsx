export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition
          ${
            page <= 1
              ? "bg-blue-300 text-white opacity-50 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }
        `}
      >
        ← Previous
      </button>

      <span className="text-gray-700 font-medium">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition
          ${
            page >= totalPages
              ? "bg-blue-300 text-white opacity-50 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }
        `}
      >
        Next →
      </button>
    </div>
  );
}
