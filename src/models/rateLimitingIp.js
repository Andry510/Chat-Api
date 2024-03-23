import { Schema, model } from "mongoose";

const rateLimitingIpSchema = new Schema({

    ip: {
        type: String,
        require: true,
        
    },

    count: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: '15m'
    }
    
}, {
    versionKey: false
})

const rateLimitingIpModel = model('Rate Limiting', rateLimitingIpSchema)

export default rateLimitingIpModel

