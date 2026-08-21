const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@app.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const adminUser = new User({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                roles: ['ROLE_ADMIN', 'ROLE_USER']
            });

            await adminUser.save();
            console.log("Default Admin user (admin@app.com) created successfully.");
        }
    } catch (error) {
        console.error("Error seeding default admin user:", error.message);
    }
};

module.exports = seedAdmin;
