import express from 'express';
import { getAllFeedbacks, createFeedback, respondFeedback } from '../controllers/feedbackController';

const router = express.Router();

router.get('/', getAllFeedbacks);
router.post('/', createFeedback);
router.post('/:id/respond', respondFeedback);

export default router; 