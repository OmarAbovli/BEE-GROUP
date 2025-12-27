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
        const res = await pool.query('SELECT title, image_url FROM products');
        console.log("Current Product URLs:");
        res.rows.forEach(r => {
            console.log(`${r.title}: ${r.image_url}`);
        });
    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        await pool.end();
    }
}

check();
