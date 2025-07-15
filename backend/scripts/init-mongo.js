// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the ecommerce database
db = db.getSiblingDB("ecommerce");

// Create collections
db.createCollection("users");
db.createCollection("products");
db.createCollection("carts");
db.createCollection("orders");

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ name: "text", description: "text" });
db.products.createIndex({ category: 1 });
db.products.createIndex({ brand: 1 });
db.products.createIndex({ price: 1 });
db.orders.createIndex({ user: 1 });
db.orders.createIndex({ orderNumber: 1 }, { unique: true });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });

print("MongoDB initialized successfully!");
print("Database: ecommerce");
print("Collections: users, products, carts, orders");
print("Indexes created for optimal performance");
