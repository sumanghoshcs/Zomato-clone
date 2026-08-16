export const COUPONS = [
  {
    code: "WELCOME50",
    label: "50% OFF up to \u20b9100",
    type: "percent",
    value: 50,
    maxDiscount: 100,
    minOrder: 99,
    description: "Use WELCOME50 on your first order to get 50% OFF up to \u20b9100.",
  },
  {
    code: "FLAT100",
    label: "Flat \u20b9100 OFF above \u20b9399",
    type: "flat",
    value: 100,
    minOrder: 399,
    description: "Save a flat \u20b9100 on every order above \u20b9399.",
  },
  {
    code: "ZOMATO20",
    label: "20% OFF up to \u20b9150",
    type: "percent",
    value: 20,
    maxDiscount: 150,
    minOrder: 249,
    description: "Get 20% OFF (max \u20b9150) on orders above \u20b9249.",
  },
  {
    code: "FREEDEL",
    label: "Free Delivery",
    type: "freeDelivery",
    value: 0,
    minOrder: 199,
    description: "Free delivery on orders above \u20b9199.",
  },
  {
    code: "SAVE125",
    label: "\u20b9125 OFF above \u20b9499",
    type: "flat",
    value: 125,
    minOrder: 499,
    description: "Flat \u20b9125 off on orders above \u20b9499.",
  },
];

export function applyCoupon(code, subtotal, deliveryFee) {
  const coupon = COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
  if (!coupon) return { valid: false, reason: "Invalid coupon code", discount: 0 };
  if (subtotal < coupon.minOrder) {
    return {
      valid: false,
      reason: `Add items worth \u20b9${coupon.minOrder} or more to use this coupon`,
      discount: 0,
    };
  }
  let discount = 0;
  if (coupon.type === "percent") {
    discount = Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount);
  } else if (coupon.type === "flat") {
    discount = coupon.value;
  } else if (coupon.type === "freeDelivery") {
    discount = deliveryFee;
  }
  discount = Math.min(discount, subtotal);
  return { valid: true, reason: coupon.label, discount: Math.round(discount), coupon };
}
