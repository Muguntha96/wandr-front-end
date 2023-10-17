// npm modules
import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
// pages
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import Landing from './pages/Landing/Landing'
import Profiles from './pages/Profiles/Profiles'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import PostList from './pages/PostList/PostList'
import PostDetails from './pages/PostDetails/PostDetails'
import EditPost from './pages/EditPost/EditPost'
import About from './pages/About/About'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import EditProfile from './pages/EditProfile/EditProfile'
import FollowingIndex from './pages/FollowingIndex/FollowingIndex'
import ExplorePage from './pages/ExplorePage/ExplorePage'
// components
import NavBar from './components/NavBar/NavBar'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
// services
import * as authService from './services/authService'
import * as profileService from './services/profileService'
import * as postService from './services/postService'
// styles
import './App.css'
import NewPost from './pages/NewPost/NewPost'
import FollowerList from './components/FollowerList/FollowerList'
import FollowingList from './components/FollowingList/FollowingList'
function App() {
  const [user, setUser] = useState(authService.getUser())
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [errMsg, setErrMsg] = useState("")
  const [isSearch, setIsSearch] = useState(false)
  const handleLogout = () => {
    authService.logout()
    setUser(null)
    navigate('/')
  }
  const handleAuthEvt = () => {
    setUser(authService.getUser())
  }
  const handleUpdateProfile = async (profileFormData, photoData) => {
    const updateProfile = await profileService.updateProfile(profileFormData)
    if (photoData) {
      await profileService.addPhoto(photoData)
    }
    setUser(updateProfile)
    navigate(`/profiles/${updateProfile.profile}`)
  }
  useEffect(() => {
    const fetchAllPosts = async () => {
      const postData = await postService.index()
      setPosts(postData)
      console.log(posts)
    }
    fetchAllPosts()
  }, [])
  const handleAddPost = async (postFormData) => {
    const newPost = await postService.create(postFormData)
    setPosts([newPost, ...posts])
    navigate('/posts')
  }
  const handleDeletePost = async (postId) => {
    const deletedPost = await postService.deletePost(postId)
    setPosts(posts.filter(p => p._id !== deletedPost._id))
    navigate('/posts')
  }
  const handleUpDatePost = async (postFormData) => {
    const updatedPost = await postService.update(postFormData)
    setPosts(posts.map(p => p._id === postFormData._id ? updatedPost : p))
    navigate(`/posts/${updatedPost._id}`)
  }
  const handlePostSearch = formData => {
    let filteredPostSearch = posts
    if (formData.query) {
      filteredPostSearch = posts.filter(post =>
        post.location?.toLowerCase().includes(formData.query.toLowerCase())
        || post.title?.toLowerCase().includes(formData.query.toLowerCase())
        || post.author?.name.toLowerCase().includes(formData.query.toLowerCase())
      )
    }
    if (!filteredPostSearch.length) {
      setErrMsg("No Post")
    } else {
      setErrMsg("")
    }
    setSearchResults(filteredPostSearch)
    setIsSearch(true)
  }
  return (
    <>
      <NavBar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Landing user={user} posts={posts} errMsg={errMsg} searchResults={searchResults} handlePostSearch={handlePostSearch} isSearch={isSearch} />} />
        <Route
          path="/about"
          element={
            <About />
          }
        />
        <Route
          path="/profiles"
          element={
            <ProtectedRoute user={user}>
              <Profiles user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profiles/:profileId/edit' element={
            <ProtectedRoute user={user}>
              <EditProfile user={user} handleUpdateProfile={handleUpdateProfile} />
            </ProtectedRoute>}
        />
        <Route
          path="/auth/signup"
          element={<Signup handleAuthEvt={handleAuthEvt} />}
        />
        <Route
          path="/auth/login"
          element={<Login handleAuthEvt={handleAuthEvt} />}
        />
        <Route
          path="/auth/change-password"
          element={
            <ProtectedRoute user={user}>
              <ChangePassword handleAuthEvt={handleAuthEvt} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts"
          element={
            <PostList posts={posts} errMsg={errMsg} searchResults={searchResults} handlePostSearch={handlePostSearch} isSearch={isSearch} />
          }
        />
        <Route
          path="/posts/new"
          element={
            <ProtectedRoute user={user}>
              <NewPost handleAddPost={handleAddPost} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/:postId"
          element={
            <PostDetails user={user} handleDeletePost={handleDeletePost} />
          }
        />
        <Route
          path="/posts/:postId/edit"
          element={
            <ProtectedRoute user={user}>
              <EditPost handleUpDatePost={handleUpDatePost} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profiles/:profileId"
          element={
            <ProfilePage user={user} />
          }
        />
        <Route
          path="/profiles/:profileId/following"
          element={<FollowingIndex user={user} />}
        />
        <Route
          path="/profiles/:profileId/following/posts"
          element={<ExplorePage user={user} />}
        />
      </Routes>
    </>
  )
}
export default App
