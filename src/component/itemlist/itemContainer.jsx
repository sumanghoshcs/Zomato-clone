import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Star from "../../Images/star.png";

function ItemList() {
  const items = useSelector((state) => state.cart.items);
  // console.log("🚀 ~ ItemList ~ items:", items);

  // items.forEach((value) => {
  //   console.log("🚀 ~ ItemList ~ value:", value);
  // });
  const { name, img, text, distance, time, quantity } = useParams();

  // Use 'name' and 'src' as needed
  // Decode the values if necessary
  const decodedName = decodeURIComponent(name);
  const decodedSrc = decodeURIComponent(img);
  const decodedRating = decodeURIComponent(text);
  const decodeDistance = decodeURIComponent(distance);
  const decodeTime = decodeURIComponent(time);
  const decodeQuantity = decodeURIComponent(quantity);

  return (
    <div className="mx-20">
      <img
        className="w-full h-96 rounded-1xl"
        src={items[0]?.src}
        alt={items[0]?.name}
      />
      <div className="flex flex-row justify-between">
        <p className="text-2xl mt-6 font-medium">{`Item List for ${items[0]?.name}`}</p>
        <div>
          <div className="flex items-center ml-9 rounded-lg p-1 bg-green-800">
            <p className="text-white font-semibold text-center text-sm">
              {items[0]?.rating}
            </p>
            <img className="" src={Star} alt="star" height={12} width={12} />
          </div>
        </div>
      </div>

      {/* Render the content based on the fetched data */}
    </div>
  );
}

export default ItemList;
