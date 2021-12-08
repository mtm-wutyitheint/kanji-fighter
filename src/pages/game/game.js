import React, { useEffect } from "react";
import mountainBehindImg from "../../img/back-img.png";
import playcat from "../../img/play-card.png";
import { Link } from "react-router-dom";
import "./game.scss";

export default function Home() {
  useEffect(() => {
    sessionStorage.setItem("game", true);
  }, []);

  const bactToHome = () => {
    sessionStorage.setItem("game", false);
  };
  
  return (
    <>
      <div className="images">
        {sessionStorage.setItem("game", true)}
        <img src={mountainBehindImg} alt="" className="mountains_behind" />
        <h2 className="text">Words Fighter</h2>
        <Link to="/card-play" className="btn">
          PLAY NOW
        </Link>
        <Link to="/content">
          <img src={playcat} alt="" onClick={bactToHome} className="play_cat" />
        </Link>
      </div>
    </>
  );
}
