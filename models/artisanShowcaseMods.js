import { db } from './db.js';

// Mock artisan data for showcase
const mockArtisans = [
    {
        id: 1,
        user_id: 2,
        name: 'Maria Santos',
        profile_photo: null,
        specialty: 'Traditional Weaving',
        bio: 'Master weaver with over 30 years of experience in traditional Mangyan textile arts. Maria learned the craft from her grandmother and has dedicated her life to preserving this ancient tradition.',
        story: 'Growing up in the mountains of Gloria, I watched my grandmother weave beautiful patterns that told stories of our ancestors. Each thread carries meaning, each pattern a prayer. Today, I teach young women this sacred art so it will never be forgotten.',
        location: 'Barangay Agsalin, Gloria',
        experience_years: 30,
        awards: ['National Living Treasure Nominee 2020', 'Best Traditional Craft - Mindoro Festival 2019'],
        contact_email: 'maria.santos@email.com',
        contact_phone: '+63 917 123 4567',
        social_facebook: 'mariasantosweaving',
        social_instagram: '@mariasantos_weaves',
        rating: 4.9,
        review_count: 47,
        featured: true,
        status: 'active',
        created_at: new Date('2023-01-15')
    },
    {
        id: 2,
        user_id: 3,
        name: 'Juan Dela Cruz',
        profile_photo: null,
        specialty: 'Wood Carving',
        bio: 'Third-generation wood carver specializing in traditional Filipino religious icons and decorative pieces using native hardwoods.',
        story: 'My father taught me to see the spirit within the wood. Every piece I carve is a conversation between me and the tree that gave its life for art. I use only sustainably harvested native woods.',
        location: 'Poblacion, Gloria',
        experience_years: 25,
        awards: ['Gawad sa Sining Award 2018'],
        contact_email: 'juan.carving@email.com',
        contact_phone: '+63 918 234 5678',
        social_facebook: 'juanwoodcarving',
        social_instagram: '@juan_carves',
        rating: 4.8,
        review_count: 32,
        featured: true,
        status: 'active',
        created_at: new Date('2023-02-20')
    },
    {
        id: 3,
        user_id: 4,
        name: 'Rosa Mendoza',
        profile_photo: null,
        specialty: 'Basket Weaving',
        bio: 'Expert in traditional Filipino basket weaving using native materials like bamboo, rattan, and nito vine.',
        story: 'Basket weaving is more than a craft—it is our connection to the land. I gather materials from the forest with respect and gratitude, creating baskets that are both functional and beautiful.',
        location: 'Barangay Buong Lupa, Gloria',
        experience_years: 20,
        awards: [],
        contact_email: 'rosa.baskets@email.com',
        contact_phone: '+63 919 345 6789',
        social_facebook: null,
        social_instagram: '@rosabaskets',
        rating: 4.7,
        review_count: 28,
        featured: false,
        status: 'active',
        created_at: new Date('2023-03-10')
    },
    {
        id: 4,
        user_id: 5,
        name: 'Pedro Reyes',
        profile_photo: null,
        specialty: 'Pottery & Ceramics',
        bio: 'Traditional potter creating functional and decorative earthenware using ancestral techniques passed down through generations.',
        story: 'The clay speaks to those who listen. My hands shape what the earth provides, creating vessels that connect us to our ancestors who used the same techniques thousands of years ago.',
        location: 'Barangay Mabini, Gloria',
        experience_years: 35,
        awards: ['Heritage Craftsman Award 2021', 'Best Pottery - Oriental Mindoro Expo 2020'],
        contact_email: 'pedro.pottery@email.com',
        contact_phone: '+63 920 456 7890',
        social_facebook: 'pedropottery',
        social_instagram: null,
        rating: 4.9,
        review_count: 41,
        featured: true,
        status: 'active',
        created_at: new Date('2023-04-05')
    },
    {
        id: 5,
        user_id: 6,
        name: 'Elena Bautista',
        profile_photo: null,
        specialty: 'Embroidery & Beadwork',
        bio: 'Skilled artisan specializing in traditional Filipino embroidery and intricate beadwork for ceremonial garments.',
        story: 'Every stitch tells a story. I create pieces that honor our traditions while bringing beauty to modern celebrations. My beadwork designs are inspired by nature and Mangyan symbols.',
        location: 'Poblacion, Gloria',
        experience_years: 15,
        awards: [],
        contact_email: 'elena.embroidery@email.com',
        contact_phone: '+63 921 567 8901',
        social_facebook: 'elenaembroidery',
        social_instagram: '@elena_beadwork',
        rating: 4.6,
        review_count: 19,
        featured: false,
        status: 'active',
        created_at: new Date('2023-05-12')
    }
];

