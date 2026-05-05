import { sequelize } from '../models/db.js';
import bcrypt from 'bcryptjs';

(async () => {
  try {
    console.log('🔧 Fixing admin account...\n');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Delete existing admin if any
    await sequelize.query("DELETE FROM users WHERE email = 'admin@heritagelink.com'");
    
    // Insert new admin
    await sequelize.query(`
      INSERT INTO users (username, name, email, password, role, status) 
      VALUES ('admin', 'Administrator', 'admin@heritagelink.com', '${hashedPassword}', 'admin', 'active')
    `);
    
    console.log('✅ Admin account created!');
    console.log('📧 Email: admin@heritagelink.com');
    console.log('🔑 Password: admin123');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
