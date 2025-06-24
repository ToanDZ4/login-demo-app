import mongoose from 'mongoose';

export interface IFeedback extends mongoose.Document {
  customer: string;
  content: string;
  response?: string;
  createdAt: Date;
}

const feedbackSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  content: { type: String, required: true },
  response: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IFeedback>('Feedback', feedbackSchema); 