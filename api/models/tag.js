import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: String,
  resources: [{
    type: Number,
    ref: 'Resource'
  }]
});
export default mongoose.model('Tag', tagSchema);
