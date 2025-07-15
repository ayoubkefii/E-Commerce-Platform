const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Wishlist = sequelize.define(
    "Wishlist",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["user_id", "product_id"],
        },
      ],
      tableName: "wishlists",
      timestamps: false,
    }
  );

  return Wishlist;
};
