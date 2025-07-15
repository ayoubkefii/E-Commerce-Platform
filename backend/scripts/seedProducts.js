const { sequelize } = require("../config/database");
const Product = require("../models/Product");

const products = [
  // Electronics
  {
    name: "iPhone 15 Pro",
    description:
      "The latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Features 48MP main camera, USB-C, and all-day battery life.",
    price: 999.99,
    compare_price: 1199.99,
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Apple",
    main_image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop",
    stock: 50,
    sku: "IPH15PRO-128",
    weight: 187,
    tags: ["smartphone", "apple", "iphone", "5g", "camera"],
    specifications: {
      "Screen Size": "6.1 inches",
      Storage: "128GB",
      Color: "Natural Titanium",
      Chip: "A17 Pro",
      Camera: "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
    },
    average_rating: 4.8,
    num_reviews: 125,
    is_active: true,
    is_featured: true,
    discount: 10,
    free_shipping: true,
  },
  {
    name: "MacBook Air M2",
    description:
      "Ultra-thin laptop with M2 chip, 13.6-inch Liquid Retina display, and up to 18 hours of battery life. Perfect for work and creativity.",
    price: 1199.99,
    compare_price: 1399.99,
    category: "Electronics",
    subcategory: "Laptops",
    brand: "Apple",
    main_image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    stock: 30,
    sku: "MBA-M2-256",
    weight: 1247,
    tags: ["laptop", "apple", "macbook", "m2", "ultrabook"],
    specifications: {
      Processor: "Apple M2",
      Memory: "8GB Unified Memory",
      Storage: "256GB SSD",
      Display: "13.6-inch Liquid Retina",
      Battery: "Up to 18 hours",
    },
    average_rating: 4.9,
    num_reviews: 89,
    is_active: true,
    is_featured: true,
    discount: 15,
    free_shipping: true,
  },
  {
    name: "Sony WH-1000XM5",
    description:
      "Industry-leading noise canceling wireless headphones with exceptional sound quality and 30-hour battery life.",
    price: 399.99,
    compare_price: 449.99,
    category: "Electronics",
    subcategory: "Audio",
    brand: "Sony",
    main_image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    stock: 75,
    sku: "SONY-WH1000XM5",
    weight: 250,
    tags: ["headphones", "wireless", "noise-canceling", "bluetooth"],
    specifications: {
      Driver: "30mm",
      Frequency: "4Hz-40kHz",
      Battery: "30 hours",
      Connectivity: "Bluetooth 5.2",
      Weight: "250g",
    },
    average_rating: 4.7,
    num_reviews: 203,
    is_active: true,
    is_featured: false,
    discount: 0,
    free_shipping: true,
  },

  // Clothing
  {
    name: "Nike Air Max 270",
    description:
      "Comfortable running shoes with Air Max 270 unit for all-day comfort. Perfect for running, training, or casual wear.",
    price: 129.99,
    compare_price: 159.99,
    category: "Clothing",
    subcategory: "Shoes",
    brand: "Nike",
    main_image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    stock: 100,
    sku: "NIKE-AM270-BLK",
    weight: 320,
    tags: ["shoes", "running", "nike", "air-max", "sports"],
    specifications: {
      Upper: "Breathable mesh",
      Midsole: "Air Max 270 unit",
      Outsole: "Rubber",
      Weight: "320g",
      Type: "Running",
    },
    average_rating: 4.6,
    num_reviews: 156,
    is_active: true,
    is_featured: false,
    discount: 20,
    free_shipping: true,
  },
  {
    name: "Levi's 501 Original Jeans",
    description:
      "Classic straight-fit jeans with button fly and original 5-pocket styling. Made from premium denim for lasting comfort.",
    price: 89.99,
    compare_price: 109.99,
    category: "Clothing",
    subcategory: "Jeans",
    brand: "Levi's",
    main_image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
    stock: 200,
    sku: "LEVIS-501-32-34",
    weight: 450,
    tags: ["jeans", "denim", "levis", "classic", "casual"],
    specifications: {
      Fit: "Straight",
      Rise: "Mid-rise",
      "Leg Opening": "16 inches",
      Material: "100% Cotton",
      Care: "Machine wash cold",
    },
    average_rating: 4.5,
    num_reviews: 89,
    is_active: true,
    is_featured: false,
    discount: 0,
    free_shipping: true,
  },

  // Books
  {
    name: "The Psychology of Money",
    description:
      "Timeless lessons on wealth, greed, and happiness. A fascinating study of how people think about money.",
    price: 19.99,
    compare_price: 24.99,
    category: "Books",
    subcategory: "Business",
    brand: "Harriman House",
    main_image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop",
    stock: 150,
    sku: "BOOK-PSYCH-MONEY",
    weight: 280,
    tags: ["book", "psychology", "money", "finance", "self-help"],
    specifications: {
      Pages: "256",
      Language: "English",
      Format: "Hardcover",
      ISBN: "978-0857197689",
      Publisher: "Harriman House",
    },
    average_rating: 4.8,
    num_reviews: 342,
    is_active: true,
    is_featured: true,
    discount: 25,
    free_shipping: true,
  },
  {
    name: "Atomic Habits",
    description:
      "An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results.",
    price: 16.99,
    compare_price: 21.99,
    category: "Books",
    subcategory: "Self-Help",
    brand: "Avery",
    main_image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&h=500&fit=crop",
    stock: 120,
    sku: "BOOK-ATOMIC-HABITS",
    weight: 300,
    tags: ["book", "habits", "self-help", "productivity", "psychology"],
    specifications: {
      Pages: "320",
      Language: "English",
      Format: "Paperback",
      ISBN: "978-0735211292",
      Publisher: "Avery",
    },
    average_rating: 4.9,
    num_reviews: 567,
    is_active: true,
    is_featured: true,
    discount: 30,
    free_shipping: true,
  },

  // Home & Garden
  {
    name: "Instant Pot Duo 7-in-1",
    description:
      "7-in-1 electric pressure cooker that slow cooks, rice cooks, steams, sautés, warms, and sterilizes. Cooks up to 70% faster.",
    price: 89.99,
    compare_price: 119.99,
    category: "Home & Garden",
    subcategory: "Kitchen",
    brand: "Instant Pot",
    main_image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop",
    stock: 80,
    sku: "INSTANT-DUO-6QT",
    weight: 2500,
    tags: ["pressure-cooker", "kitchen", "cooking", "instant-pot", "appliance"],
    specifications: {
      Capacity: "6 quarts",
      Functions: "7-in-1",
      Power: "1000W",
      Material: "Stainless Steel",
      Warranty: "1 year",
    },
    average_rating: 4.7,
    num_reviews: 234,
    is_active: true,
    is_featured: false,
    discount: 15,
    free_shipping: true,
  },
  {
    name: "Philips Hue Smart Bulb Starter Kit",
    description:
      "Control your lights with your smartphone. Includes 3 white and color ambiance bulbs and a bridge for smart home integration.",
    price: 199.99,
    compare_price: 249.99,
    category: "Home & Garden",
    subcategory: "Lighting",
    brand: "Philips",
    main_image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
    stock: 45,
    sku: "PHILIPS-HUE-KIT",
    weight: 500,
    tags: ["smart-bulb", "lighting", "philips", "hue", "smart-home"],
    specifications: {
      Bulbs: "3 white and color",
      Brightness: "800 lumens",
      Colors: "16 million",
      Connectivity: "WiFi + Bluetooth",
      Compatibility: "Alexa, Google, Apple HomeKit",
    },
    average_rating: 4.6,
    num_reviews: 178,
    is_active: true,
    is_featured: false,
    discount: 0,
    free_shipping: true,
  },

  // Sports
  {
    name: "Wilson Pro Staff Tennis Racket",
    description:
      "Professional tennis racket with excellent control and precision. Used by top players worldwide.",
    price: 249.99,
    compare_price: 299.99,
    category: "Sports",
    subcategory: "Tennis",
    brand: "Wilson",
    main_image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop",
    stock: 25,
    sku: "WILSON-PRO-STAFF",
    weight: 315,
    tags: ["tennis", "racket", "wilson", "sports", "professional"],
    specifications: {
      "Head Size": "97 sq inches",
      Weight: "315g",
      "String Pattern": "16x19",
      "Grip Size": "4 1/4",
      Material: "Graphite",
    },
    average_rating: 4.8,
    num_reviews: 67,
    is_active: true,
    is_featured: false,
    discount: 10,
    free_shipping: true,
  },
  {
    name: "Nike Dri-FIT Training Shorts",
    description:
      "Lightweight, breathable training shorts with built-in liner. Perfect for workouts, running, and sports activities.",
    price: 34.99,
    compare_price: 44.99,
    category: "Sports",
    subcategory: "Activewear",
    brand: "Nike",
    main_image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop",
    stock: 150,
    sku: "NIKE-DRIFIT-SHORTS",
    weight: 180,
    tags: ["shorts", "training", "nike", "dri-fit", "sports"],
    specifications: {
      Material: "Dri-FIT fabric",
      Fit: "Regular",
      Length: "7-inch inseam",
      Features: "Built-in liner, side pockets",
      Care: "Machine wash cold",
    },
    average_rating: 4.5,
    num_reviews: 123,
    is_active: true,
    is_featured: false,
    discount: 0,
    free_shipping: true,
  },

  // Beauty
  {
    name: "Dyson Airwrap Multi-Styler",
    description:
      "Revolutionary hair styling tool that dries, curls, waves, and smooths hair using air instead of extreme heat.",
    price: 599.99,
    compare_price: 699.99,
    category: "Beauty",
    subcategory: "Hair Care",
    brand: "Dyson",
    main_image:
      "https://images.unsplash.com/photo-1522338140263-f46f5913618a?w=500&h=500&fit=crop",
    stock: 30,
    sku: "DYSON-AIRWRAP",
    weight: 1200,
    tags: ["hair-styler", "dyson", "beauty", "curling", "drying"],
    specifications: {
      Attachments: "6 styling attachments",
      Power: "1300W",
      Heat: "Intelligent heat control",
      Warranty: "2 years",
      Color: "Nickel/Copper",
    },
    average_rating: 4.9,
    num_reviews: 445,
    is_active: true,
    is_featured: true,
    discount: 0,
    free_shipping: true,
  },
  {
    name: "La Mer Moisturizing Cream",
    description:
      "Luxury moisturizing cream with Miracle Broth™. Provides intense hydration and helps reduce the look of fine lines.",
    price: 349.99,
    compare_price: 399.99,
    category: "Beauty",
    subcategory: "Skincare",
    brand: "La Mer",
    main_image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop",
    stock: 20,
    sku: "LAMER-MOISTURIZER",
    weight: 100,
    tags: ["moisturizer", "skincare", "la-mer", "luxury", "anti-aging"],
    specifications: {
      Size: "1 oz",
      "Skin Type": "All skin types",
      "Key Ingredients": "Miracle Broth™, Lime Tea",
      Texture: "Rich cream",
      Fragrance: "Subtle, fresh",
    },
    average_rating: 4.7,
    num_reviews: 89,
    is_active: true,
    is_featured: false,
    discount: 0,
    free_shipping: true,
  },

  // Toys
  {
    name: "LEGO Star Wars Millennium Falcon",
    description:
      "Iconic Star Wars spaceship with 1,329 pieces. Features detailed interior and exterior, plus 7 minifigures.",
    price: 159.99,
    compare_price: 199.99,
    category: "Toys",
    subcategory: "Building Sets",
    brand: "LEGO",
    main_image:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&h=500&fit=crop",
    stock: 40,
    sku: "LEGO-MFALCON",
    weight: 1500,
    tags: ["lego", "star-wars", "millennium-falcon", "building", "collector"],
    specifications: {
      Pieces: "1,329",
      Age: "9+",
      Dimensions: "57 x 37 x 13 cm",
      Minifigures: "7",
      Theme: "Star Wars",
    },
    average_rating: 4.9,
    num_reviews: 234,
    is_active: true,
    is_featured: true,
    discount: 20,
    free_shipping: true,
  },
  {
    name: "Nintendo Switch OLED",
    description:
      "Enhanced Nintendo Switch with 7-inch OLED screen, improved audio, and larger storage. Perfect for gaming on the go.",
    price: 349.99,
    compare_price: 399.99,
    category: "Toys",
    subcategory: "Video Games",
    brand: "Nintendo",
    main_image:
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&h=500&fit=crop",
    stock: 60,
    sku: "NINTENDO-SWITCH-OLED",
    weight: 420,
    tags: ["nintendo", "switch", "gaming", "console", "portable"],
    specifications: {
      Screen: "7-inch OLED",
      Storage: "64GB",
      Battery: "4.5-9 hours",
      Resolution: "1280x720",
      Connectivity: "WiFi, Bluetooth",
    },
    average_rating: 4.8,
    num_reviews: 567,
    is_active: true,
    is_featured: true,
    discount: 0,
    free_shipping: true,
  },

  // Automotive
  {
    name: "Dash Cam Front and Rear",
    description:
      "Dual dash cam with front and rear cameras, night vision, and loop recording. Captures HD video for safety and evidence.",
    price: 89.99,
    compare_price: 129.99,
    category: "Automotive",
    subcategory: "Electronics",
    brand: "Garmin",
    main_image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=500&fit=crop",
    stock: 85,
    sku: "GARMIN-DASHCAM",
    weight: 200,
    tags: ["dash-cam", "automotive", "safety", "recording", "garmin"],
    specifications: {
      Resolution: "1080p HD",
      Storage: "Up to 64GB",
      "Night Vision": "Yes",
      GPS: "Built-in",
      Warranty: "1 year",
    },
    average_rating: 4.6,
    num_reviews: 145,
    is_active: true,
    is_featured: false,
    discount: 30,
    free_shipping: true,
  },

  // Health
  {
    name: "Fitbit Charge 5",
    description:
      "Advanced fitness tracker with built-in GPS, heart rate monitoring, and stress management. Tracks sleep, workouts, and health metrics.",
    price: 179.99,
    compare_price: 199.99,
    category: "Health",
    subcategory: "Fitness Trackers",
    brand: "Fitbit",
    main_image:
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop",
    stock: 70,
    sku: "FITBIT-CHARGE-5",
    weight: 28,
    tags: ["fitbit", "fitness-tracker", "health", "gps", "heart-rate"],
    specifications: {
      Display: "AMOLED touchscreen",
      Battery: "Up to 7 days",
      "Water Resistance": "50m",
      Sensors: "Heart rate, GPS, SpO2",
      Compatibility: "iOS, Android",
    },
    average_rating: 4.7,
    num_reviews: 234,
    is_active: true,
    is_featured: false,
    discount: 10,
    free_shipping: true,
  },

  // Food
  {
    name: "Nespresso Vertuo Coffee Machine",
    description:
      "Premium coffee machine that brews both espresso and coffee. Uses innovative centrifusion technology for perfect extraction.",
    price: 199.99,
    compare_price: 249.99,
    category: "Food",
    subcategory: "Coffee",
    brand: "Nespresso",
    main_image:
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop",
    stock: 55,
    sku: "NESPRESSO-VERTUO",
    weight: 2500,
    tags: ["coffee-machine", "nespresso", "espresso", "brewing", "kitchen"],
    specifications: {
      Capacity: "1.2L water tank",
      Pressure: "19 bar",
      "Capsule System": "Vertuo",
      "Heat-up Time": "15 seconds",
      "Auto-off": "9 minutes",
    },
    average_rating: 4.8,
    num_reviews: 189,
    is_active: true,
    is_featured: false,
    discount: 20,
    free_shipping: true,
  },
];

const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.destroy({ where: {} });
    console.log("✅ Cleared existing products");

    // Add new products
    for (const product of products) {
      await Product.create(product);
    }
    console.log(`✅ Added ${products.length} products to the database`);

    console.log("🎉 Product seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding products:", error);
  } finally {
    await sequelize.close();
  }
};

// Run the seed function
seedProducts();
