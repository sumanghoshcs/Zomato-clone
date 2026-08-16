import { useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "../component/foodcard/data/cartSlice";

export function QuantityStepper({ id, quantity, size = "md" }) {
  const dispatch = useDispatch();
  const btnClass =
    size === "sm"
      ? "h-8 w-8 text-lg"
      : "h-10 w-10 text-2xl";
  return (
    <div className="inline-flex items-center rounded-lg border border-gray-300 bg-white shadow-sm">
      <button
        className={`${btnClass} flex items-center justify-center text-zomato hover:bg-gray-100 rounded-l-lg`}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(decrementQuantity(id));
        }}
        aria-label="Decrease quantity"
      >
        &minus;
      </button>
      <span className={`px-3 text-center font-semibold text-zomato ${size === "sm" ? "text-lg" : "text-2xl"}`}>
        {quantity}
      </span>
      <button
        className={`${btnClass} flex items-center justify-center text-zomato hover:bg-gray-100 rounded-r-lg`}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(incrementQuantity(id));
        }}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default QuantityStepper;
