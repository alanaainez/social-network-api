import { Schema, Types } from 'mongoose';

interface IReaction {
    reactionId: Types.ObjectId,
    reactionBody: string,
    username: string,
    createdAt: Date,
}

const ReactionSchema = new Schema<IReaction>({
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
    }, 
    { id: false });

export { IReaction, ReactionSchema};