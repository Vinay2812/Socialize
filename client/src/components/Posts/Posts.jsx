import React from 'react'
import "./posts.css"
// import { PostsData } from '../../dummyData/postsData'
import Post from '../Post/Post'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getTimeLinePosts } from '../../actions/PostAction'

import Loader from '../loader/Loader'
import { useParams } from 'react-router-dom'


const Posts = () => {
  
  const dispatch = useDispatch();
  let {posts, loading} = useSelector((state)=>state.postReducer);
  const {user} = useSelector((state)=>state.authReducer.authData);

  // const [posts, setPosts] = useState([]);
  useEffect(()=>{
    dispatch(getTimeLinePosts(user._id));
  }, [posts.length]);

  //for profile page, profile page will have params id
  const params = useParams();
  if(params.id){
    posts = posts.filter((post)=>post.userId === params.id);
  }

  return (
    <div className="posts">
      {loading 
        ? <Loader />
        : posts.map((post, id)=>{
            return ( 
                <Post data={post} id={id}/>
            )
          })
      }
        
    </div>
  )
}

export default Posts