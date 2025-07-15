const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "products", key: "id" },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true, len: [3, 500] },
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "questions",
    timestamps: true,
  }
);

module.exports = Question;
