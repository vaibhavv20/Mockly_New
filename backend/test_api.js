const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function test() {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'john.doe@example.com' });
    console.log(user);
    process.exit(0);
}
test();