// Mock products data
const mockProducts = [
    {
        id: 1,
        artisan_id: 1,
        name: 'Mangyan Woven Blanket',
        description: 'Hand-woven blanket featuring traditional Mangyan patterns. Made from locally sourced cotton using ancestral weaving techniques. Each blanket takes approximately 2 weeks to complete.',
        category: 'textiles',
        price: 3500,
        images: ['/uploads/products/mangyan-blanket-1.jpg'],
        materials: ['Cotton', 'Natural dyes'],
        dimensions: '150cm x 200cm',
        care_instructions: 'Hand wash cold, air dry',
        stock_status: 'made_to_order',
        lead_time: '2-3 weeks',
        rating: 4.9,
        review_count: 23,
        featured: true,
        status: 'available',
        created_at: new Date('2024-01-10')
    },
    {
        id: 2,
        artisan_id: 1,
        name: 'Traditional Table Runner',
        description: 'Elegant table runner with geometric Mangyan designs. Perfect for adding cultural flair to your dining table.',
        category: 'textiles',
        price: 1200,
        images: ['/uploads/products/table-runner-1.jpg'],
        materials: ['Cotton blend'],
        dimensions: '30cm x 150cm',
        care_instructions: 'Machine wash gentle',
        stock_status: 'in_stock',
        lead_time: null,
        rating: 4.8,
        review_count: 15,
        featured: false,
        status: 'available',
        created_at: new Date('2024-01-15')
    },
    {
        id: 3,
        artisan_id: 2,
        name: 'Santo Niño Wood Carving',
        description: 'Hand-carved Santo Niño statue from native molave wood. Each piece is unique and blessed by a local priest.',
        category: 'religious',
        price: 4500,
        images: ['/uploads/products/santo-nino-1.jpg'],
        materials: ['Molave wood', 'Natural finish'],
        dimensions: '30cm height',
        care_instructions: 'Dust with soft cloth, avoid direct sunlight',
        stock_status: 'in_stock',
        lead_time: null,
        rating: 5.0,
        review_count: 18,
        featured: true,
        status: 'available',
        created_at: new Date('2024-02-01')
    },
    {
        id: 4,
        artisan_id: 2,
        name: 'Decorative Wall Panel',
        description: 'Intricately carved wall panel depicting traditional Filipino village life. A stunning centerpiece for any room.',
        category: 'home_decor',
        price: 8500,
        images: ['/uploads/products/wall-panel-1.jpg'],
        materials: ['Narra wood'],
        dimensions: '60cm x 90cm',
        care_instructions: 'Indoor use only, polish occasionally',
        stock_status: 'made_to_order',
        lead_time: '4-6 weeks',
        rating: 4.9,
        review_count: 8,
        featured: true,
        status: 'available',
        created_at: new Date('2024-02-10')
    },
    {
        id: 5,
        artisan_id: 3,
        name: 'Rattan Storage Basket',
        description: 'Handwoven rattan basket perfect for storage or as decorative piece. Features traditional weaving patterns.',
        category: 'baskets',
        price: 850,
        images: ['/uploads/products/rattan-basket-1.jpg'],
        materials: ['Rattan', 'Bamboo frame'],
        dimensions: '35cm diameter x 25cm height',
        care_instructions: 'Keep dry, dust regularly',
        stock_status: 'in_stock',
        lead_time: null,
        rating: 4.7,
        review_count: 12,
        featured: false,
        status: 'available',
        created_at: new Date('2024-02-15')
    },
    {
        id: 6,
        artisan_id: 3,
        name: 'Nito Vine Handbag',
        description: 'Elegant handbag woven from nito vine with leather handles. Lightweight yet durable, perfect for everyday use.',
        category: 'accessories',
        price: 1800,
        images: ['/uploads/products/nito-bag-1.jpg'],
        materials: ['Nito vine', 'Leather handles'],
        dimensions: '30cm x 25cm x 12cm',
        care_instructions: 'Avoid water, store in dust bag',
        stock_status: 'in_stock',
        lead_time: null,
        rating: 4.8,
        review_count: 21,
        featured: true,
        status: 'available',
        created_at: new Date('2024-03-01')
    },
    {
        id: 7,
        artisan_id: 4,
        name: 'Traditional Clay Pot (Palayok)',
        description: 'Authentic clay cooking pot made using traditional methods. Perfect for cooking traditional Filipino dishes like sinigang.',
        category: 'kitchenware',
        price: 650,
        images: ['/uploads/products/palayok-1.jpg'],
        materials: ['Local clay', 'Natural glaze'],
        dimensions: '25cm diameter',
        care_instructions: 'Season before first use, hand wash only',
        stock_status: 'in_stock',
        lead_time: null,
        rating: 4.9,
        review_count: 34,
        featured: false,
        status: 'available',
        created_at: new Date('2024-03-10')
    },
    {
        id: 8,
        artisan_id: 4,
        name: 'Decorative Vase Set',
        description: 'Set of 3 hand-thrown ceramic vases with traditional Filipino motifs. Each piece is unique.',
        category: 'home_decor',
        price: 2200,
        images: ['/uploads/products/vase-set-1.jpg'],
        materials: ['Stoneware clay', 'Hand-painted'],
        dimensions: 'Various sizes (15-30cm)',
        care_instructions: 'Decorative use, hand wash if needed',
        stock_status: 'in_stock',
        lead_time: null,
        rating: 4.8,
        review_count: 11,
        featured: true,
        status: 'available',
        created_at: new Date('2024-03-15')
    },
    {
        id: 9,
        artisan_id: 5,
        name: 'Beaded Ceremonial Necklace',
        description: 'Stunning beaded necklace inspired by traditional Mangyan designs. Perfect for special occasions.',
        category: 'jewelry',
        price: 1500,
        images: ['/uploads/products/beaded-necklace-1.jpg'],
        materials: ['Glass beads', 'Brass findings'],
        dimensions: '45cm length',
        care_instructions: 'Store flat, avoid moisture',
        stock_status: 'in_stock',
        lead_time: null,
        rating: 4.7,
        review_count: 9,
        featured: false,
        status: 'available',
        created_at: new Date('2024-04-01')
    },
    {
        id: 10,
        artisan_id: 5,
        name: 'Embroidered Barong Tagalog',
        description: 'Hand-embroidered Barong Tagalog with intricate floral patterns. Made from premium piña-jusi fabric.',
        category: 'clothing',
        price: 5500,
        images: ['/uploads/products/barong-1.jpg'],
        materials: ['Piña-jusi fabric', 'Silk thread'],
        dimensions: 'Made to measure',
        care_instructions: 'Dry clean only',
        stock_status: 'made_to_order',
        lead_time: '3-4 weeks',
        rating: 5.0,
        review_count: 7,
        featured: true,
        status: 'available',
        created_at: new Date('2024-04-10')
    }
];

