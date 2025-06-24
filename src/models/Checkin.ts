import mongoose from 'mongoose';

export interface ICheckin extends mongoose.Document {
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  guestIdCard: string;
  roomNumber: string;
  roomType: string;
  keyNumber: string;
  checkInDate: Date;
  checkOutDate?: Date;
  status: 'active' | 'checked-out' | 'cancelled';
  notes?: string;
}

const checkinSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: true,
    trim: true
  },
  guestPhone: {
    type: String,
    required: true,
    trim: true
  },
  guestEmail: {
    type: String,
    trim: true
  },
  guestIdCard: {
    type: String,
    required: true,
    trim: true
  },
  roomNumber: {
    type: String,
    required: true,
    trim: true
  },
  roomType: {
    type: String,
    required: true,
    enum: ['Phòng đơn', 'Phòng đôi', 'Phòng VIP', 'Suite']
  },
  keyNumber: {
    type: String,
    required: true,
    trim: true
  },
  checkInDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkOutDate: {
    type: Date
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'checked-out', 'cancelled'],
    default: 'active'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model<ICheckin>('Checkin', checkinSchema); 