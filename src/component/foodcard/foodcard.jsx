import React from "react";
import { useNavigate } from "react-router-dom";
import { Stars } from "../../components/Stars";

function FoodCard(props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/restaurant/${props.id}?from=home`);
  };

  return (
    <div
      className="cursor-pointer rounded-2xl p-3 hover:shadow-2xl hover:border hover:border-gray-200 transition-all overflow-hidden"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img
          className="w-full h-44 md:h-48 object-cover transition-transform duration-300 hover:scale-105"
          src={props.src}
          alt={props.name}
          loading="lazy"
        />
        {props.offer && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <span className="text-white text-sm font-semibold">{props.offer}</span>
          </div>
        )}
      </div>
      <div className="pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-medium text-slate-700 truncate">{props.name}</h3>
          <Stars rating={props.rating} />
        </div>
        <p className="text-sm text-slate-500 mt-1 truncate">
          {Array.isArray(props.text) ? props.text.map((t) => t.name).join(", ") : props.text}
        </p>
        <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
          <span>{props.time || "35 min"}</span>
          <span>{props.distance || "1.5 km"}</span>
          <span className="text-slate-400 font-medium">{props.quantity}</span>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
