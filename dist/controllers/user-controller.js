//import { ObjectId } from 'mongodb';
import User from '../models/User.js';
import Thought from '../models/Thought.js';
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
        const { userId, friendId } = req.params;
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        if (!user || !friend) {
            return res.status(404).json({ message: "User or Friend not found" });
        }
        // Check if already friends
        if (user.friends.includes(friendId)) {
            return res.status(400).json({ message: "Already friends" });
        }
        // Add friend
        user.friends.push(friendId);
        await user.save();
        // Also add the user to the friend's list (mutual friendship)
        friend.friends.push(userId);
        await friend.save();
        return res.json({ message: "Friend added!", user });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
// remove friend from friend list
export const removeFriend = async (req, res) => {
    console.log('You are removing a friend');
    console.log(req.params);
    try {
        const { userId, friendId } = req.params;
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        if (!user || !friend) {
            return res.status(404).json({ message: "User or Friend not found" });
        }
        // Remove friend
        user.friends = user.friends.filter(id => id.toString() !== friendId);
        await user.save();
        // Also remove the user from the friend's list (mutual removal)
        friend.friends = friend.friends.filter(id => id.toString() !== userId);
        await friend.save();
        return res.json({ message: "Friend removed!", user });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
