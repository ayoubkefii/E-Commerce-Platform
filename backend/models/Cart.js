const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    coupon_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coupon_discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    coupon_type: {
      type: DataTypes.ENUM("percentage", "fixed"),
      defaultValue: "percentage",
    },
    shipping_street: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shipping_city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shipping_state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shipping_zip_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shipping_country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shipping_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shipping_method_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shipping_cost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    shipping_estimated_days: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500],
      },
    },
  },
  {
    tableName: "carts",
  }
);

// Virtual for total items count
Cart.prototype.getTotalItems = function () {
  return this.CartItems
    ? this.CartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;
};

// Virtual for subtotal
Cart.prototype.getSubtotal = function () {
  return this.CartItems
    ? this.CartItems.reduce(
        (total, item) => total + parseFloat(item.price) * item.quantity,
        0
      )
    : 0;
};

// Virtual for discount amount
Cart.prototype.getDiscountAmount = function () {
  if (!this.coupon_code) return 0;

  const subtotal = this.getSubtotal();
  if (this.coupon_type === "percentage") {
    return (subtotal * parseFloat(this.coupon_discount)) / 100;
  } else {
    return Math.min(parseFloat(this.coupon_discount), subtotal);
  }
};

// Virtual for total amount
Cart.prototype.getTotal = function () {
  return (
    this.getSubtotal() -
    this.getDiscountAmount() +
    parseFloat(this.shipping_cost || 0)
  );
};

module.exports = Cart;
