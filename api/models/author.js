import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
  name: String,
  website: String,
  medium: String,
  github: String,
  resources: [{
    type: Number,
    ref: 'Resource'
  }]
});
export default mongoose.model('Author', authorSchema);
