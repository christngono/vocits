import { voteVocit } from '../controllers/vocitsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

router.post('/:id/vote', authMiddleware, voteVocit);
