export function Stars({ rating, large = false }) {
  const num = parseFloat(rating) || 0;
  const color = num >= 4 ? "bg-green-700" : num >= 3 ? "bg-green-600" : "bg-yellow-500";
  const size = large ? "px-3 py-1.5 text-xl" : "px-2 py-0.5 text-sm";
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg text-white ${color} ${size}`}>
      {num > 0 ? num.toFixed(1) : "NEW"}
      {num > 0 && (
        <svg viewBox="0 0 24 24" className={large ? "w-4 h-4" : "w-3 h-3"} fill="currentColor">
          <path d="M12 2l2.9 6.26 6.86.86-5.04 4.72 1.3 6.76L12 17.18l-6.02 3.42 1.3-6.76L2.24 9.12l6.86-.86L12 2z" />
        </svg>
      )}
    </span>
  );
}

export default Stars;
