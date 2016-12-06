import mongoose from 'mongoose';
import Promise from 'bluebird';
mongoose.Promise = Promise;

const pendingResourceSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  _tags: [{
    type: Number,
    ref: 'PendingTag'
  }],
  url: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: Date
});

export default mongoose.model('PendingResource', pendingResourceSchema);
