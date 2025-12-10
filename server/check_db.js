require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function check() {
    await client.connect();
    try {
        const res = await client.query('SELECT model_path FROM products LIMIT 1');
        console.log("model_path column exists!");
    } catch (e) {
        console.error("Column missing?", e.message);
    } finally {
        await client.end();
    }
}

check();
