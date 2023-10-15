// npm modules
import { NavLink } from 'react-router-dom'
import { useState } from 'react'

// css
import styles from './NavBar.module.css'

const NavBar = ({ user, handleLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false)

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  return (
    <nav className={`${styles.container} ${showDropdown ? styles.fixed : ''}`}>
      <div className={styles.icon} onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
        <img src="src/assets/icons/menu.png" alt="menu" className={styles.img} />     
      </div>

      {user && showDropdown && (
        <ul className={styles.dropdownMenu}>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/profiles">Profiles</NavLink></li>
          <li><NavLink to="/posts">All Posts</NavLink></li>
          <li><NavLink to="/posts/new">New Post</NavLink></li>
          <li><NavLink to="/auth/change-password">Change Password</NavLink></li>
          <li><NavLink to="/auth/myprofile">My Profile</NavLink></li>
          <li><NavLink to="" onClick={handleLogout}>Log Out</NavLink></li>
        </ul>
      )}

      {!user && (
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/auth/login">Log In</NavLink></li>
          <li><NavLink to="/auth/signup">Sign Up</NavLink></li>
        </ul>
      )}
    </nav>
  )
}

      {/* {user ?
        <ul>
          <li>Welcome, {user.name}</li>
          <li><NavLink to="/profiles">Profiles</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/posts">All Posts</NavLink></li>
          <li><NavLink to="/posts/new">New Post</NavLink></li>
          <li><NavLink to="/">Home Page</NavLink></li>
          <li><NavLink to="/auth/change-password">Change Password</NavLink></li>
          <li><NavLink to="" onClick={handleLogout}>LOG OUT</NavLink></li>
        </ul>
      :
      <ul>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/auth/login">Log In</NavLink></li>
          <li><NavLink to="/auth/signup">Sign Up</NavLink></li>
        </ul>
      } */}

export default NavBar
