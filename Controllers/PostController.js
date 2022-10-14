const PostModel = require("../Models/PostModel");
const mongoose = require("mongoose");
const UserModel = require("../Models/UserModel");

//create new post
const createPost = async(req, res)=>{
    const new_post = new PostModel(req.body);

    try {
       const savedPost = await new_post.save();
       res.status(200).json(savedPost); 
    } catch (err) {
        console.log("PostController -> createPost -> " + err);
        res.status(500).json(err);
    }
};

//update post
const updatePost = async(req, res)=>{
    const { userId } = req.body;
    const postId = req.params.id;
    try {
        
        const post = await PostModel.findById(postId);
        if(post.userId === userId){
            await PostModel.updateOne({$set: req.body})
            res.status(200).json("Post updated");
        }
        else{
            res.status(403).json("You can't update this post");
        }
    } catch (err) {
        console.log("PostController -> updatePost -> " + err);
        res.status(500).json(err);
    }
}

//get a post
const getPost = async(req, res)=>{
    const id = req.params.id;
    try {
       const post = await PostModel.findById(id);
       res.status(200).json(post); 
    } catch (err) {
        console.log("PostController -> getPost -> " + err);
        res.status(500).json(err);
    }
}

//delete post
const deletePost = async(req, res)=>{
    const postId = req.params.id;
    const {userId}  = req.body

    try {
        const post = await PostModel.findById(postId); 

        if(post.userId === userId){
           
            await PostModel.findByIdAndDelete(post);
            res.status(200).json("Post deleted Successfully");
        }
        else{
            res.status(403).json("You can't delete this post");
        }
    } catch (err) {
        console.log("PostController -> deletePost -> " + err);
        res.status(500).json(err);
    }
}

//like and dislike post
const likePost = async(req, res)=>{
    const postId = req.params.id;
    const { userId } = req.body;

    try {
        const post = await PostModel.findById(postId);
        
        if(post.likes.includes(userId)){
            await post.updateOne({$pull: {likes: userId}});
            res.status(200).json("Post disliked");
        }
        else{
            await post.updateOne({$push: {likes: userId}});
            res.status(200).json("Post liked");
        }

    } catch (err) {
        console.log("PostController -> likePost -> " + err);
        res.status(500).json(err);
    }
}

// add comment
const addComment = async(req, res)=>{
    const postId = req.params.id;
    const {commenterId, comment} = req.body;
    try {
       const post = await PostModel.findById(postId);
       const commenter = await UserModel.findById(commenterId);
       const commenterName = commenter.username;
       await post.updateOne({$push: {comments: {commenterId, comment, commenterName}}});

       res.status(200).json("Comment added");
    } catch (err) {
        console.log("PostController -> likePost -> " + err);
        res.status(500).json(err);
    }
}

//delete comment
const deleteComment = async(req, res)=>{
    const postId = req.params.id;
    const { userId, commentId } = req.body;
    try {
        const post = await PostModel.findById(postId);
        const comment = await PostModel.findOne(
            {
                "_id": postId,
                $or: [{"comments.commenterId": userId},{userId: userId}],
                "comments._id":commentId
            }
        )
        
        if(comment !==null){
            await post.updateOne(
                {
                    $pull: {
                        comments: {_id : commentId}
                    }
                }
            );
            res.status(200).json("Comment Deleted");
        }
        else{
            res.status(403).json("Can't delete this comment");
        }
        
     } catch (err) {
         console.log("PostController -> likePost -> " + err);
         res.status(500).json(err);
     }
}
//get timeline post
const getTimeLinePosts = async(req, res) =>{
    const userId = req.params.id;
    try {
        const currentUserPosts = await PostModel.find({userId: userId});
        const publicPosts = await PostModel.find({isPublicPost: true});

        const user = await UserModel.findById(userId);
        const followingPosts = await Promise.all(
            user.following.map(async (followingId)=>{
                const userPost = await PostModel.find(
                    {userId: followingId}
                );
                return userPost
                
            })
        )
        /* const followingPosts = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }    
            },
            //Foreign key
            {
                $lookup: {
                    from : "posts",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPosts" 
                }
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0
                }
            }
        ])*/
        
        let getAllPosts;
        if(followingPosts.length !== 0){
            getAllPosts = [...currentUserPosts,...followingPosts[0], ...publicPosts];
        }
        else{
            getAllPosts = [...currentUserPosts, ...publicPosts];
        }

        const allPosts = getAllPosts;
        
        const uniquePostId = [
            ...new Set(
                allPosts.map((post) => {
                    return post._id.toString();
                }
            )
        )];

        const allUniquePosts = await Promise.all(
            uniquePostId.map(async (postId)=>{
                    const post = await PostModel.find({_id: new mongoose.Types.ObjectId(postId)});
                    return post[0];
                }   
            )
        )

        res.status(200).json(
            allUniquePosts
            .sort((a, b)=>{
                return b.createdAt - a.createdAt;
            })
        );

    } catch (err) {
        console.log("PostController -> getimeLinePosts -> " + err);
        res.status(500).json(err);
    }
}

module.exports = {createPost, getPost, deletePost, updatePost, likePost, getTimeLinePosts, addComment, deleteComment};