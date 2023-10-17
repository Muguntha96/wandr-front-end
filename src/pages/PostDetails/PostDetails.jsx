//npm modules
import { useState, useEffect} from 'react'
import { useParams, Link } from 'react-router-dom'
//services
import * as postService from '../../services/postService'
//components
import Loading from '../../components/Loading/Loading'
import NewComment from '../../components/NewComment/NewComment'
import CommentCard from '../../components/CommentCard/CommentCard'
import Recommendation from '../../components/Recommendation/Recommendation'
import RecCard from '../../components/RecCard/RecCard'
import PhotoUpload from '../../components/UploadPhoto/PhotoUpload'
import MorePhotosUpload from '../../components/UploadPhoto/MorePhotosUpload'
import PhotoCard from '../../components/PhotoCard/PhotoCard'

//css
import styles from './PostDetails.module.css'
import likesIcon from "../../assets/icons/likes.png"
import savesIcon from "../../assets/icons/saves.png"
import AuthorInfo from '../../components/AuthorInfo/AuthorInfo'
import DefaultPhoto from '../../assets/img/default-pic2.jpg'

const PostDetails = (props) => {
  const [post, setPost] = useState(null)
  const { postId } = useParams()

  const [showPhotoUploadField, setShowPhotoUploadField] = useState(false)
  const [showMorePhotosUploadField, setShowMorePhotosUploadField] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      const PostData = await postService.show(postId)
      setPost(PostData)
    }
  fetchPost()
  }, [postId])

  const handleAddComment = async (commentFormData) => {
    const newComment = await postService.createComment(postId, commentFormData)
    setPost({...post, comments: [...post.comments, newComment]})
  }
  
  const handleAddRec= async (recFormData) => {
    const newRecommendation = await postService.createRec(postId, recFormData)
    setPost({...post, recommendations: [...post.recommendations, newRecommendation]})
  }

  const handleDeleteRec = async (recId) => {
    const deltedRec = await postService.deleteRec(postId, recId)
    setPost({...post, recommendations: post.recommendations.filter(rec => rec._id !== deltedRec._id)})
  }

  const handleDeleteComment = async (commentId) => {
    const deletedComment = await postService.deleteComment(postId, commentId)
    setPost({...post, comments: post.comments.filter(cmt => cmt._id !== deletedComment._id)})
  }
  
  const handleEditComment = async (commentFormData) => {
    const editedComment = await postService.editComment(postId, commentFormData)
    setPost({...post, comments: post.comments.map(cmt => cmt._id === commentFormData._id ? editedComment : cmt)})
  }

  const handleEditRec = async (recFormData) => {
    const editedRec = await postService.editRec(postId, recFormData)
    setPost({...post, recommendations: post.recommendations.map(rec => rec._id === recFormData._id ? editedRec : rec)})
  }

  const handleLikePost = async (profileId) => {
    const like = await postService.likePost(postId, profileId)
    setPost({...post, likes: [...post.likes, like]})
  }

  const handleSavePost = async (profileId) => {
    const save = await postService.savePost(postId, profileId)
    setPost({...post, saves: [...post.saves, save]})
  }

  const handleShow = () => {
    setShowPhotoUploadField(true)
  }
  const handleShowMore = () => {
    setShowMorePhotosUploadField(true)
  }

  const handleDeleteMainPhoto = async () => {
    const mainPhoto = await postService.deleteMainPhoto(postId)
    setPost({...post, mainPhoto: mainPhoto})
  }
  
  const handleAddMainPhoto = async (postId, photoData) => {
    const mainPhoto = await postService.addMainPhoto(postId, photoData)
    setPost({...post, mainPhoto: mainPhoto})
  }

  const handleAddMorePostPhotos = async (postId, photoData) => {
    const photo = await postService.addMorePostPhotos(postId, photoData)
    setPost({...post, morePhotos: [photo, ...post.morePhotos]})
  }

  const handleDeleteMorePhotos = async (photoId) => {
    const deletedPhoto = await postService.deleteMorePostPhotos(postId, photoId)
    setPost({...post, morePhotos: post.morePhotos.filter(p => p._id !== deletedPhoto._id)})
  }

  if (!post) return <Loading />

  return ( 
    <div>
      <div className={styles.cardDetailsContainer}>
        <div className={styles.textContainer}>
          <h1>{post.title}</h1>
          <div className={styles.cardLocation}>
            <p>{post.location}</p>
          </div>
          <AuthorInfo content={post} />
          <div className={styles.cardContent}>
            <p>{post.content}</p>
          </div>
        </div>
  
        <div className={styles.imageContainer}>
            <img src={post.mainPhoto ? post.mainPhoto : DefaultPhoto} alt="Post Main Photo" />
        </div>
        <div className={styles.imageCollection}>
          {post.morePhotos.map((photo, idx) => 
            <PhotoCard key={idx} photo={photo} idx={idx} /* handleDeleteMorePhotos={handleDeleteMorePhotos} *//>
          )}
        </div>
      </div>
      <div className={styles.likeAndSaveBtn}>       
        <div className={styles.likeCount}>
          <img src={likesIcon} alt="Likes" className={styles.likeImg} />  
          : {post.likes.length}
        </div>
        <div className={styles.saveCount}>
          <img src={savesIcon} alt="Saves" className={styles.saveImg} /> 
          : {post.saves.length}
        </div> 

        {props.user
          && post.author._id !== props.user?.profile 
          && !post.likes.some(p => p === props.user?.profile)
          && <button onClick={() => handleLikePost(props.user.profile)} className={styles.likeBtn}>Like</button>
        }
        {props.user
          && post.author._id !== props.user?.profile 
          && !post.saves.some(p => p === props.user?.profile)
          && <button onClick={() => handleSavePost(props.user?.profile)} className={styles.saveBtn}>Save</button>
        } 
      </div>

      <div className={styles.buttonsContainer}>
        <div className={styles.cardDetailsBtn}>
          {post.author._id === props.user?.profile && (
            <>
              <Link to={`/posts/${postId}/edit`} state={post}>
                <button  className={styles.editBtn}>
                  Edit
                </button>
              </Link>
              <button onClick={() => props.handleDeletePost(postId)} className={styles.deleteBtn}>
                Delete
              </button>
            </>
          )}
        </div>
        <div className={styles.cardPhotosBtn}>
          {post.author._id === props.user?.profile && (
            <>
              <button onClick={handleShow}>
                {post.mainPhoto ? 'Edit Main Photo' : 'Upload Main Photo'}
              </button>
              {post.mainPhoto && <button onClick={handleDeleteMainPhoto}>
                Delete Main Photo
              </button>}
              {post.morePhotos.length < 5 && <button onClick={handleShowMore}>
                Upload More Photos
              </button>}
              {showPhotoUploadField && <PhotoUpload post={post} handleAddMainPhoto={handleAddMainPhoto} />}
              {showMorePhotosUploadField && <MorePhotosUpload post={post} handleAddMorePostPhotos={handleAddMorePostPhotos} />}
            </>
          )}         
        </div>
      </div>


      <div className={styles.secondRow}>

        <div className={styles.commentsContainer}>
          <h3>Comments</h3>
    
          {props.user && <NewComment handleAddComment={handleAddComment} />}
          {post.comments.map(comment => 
            <CommentCard key={comment._id} comment={comment} user={props.user} handleDeleteComment={handleDeleteComment} handleEditComment={handleEditComment}
            />
            )}
        </div>  
        <div className={styles.recommendationsContainer}>
          {post.author._id === props.user?.profile && (
            <Recommendation user={props.user} handleAddRec={handleAddRec} />
          )}
          {post.recommendations.map((recommendation) => (
            <RecCard
              key={recommendation._id}
              recommendation={recommendation}
              user={props.user}
              handleDeleteRec={handleDeleteRec}
              handleEditRec={handleEditRec}
              author={post.author}
            />
          ))} 
        </div>

      </div>
    </div>
  )
}

export default PostDetails