// Product categories
const productCategories = [
    { id: 'textiles', name: 'Textiles & Fabrics', icon: 'fa-scroll' },
    { id: 'baskets', name: 'Baskets & Woven Items', icon: 'fa-basket-shopping' },
    { id: 'woodcraft', name: 'Wood Carvings', icon: 'fa-tree' },
    { id: 'pottery', name: 'Pottery & Ceramics', icon: 'fa-jar' },
    { id: 'jewelry', name: 'Jewelry & Accessories', icon: 'fa-gem' },
    { id: 'clothing', name: 'Traditional Clothing', icon: 'fa-shirt' },
    { id: 'home_decor', name: 'Home Decor', icon: 'fa-couch' },
    { id: 'religious', name: 'Religious Items', icon: 'fa-cross' },
    { id: 'kitchenware', name: 'Kitchenware', icon: 'fa-utensils' },
    { id: 'accessories', name: 'Bags & Accessories', icon: 'fa-bag-shopping' }
];

class ArtisanShowcase {
    // Get all artisans for showcase
    static async findAll(filters = {}) {
        try {
            let query = `
                SELECT u.id, u.name, u.profile_photo, u.bio, u.specialization as specialty,
                       u.business_name, u.phone as contact_phone, u.email as contact_email,
                       u.address as location, u.created_at,
                       (SELECT COUNT(*) FROM products WHERE artisan_id = u.id AND status = 'available') as product_count
                FROM users u 
                WHERE u.role = 'artisan' AND u.status = 'active'
            `;
            const params = [];

            if (filters.specialty) {
                query += ' AND u.specialization LIKE ?';
                params.push(`%${filters.specialty}%`);
            }

            if (filters.featured) {
                query += ' AND u.featured = 1';
            }

            if (filters.search) {
                query += ' AND (u.name LIKE ? OR u.specialization LIKE ? OR u.bio LIKE ?)';
                params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
            }

            query += ' ORDER BY u.name ASC';

            const [rows] = await db.query(query, params);
            return rows;
        } catch (err) {
            console.log('ArtisanShowcase findAll using mock data:', err.message);
            let artisans = [...mockArtisans].filter(a => a.status === 'active');

            if (filters.specialty) {
                artisans = artisans.filter(a => a.specialty.toLowerCase().includes(filters.specialty.toLowerCase()));
            }
            if (filters.featured) {
                artisans = artisans.filter(a => a.featured);
            }
            if (filters.search) {
                const search = filters.search.toLowerCase();
                artisans = artisans.filter(a =>
                    a.name.toLowerCase().includes(search) ||
                    a.specialty.toLowerCase().includes(search) ||
                    a.bio.toLowerCase().includes(search)
                );
            }

            // Add product count
            return artisans.map(a => ({
                ...a,
                product_count: mockProducts.filter(p => p.artisan_id === a.id && p.status === 'available').length
            }));
        }
    }

