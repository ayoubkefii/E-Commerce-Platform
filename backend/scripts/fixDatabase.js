const { Sequelize } = require("sequelize");
const { sequelize } = require("../config/database");

const fixDatabase = async () => {
  try {
    console.log("Starting aggressive database fix...");

    // Close all connections
    await sequelize.close();

    // Get database name from config
    const dbName = sequelize.config.database;
    console.log(`Dropping database: ${dbName}`);

    // Create a new connection without specifying database
    const tempSequelize = new Sequelize(
      null, // No database
      sequelize.config.username,
      sequelize.config.password,
      {
        host: sequelize.config.host,
        port: sequelize.config.port,
        dialect: sequelize.getDialect(), // Explicitly set dialect
        logging: false,
      }
    );

    // Drop and recreate database
    await tempSequelize.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
    await tempSequelize.query(`CREATE DATABASE \`${dbName}\``);
    await tempSequelize.close();

    console.log("Database dropped and recreated successfully!");

    // Reconnect and sync
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    console.log("Database tables recreated successfully!");
    console.log("You may need to re-run your seed scripts to populate data.");

    process.exit(0);
  } catch (error) {
    console.error("Error fixing database:", error);
    process.exit(1);
  }
};

fixDatabase();
