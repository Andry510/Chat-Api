import { Schema, model } from "mongoose";

const blackListSchema = new Schema({
    ip: {
        type: String,
        require: true,
        
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: '20m'
    }
},{
    versionKey: false
})

const blackListModel = model('Black List', blackListSchema)

export default blackListModel;