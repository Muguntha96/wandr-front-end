const MyProfile = ({user}) => {
  return (  
   <>
    <h1>My Profile</h1>
    <h2>User Name : {user.name}</h2>
    <h2>Email: {user.email}</h2>
    
    </>
  );
}
 
export default MyProfile;