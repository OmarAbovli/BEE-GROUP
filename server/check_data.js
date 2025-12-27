const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function check() {
    try {
        // Select a few products and check the specific missing fields
        const res = await pool.query(`
            SELECT id, title, ingredients, indications, usage_instructions, warning 
            FROM products 
            LIMIT 5
        `);
        console.log("Product Data Sample:");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        await pool.end();
    }
}

check();
