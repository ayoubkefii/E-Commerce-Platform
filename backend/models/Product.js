const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 2000],
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    compare_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    category: {
      type: DataTypes.ENUM(
        "Electronics",
        "Clothing",
        "Books",
        "Home & Garden",
        "Sports",
        "Beauty",
        "Toys",
        "Automotive",
        "Health",
        "Food"
      ),
      allowNull: false,
    },
    subcategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    main_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    weight: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    length: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    width: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    height: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("tags");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("tags", JSON.stringify(value));
      },
    },
    specifications: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("specifications");
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue("specifications", JSON.stringify(value));
      },
    },
    average_rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    num_reviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    discount_end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    shipping_weight: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    shipping_length: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    shipping_width: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    shipping_height: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    free_shipping: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    shipping_cost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    discounted_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    tableName: "products",
    hooks: {
      beforeSave: (product) => {
        // Calculate discounted price
        if (
          product.discount > 0 &&
          (!product.discount_end_date || product.discount_end_date > new Date())
        ) {
          product.discounted_price =
            product.price - (product.price * product.discount) / 100;
        } else {
          product.discounted_price = product.price;
        }
      },
    },
  }
);

// Virtual for discounted price
Product.prototype.getDiscountedPrice = function () {
  if (
    this.discount > 0 &&
    (!this.discount_end_date || this.discount_end_date > new Date())
  ) {
    return (
      parseFloat(this.price) - (parseFloat(this.price) * this.discount) / 100
    );
  }
  return parseFloat(this.price);
};

module.exports = Product;
