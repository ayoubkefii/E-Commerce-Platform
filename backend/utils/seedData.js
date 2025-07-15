const bcrypt = require("bcryptjs");
require("dotenv").config();

const { sequelize } = require("../config/database");
const { User, Product } = require("../models");

// Sample products data
const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    price: 129.99,
    compare_price: 159.99,
    category: "Electronics",
    subcategory: "Audio",
    brand: "TechSound",
    stock: 50,
    weight: 0.3,
    length: 18,
    width: 8,
    height: 3,
    tags: ["wireless", "bluetooth", "noise-cancelling", "audio"],
    specifications: {
      "Battery Life": "30 hours",
      Connectivity: "Bluetooth 5.0",
      "Noise Cancellation": "Active",
      "Water Resistance": "IPX4",
    },
    is_featured: true,
    discount: 15,
    main_image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
  },
  {
    name: "Premium Cotton T-Shirt",
    description:
      "Comfortable and stylish cotton t-shirt made from 100% organic cotton. Available in multiple colors and sizes.",
    price: 24.99,
    compare_price: 34.99,
    category: "Clothing",
    subcategory: "T-Shirts",
    brand: "EcoWear",
    stock: 100,
    weight: 0.2,
    length: 28,
    width: 20,
    height: 1,
    tags: ["cotton", "organic", "comfortable", "casual"],
    specifications: {
      Material: "100% Organic Cotton",
      Fit: "Regular",
      Care: "Machine washable",
      Sizes: "XS, S, M, L, XL, XXL",
    },
    is_featured: true,
    discount: 25,
    main_image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
  },
  {
    name: "Smart Fitness Watch",
    description:
      "Advanced fitness tracking watch with heart rate monitor, GPS, and 7-day battery life. Perfect for athletes and health enthusiasts.",
    price: 199.99,
    compare_price: 249.99,
    category: "Electronics",
    subcategory: "Wearables",
    brand: "FitTech",
    stock: 30,
    weight: 0.05,
    length: 4,
    width: 4,
    height: 1,
    tags: ["fitness", "smartwatch", "health", "tracking"],
    specifications: {
      "Battery Life": "7 days",
      "Water Resistance": "5ATM",
      GPS: "Built-in",
      "Heart Rate Monitor": "Yes",
      Compatibility: "iOS & Android",
    },
    is_featured: true,
    discount: 20,
    main_image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
  },
  {
    name: "Professional Coffee Maker",
    description:
      "Automatic coffee maker with programmable settings, thermal carafe, and 12-cup capacity. Perfect for home and office use.",
    price: 89.99,
    compare_price: 119.99,
    category: "Home & Garden",
    subcategory: "Kitchen Appliances",
    brand: "BrewMaster",
    stock: 25,
    weight: 3.5,
    length: 35,
    width: 25,
    height: 40,
    tags: ["coffee", "automatic", "programmable", "kitchen"],
    specifications: {
      Capacity: "12 cups",
      Programmable: "Yes",
      "Thermal Carafe": "Yes",
      "Auto Shut-off": "Yes",
      Warranty: "2 years",
    },
    is_featured: false,
    discount: 30,
    main_image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500",
  },
  {
    name: "Yoga Mat Premium",
    description:
      "Non-slip yoga mat made from eco-friendly materials. Perfect thickness for comfort and stability during practice.",
    price: 39.99,
    compare_price: 59.99,
    category: "Sports",
    subcategory: "Yoga",
    brand: "ZenFit",
    stock: 75,
    weight: 1.2,
    length: 183,
    width: 61,
    height: 0.6,
    tags: ["yoga", "non-slip", "eco-friendly", "fitness"],
    specifications: {
      Material: "Eco-friendly TPE",
      Thickness: "6mm",
      Length: "183cm",
      Width: "61cm",
      "Non-slip": "Yes",
    },
    is_featured: false,
    discount: 25,
    main_image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
  },
  {
    name: "Organic Face Cream",
    description:
      "Hydrating face cream made with natural ingredients. Suitable for all skin types and provides 24-hour moisture.",
    price: 29.99,
    compare_price: 39.99,
    category: "Beauty",
    subcategory: "Skincare",
    brand: "NaturalGlow",
    stock: 60,
    weight: 0.1,
    length: 6,
    width: 6,
    height: 8,
    tags: ["organic", "skincare", "hydrating", "natural"],
    specifications: {
      Volume: "50ml",
      "Skin Type": "All types",
      Ingredients: "Natural & Organic",
      Fragrance: "Unscented",
      "Shelf Life": "24 months",
    },
    is_featured: false,
    discount: 20,
    main_image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500",
  },
];

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({
      where: { email: "admin@ecommerce.com" },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 12);
      await User.create({
        name: "Admin User",
        email: "admin@ecommerce.com",
        password: hashedPassword,
        role: "admin",
        is_email_verified: true,
        is_active: true,
      });
      console.log("✅ Admin user created successfully");
    } else {
      console.log("ℹ️ Admin user already exists");
    }
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  }
};

const createRegularUser = async () => {
  try {
    const existingUser = await User.findOne({
      where: { email: "user@ecommerce.com" },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("user123", 12);
      await User.create({
        name: "Regular User",
        email: "user@ecommerce.com",
        password: hashedPassword,
        role: "user",
        is_email_verified: true,
        is_active: true,
      });
      console.log("✅ Regular user created successfully");
    } else {
      console.log("ℹ️ Regular user already exists");
    }
  } catch (error) {
    console.error("❌ Error creating regular user:", error);
  }
};

const seedProducts = async () => {
  try {
    for (const productData of sampleProducts) {
      const existingProduct = await Product.findOne({
        where: { name: productData.name },
      });

      if (!existingProduct) {
        await Product.create(productData);
        console.log(`✅ Product "${productData.name}" created successfully`);
      } else {
        console.log(`ℹ️ Product "${productData.name}" already exists`);
      }
    }
    console.log("✅ All products seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding products:", error);
  }
};

const seedData = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    await connectDB();
    await createAdminUser();
    await createRegularUser();
    await seedProducts();

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📋 Test Accounts:");
    console.log("👤 Admin: admin@ecommerce.com / admin123");
    console.log("👤 User: user@ecommerce.com / user123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
};

// Run the seeding
seedData();
