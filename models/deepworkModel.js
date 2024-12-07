import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  time: { type: String, required: true },
  intensity: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
});

const DeepWorkSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  userId: { type: String, required: true },
  Deepwork: [ActivitySchema],
  Distraction: [ActivitySchema],
  Unwind: [ActivitySchema],
}, { timestamps: true });

export default mongoose.model('DeepWork', DeepWorkSchema);
