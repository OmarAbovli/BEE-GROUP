require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function seedAdmin() {
    await client.connect();
    try {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await client.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO UPDATE SET password = $2',
            ['admin', hashedPassword, 'admin']
        );
        console.log("Admin user seeded successfully");
    } catch (err) {
        console.error("Error seeding admin", err);
    } finally {
        await client.end();
    }
}

seedAdmin();
