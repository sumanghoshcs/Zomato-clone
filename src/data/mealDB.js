const API_BASE = "https://www.themealdb.com/api/json/v1/1";
const CACHE_KEY = "zmtcdb_meals_v1";

const CATEGORIES = [
  "Beef",
  "Chicken",
  "Dessert",
  "Pasta",
  "Pork",
  "Seafood",
  "Side",
  "Starter",
  "Vegan",
  "Vegetarian",
  "Breakfast",
  "Goat",
  "Miscellaneous",
];

const CATEGORY_MAP = {
  Starter: "Starters",
  Beef: "Main Course",
  Chicken: "Main Course",
  Pork: "Main Course",
  Goat: "Main Course",
  Lamb: "Main Course",
  Seafood: "Main Course",
  Pasta: "Pastas",
  Dessert: "Desserts",
  Breakfast: "Snacks",
  Side: "Snacks",
  Vegan: "Main Course",
  Vegetarian: "Main Course",
  Miscellaneous: "Snacks",
};

const NON_VEG_KEYWORDS = [
  "chicken",
  "beef",
  "pork",
  "lamb",
  "goat",
  "duck",
  "fish",
  "salmon",
  "tuna",
  "trout",
  "cod",
  "prawn",
  "shrimp",
  "crab",
  "lobster",
  "sausage",
  "bacon",
  "ham",
  "meat",
  "kebab",
  "turkey",
  "pepperoni",
  "anchovy",
  "sardine",
  "mussel",
  "squid",
  "octopus",
  "venison",
  "meatball",
];

const PRICE_BASE = {
  Starters: 220,
  "Main Course": 280,
  Pastas: 310,
  Desserts: 140,
  Snacks: 160,
};

const NON_VEG_CATEGORIES = ["Beef", "Chicken", "Pork", "Goat", "Lamb", "Seafood"];

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function seed(n) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

function isVeg(meal) {
  if (NON_VEG_CATEGORIES.includes(meal.strCategory)) return false;
  const name = (meal.strMeal || "").toLowerCase();
  return !NON_VEG_KEYWORDS.some((w) => name.includes(w));
}

export function mealToDish(meal, fallbackCategory) {
  const category = CATEGORY_MAP[meal.strCategory] || CATEGORY_MAP[fallbackCategory] || "Snacks";
  const r = seed(hashString(meal.idMeal || meal.strMeal));
  const base = PRICE_BASE[category] || 200;
  const price = Math.max(79, base + Math.floor(r * 90));
  const rating = Math.round((3.4 + r * 1.2) * 10) / 10;
  const votes = 120 + Math.floor(r * 3200);
  const desc = `${meal.strMeal}, prepared fresh with quality ingredients and aromatic spices.`;
  return {
    name: meal.strMeal,
    price,
    veg: isVeg({ ...meal, strCategory: meal.strCategory || fallbackCategory }),
    img: meal.strMealThumb,
    category,
    rating,
    votes,
    bestseller: votes >= 1500 || rating >= 4.4,
    desc,
    mealId: meal.idMeal,
  };
}

function cacheMeals(dishes) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(dishes));
  } catch (e) {
    /* storage full or unavailable */
  }
}

export function getCachedMeals() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    /* ignore */
  }
  return [];
}

let inflight = null;

export function preloadMealPool() {
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const seen = new Map();
      for (const cat of CATEGORIES) {
        const res = await fetch(`${API_BASE}/filter.php?c=${encodeURIComponent(cat)}`);
        if (!res.ok) continue;
        const json = await res.json();
        (json.meals || []).forEach((m) => {
          if (!seen.has(m.idMeal)) {
            seen.set(m.idMeal, { ...m, strCategory: m.strCategory || cat });
          }
        });
      }
      const dishes = [...seen.values()].map((m) => mealToDish(m, m.strCategory));
      cacheMeals(dishes);
      return dishes;
    } catch (e) {
      return getCachedMeals();
    }
  })();
  return inflight;
}
