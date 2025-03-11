
// get all thoughts

// get single thought by id

// create a thought

// update thought
    
// delete thought

// add a reaction to a thought

// remove reaction from a thought
import { Request, Response } from 'express';
import { Course, Student } from '../models/index.js';

/**
 * GET All Courses /courses
 * @returns an array of Courses
 */
export const getAllCourses = async (_req: Request, res: Response) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET Course based on id /course/:id
 * @param string id
 * @returns a single Course object
 */
export const getCourseById = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({
        message: 'Course not found',
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * POST Course /courses
 * @param object username
 * @returns a single Course object
 */
export const createCourse = async (req: Request, res: Response) => {
  try {
    const newCourse = await Course.create(req.body);
    res.status(201).json(newCourse);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * PUT Course based on id /courses/:id
 * @param object id, username
 * @returns a single Course object
 */
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.courseId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!course) {
      res.status(404).json({ message: 'No course with this id!' });
    }

    res.json(course);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * DELETE Course based on id /courses/:id
 * @param string id
 * @returns string
 */
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.courseId });

    if (!course) {
      res.status(404).json({
        message: 'No course with that ID',
      });
    } else {
      await Student.deleteMany({ _id: { $in: course.students } });
      res.json({ message: 'Course and students deleted!' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

