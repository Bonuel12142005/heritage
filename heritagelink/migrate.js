import { getDB } from './models/db.js';
import { User } from './models/userMods.js';

export async function migrate() {
    console.log('🔄 Running database initialization and seeding...');

    try {
        // ensure pool initialises and tables are created
        await getDB();

        // ensure default test accounts exist
        const testAccounts = [
            { 
                email: 'admin@heritagelink.com', 
                name: 'Administrator', 
                password: 'admin123', 
                role: 'admin' 
            },
            { 
                email: 'artisan@heritagelink.com', 
                name: 'Juan Artisan', 
                password: 'artisan123', 
                role: 'artisan',
                bio: 'Traditional craftsman specializing in handwoven products from Gloria, Oriental Mindoro',
                specialization: 'Weaving & Basketry'
            },
            { 
                email: 'user@heritagelink.com', 
                name: 'Maria User', 
                password: 'user123', 
                role: 'user' 
            }
        ];

        for (const acct of testAccounts) {
            const existing = await User.findByEmail(acct.email);
            if (!existing) {
                console.log('🔧 Creating seed account:', acct.email);
                await User.create(acct);
            } else if (acct.role === 'artisan' && !existing.bio) {
                // Update artisan with profile info if missing
                console.log('🔧 Updating artisan profile:', acct.email);
                await User.update(existing.id, { 
                    bio: acct.bio, 
                    specialization: acct.specialization 
                });
            }
        }

        console.log('✅ Database initialized and seed accounts ensured');
    } catch (err) {
        console.error('❌ Migration error:', err && err.message ? err.message : err);
        throw err;
    }
}