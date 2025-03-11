import { Schema, model, Types, get } from 'mongoose';

const reactionSchema = new Schema({
    reactionId: {
      type: Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

const Reaction = model('Reaction', reactionSchema);

export default Reaction;