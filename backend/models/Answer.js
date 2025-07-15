const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Answer = sequelize.define(
  "Answer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "questions", key: "id" },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true, len: [1, 500] },
    },
  },
  {
    tableName: "answers",
    timestamps: true,
  }
);

module.exports = Answer;
