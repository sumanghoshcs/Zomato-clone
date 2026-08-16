import foodJson from "../Json-file/food.json";
import nightlifeJson from "../Json-file/nightlife.json";
import diningJson from "../Json-file/collectionlist.json";
import { buildMenu } from "./dishCatalog";

const OFFERS_POOL = [
  "50% OFF up to \u20b9100",
  "Flat \u20b9100 OFF above \u20b9399",
  "20% OFF up to \u20b9150",
  "Free delivery on orders above \u20b9199",
  "\u20b9125 OFF above \u20b9499",
  "30% OFF up to \u20b9120",
  "Buy 1 Get 1 on selected items",
  "15% OFF up to \u20b9100",
  "Flat \u20b975 OFF above \u20b9250",
  "25% OFF up to \u20b9150",
];

function seed(n) {
  const x = Math.sin(n * 999) * 10000;
  return x - Math.floor(x);
}

function cleanCost(text) {
  if (!text) return "\u20b9200 for one";
  return text;
}

function kolkataCoords(resId) {
  const n = Number(resId) || 0;
  return {
    lat: Math.round((22.5 + seed(n + 1) * 0.12) * 1e4) / 1e4,
    lng: Math.round((88.33 + seed(n + 2) * 0.12) * 1e4) / 1e4,
  };
}

function normalize(item, source) {
  const info = item.info || {};
  const cuisines = (info.cuisine || []).map((c) => c.name);
  const resId = String(info.resId || Math.floor(Math.random() * 1e9));
  const offerCount = 1 + (seed(resId.length) > 0.6 ? 1 : 0);
  const offers = [];
  for (let i = 0; i < offerCount; i++) {
    const idx = Math.floor(seed(resId.length + i * 13) * OFFERS_POOL.length);
    offers.push(OFFERS_POOL[idx]);
  }
  const menu = buildMenu(info.cuisine || [], Number(resId));
  const distance = item.distance || "2 km";
  const deliveryTime =
    (item.order && item.order.deliveryTime) || `${25 + Math.floor(seed(Number(resId)) * 40)} min`;
  const coords = kolkataCoords(resId);
  return {
    id: resId,
    name: info.name,
    image: (info.image && info.image.url) || (info.o2FeaturedImage && info.o2FeaturedImage.url) || "",
    cuisines,
    rating: (info.rating && info.rating.aggregate_rating) || "3.9",
    votes: (info.rating && info.rating.votes) || "100+",
    deliveryTime,
    distance,
    costForOne: cleanCost(info.costText && info.costText.text),
    area: (info.locality && info.locality.name) || "Kolkata",
    address: (info.locality && info.locality.address) || "",
    offers,
    menu,
    source,
    promoted: !!item.isPromoted,
    lat: coords.lat,
    lng: coords.lng,
  };
}

function uniqueById(list) {
  const map = new Map();
  list.forEach((r) => {
    if (!map.has(r.id)) map.set(r.id, r);
  });
  return [...map.values()];
}

const delivery = (foodJson.section || []).map((r) => normalize(r, "delivery"));
const nightlife = (nightlifeJson.section || []).map((r) => normalize(r, "nightlife"));
const dining = (diningJson.sectionresult || []).map((r) => normalize(r, "dining"));

export const RESTAURANTS = uniqueById([...delivery, ...nightlife, ...dining]);

export function getRestaurantById(id) {
  return RESTAURANTS.find((r) => r.id === String(id));
}

export function searchRestaurants(query, filter = {}) {
  const q = (query || "").trim().toLowerCase();
  const source = filter.source || "delivery";
  let results = RESTAURANTS.filter((r) => {
    if (source !== "all" && r.source !== source) return false;
    return true;
  });
  if (q) {
    results = results.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisines.some((c) => c.toLowerCase().includes(q)) ||
        r.area.toLowerCase().includes(q) ||
        r.menu.some((group) => group.items.some((item) => item.name.toLowerCase().includes(q)))
    );
  }
  if (filter.sort === "rating") {
    results = [...results].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  } else if (filter.sort === "deliveryTime") {
    results = [...results].sort((a, b) => {
      const ta = parseInt(a.deliveryTime) || 99;
      const tb = parseInt(b.deliveryTime) || 99;
      return ta - tb;
    });
  } else if (filter.sort === "costLow") {
    results = [...results].sort(
      (a, b) => parseInt(a.costForOne.replace(/[^\d]/g, "")) - parseInt(b.costForOne.replace(/[^\d]/g, ""))
    );
  } else if (filter.sort === "costHigh") {
    results = [...results].sort(
      (a, b) => parseInt(b.costForOne.replace(/[^\d]/g, "")) - parseInt(a.costForOne.replace(/[^\d]/g, ""))
    );
  }
  return results;
}

export const TOP_BRAND_NAMES = [
  "WOW! Momo",
  "Domino's Pizza",
  "KFC",
  "Pizza Hut",
  "Arsalan",
  "Kwality Wall's Frozen Dessert And Ice Cream Shop",
  "Kasturi Restaurant",
];
