import { getCachedMeals } from "./mealDB";

const IMG = {
  biryani:
    "https://b.zmtcdn.com/data/dish_images/d19a31d42d5913ff129cafd7cec772f81639737697.png",
  pizza:
    "https://b.zmtcdn.com/data/o2_assets/d0bd7c9405ac87f6aa65e31fe55800941632716575.png",
  chicken:
    "https://b.zmtcdn.com/data/dish_images/197987b7ebcd1ee08f8c25ea4e77e20f1634731334.png",
  burger:
    "https://b.zmtcdn.com/data/dish_images/ccb7dc2ba2b054419f805da7f05704471634886169.png",
  friedRice:
    "https://b.zmtcdn.com/data/o2_assets/e444ade83eb22360b6ca79e6e777955f1632716661.png",
  rolls:
    "https://b.zmtcdn.com/data/dish_images/c2f22c42f7ba90d81440a88449f4e5891634806087.png",
  thali:
    "https://b.zmtcdn.com/data/o2_assets/52eb9796bb9bcf0eba64c643349e97211634401116.png",
  cake:
    "https://b.zmtcdn.com/data/dish_images/d5ab931c8c239271de45e1c159af94311634805744.png",
  paneer:
    "https://b.zmtcdn.com/data/dish_images/e44c42ff4b60b025225c8691ef9735b11635781903.png",
  northIndian:
    "https://b.zmtcdn.com/data/o2_assets/019409fe8f838312214d9211be010ef31678798444.jpeg",
};

