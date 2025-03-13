import mongoose from 'mongoose';
import { User, Thought } from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);

  const users = [
    {
      username: 'exampleUser1',
      email: 'user1@gmail.com',
    },
    {
      username: 'exampleUser2',
      email: 'user2@gmail.com',
    },
  ];

  const thoughts = [
    {
      thoughtText: 'This is my first thought!',
      username: 'exampleUser1',
    },
    {
      thoughtText: 'Loving this social network API!',
      username: 'exampleUser2',
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
          user.thoughts.push(newThought._id);
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