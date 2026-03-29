const { Schema, model } = require('mongoose');

const FeedbackSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5 },
    isVisible: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model('Feedback', FeedbackSchema);