const D = [
  // Biryani & Mughlai
  { name: "Chicken Biryani", price: 289, veg: false, img: IMG.biryani, category: "Biryanis", rating: 4.3, votes: 1250, bestseller: true, desc: "Long grain basmati rice layered with marinated chicken, mint and saffron." },
  { name: "Mutton Biryani", price: 359, veg: false, img: IMG.biryani, category: "Biryanis", rating: 4.4, votes: 980, bestseller: true, desc: "Tender mutton pieces slow cooked with fragrant rice and whole spices." },
  { name: "Veg Biryani", price: 219, veg: true, img: IMG.biryani, category: "Biryanis", rating: 4.1, votes: 720, bestseller: false, desc: "Fresh vegetables and basmati rice cooked with aromatic biryani masala." },
  { name: "Egg Biryani", price: 229, veg: false, img: IMG.biryani, category: "Biryanis", rating: 4.0, votes: 540, bestseller: false, desc: "Flavourful rice biryani topped with golden fried boiled eggs." },
  { name: "Chicken Dum Biryani", price: 319, veg: false, img: IMG.biryani, category: "Biryanis", rating: 4.5, votes: 2100, bestseller: true, desc: "Authentic dum cooked biryani sealed with dough and layered with juicy chicken." },
  { name: "Chicken Kebab Platter", price: 349, veg: false, img: IMG.chicken, category: "Starters", rating: 4.2, votes: 640, bestseller: true, desc: "Smoky tandoori chicken kebabs served with mint chutney and salad." },
  { name: "Chicken Tikka Kebab", price: 289, veg: false, img: IMG.chicken, category: "Starters", rating: 4.3, votes: 810, bestseller: false, desc: "Char-grilled boneless chicken pieces in creamy yogurt marinade." },

  // North Indian
  { name: "Butter Chicken", price: 319, veg: false, img: IMG.chicken, category: "Main Course", rating: 4.5, votes: 3300, bestseller: true, desc: "Succulent chicken in a rich buttery tomato gravy with cream and fenugreek." },
  { name: "Paneer Butter Masala", price: 279, veg: true, img: IMG.paneer, category: "Main Course", rating: 4.3, votes: 1700, bestseller: true, desc: "Soft paneer cubes simmered in a silky, mildly spiced tomato butter gravy." },
  { name: "Dal Makhani", price: 239, veg: true, img: IMG.thali, category: "Main Course", rating: 4.2, votes: 1450, bestseller: true, desc: "Black lentils slow cooked overnight with butter and cream." },
  { name: "Chicken Curry", price: 289, veg: false, img: IMG.chicken, category: "Main Course", rating: 4.1, votes: 900, bestseller: false, desc: "Classic home-style chicken curry in an onion-tomato masala base." },
  { name: "Paneer Tikka", price: 259, veg: true, img: IMG.paneer, category: "Starters", rating: 4.4, votes: 1500, bestseller: true, desc: "Cubes of paneer marinated in spiced yogurt and grilled in a tandoor." },
  { name: "Malai Kofta", price: 279, veg: true, img: IMG.thali, category: "Main Course", rating: 4.0, votes: 480, bestseller: false, desc: "Fried vegetable dumplings in a rich creamy cashew and tomato gravy." },
  { name: "Garlic Naan", price: 79, veg: true, img: IMG.northIndian, category: "Breads", rating: 4.5, votes: 2200, bestseller: true, desc: "Soft tandoor baked naan brushed with garlic butter." },
  { name: "Tandoori Roti", price: 49, veg: true, img: IMG.northIndian, category: "Breads", rating: 4.2, votes: 1300, bestseller: false, desc: "Whole wheat flatbread baked in a tandoor." },
  { name: "Butter Naan", price: 69, veg: true, img: IMG.northIndian, category: "Breads", rating: 4.4, votes: 1900, bestseller: true, desc: "Classic naan bread smothered with butter." },
  { name: "Veg Thali", price: 249, veg: true, img: IMG.thali, category: "Thalis", rating: 4.1, votes: 860, bestseller: false, desc: "A wholesome platter with dal, sabzi, roti, rice, salad and dessert." },
  { name: "Non Veg Thali", price: 349, veg: false, img: IMG.thali, category: "Thalis", rating: 4.2, votes: 740, bestseller: false, desc: "A royal platter with chicken curry, dal, biryani, roti and dessert." },
  { name: "Paneer Tikka Roll", price: 179, veg: true, img: IMG.rolls, category: "Rolls", rating: 4.2, votes: 620, bestseller: false, desc: "Grilled paneer wrapped in a paratha with onions and mint chutney." },
  { name: "Chicken Kathi Roll", price: 199, veg: false, img: IMG.rolls, category: "Rolls", rating: 4.3, votes: 1100, bestseller: true, desc: "Spiced chicken strips rolled in a flaky paratha with crunchy onions." },
  { name: "Egg Roll", price: 129, veg: false, img: IMG.rolls, category: "Rolls", rating: 4.0, votes: 480, bestseller: false, desc: "Street style egg omelette roll with onions, spices and green chutney." },

  // Pizza & Italian
  { name: "Margherita Pizza", price: 249, veg: true, img: IMG.pizza, category: "Pizzas", rating: 4.4, votes: 2700, bestseller: true, desc: "Classic thin crust pizza with tangy tomato sauce, mozzarella and basil." },
  { name: "Farmhouse Pizza", price: 349, veg: true, img: IMG.pizza, category: "Pizzas", rating: 4.3, votes: 1600, bestseller: false, desc: "Loaded with onion, capsicum, tomato, mushroom and sweet corn." },
  { name: "Pepperoni Pizza", price: 399, veg: false, img: IMG.pizza, category: "Pizzas", rating: 4.5, votes: 1900, bestseller: true, desc: "Cheesy pizza topped with spicy pepperoni slices." },
  { name: "Chicken Tikka Pizza", price: 379, veg: false, img: IMG.pizza, category: "Pizzas", rating: 4.4, votes: 2100, bestseller: true, desc: "Tandoori chicken tikka chunks, onions and mozzarella on a smoky base." },
  { name: "Veggie Supreme Pizza", price: 369, veg: true, img: IMG.pizza, category: "Pizzas", rating: 4.2, votes: 1300, bestseller: false, desc: "A garden of fresh vegetables with extra cheese on a thick crust." },
  { name: "Cheese Burst Pizza", price: 429, veg: true, img: IMG.pizza, category: "Pizzas", rating: 4.6, votes: 2400, bestseller: true, desc: "Golden crust bursting with liquid cheese in every bite." },
  { name: "Penne Arrabbiata", price: 299, veg: true, img: IMG.pizza, category: "Pastas", rating: 4.1, votes: 540, bestseller: false, desc: "Penne pasta tossed in a fiery tomato chilli sauce with garlic." },
  { name: "Creamy Alfredo Pasta", price: 329, veg: true, img: IMG.pizza, category: "Pastas", rating: 4.3, votes: 760, bestseller: true, desc: "Fettuccine pasta in a rich parmesan cream sauce." },

  // Chinese
  { name: "Veg Hakka Noodles", price: 199, veg: true, img: IMG.friedRice, category: "Chinese", rating: 4.2, votes: 1500, bestseller: true, desc: "Stir fried noodles with crunchy vegetables in a smoky soy sauce." },
  { name: "Chicken Hakka Noodles", price: 239, veg: false, img: IMG.friedRice, category: "Chinese", rating: 4.3, votes: 1300, bestseller: false, desc: "Wok tossed noodles with chicken and garden vegetables." },
  { name: "Veg Fried Rice", price: 189, veg: true, img: IMG.friedRice, category: "Chinese", rating: 4.1, votes: 1700, bestseller: true, desc: "Classic Chinese fried rice with mixed vegetables and spring onions." },
  { name: "Chicken Fried Rice", price: 229, veg: false, img: IMG.friedRice, category: "Chinese", rating: 4.2, votes: 1400, bestseller: true, desc: "Flavourful fried rice with tender chicken pieces and veggies." },
  { name: "Chilli Chicken", price: 279, veg: false, img: IMG.chicken, category: "Chinese", rating: 4.4, votes: 2100, bestseller: true, desc: "Crispy chicken tossed in a spicy tangy chilli garlic sauce." },
  { name: "Chilli Paneer", price: 259, veg: true, img: IMG.paneer, category: "Chinese", rating: 4.3, votes: 1600, bestseller: true, desc: "Crispy paneer in a fiery Indo-Chinese gravy with peppers." },
  { name: "Veg Manchurian", price: 219, veg: true, img: IMG.friedRice, category: "Chinese", rating: 4.1, votes: 1100, bestseller: false, desc: "Golden veggie dumplings coated in a glossy manchurian sauce." },

  // Fast food & Burgers
  { name: "Crispy Chicken Burger", price: 169, veg: false, img: IMG.burger, category: "Burgers", rating: 4.3, votes: 1900, bestseller: true, desc: "Juicy fried chicken patty with lettuce, mayo and a soft sesame bun." },
  { name: "Veggie Burger", price: 129, veg: true, img: IMG.burger, category: "Burgers", rating: 4.1, votes: 1500, bestseller: false, desc: "Crispy veg patty stacked with lettuce, onion and tangy sauces." },
  { name: "Classic Cheeseburger", price: 199, veg: false, img: IMG.burger, category: "Burgers", rating: 4.2, votes: 1200, bestseller: true, desc: "Double cheese, grilled patty and house sauce in a toasted bun." },
  { name: "Loaded Fries", price: 179, veg: true, img: IMG.friedRice, category: "Snacks", rating: 4.2, votes: 980, bestseller: false, desc: "Crispy fries loaded with cheese sauce and chilli flakes." },
  { name: "Peri Peri Fries", price: 149, veg: true, img: IMG.friedRice, category: "Snacks", rating: 4.0, votes: 700, bestseller: false, desc: "Golden fries dusted with fiery peri peri seasoning." },
  { name: "Veg Momos", price: 129, veg: true, img: IMG.friedRice, category: "Snacks", rating: 4.2, votes: 1300, bestseller: true, desc: "Steamed momos stuffed with spiced vegetables served with red chutney." },
  { name: "Chicken Momos", price: 159, veg: false, img: IMG.friedRice, category: "Snacks", rating: 4.3, votes: 1100, bestseller: true, desc: "Juicy chicken momos steamed and served with fiery chutney." },
  { name: "Chicken Lollipop", price: 259, veg: false, img: IMG.chicken, category: "Starters", rating: 4.1, votes: 820, bestseller: false, desc: "Crispy fried chicken wings in a sweet-spicy glaze." },

  // Desserts
  { name: "Gulab Jamun", price: 99, veg: true, img: IMG.cake, category: "Desserts", rating: 4.5, votes: 2100, bestseller: true, desc: "Warm, soft dumplings soaked in rose-scented sugar syrup." },
  { name: "Rasmalai", price: 129, veg: true, img: IMG.cake, category: "Desserts", rating: 4.4, votes: 1300, bestseller: true, desc: "Cottage cheese discs in saffron infused thickened milk." },
  { name: "Chocolate Brownie", price: 149, veg: true, img: IMG.cake, category: "Desserts", rating: 4.3, votes: 1800, bestseller: true, desc: "Dense fudgy brownie with molten chocolate centre." },
  { name: "Chocolate Lava Cake", price: 189, veg: true, img: IMG.cake, category: "Desserts", rating: 4.6, votes: 1500, bestseller: true, desc: "Warm cake with a gooey chocolate lava filling." },
  { name: "Vanilla Ice Cream", price: 109, veg: true, img: IMG.cake, category: "Ice Creams", rating: 4.2, votes: 1100, bestseller: false, desc: "Creamy classic vanilla scoop with a silky texture." },
  { name: "Chocolate Sundae", price: 159, veg: true, img: IMG.cake, category: "Ice Creams", rating: 4.4, votes: 900, bestseller: false, desc: "Vanilla scoops drizzled with chocolate sauce and nuts." },
  { name: "Butterscotch Ice Cream", price: 129, veg: true, img: IMG.cake, category: "Ice Creams", rating: 4.5, votes: 1400, bestseller: true, desc: "Rich butterscotch ice cream with praline crunch." },
  { name: "Fresh Fruit Sundae", price: 179, veg: true, img: IMG.cake, category: "Ice Creams", rating: 4.1, votes: 600, bestseller: false, desc: "Ice cream topped with seasonal fresh fruits and syrup." },

  // Beverages
  { name: "Masala Chai", price: 49, veg: true, img: IMG.northIndian, category: "Beverages", rating: 4.3, votes: 1700, bestseller: true, desc: "Aromatic Indian tea brewed with ginger and spices." },
  { name: "Cold Coffee", price: 129, veg: true, img: IMG.cake, category: "Beverages", rating: 4.4, votes: 1200, bestseller: false, desc: "Frothy chilled coffee blended with cream and ice." },
  { name: "Fresh Lime Soda", price: 79, veg: true, img: IMG.cake, category: "Beverages", rating: 4.2, votes: 900, bestseller: false, desc: "Zesty lime and soda over crushed ice, sweet or salted." },
  { name: "Mango Shake", price: 149, veg: true, img: IMG.cake, category: "Beverages", rating: 4.5, votes: 1300, bestseller: true, desc: "Thick creamy shake made with ripe alphonso mangoes." },
  { name: "Chocolate Shake", price: 159, veg: true, img: IMG.cake, category: "Beverages", rating: 4.4, votes: 1000, bestseller: true, desc: "Indulgent chocolate milkshake topped with whipped cream." },
  { name: "Strawberry Shake", price: 159, veg: true, img: IMG.cake, category: "Beverages", rating: 4.3, votes: 800, bestseller: false, desc: "Refreshing shake made with fresh strawberries." },
];

