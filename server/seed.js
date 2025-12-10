require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function seed() {
    await client.connect();
    try {
        const hashedPassword = await bcrypt.hash("bee2025", 10);
        const query = `
      INSERT INTO users (username, password, role) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (username) DO NOTHING
    `;
        await client.query(query, ['admin', hashedPassword, 'admin']);
        console.log("Admin seeded successfully");
    } catch (err) {
        console.error("Error seeding", err);
    } finally {
        await client.end();
    }
}

seed();
