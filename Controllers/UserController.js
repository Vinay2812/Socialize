const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

//get a user
const getUser = async(req, res)=>{
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id);
        if(user){
            const {password, ...other} = user._doc;
            res.status(200).json(other);
        }
        else{
            res.status(404).json("user not found");
        }
        
    } catch (err) {
        console.log("UserController -> getUser -> "+ err);
        res.status(500).json(err);
    }
    
};

// get all user
const getAllUser = async (req, res)=>{
    try {
        let users = await UserModel.find();

        users = users.map((user)=>{
            const {password, ...others} = user._doc;
            return others;
        })

        res.status(200).json(users);
    } catch (err) {
        console.log("UserController -> getAlluser -> " + err);
        res.status(500).json(err);
    }
}
const searchUser = async(req, res)=>{
    const { name }= req.body;
    try {
        let users = await UserModel.find({
            $or:[
                {firstname: {$regex: `^${name}`, $options: "i"}},
                {lastname: {$regex: `^${name}`, $options: "i"}},
                {username: {$regex: `^${name}`, $options: "i"}}
            ]
        });
        if(users){
            users = [...new Set(users.map((user)=>{
                const {password, ...other} = user._doc;
                return other;
            }))]
            res.status(200).json(users);
        }
        else{
            res.status(400).json("no user found");
        }
    } catch (err) {
        console.log("UserController -> searchuser -> " + err);
        res.status(500).json(err);
    }
}
const updateUser = async(req, res)=>{
    const id = req.params.id;
    const { _id, currentUserAdminStatus, password } = req.body;
    try {
        if(id === _id || currentUserAdminStatus){
            if(password){
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }
            const user = await UserModel.findByIdAndUpdate(id, req.body, {new: true});

            const token = jwt.sign(
                {username: user.username, id: user._id},
                process.env.JWT_KEY, {expiresIn: "7d"}
            )
            res.status(200).json({user, token});
        }
        else{
            res.status(400).json("You can update only your profile");
        }
    } catch (err) {
        console.log("UserController -> updateUser -> "+ err);
        res.status(500).json(err);
    }
}

const deleteUser = async(req, res)=>{
    const id = req.params.id;
    const {currentUserId, currentUserAdminStatus} = req.body;

    try {
        const user = await UserModel.findById(id);
        if(!user){
            res.status(400).json("User doesn't exist");
        }
        else if(id === currentUserId || currentUserAdminStatus){
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("User Deleted Successfully");
        } 
        else{
            res.status(400).json("You can delete only your account");
        }
        
    } catch (err) {
        console.log("UserController -> deleteUser -> " + err);
        res.status(500).json(err);
    }
}

//follow the user
const followUser = async(req, res)=>{
    const otherUserId = req.params.id;
    const {_id} = req.body;

    if(_id === otherUserId){
        res.status(403).json("You can't follow yourself");
    }
    else{
        try {
            const otherUser = await UserModel.findById(otherUserId);
            const currentUser = await UserModel.findById(_id);
            
            if(!otherUser.followers.includes(_id)){
                await otherUser.updateOne({ $push: {followers: _id } });
                await currentUser.updateOne({ $push: {following: otherUserId } });

                res.status(200).json("Followed Successfully");
            }
            else{
                res.status(400).json("You already follow the user");
            }
        } catch (err) {
            console.log("UserController -> followUser -> " + err);
            res.status(500).json(err);
        }
    }
};

const unfollowUser = async(req, res)=>{
    const otherUserId = req.params.id;
    const {_id} = req.body;

    if(_id === otherUserId){
        res.status(403).json("You can't follow yourself");
    }
    else{
        try {
            const otherUser = await UserModel.findById(otherUserId);
            const currentUser = await UserModel.findById(_id);
            
            if(otherUser.followers.includes(_id)){
                await otherUser.updateOne({ $pull: {followers: _id } });
                await currentUser.updateOne({ $pull: {following: otherUserId } });

                res.status(200).json("Unfollowed Successfully");
            }
            else{
                res.status(400).json("You don't follow the user");
            }
        } catch (err) {
            console.log("UserController -> followUser -> " + err);
            res.status(500).json(err);
        }
    }
}
module.exports = {getUser, updateUser, deleteUser, followUser, unfollowUser, getAllUser, searchUser}