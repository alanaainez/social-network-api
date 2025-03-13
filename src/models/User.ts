import { Schema, model, Types, Document } from 'mongoose';

interface IUser extends Document {
  username: string,
  email: string,
  thoughts: Types.ObjectId[],
  friends: Schema.Types.ObjectId[]
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    thoughts: [
        {
          type: Types.ObjectId,
          ref: 'Thought',
        },
      ],
      friends: [
        {
          type: Types.ObjectId,
          ref: 'User',
        },
      ],
    }, {
      toJSON: {
        virtuals: true,
      },
      id: false,
    });
    
    // Virtual to get the friend count
    userSchema.virtual('friendCount').get(function (this: { friends: Types.ObjectId[] }) {
      return this.friends.length;
    });
    
    const user = model('User', userSchema);

    export default user;
    export { IUser };