import React from "react";
import { useNavigate } from "react-router-dom";
import Star from "../../Images/star.png";
import { useDispatch } from "react-redux";
import { addItem } from "./data/cartSlice";

function FoodCard(props) {
  console.log("🚀 ~ FoodCard ~ props:", props);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // let allItem = [];

  const handleClick = () => {
    const encodedName = encodeURIComponent(props.name);
    const encodedSrc = encodeURIComponent(props.src);
    const encodedRating = encodeURIComponent(props.text);
    const encodeDistance = encodeURIComponent(props.distance);
    const encodeTime = encodeURIComponent(props.time);
    const encodequantity = encodeURIComponent(props.quantity);

    // Redirect to another component with the single data
    navigate(`/itemlist/${encodedName}/${encodedSrc}`);
    // allItem.push(props.name);
    dispatch(addItem(props));
  };

  return (
    <div
      className="max-w-sm overflow-hidden p-3 rounded-2xl hover:shadow-2xl hover:border"
      onClick={handleClick}
    >
      <img
        className="w-full h-56 rounded-2xl"
        src={props.src}
        alt={props.name}
      />
      <div className="flex flex-row justify-between">
        <div className="py-4">
          <div className="text-lg text-slate-600 leading-6 mb-2 whitespace-nowrap truncate overflow-ellipsis w-52 font-medium text-sm">
            {props.name}
          </div>
          <div className="flex flex-row overflow-hidden w-40 gap-1">
            <p className="text-slate-500 leading-5 text-base max-w-xl truncate overflow-ellipsis text-sm">
              {props.text.map((item, index) => (
                <span key={index}>{item.name}, </span>
              ))}
            </p>
          </div>
        </div>
        <div className="py-4 text-right gap-10">
          <div className="flex items-center ml-9 rounded-lg p-1 bg-green-800">
            <p className="text-white font-semibold text-center text-sm">
              {props.rating}
            </p>
            <img className="" src={Star} alt="star" height={12} width={12} />
          </div>
          <p className="whitespace-nowrap text-slate-500 leading-5 text-xs max-w-xl truncate overflow-ellipsis">
            {props.quantity}
          </p>
          <p className="text-slate-600 text-xs">
            {props.time}
            {props.distance}
          </p>
        </div>
      </div>
      <button>Add to cart</button>
    </div>
  );
}

export default FoodCard;
