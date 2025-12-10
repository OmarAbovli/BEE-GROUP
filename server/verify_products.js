
const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function check() {
    try {
        const res = await pool.query('SELECT COUNT(*) FROM products');
        console.log("Product Count:", res.rows[0].count);

        if (res.rows[0].count > 0) {
            const sample = await pool.query('SELECT id, title, category_id FROM products LIMIT 3');
            console.log("Sample Products:", sample.rows);
        }

    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        await pool.end();
    }
}

check();
