import mongoose from 'mongoose';
import Promise from 'bluebird';
mongoose.Promise = Promise;

const resourceSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  _author: {
    type: Number,
    ref: 'Author'
  },
  tags: [String],
  _tags: [{
    type: Number,
    ref: 'Tag'
  }],
  url: String
});

export default mongoose.model('Resource', resourceSchema);
