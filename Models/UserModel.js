const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        profilePicture: {
            type: {
                name: String,
                url: String
            },
            default: {
                name: "1665421366423default_profile.png",
                url: "https://firebasestorage.googleapis.com/v0/b/socialize-development.appspot.com/o/images%2F1665421366423default_profile.png?alt=media&token=cfe908d9-c0f3-47db-84f1-379a18f2f1a1"
            }
        },
        coverPicture: {
            type: {
                name: String,
                url: String
            },
            default: {
                name: "1665421262489default_cover.jpg",
                url: "https://firebasestorage.googleapis.com/v0/b/socialize-development.appspot.com/o/images%2F1665421262489default_cover.jpg?alt=media&token=2fe10894-c473-43f6-90f9-1b70cd132f2f"
            }
        },
        about:{
            type: String,
            default: ""
        },
        livesin:{
            type: String,
            default: ""
        },
        worksAt:{
            type: String,
            default: ""
        },
        relationship:{
            type: String,
            default: ""
        },
        bio:{
            type: String,
            default: ""
        },
        followers:{
            type: Array,
            default: []
        },
        following: {
            type: Array,
            default: []
        },
        requestSend: {
            type: Array,
            default: []
        },
        requestReceived: {
            type: Array,
            default: []
        },

    }, 
    {
        timestamps: true
    }
)

const UserModel = mongoose.model("Users", UserSchema);

module.exports = UserModel