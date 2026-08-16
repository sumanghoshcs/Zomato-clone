import { RESTAURANTS, getRestaurantById, searchRestaurants } from "./restaurants";
import { buildMenu } from "./dishCatalog";
import { applyCoupon } from "./coupons";
import { mealToDish } from "./mealDB";

describe("restaurant data", () => {
  test("normalizes restaurants from all sources", () => {
    expect(RESTAURANTS.length).toBeGreaterThan(30);
    RESTAURANTS.forEach((r) => {
      expect(r.id).toBeTruthy();
      expect(r.name).toBeTruthy();
      expect(r.image).toBeTruthy();
      expect(Array.isArray(r.cuisines)).toBe(true);
      expect(r.offers.length).toBeGreaterThan(0);
      expect(r.menu.length).toBeGreaterThan(0);
      r.menu.forEach((g) => {
        expect(g.category).toBeTruthy();
        expect(g.items.length).toBeGreaterThan(0);
      });
    });
  });

  test("menu items have unique ids within a restaurant", () => {
    const r = getRestaurantById(RESTAURANTS[0].id);
    const ids = r.menu.flatMap((g) => g.items.map((i) => i.id));
    expect(new Set(ids).size).toBeGreaterThan(10);
    ids.forEach((id) => expect(id).toContain(r.id));
  });

  test("buildMenu returns valid menu for any cuisine list", () => {
    const menu = buildMenu([{ name: "Unknown Cuisine Xyz" }], 12345);
    expect(menu.length).toBeGreaterThan(0);
    const menu2 = buildMenu([{ name: "Biryani" }, { name: "Pizza" }], 54321);
    expect(menu2.length).toBeGreaterThan(0);
  });

  test("search finds restaurants and sorts by rating", () => {
    const results = searchRestaurants("pizza", { source: "all", sort: "rating" });
    expect(results.length).toBeGreaterThan(0);
    for (let i = 1; i < results.length; i++) {
      expect(parseFloat(results[i - 1].rating)).toBeGreaterThanOrEqual(
        parseFloat(results[i].rating)
      );
    }
  });

  test("coupons compute discounts correctly", () => {
    expect(applyCoupon("WELCOME50", 300, 40)).toMatchObject({ valid: true, discount: 100 });
    expect(applyCoupon("FLAT100", 500, 40)).toMatchObject({ valid: true, discount: 100 });
    expect(applyCoupon("FLAT100", 200, 40)).toMatchObject({ valid: false });
    expect(applyCoupon("INVALID", 500, 40)).toMatchObject({ valid: false });
    expect(applyCoupon("FREEDEL", 250, 40)).toMatchObject({ valid: true, discount: 40 });
  });

  test("mealToDish maps TheMealDB meals to menu items", () => {
    const dish = mealToDish(
      { idMeal: "52959", strMeal: "Chicken Handi", strMealThumb: "https://example.com/x.jpg", strCategory: "Chicken" },
      "Chicken"
    );
    expect(dish.name).toBe("Chicken Handi");
    expect(dish.img).toContain("example.com");
    expect(dish.veg).toBe(false);
    expect(dish.category).toBe("Main Course");
    expect(dish.price).toBeGreaterThan(0);
    expect(dish.rating).toBeGreaterThanOrEqual(3);
    expect(dish.votes).toBeGreaterThan(0);

    const vegDish = mealToDish(
      { idMeal: "52999", strMeal: "Vegetarian Pasta", strMealThumb: "https://example.com/y.jpg", strCategory: "Vegetarian" },
      "Vegetarian"
    );
    expect(vegDish.veg).toBe(true);
    expect(vegDish.category).toBe("Main Course");

    const stable = mealToDish(
      { idMeal: "52959", strMeal: "Chicken Handi", strMealThumb: "https://example.com/x.jpg", strCategory: "Chicken" },
      "Chicken"
    );
    expect(stable.price).toBe(dish.price);
    expect(stable.rating).toBe(dish.rating);
  });
});
