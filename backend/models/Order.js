const { DataTypes } = require("sequelize");
const Sequelize = require("sequelize");
const { sequelize } = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    order_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM("stripe", "paypal", "cod"),
      allowNull: false,
    },
    payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_update_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_email_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_status_enum: {
      type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
      defaultValue: "pending",
    },
    order_status: {
      type: DataTypes.ENUM(
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned"
      ),
      defaultValue: "pending",
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    shipping_cost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    coupon_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coupon_discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    coupon_type: {
      type: DataTypes.ENUM("percentage", "fixed"),
      allowNull: true,
    },
    shipping_method_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shipping_method_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    shipping_estimated_days: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tracking_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    carrier: {
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
    estimated_delivery: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelled_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    cancellation_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    refund_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_delivered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "orders",
    timestamps: true, // <-- Ensure timestamps are enabled
  }
);

module.exports = Order;
