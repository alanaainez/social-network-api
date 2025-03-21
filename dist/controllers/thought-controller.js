import { Thought, User } from '../models/index.js';
// get all thoughts
export const getAllThoughts = async (_req, res) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
// get single thought by id
export const getThoughtById = async (req, res) => {
    const { thoughtId } = req.params;
    try {
        const thought = await Thought.findById(thoughtId);
        if (thought) {
            res.json(thought);
        }
        else {
            res.status(404).json({
                message: 'Thought not found',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
// create a thought
export const createThought = async (req, res) => {
    try {
        const newThought = await Thought.create(req.body);
        res.status(201).json(newThought);
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};
// update thought
export const updateThought = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true });
        if (!thought) {
            res.status(404).json({ message: 'No course with this id!' });
        }
        res.json(thought);
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};
// delete thought
export const deleteThought = async (req, res) => {
    try {
        const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
        if (!thought) {
            res.status(404).json({
                message: 'No thought with that ID',
            });
        }
        else {
            await User.updateMany({ thoughts: req.params.thoughtId }, { $pull: { thoughts: req.params.thoughtId } });
            res.json({ message: 'Thought and reactions deleted!' });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
// add a reaction to a thought
export const addReaction = async (req, res) => {
    console.log('You are adding a reaction');
    console.log(req.body);
    try {
        const { thoughtId } = req.params;
        const { reactionBody, username } = req.body;
        if (!reactionBody || !username) {
            return res.status(400).json({ message: 'Reaction body and username are required.' });
        }
        const updatedThought = await Thought.findByIdAndUpdate(thoughtId, { $push: { reactions: { reactionBody, username, createdAt: new Date() } } }, { new: true, runValidators: true });
        if (!updatedThought) {
            return res.status(404).json({ message: 'Thought not found.' });
        }
        return res.json(updatedThought);
    }
    catch (err) {
        return res.status(500).json(err);
    }
};
// remove reaction from a thought
export const removeReaction = async (req, res) => {
    try {
        const { thoughtId, reactionId } = req.params;
        const updatedThought = await Thought.findByIdAndUpdate(thoughtId, { $pull: { reactions: { _id: reactionId } } }, { new: true });
        if (!updatedThought) {
            return res.status(404).json({ message: 'Thought not found or reaction does not exist.' });
        }
        return res.json(updateThought);
    }
    catch (err) {
        return res.status(500).json(err);
    }
};