const CATEGORY_ORDER = [
  "Recommended",
  "Biryanis",
  "Starters",
  "Main Course",
  "Pizzas",
  "Pastas",
  "Chinese",
  "Burgers",
  "Rolls",
  "Snacks",
  "Thalis",
  "Breads",
  "Desserts",
  "Ice Creams",
  "Beverages",
];

const CUISINE_KEYWORDS = {
  Biryani: ["Biryanis", "Mughlai", "Main Course", "Beverages", "Desserts"],
  Mughlai: ["Biryanis", "Main Course", "Starters", "Rolls", "Breads"],
  Pizza: ["Pizzas", "Pastas", "Beverages", "Desserts"],
  Pasta: ["Pastas", "Pizzas", "Beverages"],
  Italian: ["Pizzas", "Pastas", "Beverages", "Desserts"],
  "North Indian": ["Main Course", "Starters", "Breads", "Thalis", "Desserts"],
  Bengali: ["Main Course", "Thalis", "Breads", "Desserts", "Beverages"],
  Chinese: ["Chinese", "Snacks", "Beverages"],
  "Fast Food": ["Burgers", "Snacks", "Beverages", "Desserts"],
  Burger: ["Burgers", "Snacks", "Beverages"],
  Rolls: ["Rolls", "Snacks", "Beverages"],
  Kebab: ["Starters", "Biryanis", "Main Course"],
  Seafood: ["Main Course", "Starters", "Chinese"],
  Desserts: ["Desserts", "Ice Creams", "Beverages"],
  "Ice Cream": ["Ice Creams", "Desserts", "Beverages"],
  Beverages: ["Beverages", "Desserts"],
  Shake: ["Beverages", "Desserts"],
  Cafe: ["Beverages", "Desserts", "Snacks"],
  Salad: ["Snacks", "Main Course"],
  Asian: ["Chinese", "Burgers", "Snacks", "Beverages"],
  Continental: ["Pastas", "Pizzas", "Snacks"],
  Pan: ["Beverages", "Desserts", "Snacks"],
  "South Indian": ["Main Course", "Breads", "Desserts", "Beverages"],
  Momos: ["Snacks", "Burgers", "Chinese"],
  Sandwich: ["Snacks", "Burgers", "Beverages"],
};

