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
    }, [scrollValue]);

   
    return (
      <>
         <div className="images">
            <img src={mountainBehindImg} alt="" className="mountains_behind"/>
            <h2 className="text" >Words Fighter</h2>
            <Link to="/card-play" onClick="" className="btn">PLAY NOW</Link>
         </div>
      </>
    )
}