    // Get single artisan with full details
    static async findById(id) {
        try {
            const [rows] = await db.query(`
                SELECT u.*, 
                       (SELECT COUNT(*) FROM products WHERE artisan_id = u.id AND status = 'available') as product_count
                FROM users u 
                WHERE u.id = ? AND u.role = 'artisan'
            `, [id]);
            return rows[0];
        } catch (err) {
            console.log('ArtisanShowcase findById using mock data:', err.message);
            const artisan = mockArtisans.find(a => a.id === parseInt(id) || a.user_id === parseInt(id));
            if (artisan) {
                return {
                    ...artisan,
                    product_count: mockProducts.filter(p => p.artisan_id === artisan.id && p.status === 'available').length
                };
            }
            return null;
        }
    }

    // Get featured artisans
    static async getFeatured(limit = 4) {
        try {
            const safeLimit = parseInt(limit) || 4;
            const [rows] = await db.query(`
                SELECT u.id, u.name, u.profile_photo, u.bio, u.specialization as specialty
                FROM users u 
                WHERE u.role = 'artisan' AND u.status = 'active'
                ORDER BY RAND()
                LIMIT ${safeLimit}
            `);
            return rows;
        } catch (err) {
            console.log('ArtisanShowcase getFeatured using mock data:', err.message);
            return mockArtisans.filter(a => a.featured && a.status === 'active').slice(0, limit);
        }
    }

    // Get artisan specialties
    static async getSpecialties() {
        try {
            const [rows] = await db.query(`
                SELECT DISTINCT specialization FROM users 
                WHERE role = 'artisan' AND status = 'active' AND specialization IS NOT NULL
                ORDER BY specialization
            `);
            return rows.map(r => r.specialization);
        } catch (err) {
            return [...new Set(mockArtisans.map(a => a.specialty))].sort();
        }
    }
}

