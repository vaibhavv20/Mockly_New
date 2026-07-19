require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const emailToMakeAdmin = process.argv[2];

if (!emailToMakeAdmin) {
    console.error('Please provide an email address. Example: node makeAdmin.js admin@example.com');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log('Connected to MongoDB...');
    const user = await User.findOne({ email: emailToMakeAdmin });
    
    if (!user) {
        console.error(`User with email ${emailToMakeAdmin} not found! Please create an account first.`);
        process.exit(1);
    }

    user.isAdmin = true;
    await user.save();
    
    console.log(`Success! ${emailToMakeAdmin} is now an Admin.`);
    process.exit(0);
})
.catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
