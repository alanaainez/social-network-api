import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Thought } from '../models/index.js';

interface IReaction {
  reactionBody: string;
  username: string;
  createdAt?: Date;
}


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
      reactions: [],
    },
    {
      thoughtText: 'Jinkies! Leigh Howard and the Ghosts of Simmons-Pierce Manor is a great read!',
      username: 'MysteriousSpecs',
      reactions: [],
    },
    {
      thoughtText: 'Ascots are still cool.',
      username: 'GearFiveFred',
      reactions: [],
    },
    {
      thoughtText: 'Jeepers! I need a spa day after that mystery.',
      username: 'BlackBeltBlake',
      reactions: [],
    },
    {
      thoughtText: 'Ruh-oh! Time to buy more Scooby Snax!',
      username: 'ScoobyTheGreatDane',
      reactions: [],
    },
  ];

const sampleReactions = [
  {
    reactionBody: "Cool!", username: "ScoobyTheGreatDane"
  },
  {
    reactionBody: "That's awesome!", username: "GearFiveFred"
  },
  {
    reactionBody: "Totally agree!", username: "BlackBeltBlake"
  },
  {
    reactionBody: "Jinkies! Count me in!", username: "MysteriousSpecs"
  },
  {
    reactionBody: "Time for a Costco run!", username: "ChefShaggy"
  },
];

const getRandomReactions = (): IReaction[] => {
  const reactionCount = Math.floor(Math.random() * 4); // 0 to 3 reactions
  return Array.from({ length: reactionCount }, () => {
      const randomReaction = sampleReactions[Math.floor(Math.random() * sampleReactions.length)];
      return { ...randomReaction, createdAt: new Date() };
  });
};

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
                // Generate random reactions for this thought
                const reactions = getRandomReactions();

                // Create a new Thought with reactions
                const newThought = await Thought.create({
                    ...thought,
                    userId: user._id,
                    reactions, // Adding reactions here
                });

                // Link thought to user
                user.thoughts.push(newThought._id as mongoose.Types.ObjectId);
                await user.save();
            }
        }

        console.log('Thoughts seeded with reactions!');
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed.');
    }
};

  seedDatabase();