import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  DialogTitle,
} from "@material-ui/core";
import axios from "axios";
import _ from "lodash";

import MemoryCard from "../../components/memory-card/card";
import "./card-play.scss";
import { env } from "../../env/development";
import ChatPlay from "../chat-play/chat-play";
import chatIcon from "../../img/bot_face.png";
import homeIcon from "../../img/home01.png";
import { Link } from "react-router-dom";

function shuffleCards(array) {
  const length = array.length;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

function randomList(array) {
  let list = [];
  for (let i = 0; i < array.length; i++) {
    const index = Math.floor(Math.random() * array.length);
    const data = array.splice(index, 1);
    list = [...list, data[0]];
  }
  const sliceArray = list.slice(0, 24);
  console.log(sliceArray)
  return sliceArray;
}

export default function CardPlay() {
  const [memoryList, setMemoryList] = useState([]);
  const [hira, setHira] = useState([]);
  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState({});
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bestScore, setBestScore] = useState(
    JSON.parse(sessionStorage.getItem("bestScore")) || Number.POSITIVE_INFINITY
  );
  const timeout = useRef(null);

  const getMemoryList = () => {
    
    const params = {
      kanji_ne: "",
    };
    axios
      .get(`${env.apiEndPoint}/words-collections`, { params })
      .then((res) => {
        let list = [];
        for (let i = 0; i < res.data.length; i++) {
          const index = Math.floor(Math.random() * res.data.length);
          const data = res.data.splice(index, 1);
          list = [...list, data[0]];
        };
        const sliceArray = list.slice(0, 12);
        let listData = _.cloneDeep(sliceArray);
        console.log(list)
        setHira(listData);
        let shuffleData = shuffleCards(_.cloneDeep(listData));
        setMemoryList(shuffleData);
      })
      .catch((err) => console.error(err));
  };

  const disable = () => {
    setShouldDisableAllCards(true);
  };
  const enable = () => {
    setShouldDisableAllCards(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkCompletion = () => {
    if (Object.keys(clearedCards).length !== memoryList.length) {
      return;
    }
    setShowModal(true);
    const highScore = Math.min(moves, bestScore);
    setBestScore(highScore);
    sessionStorage.setItem("bestScore", highScore);
  };

  const remove = (index) => {
    return String(index).includes("_") ? index.replace(/_/g, "") : index;
  };

  const list = (index) => {
    return String(index).includes("_") ? hira : memoryList;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const evaluate = () => {
    const [first, second] = openCards;
    enable();
    if (list(first)[remove(first)].id === list(second)[remove(second)].id) {
      setClearedCards((prev) => ({
        ...prev,
        [list(first)[remove(first)].id]: true,
      }));
      setOpenCards([]);
      return;
    }
    // This is to flip the cards back after 500ms duration
    timeout.current = setTimeout(() => {
      setOpenCards([]);
    }, 500);
  };

  const handleCardClick = (index, type) => {
    if (openCards.length === 1) {
      setOpenCards((prev) => [...prev, index]);
      setMoves((moves) => moves + 1);
      disable();
    } else {
      clearTimeout(timeout.current);
      setOpenCards([index]);
    }
  };

  useEffect(() => {
    let timeout = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 500);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [evaluate, openCards.length]);

  useEffect(() => {
    memoryList.length === 0 && getMemoryList();
    memoryList.length > 0 && checkCompletion();
  }, [checkCompletion, clearedCards, memoryList.length]);

  const checkIsFlipped = (index) => {
    return openCards.includes(index);
  };

  const checkIsInactive = (card) => {
    return Boolean(clearedCards[card.id]);
  };

  const handleRestart = () => {
    setClearedCards({});
    setOpenCards([]);
    setShowModal(false);
    setMoves(0);
    setShouldDisableAllCards(false);
    // set a shuffled deck of cards
    getMemoryList();
    // setMemoryList(shuffleCards(memoryList));
  };

  let hide = {
    opacity: "0.5",
    "pointer-events": "none",
  };
  let show = {
    opacity: "1",
  };

  const [chatopen, setChatopen] = useState(false);
  const toggle = (e) => {
    setChatopen(!chatopen);
  };

  const bactToHome = () => {
    sessionStorage.setItem("game", false);
  };

  return (
    <div className="MemoryCardBlock">
      <header>
        <h3>フリップカードゲームをプレイする</h3>
        <div>結果的に同じ内容の2枚のカードを選択してそれらを消滅させます。</div>
      </header>
      <br />
      <div className="kanjiBlock">
        <h3>Kanji</h3>
        <div className="container" style={chatopen ? hide : show}>
          {memoryList.map((card, index) => {
            return (
              <MemoryCard
                key={index}
                card={card}
                type="kanji"
                index={index}
                isDisabled={shouldDisableAllCards}
                isInactive={checkIsInactive(card)}
                isFlipped={checkIsFlipped(index)}
                onClick={handleCardClick}
              />
            );
          })}
        </div>
      </div>

      <div className="hiraBlock">
        <h3>Furigana</h3>
        <div className="container " style={chatopen ? hide : show}>
          {hira.map((card, index) => {
            return (
              <MemoryCard
                key={index + "_"}
                card={card}
                type="furigana"
                index={index + "_"}
                isDisabled={shouldDisableAllCards}
                isInactive={checkIsInactive(card)}
                isFlipped={checkIsFlipped(index + "_")}
                onClick={handleCardClick}
              />
            );
          })}
        </div>
      </div>
      <br />
      <br />
      <br />
      <footer>
        <div className="score">
          <div className="moves">
            <span className="bold">Moves:</span> {moves}
          </div>
          {sessionStorage.getItem("bestScore") && (
            <div className="high-score">
              <span className="bold">Best Score:</span> {bestScore}
            </div>
          )}
        </div>
        <br />
        <div className="restart">
          <Button
            onClick={handleRestart}
            style={chatopen ? hide : show}
            color="primary"
            variant="contained"
          >
            Restart
          </Button>
        </div>
      </footer>
      <div>
        <Dialog
          open={showModal}
          disableEscapeKeyDown
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Congratulations!!! You completed the challenge
          </DialogTitle>
          <DialogContent
            style={{
              width: "300px",
              height: "60px",
              color: "black",
              padding: "15px 10px -5px 10px",
            }}
          >
            <DialogContentText id="alert-dialog-description">
              You completed the game in {moves} moves. Your best score is{" "}
              {bestScore} moves.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRestart} color="primary">
              Restart
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className="home-box">
        <Link to="/content">
          <img src={homeIcon} onClick={bactToHome} alt="" />
        </Link>
        <p>Go to home</p>
      </div>
      <div className="chatCon">
        <div className="footer">
          {chatopen && <ChatPlay memoryList={memoryList}></ChatPlay>}
        </div>
        <div className="pop">
          <p className="img-wrap">
            <img className="logo" onClick={toggle} src={chatIcon} alt="" />
          </p>
          {/* {!chatopen && (
            <p className="info">You can ask me if you want to know something</p>
          )} */}
        </div>
      </div>
    </div>
  );
}
