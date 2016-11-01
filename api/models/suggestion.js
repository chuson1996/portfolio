import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  url: String,
  tags: [String],
  email: String
});
export default mongoose.model('Suggestion', suggestionSchema);
