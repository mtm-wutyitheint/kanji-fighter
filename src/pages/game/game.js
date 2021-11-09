import React, { useEffect } from 'react';
import mountainBehindImg from '../../img/back-img.png'
import { Link } from 'react-router-dom';
import "./game.scss"

export default function Home() {
    useEffect(() => {
      let value = 0;
      console.log(value)
      localStorage.setItem('game', true);
    }, []);

   
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

