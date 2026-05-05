import { Sequelize, QueryTypes } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

// Use DATABASE_URL from Aiven
const databaseUrl = process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
    // Production: Use DATABASE_URL from Aiven
    sequelize = new Sequelize(databaseUrl, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
} else {
    // Development fallback
    sequelize = new Sequelize(
        process.env.DB_NAME || 'heritagelink',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || '',
        {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            logging: false
        }
    );
}

// Test connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully!");
        console.log("📊 Database dialect:", sequelize.getDialect());
    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
    }
})();

// Database wrapper for compatibility
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
            // PostgreSQL returns different format than MySQL
            const insertId = result && result[0] && result[0].id ? result[0].id : null;
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

export { sequelize, db };
export default sequelize;