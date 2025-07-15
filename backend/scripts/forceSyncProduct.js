const { sequelize } = require("../config/database");
const Product = require("../models/Product");

(async () => {
  try {
    await Product.sync({ force: true });
    console.log("Product table force-synced!");
    process.exit(0);
  } catch (err) {
    console.error("Force sync error:", err);
    process.exit(1);
  }
})();
