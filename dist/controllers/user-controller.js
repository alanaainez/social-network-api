//import { ObjectId } from 'mongodb';
import { User, Thought } from '../models/index.js';
// get all users
export const headCount = async () => {
    const numberOfUsers = await User.aggregate([
        {
            $count: 'totalUsers',
        }
    ]);
    return numberOfUsers[0]?.totalUsers || 0;
};
export const getAllUsers = async (_req, res) => {
    try {
        const users = await User.find()
            .populate('thoughts')
            .populate('friends');
        const userObj = {
            users,
            headCount: await headCount(),
        };
        res.json(userObj);
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
    return;
};
// get single user by id
export const getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId)
            .populate('thoughts')
            .populate('friends');
        if (!user) {
            return res.status(404).json({
                message: `No user found with ID: ${userId}`,
            });
        }
        // Log if the user has no thoughts
        if (!user.thoughts.length) {
            console.log(`User ${user.username} has no thoughts yet.`);
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
    return;
};
// create a new user
export const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};
// update a user
export const updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { runValidators: true, new: true });
        if (!user) {
            res.status(404).json({ message: 'No user with this id!' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};
// delete user (BONUS: and delete associated thoughts)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });
        if (!user) {
            res.status(404).json({
                message: `No thought found with ID: ${req.params.thoughtId}`,
            });
        }
        else {
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: 'User and thoughts deleted!' });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
// add friend to friend list
export const addFriend = async (req, res) => {
    console.log('You are adding a friend');
    console.log(req.body);
    try {
        const user = await User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { runValidators: true, new: true });
        return res.json(user);
    }
    catch (err) {
        return res.status(500).json(err);
    }
};
// remove friend from friend list
export const removeFriend = async (req, res) => {
    console.log('You are removing a friend');
    console.log(req.body);
    try {
        const user = await User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { runValidators: true, new: true });
        return res.json(user);
    }
    catch (err) {
        return res.status(500).json(err);
    }
};
