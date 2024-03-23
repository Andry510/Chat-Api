//Dependecia de node (mongoose)
import { Schema, model } from "mongoose"

//Modelo de mongodb
const channelSchema = new Schema({
    creatorUserID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    name: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        enum: ['private', 'public'],
        required: true,
    },

    pictureUrl: {
        type: String,
        default: ''
    },

    category: {
        type: String,
        enum: ["technology", "science", 'education', 'sports', 'music'],
        required: true,
    },

    members: [
        {
            member: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            
            joinedAt: {
                type: Date,
                default: Date.now,
                index: true
            },

            _id: false
        }
    ],

}, {
    timestamps: true,
    versionKey: false,

    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.creatorUserID;
            delete ret.createdAt
            delete ret.updatedAt

            return ret;
        }
    }
})

const channelModel = model('Channel', channelSchema)

export default channelModel