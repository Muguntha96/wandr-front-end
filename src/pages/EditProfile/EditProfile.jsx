import { useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
//
import styles from './ProfilePage.module.css'
import avatar from "../../assets/icons/avatar.png"

const EditProfile = (props) => {
  const { state } = useLocation()
  const imgInputRef = useRef(null)
  const [message, setMessage] = useState('')
  const [profile, setprofile] = useState(state)
  const [profileFormData, setProfileFormData] = useState(props.user)
  const [photoData, setPhotoData] = useState({ photo: null })
  const handleChange = (e) => {
    setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value })
  }
  const handleChangePhoto = evt => {
    const file = evt.target.files[0]
    let isFileInvalid = false
    let errMsg = ""
    const validFormats = ['gif', 'jpeg', 'jpg', 'png', 'svg', 'webp']
    const photoFormat = file.name.split('.').at(-1)
    // cloudinary supports files up to 10.4MB each as of May 2023
    if (file.size >= 10485760) {
      errMsg = "Image must be smaller than 10.4MB"
      isFileInvalid = true
    }
    if (!validFormats.includes(photoFormat)) {
      errMsg = "Image must be in gif, jpeg/jpg, png, svg, or webp format"
      isFileInvalid = true
    }
    setMessage(errMsg)
    if (isFileInvalid) {
      imgInputRef.current.value = null
      return
    }
    setPhotoData({ photo: evt.target.files[0] })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    props.handleUpdateProfile(profileFormData, photoData.photo)
  }
  return (
    <>
      <h1>Edit profile</h1>
      <p className={styles.editMessage}>{message}</p>
      <form autoComplete="off" onSubmit={handleSubmit} >
        <label >
          Name
          <input
            type="text"
            value={profileFormData.name}
            name="name"
            onChange={handleChange} />
        </label>
        <label >
          Email
          <input
            type="text"
            value={profileFormData.email}
            name="email"
            onChange={handleChange}
          />
        </label>
        <div className={styles.ppAvatar}>
          {profile.photo ? (
            <img src={profile.photo} alt="profile image" />
          ) : (
            <img src={avatar} alt="avatar" />
          )}
        </div>
        <label>
          Upload Photo
          <input
            type="file"
            name="photo"
            onChange={handleChangePhoto}
            ref={imgInputRef}
          />
        </label>
        <button type='submit'>Submit</button>
      </form>
    </>
  );
}
export default EditProfile;