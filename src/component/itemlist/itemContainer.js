import { useParams } from 'react-router-dom';

function ItemList() {
  const { name, img } = useParams();

  // Use 'name' and 'src' as needed
  // Decode the values if necessary
  const decodedName = decodeURIComponent(name);
  const decodedSrc = decodeURIComponent(img);

  return (
    <div>
      <h1>{`Item List for ${decodedName}`}</h1>
      <img src={decodedSrc} alt={decodedName} />
      {/* Render the content based on the fetched data */}
    </div>
  );
}

export default ItemList;