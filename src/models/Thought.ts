import { Schema, model, Document } from 'mongoose';
import { ReactionSchema, IReaction } from './Reaction.js';

interface IThought extends Document {
  thoughtText: string,
  createdAt: Date,
  username: string,
  reactions: IReaction[]
}

const thoughtSchema = new Schema<IThought>({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [ReactionSchema],
}, {
  toJSON: {
    virtuals: true,
  },
  id: false,
});

// Virtual to get reaction count
thoughtSchema.virtual('reactionCount').get(function (this: IThought) {
  return this.reactions.length;
});

const thought = model('Thought', thoughtSchema);

export default thought;