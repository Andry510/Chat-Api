//Dependecia de node (mongoose)
import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    profileImage: {
        profilePictureUrl: {
            type: String,
            default: "",
        },
        backgroundPictureUrl: {
            type: String,
            default: "",
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    phoneNumber: {
        type: String,
        max: 10
    },

    password: {
        type: String,
        required: true,
    },

    channels: {
        memberOf: [
            {
                channelId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Channel',
                },
                _id: false
            }
        ],
        createdBy: [
            {
                channelId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Channel',
                },
                _id: false
            }
        ]
    },

    refreshToken: {
        type: String,
        default: '',
    },

}, {
    timestamps: true,
    versionKey: false,

    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.refreshToken
            delete ret.password
            delete ret.createdAt
            delete ret.updatedAt

            return ret;
        }
    }
})


const userModel = model('User', userSchema)

export default userModel