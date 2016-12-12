import mongoose from 'mongoose';

const sessionCodeSchema = new mongoose.Schema({
  code: String,
  activated: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
sessionCodeSchema.methods.activate = function activate() {
  this.activated = true;
  return this.save();
};
export default mongoose.model('SessionCode', sessionCodeSchema);
