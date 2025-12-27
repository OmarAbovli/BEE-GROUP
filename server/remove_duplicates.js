import { db } from './src/db/index.js';
import { products } from './src/db/schema.js';
import { sql } from 'drizzle-orm';

async function removeDuplicates() {
    try {
        console.log('Removing duplicate products...');

        // Keep only the first occurrence of each product title
        await db.execute(sql`
            DELETE FROM products
            WHERE id NOT IN (
                SELECT MIN(id)
                FROM products
                GROUP BY title
            )
        `);

        console.log('✅ Duplicates removed!');

        // Show remaining products
        const remaining = await db.select().from(products);
        console.log(`\nRemaining products: ${remaining.length}`);
        remaining.forEach(p => console.log(`- ${p.title}`));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

removeDuplicates();
