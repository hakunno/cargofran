import React, { useRef } from 'react'
import VideoBackground from '../component/VideoBackground'
import WhyChooseUs from '../component/WhyChooseUs'

const Home = () => {
  const loginRef = useRef(null);

  const handleLoginRefReady = (ref) => {
    loginRef.current = ref.current;
  };

  return (
    <div>
      <VideoBackground onLoginRefReady={handleLoginRefReady} />
      <WhyChooseUs loginRef={loginRef} />
    </div>
  )
}

export default Home
