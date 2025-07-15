const { sequelize } = require("../config/database");
const Product = require("../models/Product");
const OrderItem = require("../models/OrderItem");
const CartItem = require("../models/CartItem");

(async () => {
  try {
    // Drop referencing tables first
    await OrderItem.drop();
    await CartItem.drop();
    // Drop Product table
    await Product.drop();
    // Recreate Product table
    await Product.sync({ force: true });
    // Recreate referencing tables
    await OrderItem.sync({ force: true });
    await CartItem.sync({ force: true });
    console.log("OrderItem, CartItem, and Product tables force-synced!");
    process.exit(0);
  } catch (err) {
    console.error("Force sync error:", err);
    process.exit(1);
  }
})();
