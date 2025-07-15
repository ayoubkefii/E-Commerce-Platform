const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

// Use DATABASE_URL if available, otherwise use individual parameters
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  });
} else {
  // Handle empty password properly
  const password =
    process.env.DB_PASSWORD === "" ? null : process.env.DB_PASSWORD;

  sequelize = new Sequelize(
    process.env.DB_NAME || "ecommerce",
    process.env.DB_USER || "root",
    password,
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
      },
    }
  );
}

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw error;
  }
};

module.exports = { sequelize, testConnection };
