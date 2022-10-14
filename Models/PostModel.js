const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
    {
        userId:{
            type: String,
            required: true
        },
        desc: String,
        likes: [],
        comments:{
            type: [{
                commenterId: {
                    type:String,
                    required: true,
                },
                comment: {
                    type: String,
                    max: 100,
                    min: 1
                },
                commenterName:{
                    type: String
                }
            }],
            default: []
        },
        isPublicPost: Boolean,
        image: {
            name: String,
            url: String
        },
        video: {
            name: String,
            url: String
        }
    },
    {
        timestamps:true
    }
);

const PostModel = mongoose.model("Posts",PostSchema);

module.exports = PostModel


