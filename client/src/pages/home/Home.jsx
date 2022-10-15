import PostSide from '../../components/postSide/PostSide'
import ProfileSide from '../../components/profileSide/ProfileSide'
import RightSide from '../../components/rightSide/RightSide'
import "./home.css"


import Navbar from '../../components/navbar/Navbar'


function Home() {
  return (
    <>
      <div className="home-navbar">
        <Navbar />
      </div>
      
      <div className="home">
        <div className="home-profileSide">
          <ProfileSide location="homePage" />
        </div>

        <div className="home-postSide">
          <PostSide />
        </div>
        <div className="home-rightSide">
          <RightSide />
        </div>

      </div>
    </>
  )
}

export default Home