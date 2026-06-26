export const categories = ["pizza", "burger", "chicken", "pasta", "drinks", "dessert"];

export const demoProducts = [
  {
    _id: "665000000000000000000001",
    name: { en: "Margherita Pizza", ar: "بيتزا مارجريتا" },
    description: {
      en: "Classic tomato sauce, mozzarella, and fresh basil.",
      ar: "صلصة طماطم كلاسيكية مع موتزاريلا وريحان طازج.",
    },
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=900&q=80",
    price: 145,
    category: "pizza",
    available: true,
  },
  {
    _id: "665000000000000000000002",
    name: { en: "Double Beef Burger", ar: "دبل بيف برجر" },
    description: {
      en: "Two beef patties with cheddar, pickles, and house sauce.",
      ar: "قطعتان لحم مع شيدر ومخلل وصوص خاص.",
    },
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
    price: 185,
    category: "burger",
    available: true,
  },
  {
    _id: "665000000000000000000003",
    name: { en: "Crispy Chicken Meal", ar: "وجبة تشيكن كرسبي" },
    description: {
      en: "Crispy chicken pieces with fries, coleslaw, and sauce.",
      ar: "قطع دجاج مقرمشة مع بطاطس وكول سلو وصوص.",
    },
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=80",
    price: 170,
    category: "chicken",
    available: true,
  },
  {
    _id: "665000000000000000000004",
    name: { en: "Alfredo Pasta", ar: "مكرونة ألفريدو" },
    description: {
      en: "Creamy alfredo sauce with grilled chicken and parmesan.",
      ar: "صوص ألفريدو كريمي مع دجاج مشوي وبارميزان.",
    },
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=80",
    price: 160,
    category: "pasta",
    available: true,
  },
  {
    _id: "665000000000000000000005",
    name: { en: "Chocolate Cake", ar: "كيك شوكولاتة" },
    description: {
      en: "Rich chocolate cake with soft ganache topping.",
      ar: "كيك شوكولاتة غني مع طبقة جاناش ناعمة.",
    },
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
    price: 95,
    category: "dessert",
    available: true,
  },
  {
    _id: "665000000000000000000006",
    name: { en: "Fresh Orange Juice", ar: "عصير برتقال فريش" },
    description: {
      en: "Freshly squeezed orange juice served chilled.",
      ar: "عصير برتقال طازج يقدم باردًا.",
    },
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=900&q=80",
    price: 55,
    category: "drinks",
    available: true,
  },
];

export const demoOrders = [
  {
    _id: "demo-order-1001",
    products: [demoProducts[0], demoProducts[1]].map((item) => ({
      productId: item._id,
      quantity: 1,
      name: item.name,
      image: item.image,
      itemPrice: item.price,
      totalPrice: item.price,
    })),
    address: "Nasr City, Cairo",
    phone: "01000000000",
    paymentMethod: "cash",
    paymentStatus: "pending",
    status: "preparing",
    totalPrice: demoProducts[0].price + demoProducts[1].price,
    createdAt: new Date().toISOString(),
  },
];