function seed(seedValue) {
  const x = Math.sin(seedValue) * 10000;
  return x - Math.floor(x);
}

function shuffledBySeed(list, seedValue) {
  const arr = [...list];
  const out = [];
  while (arr.length) {
    const idx = Math.floor(seed(seedValue + out.length * 7) * arr.length);
    out.push(arr.splice(idx, 1)[0]);
  }
  return out;
}

function pickFromPool(cuisines) {
  const categories = [];
  cuisines.forEach((c) => {
    const mapped = CUISINE_KEYWORDS[c.name] || CUISINE_KEYWORDS[c.name.split(" ")[0]];
    if (mapped) mapped.forEach((cat) => categories.push(cat));
  });
  const uniqueCategories = [...new Set(categories)];
  const pool = D.filter((d) => uniqueCategories.includes(d.category));
  return { pool, uniqueCategories };
}

export function buildMenu(cuisines, resId) {
  const { pool, uniqueCategories } = pickFromPool(cuisines);
  const livePool = getCachedMeals();

  const catList = uniqueCategories.length
    ? uniqueCategories
    : CATEGORY_ORDER.filter((c) => c !== "Recommended");

  const getSource = (cat) => {
    if (livePool.length) {
      const live = livePool.filter((d) => d.category === cat);
      if (live.length) return live;
    }
    return pool.filter((d) => d.category === cat);
  };

  const selected = [];

  const fillCategories = (cats, offset) => {
    cats.forEach((cat, i) => {
      if (selected.length >= 16) return;
      const src = getSource(cat);
      if (!src.length) return;
      const want = Math.max(2, Math.min(4, Math.floor(seed(resId + offset + i * 11) * 4)));
      shuffledBySeed(src, resId + offset + i * 7)
        .slice(0, want)
        .forEach((item) => {
          if (!selected.some((s) => s.name === item.name)) selected.push({ ...item });
        });
    });
  };

  fillCategories(catList, 0);
  fillCategories(
    CATEGORY_ORDER.filter((c) => c !== "Recommended" && !catList.includes(c)),
    100
  );

  const withId = selected.map((item, index) => ({
    ...item,
    id: `${resId}-${index}`,
  }));
  const recommended = withId.filter((i) => i.bestseller);
  const groups = {};
  withId.forEach((item) => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });
  const menu = [];
  if (recommended.length) {
    menu.push({ category: "Recommended", items: recommended });
  }
  CATEGORY_ORDER.forEach((cat) => {
    if (cat !== "Recommended" && groups[cat]) {
      menu.push({ category: cat, items: groups[cat] });
    }
  });
  Object.keys(groups).forEach((cat) => {
    if (!CATEGORY_ORDER.includes(cat) && !menu.find((g) => g.category === cat)) {
      menu.push({ category: cat, items: groups[cat] });
    }
  });
  return menu.length ? menu : [{ category: "Recommended", items: withId }];
}

export const ALL_CUISINES = [...new Set(D.map((d) => d.category))];

export default D;
