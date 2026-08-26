const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User = require('./models/user.model');
const Category = require('./models/category.model');
const Event = require('./models/event.model');
const Registration = require('./models/registration.model');
const Message = require('./models/message.model');

const seedData = require('./data/seedData');

const seedDatabase = async () => {
  try {
    await connectDB();

    await Message.deleteMany({});
    await Registration.deleteMany({});
    await Event.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});


    // USERS
    const users = await User.create(seedData.users);

    const userMap = {};

    users.forEach(user => {
      userMap[user.email] = user._id;
    });


    // CATEGORIES
    const categories = await Category.create(seedData.categories);

    const categoryMap = {};

    categories.forEach(category => {
    categoryMap[category.name] = category._id;
    });


    // EVENTS
    const events = await Event.create(
        seedData.events.map(event => ({
            ...event,

            category: categoryMap[event.category],

            organizer: userMap[event.organizer]
        }))
    );


    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Seeding error:', error);

  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

seedDatabase();