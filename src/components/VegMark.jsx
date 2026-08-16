export function VegMark({ veg = false }) {
  const color = veg ? "border-green-600 text-green-600" : "border-red-600 text-red-600";
  const inner = veg ? "bg-green-600" : "bg-red-600";
  return (
    <span
      className={`inline-flex h-4 w-4 items-center justify-center border-2 ${color} rounded-[3px] shrink-0`}
      title={veg ? "Veg" : "Non Veg"}
    >
      <span className={`h-2 w-2 rounded-full ${inner}`} />
    </span>
  );
}

export default VegMark;
