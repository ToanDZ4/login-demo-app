import mongoose from 'mongoose';

export interface IRoom extends mongoose.Document {
  number: string;
  type: string;
  status: 'ready' | 'cleaning' | 'occupied';
  lastUpdated: Date;
  notes?: string;
}

const roomSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Phòng đơn', 'Phòng đôi', 'Phòng VIP', 'Suite']
  },
  status: {
    type: String,
    required: true,
    enum: ['ready', 'cleaning', 'occupied'],
    default: 'ready'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IRoom>('Room', roomSchema); 