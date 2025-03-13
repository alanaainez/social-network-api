import { Schema, model, Types } from 'mongoose';
const userSchema = new Schema({
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
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});
const user = model('User', userSchema);
export default user;
