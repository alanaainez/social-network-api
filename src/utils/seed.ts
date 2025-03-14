import mongoose from 'mongoose';
import { User, Thought } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);

  const users = [
    {
      username: 'ChefShaggy',
      email: 'nsrogers@gmail.com',
    },
    {
      username: 'MysteriousSpecs',
      email: 'vdinkley@gmail.com',
    },
    {
      username: 'GearFiveFred',
      email: 'fjones@gmail.com',
    },
    {
      username: 'BlackBeltBlake',
      email: 'dblake@gmail.com',
    },
    {
      username: 'ScoobyTheGreatDane',
      email: 'scoobert.doo@gmail.com',
    },
  ];

  const thoughts = [
    {
      thoughtText: 'Zoinks! A Hobbit-style buffet at the Renaissance Fair!',
      username: 'ChefShaggy',
    },
    {
      thoughtText: 'Jinkies! Leigh Howard and the Ghosts of Simmons-Pierce Manor is a great read!',
      username: 'MysteriousSpecs',
    },
    {
      thoughtText: 'Ascots are still cool.',
      username: 'GearFiveFred',
    },
    {
      thoughtText: 'Jeepers! I need a spa day after that mystery.',
      username: 'BlackBeltBlake',
    },
    {
      thoughtText: 'Ruh-oh! Time to buy more Scooby Snax!',
      username: 'ScoobyTheGreatDane',
    },
  ];

  // Seed Function
const seedDatabase = async () => {
    try {
      // Clear existing data
      await User.deleteMany({});
      await Thought.deleteMany({});
  
      console.log('Database cleared!');
  
      // Insert Users
      const createdUsers = await User.insertMany(users);
      console.log('Users seeded!');
  
      // Assign thoughts to users
      for (const thought of thoughts) {
        const user = createdUsers.find(u => u.username === thought.username);
        if (user) {
          const newThought = await Thought.create({ ...thought, userId: user._id });
          user.thoughts.push(newThought._id as mongoose.Types.ObjectId);
          await user.save();
        }
      }
  
      console.log('Thoughts seeded!');
    } catch (err) {
      console.error(err);
    } finally {
      mongoose.connection.close();
      console.log('Database connection closed.');
    }
  };

  seedDatabase();