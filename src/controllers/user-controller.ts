import { Request, Response } from 'express';
//import { ObjectId } from 'mongodb';
import { User, Thought } from '../models/index.js';

// get all users
export const headCount = async () => {
  const numberOfUsers = await User.aggregate([
    {
      $count: 'totalUserss',
    },
  ]);
  return numberOfUsers[0]?.totalUsers || 0;
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();

    const userObj = {
      users,
      headCount: await headCount(),
    };

    res.json(userObj);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// get single user by id
export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user) {
      res.json({
        user,
        thoughts: user,
      });
    } else {
      res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// update a user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!user) {
      res.status(404).json({ message: 'No user with this id!' });
    }

    res.json(user);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// delete user (BONUS: and delete associated thoughts)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.courseId });

    if (!user) {
      res.status(404).json({
        message: 'No thought with that ID',
      });
    } else {
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and thoughts deleted!' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// add friend to friend list
export const addFriend = async (req: Request, res: Response) => {
  console.log('You are adding a friend');
  console.log(req.body);
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.body.friendId } },
      { runValidators: true, new: true }
    );
    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};
// remove friend from friend list
export const removeFriend = async (req: Request, res: Response) => {
  console.log('You are removing a friend');
  console.log(req.body);
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.body.friendId } },
      { runValidators: true, new: true }
    );
    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
}
