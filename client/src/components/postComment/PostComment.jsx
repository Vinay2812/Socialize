import React from 'react'
import "./postComment.css"
import { DeleteForeverOutlined} from "@material-ui/icons"
import { useDispatch, useSelector } from 'react-redux'
import { deleteComment, getTimeLinePosts } from '../../actions/PostAction'




const Comment = ({data, post})=>{
    const {user} = useSelector((state)=>state.authReducer.authData)
    const isMyComment = (data.commenterId === user._id || post.userId === user._id);
    const dispatch = useDispatch();
    const handleDeleteComment = ()=>{
        const comment = {
            userId: user._id,
            commentId: data._id
        }

        dispatch(deleteComment(post._id, comment)).then(()=>dispatch(getTimeLinePosts(user._id)));
    }
    return (
            <div className="postComment" style={!(data.commenterId === post.userId) ? {alignSelf: "flex-start"}: {alignSelf: "flex-end", backgroundColor: "rgba(236, 232, 232, 0.203)"}}>
                <div className='text'>
                    <div className="userName">
                        @{data.commenterName}
                    </div>
                    <div className="comment">
                        {data.comment}
                    </div>
                </div>
                {isMyComment? <div className="delete-comment">
                    <DeleteForeverOutlined onClick={handleDeleteComment}/>
                </div> : ''}
            </div>
        )
}

const PostComment = ({commentData, post}) => {
   
  return (
    <>
        <div className="comment-title">
            <span>Comments <div>{commentData.length}</div></span>
        </div>
        {commentData.length === 0
            ?<div className="no-comments">
                Be the first one to comment
            </div>
            : <div className="comment-section">
                {
                    commentData.map((data, id)=>{
                        return <Comment data={data} post={post} key={id}/>
                    })
                }
            </div> 
        }
        
        
    </>
   
  )
}

export default PostComment