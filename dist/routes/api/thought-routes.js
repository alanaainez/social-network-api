import { Router } from 'express';
import { addReaction, removeReaction } from '../../controllers/thought-controller.js';
const router = Router();
import { getAllThoughts, getThoughtById, createThought, updateThought, deleteThought, } from '../../controllers/thought-controller.js';
// /api/thoughts
router.route('/').get(getAllThoughts).post(createThought);
// /api/thoughts/:thoughtId
router
    .route('/:thoughtId')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought);
// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(addReaction);
// /api/thoughts/:thoughtId/reactions/:reactionId
router.delete('/:thoughtId/reactions/:reactionId', removeReaction);
export { router as thoughtRouter };
