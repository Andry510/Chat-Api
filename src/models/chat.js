//Dependecia de node (mongoose)
import { Schema, Types, model } from "mongoose";

const chatSchema = new Schema({
    
    channelId: {
        type: Schema.Types.ObjectId,
        ref: 'Channel'
    },

    messagesHistory: [
        {

            _id: false,
            
            user: {
                userId: {
                    type: Types.ObjectId,
                    ref: 'User',
                },

                userName: {
                    type: String,
                    required: true
                }
            },

            messageContent: {
                type: String,
                maxLength: 1000,
                required: true,
            },

            messageStatus: {
                type: Boolean,
                default: false,
            },

            sentAt: {
                type: Date,
                default: Date.now,
                index: true
            },

            viewedBy: [
                {
                    user: {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                    }
                }
            ]
        }
    ]
}, {

    versionKey: false,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;

            return ret;
        }
    }
})

const chatModel = model('Chat', chatSchema)

export default chatModel