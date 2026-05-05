import { User } from '../models/userModels.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('🔐 Login attempt for:', email);
        
        // Find user by email
        let user = null;
        try {
            user = await User.findByEmail(email);
        } catch (dbErr) {
            console.warn('⚠️  DB lookup failed during login, will try local fallback:', dbErr && dbErr.message ? dbErr.message : dbErr);
        }
        
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password. Please make sure you have an account.' 
            });
        }
        
        // Compare password
        const isPasswordValid = await User.comparePassword(password, user.password, user);
        if (!isPasswordValid) {
            console.log('❌ Invalid password for:', email);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        // Set session (remove password from session)
        const userSession = {
            id: user.id,
            email: user.email,
            name: user.name || user.username,
            role: user.role,
            profile_photo: user.profile_photo || null
        };
        
        req.session.user = userSession;
        
        console.log('✅ Login successful:', userSession);
        
        // Determine redirect URL based on role
        let redirectUrl = '/user/dashboard';
        if (user.role === 'admin') redirectUrl = '/admin/dashboard';
        if (user.role === 'artisan') redirectUrl = '/artisan/dashboard';
        
        res.json({ 
            success: true, 
            message: 'Login successful', 
            user: userSession,
            redirect: redirectUrl
        });
        
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
};

export const register = async (req, res) => {
    try {
        const { name, email, password, role = 'user' } = req.body;
        console.log('📝 Registration attempt:', { name, email, role });
        
        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            console.log('❌ User already exists:', email);
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email' 
            });
        }
        
        // Create new user
        const newUser = await User.create({
            name,
            email,
            password,
            role
        });
        
        // Auto-login after registration
        const userSession = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name || newUser.username,
            role: newUser.role
        };
        
        req.session.user = userSession;
        
        console.log('✅ Registration successful:', userSession);
        
        // Determine redirect URL based on role
        let redirectUrl = '/user/dashboard';
        if (newUser.role === 'admin') redirectUrl = '/admin/dashboard';
        if (newUser.role === 'artisan') redirectUrl = '/artisan/dashboard';
        
        res.json({ 
            success: true, 
            message: 'Registration successful', 
            user: userSession,
            redirect: redirectUrl
        });
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration' 
        });
    }
};

export const logout = (req, res) => {
    console.log('🚪 Logout attempt for:', req.session.user?.email);
    req.session.destroy((err) => {
        if (err) {
            console.error('❌ Logout error:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Logout failed' 
            });
        }
        console.log('✅ Logout successful');
        res.json({ 
            success: true, 
            message: 'Logout successful' 
        });
    });
};

export const getCurrentUser = (req, res) => {
    if (req.session.user) {
        res.json({ 
            success: true, 
            user: req.session.user 
        });
    } else {
        res.json({ 
            success: false, 
            user: null 
        });
    }
};

export default { login, register, logout, getCurrentUser };