import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^[a-zA-Z0-9]+$/.test(v);
      },
      message: 'Username cannot contain special characters'
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    validate: {
      validator: function(v: string) {
        return /^[a-zA-Z0-9]+$/.test(v);
      },
      message: 'Password cannot contain special characters'
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema); 