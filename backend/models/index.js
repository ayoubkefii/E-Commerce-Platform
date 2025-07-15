const { sequelize } = require("../config/database");
const User = require("./User");
const Product = require("./Product");
const Review = require("./Review");
const Cart = require("./Cart");
const CartItem = require("./CartItem");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const ShippingAddress = require("./ShippingAddress");
const WishlistFactory = require("./Wishlist");
const Question = require("./Question");
const Answer = require("./Answer");

// Initialize Wishlist with sequelize
const Wishlist = WishlistFactory(sequelize);

// User associations
User.hasMany(Review, { foreignKey: "user_id", as: "reviews" });
User.hasOne(Cart, { foreignKey: "user_id", as: "cart" });
User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
User.hasMany(Order, { foreignKey: "cancelled_by", as: "cancelledOrders" });
User.hasMany(Question, { foreignKey: "user_id", as: "questions" });

// Product associations
Product.hasMany(Review, { foreignKey: "product_id", as: "reviews" });
Product.hasMany(CartItem, { foreignKey: "product_id", as: "cartItems" });
Product.hasMany(OrderItem, { foreignKey: "product_id", as: "orderItems" });
Product.hasMany(Question, { foreignKey: "product_id", as: "questions" });

// Review associations
Review.belongsTo(User, { foreignKey: "user_id", as: "user" });
Review.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Cart associations
Cart.belongsTo(User, { foreignKey: "user_id", as: "user" });
Cart.hasMany(CartItem, { foreignKey: "cart_id", as: "cartItems" });

// CartItem associations
CartItem.belongsTo(Cart, { foreignKey: "cart_id", as: "cart" });
CartItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Order associations
Order.belongsTo(User, { foreignKey: "user_id", as: "user" });
Order.belongsTo(User, { foreignKey: "cancelled_by", as: "cancelledByUser" });
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "orderItems" });
Order.hasOne(ShippingAddress, {
  foreignKey: "order_id",
  as: "shippingAddress",
});

// OrderItem associations
OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// ShippingAddress associations
ShippingAddress.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// Wishlist associations
User.belongsToMany(Product, {
  through: Wishlist,
  foreignKey: "user_id",
  otherKey: "product_id",
  as: "wishlistProducts",
});
Product.belongsToMany(User, {
  through: Wishlist,
  foreignKey: "product_id",
  otherKey: "user_id",
  as: "wishlistedByUsers",
});
// For controller includes
Wishlist.belongsTo(Product, { as: "product", foreignKey: "product_id" });
Wishlist.belongsTo(User, { as: "user", foreignKey: "user_id" });

// Question associations
Question.belongsTo(User, { foreignKey: "user_id", as: "user" });
Question.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Question.hasMany(Answer, { foreignKey: "question_id", as: "answers" });
Answer.belongsTo(Question, { foreignKey: "question_id", as: "question" });
Answer.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = {
  User,
  Product,
  Review,
  Cart,
  CartItem,
  Order,
  OrderItem,
  ShippingAddress,
  Wishlist,
  Question,
  Answer,
};
