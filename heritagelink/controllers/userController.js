export const getDashboard = async (req, res) => {
    try {
        console.log('👤 User dashboard access check:', req.session.user);
        
        if (!req.session.user || req.session.user.role !== 'user') {
            console.log('❌ Unauthorized access attempt to user dashboard');
            return res.redirect('/login');
        }

        console.log('✅ User access granted for:', req.session.user.name);

        // Mock data for user dashboard
        const userStats = {
            visitedDestinations: 8,
            eventsAttended: 3,
            reviewsWritten: 5,
            artisansMet: 6
        };

        res.render('user-dashboard', {
            title: 'User Dashboard - HeritageLink',
            user: req.session.user,
            ...userStats
        });
    } catch (error) {
        console.error('❌ User dashboard error:', error);
        res.status(500).render('error', { 
            title: 'Error - HeritageLink',
            message: 'Failed to load user dashboard' 
        });
    }
};

export const getMyReviews = async (req, res) => {
    try {
        console.log('📝 Fetching user reviews...');
        
        // Mock reviews data
        const reviews = [
            { id: 1, destination: 'Gloria Plaza', rating: 5, comment: 'Beautiful place!', date: '2024-01-15' },
            { id: 2, destination: 'Mount Halcon', rating: 4, comment: 'Great hiking experience', date: '2024-01-10' }
        ];
        
        res.json({ 
            success: true, 
            reviews: reviews 
        });
    } catch (error) {
        console.error('❌ Get reviews error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch reviews' 
        });
    }
};

export default { getDashboard, getMyReviews };