class ProductShowcase {
    // Get all products for showcase
    static async findAll(filters = {}) {
        try {
            let query = `
                SELECT p.*, u.name as artisan_name, u.profile_photo as artisan_photo
                FROM products p 
                LEFT JOIN users u ON p.artisan_id = u.id
                WHERE p.status = 'available'
            `;
            const params = [];

            if (filters.category) {
                query += ' AND p.category = ?';
                params.push(filters.category);
            }

            if (filters.artisan_id) {
                query += ' AND p.artisan_id = ?';
                params.push(filters.artisan_id);
            }

            if (filters.min_price) {
                query += ' AND p.price >= ?';
                params.push(filters.min_price);
            }

            if (filters.max_price) {
                query += ' AND p.price <= ?';
                params.push(filters.max_price);
            }

            if (filters.search) {
                query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
                params.push(`%${filters.search}%`, `%${filters.search}%`);
            }

            query += ' ORDER BY p.created_at DESC';

            if (filters.limit) {
                const safeLimit = parseInt(filters.limit) || 50;
                query += ` LIMIT ${safeLimit}`;
            }

            const [rows] = await db.query(query, params);
            return rows;
        } catch (err) {
            console.log('ProductShowcase findAll using mock data:', err.message);
            let products = [...mockProducts].filter(p => p.status === 'available');

            if (filters.category) {
                products = products.filter(p => p.category === filters.category);
            }
            if (filters.artisan_id) {
                products = products.filter(p => p.artisan_id === parseInt(filters.artisan_id));
            }
            if (filters.min_price) {
                products = products.filter(p => p.price >= filters.min_price);
            }
            if (filters.max_price) {
                products = products.filter(p => p.price <= filters.max_price);
            }
            if (filters.search) {
                const search = filters.search.toLowerCase();
                products = products.filter(p =>
                    p.name.toLowerCase().includes(search) ||
                    p.description.toLowerCase().includes(search)
                );
            }
            if (filters.limit) {
                products = products.slice(0, parseInt(filters.limit));
            }

            // Add artisan info
            return products.map(p => {
                const artisan = mockArtisans.find(a => a.id === p.artisan_id);
                return {
                    ...p,
                    artisan_name: artisan?.name || 'Unknown Artisan',
                    artisan_photo: artisan?.profile_photo
                };
            });
        }
    }

    // Get single product
    static async findById(id) {
        try {
            const [rows] = await db.query(`
                SELECT p.*, u.name as artisan_name, u.profile_photo as artisan_photo,
                       u.bio as artisan_bio, u.specialization as artisan_specialty
                FROM products p 
                LEFT JOIN users u ON p.artisan_id = u.id
                WHERE p.id = ?
            `, [id]);
            return rows[0];
        } catch (err) {
            const product = mockProducts.find(p => p.id === parseInt(id));
            if (product) {
                const artisan = mockArtisans.find(a => a.id === product.artisan_id);
                return {
                    ...product,
                    artisan_name: artisan?.name,
                    artisan_photo: artisan?.profile_photo,
                    artisan_bio: artisan?.bio,
                    artisan_specialty: artisan?.specialty
                };
            }
            return null;
        }
    }

    // Get featured products
    static async getFeatured(limit = 8) {
        try {
            const safeLimit = parseInt(limit) || 8;
            const [rows] = await db.query(`
                SELECT p.*, u.name as artisan_name
                FROM products p 
                LEFT JOIN users u ON p.artisan_id = u.id
                WHERE p.status = 'available'
                ORDER BY RAND()
                LIMIT ${safeLimit}
            `);
            return rows;
        } catch (err) {
            console.log('ProductShowcase getFeatured using mock data:', err.message);
            const featured = mockProducts.filter(p => p.featured && p.status === 'available').slice(0, limit);
            return featured.map(p => {
                const artisan = mockArtisans.find(a => a.id === p.artisan_id);
                return { ...p, artisan_name: artisan?.name };
            });
        }
    }

    // Get products by artisan
    static async findByArtisan(artisanId) {
        try {
            const [rows] = await db.query(`
                SELECT * FROM products WHERE artisan_id = ? AND status = 'available' ORDER BY created_at DESC
            `, [artisanId]);
            return rows;
        } catch (err) {
            return mockProducts.filter(p => p.artisan_id === parseInt(artisanId) && p.status === 'available');
        }
    }

    // Get categories
    static getCategories() {
        return productCategories;
    }
}

export { ArtisanShowcase, ProductShowcase, mockArtisans, mockProducts, productCategories };
