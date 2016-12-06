import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  displayName: String,
  email: String,
  avatarUrl: String,
});
export default mongoose.model('User', userSchema);
