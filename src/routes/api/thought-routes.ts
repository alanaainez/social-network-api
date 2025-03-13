import { Router } from 'express';

const router = Router();

import {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
} from '../../controllers/thought-controller.js';

// /api/thoughts
router.route('/').get(getAllThoughts).post(createThought);

// /api/thoughts/:thoughtId
router
  .route('/:thoughtId')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post((_, res) => {
  res.send('Create a reaction to a thought');
});

// /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId').delete((_, res) => {
  res.send('Delete a reaction from a thought');
});

export { router as thoughtRouter };
