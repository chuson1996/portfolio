import mongoose from 'mongoose';

const pendingTagSchema = new mongoose.Schema({
  name: String,
  resources: [{
    type: Number,
    ref: 'PrivateResource'
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
export default mongoose.model('PendingTag', pendingTagSchema);
