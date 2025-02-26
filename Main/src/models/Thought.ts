import { Schema, model, Types } from 'mongoose';

const thoughtsSchema = new Schema({
    thoughtText:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp: number) => new Date(timestamp).toLocaleDateString()
    },
    username: {
        type: String,
        required: true
    },
    reactions: [
        
    ]

})