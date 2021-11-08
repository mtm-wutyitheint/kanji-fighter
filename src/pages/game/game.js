import React, { useEffect, useState } from 'react';
import mountainBehindImg from '../../img/back-img.png'
import { Link } from 'react-router-dom';
import "./game.scss"

export default function Home() {
    const [scrollValue, setScrollValue] = useState();
    useEffect(() => {
      let value = 0;
      console.log(value)
      localStorage.setItem('game', true);
      // window.addEventListener('scroll', () => {
      //    value = window.scrollY;
      //    setScrollValue(value);
      //    console.log(scrollValue);
      // })
    }, [scrollValue]);

    return (
      <>
         <div className="images">
            <img src={mountainBehindImg} alt="" className="mountains_behind"/>
            <h2 className="text" >Words Fighter</h2>
            {/* <Link to="/card-play" className="btn">Card Game</Link>
            <Link to="/chat-play" className="btn">Chat Play</Link> */}
            <Link to="/card-play" className="btn">PLAY NOW</Link>
         </div>
      </>
    )
}

