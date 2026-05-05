export const getDashboard = async (req, res) => {
    try {
        console.log('🛠️ Artisan dashboard access check:', req.session.user);
        
        if (!req.session.user || req.session.user.role !== 'artisan') {
            console.log('❌ Unauthorized access attempt to artisan dashboard');
            return res.redirect('/login');
        }

        console.log('✅ Artisan access granted for:', req.session.user.name);

        // Mock data for artisan dashboard
        const dashboardData = {
            productCount: 12,
            orderCount: 5,
            reviewCount: 8,
            earnings: 15000
        };

        res.render('artisan-dashboard', {
            title: 'Artisan Dashboard - HeritageLink',
            user: req.session.user,
            ...dashboardData
        });
    } catch (error) {
        console.error('❌ Artisan dashboard error:', error);
        res.status(500).render('error', { 
            title: 'Error - HeritageLink',
            message: 'Failed to load artisan dashboard' 
        });
    }
};

export const getMyProducts = async (req, res) => {
    try {
        console.log('📦 Fetching artisan products...');
        
        // Mock products data
        const products = [
            { id: 1, name: 'Handwoven Basket', price: 500, status: 'Active' },
            { id: 2, name: 'Wood Carving', price: 1200, status: 'Active' },
            { id: 3, name: 'Traditional Pottery', price: 800, status: 'Pending' }
        ];
        
        res.json({ 
            success: true, 
            products: products 
        });
    } catch (error) {
        console.error('❌ Get products error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch products' 
        });
    }
};

export default { getDashboard, getMyProducts };