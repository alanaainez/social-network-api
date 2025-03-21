import { Request, Response } from 'express';
import { Thought, User } from '../models/index.js';

// get all thoughts
export const getAllThoughts = async (_req: Request, res: Response) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// get single thought by id
export const getThoughtById = async (req: Request, res: Response) => {
  const { thoughtId } = req.params;
  try {
    const thought = await Thought.findById(thoughtId);
    if (thought) {
      res.json(thought);
    } else {
      res.status(404).json({
        message: 'Thought not found',
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// create a thought
export const createThought = async (req: Request, res: Response) => {
  try {
    const newThought = await Thought.create(req.body);
    res.status(201).json(newThought);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// update thought
export const updateThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!thought) {
      res.status(404).json({ message: 'No course with this id!' });
    }

    res.json(thought);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// delete thought
export const deleteThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.thoughtId );

    if (!thought) {
      res.status(404).json({
        message: 'No thought with that ID',
      });
    } else {
      await User.updateMany(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } }
      );
      res.json({ message: 'Thought and reactions deleted!' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// add a reaction to a thought
export const addReaction = async (req: Request, res: Response) => {
  console.log('You are adding a reaction');
  console.log(req.body);
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res
        .status(404)
        .json({ message: 'No thought found with that ID :(' });
    }

    return res.json(thought);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// remove reaction from a thought
export const removeReaction = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res
        .status(404)
        .json({ message: 'No thought found with that ID :(' });
    }

    return res.json(thought);
  } catch (err) {
    return res.status(500).json(err);
  }
};