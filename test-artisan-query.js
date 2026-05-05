import { db } from './models/db.js';

async function testQuery() {
    try {
        const artisanId = 1;
        const [orders] = await db.query(
            `SELECT o.*, p.name as product_name, o.user_name as customer_name, o.total_price as total_amount 
             FROM orders o 
             JOIN products p ON o.product_id = p.id 
             WHERE p.artisan_id = ? 
             ORDER BY o.created_at DESC`,
            [artisanId]
        );
        console.log('ARTISAN ID:', artisanId);
        console.log('ORDERS FOUND:', orders.length);
        console.log('ORDERS:', JSON.stringify(orders, null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error('Test query failed:', err);
        process.exit(1);
    }
}

testQuery();
