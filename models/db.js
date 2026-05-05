import { Sequelize, QueryTypes } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
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

(async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully!");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
})();

// Wrapper object with execute method for MySQL2 compatibility
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
      // For MySQL, result is the insertId directly
      const insertId = typeof result === 'number' ? result : (result && result.insertId ? result.insertId : null);
      return [{ insertId }];
    } else {
      const [results] = await sequelize.query(sql, {
        replacements: params
      });
      return [results];
    }
  },
  query: async (sql, params = []) => {
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
      // For MySQL, result is the insertId directly
      const insertId = typeof result === 'number' ? result : (result && result.insertId ? result.insertId : null);
      return [{ insertId }];
    } else {
      const [results] = await sequelize.query(sql, {
        replacements: params
      });
      return [results];
    }
  }
};

// Function to get the database instance
function getDB() {
  return db;
}

export { sequelize, db, getDB };
export default sequelize;
