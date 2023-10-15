//import { useState,useEffect } from 'react';
//components
import PostCard from "../../components/PostCard/PostCard"
import SearchPost from '../../components/SearchPost/SearchPost'
//import { index } from '../../services/postService';

const PostList = (props) => {
  const [posts, setPosts] = useState([])
  const allPosts = props.posts
  const [searchResults,setSearchResults]=useState([])
   const [errMsg,setErrMsg]=useState("")

  const handlePostSearch = formData =>{
    const filteredPostSearch= allPosts.filter(post => post.location.toLowerCase().includes(formData.query.toLowerCase()))
    if(!filteredPostSearch.length){
      setErrMsg('No posts')
    }else{
      setErrMsg("")
    }
    setSearchResults(filteredPostSearch)
    
  }
  useEffect(() =>{
    const fetchPostList = async () =>{
      const postData= await index()
      setPosts(postData)
    }
    fetchPostList()
  },[])

  return ( 
    <main>
           <h1>Post List</h1>

    {props.posts.map(post =>  
      <>
      {post.public && <PostCard key={post._id} post={post} />}
      </>
    )}
    
    </main>
  )
}

export default PostList