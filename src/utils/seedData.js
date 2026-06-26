import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../../DB/connection.js";
import { Product } from "../../DB/models/product.model.js";
import { User } from "../../DB/models/user.model.js";

dotenv.config();

const adminData = {
  userName: "Food Admin",
  email: "admin@foodapp.com",
  password: "Admin123456",
  phone: "01000000000",
  address: "Cairo, Egypt",
  role: "admin",
  isActive: true,
};

const products = [
  {
    name: { en: "Margherita Pizza", ar: "بيتزا مارجريتا" },
    description: {
      en: "Classic tomato sauce, mozzarella, and fresh basil.",
      ar: "صلصة طماطم كلاسيكية مع موتزاريلا وريحان طازج.",
    },
    image:
      "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=900&q=80",
    price: 145,
    category: "pizza",
    available: true,
  },
  {
    name: { en: "Double Beef Burger", ar: "دبل بيف برجر" },
    description: {
      en: "Two beef patties with cheddar, pickles, and house sauce.",
      ar: "قطعتان لحم مع شيدر ومخلل وصوص خاص.",
    },
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
    price: 185,
    category: "burger",
    available: true,
  },
  {
    name: { en: "Crispy Chicken Meal", ar: "وجبة تشيكن كرسبي" },
    description: {
      en: "Crispy chicken pieces with fries, coleslaw, and sauce.",
      ar: "قطع دجاج مقرمشة مع بطاطس وكول سلو وصوص.",
    },
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=80",
    price: 170,
    category: "chicken",
    available: true,
  },
  {
    name: { en: "Alfredo Pasta", ar: "مكرونة ألفريدو" },
    description: {
      en: "Creamy alfredo sauce with grilled chicken and parmesan.",
      ar: "صوص ألفريدو كريمي مع دجاج مشوي وبارميزان.",
    },
    image:
      "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=80",
    price: 160,
    category: "pasta",
    available: true,
  },
  {
    name: { en: "Chocolate Cake", ar: "كيك شوكولاتة" },
    description: {
      en: "Rich chocolate cake with soft ganache topping.",
      ar: "كيك شوكولاتة غني مع طبقة جاناش ناعمة.",
    },
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
    price: 95,
    category: "dessert",
    available: true,
  },
  {
    name: { en: "Fresh Orange Juice", ar: "عصير برتقال فريش" },
    description: {
      en: "Freshly squeezed orange juice served chilled.",
      ar: "عصير برتقال طازج يقدم باردًا.",
    },
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=900&q=80",
    price: 55,
    category: "drinks",
    available: true,
  },
];

const seed = async () => {
  await connectDB();

  let admin = await User.findOne({ email: adminData.email });

  if (!admin) {
    admin = new User(adminData);
  } else {
    admin.userName = adminData.userName;
    admin.password = adminData.password;
    admin.phone = adminData.phone;
    admin.address = adminData.address;
    admin.role = "admin";
    admin.isActive = true;
  }

  await admin.save();

  for (const productData of products) {
    await Product.findOneAndUpdate(
      { "name.en": productData.name.en },
      {
        ...productData,
        createdBy: admin._id,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  console.log("Seed completed successfully");
  console.log("Admin email:", adminData.email);
  console.log("Admin password:", adminData.password);

  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error("Seed failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});
