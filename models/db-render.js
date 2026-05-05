import { Sequelize, QueryTypes } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

// Render provides DATABASE_URL for PostgreSQL
const databaseUrl = process.env.DATABASE_URL || process.env.DB_URL;

let sequelize;

if (databaseUrl) {
  // Production: Use DATABASE_URL (PostgreSQL on Render)
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  });
} else {
  // Development: Use MySQL locally
  sequelize = new Sequelize(
    process.env.DB_NAME || 'heritagelink',
    process.env.DB_USER || 'root', 
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        connectTimeout: 10000
      }
    }
  );
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
    console.log("Database dialect:", sequelize.getDialect());
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
})();

// Wrapper object with execute method for compatibility
const db = {
  execute: async (sql, params = []) => {
    const sqlUpper = sql.trim().toUpperCase();
    const isSelect = sqlUpper.startsWith('SELECT');
    const isInsert = sqlUpper.startsWith('INSERT');
    
    if (isSelect) {
      const results = await sequelize.query(sql, {
        replacements: params,
        type: QueryTypes.SELECT
      });
      return [results];
    } else if (isInsert) {
      const [result] = await sequelize.query(sql, {
        replacements: params
      });
      // Handle both MySQL and PostgreSQL insert results
      const insertId = result && result.insertId ? result.insertId : 
                      (result && result[0] && result[0].id ? result[0].id : null);
      return [{ insertId }];
    } else {
      const [results] = await sequelize.query(sql, {
        replacements: params
      });
      return [results];
    }
  },
  query: async (sql, params = []) => {
    return await db.execute(sql, params);
  }
};

// Function to get the database instance
function getDB() {
  return db;
}

export { sequelize, db, getDB };
export default sequelize;