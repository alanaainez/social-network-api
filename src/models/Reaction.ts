import { Schema, Types } from 'mongoose';

interface IReaction {
    reactionId: Types.ObjectId,
    reactionBody: string,
    username: string,
    createdAt: Date,
}

const ReactionSchema = new Schema<IReaction>({
    reactionId: {
      type: Schema.Types.ObjectId,
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

export { IReaction, ReactionSchema};