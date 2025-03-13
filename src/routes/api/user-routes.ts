import { get } from "mongoose";
import { Router } from 'express';

const router = Router();

import {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  addFriend,
  removeFriend,
} from '../../controllers/user-controller.js';

// /api/users
router.route('/').get(getAllUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getUserById).delete(deleteUser);

// /api/students/:userId/friends
router.route('/:userId/friends').post(addFriend);

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').delete(removeFriend);

export { router as studentRouter} ;
