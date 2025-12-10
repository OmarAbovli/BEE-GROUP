require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function reset() {
    await client.connect();
    try {
        await client.query('DROP TABLE IF EXISTS "products" CASCADE');
        await client.query('DROP TABLE IF EXISTS "categories" CASCADE');
        await client.query('DROP TABLE IF EXISTS "users" CASCADE');
        await client.query('DROP TABLE IF EXISTS "drizzle_migrations" CASCADE');
        console.log("All tables dropped successfully");
    } catch (err) {
        console.error("Error dropping tables", err);
    } finally {
        await client.end();
    }
}

reset();
