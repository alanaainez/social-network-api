import { Router } from 'express';

const router = Router();

import {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  addFriend,
  removeFriend,
} from '../../controllers/user-controller.js';

// /api/users
router.route('/').get(getAllUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getUserById).delete(deleteUser);

// /api/users/:userId
router.route('/:userId').put(updateUser)

// /api/users/:userId/friends
router.route('/:userId/friends/:friendId').post(addFriend);

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').delete(removeFriend);

export { router as userRouter} ;
