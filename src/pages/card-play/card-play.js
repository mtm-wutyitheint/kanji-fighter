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
  return list;
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
    JSON.parse(localStorage.getItem("bestScore")) || Number.POSITIVE_INFINITY
  );
  const timeout = useRef(null);

  const getMemoryList = () => {
    const loginUser = JSON.parse(localStorage.getItem("loginUser"));
    let jwt = loginUser && loginUser.jwt ? loginUser.jwt : "";
    const headers = { Authorization: `Bearer ${jwt}` };
    axios
      .get(`${env.apiEndPoint}/memory-games`)
      .then((res) => {
        console.log(res.data);
        const sliceArray = res.data.slice(0, 24);
        let list = randomList(_.cloneDeep(sliceArray));
        console.log(list);
        setHira(list);
        let shuffleData = shuffleCards(_.cloneDeep(list));
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
    localStorage.setItem("bestScore", highScore);
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
    setMemoryList(shuffleCards(memoryList));
  };

  let hide = {
    display: "none",
  };
  let show = {
    display: "block",
  };
  let textRef = React.createRef();
  // const {messages} = props

  const [chatopen, setChatopen] = useState(false);
  const toggle = (e) => {
    setChatopen(!chatopen);
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
        <div className="container">
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
        <div className="container ">
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
          {localStorage.getItem("bestScore") && (
            <div className="high-score">
              <span className="bold">Best Score:</span> {bestScore}
            </div>
          )}
        </div>
        <br />
        <div className="restart">
          <Button onClick={handleRestart} color="primary" variant="contained">
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
          <DialogContent>
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
      <div class="chatCon">
        {/* <div class="chat-box" style={chatopen ? show : hide}></div> */}
        <div class="footer">{chatopen && <ChatPlay></ChatPlay>}</div>

        <div class="pop">
          <p>
            <img
              onClick={toggle}
              src="https://p7.hiclipart.com/preview/151/758/442/iphone-imessage-messages-logo-computer-icons-message.jpg"
              alt=""
            />
          </p>
        </div>
      </div>
    </div>
  );
}

//   let hide = {
//     display: 'none',
//   }
//   let show = {
//     display: 'block'
//   }
//   let textRef = React.createRef()
//   // const {messages} = props

//   const [chatopen, setChatopen] = useState(false)
//   const toggle = e => {
//     setChatopen(!chatopen)
//   }

//   const handleSend = e => {
//     // const get = props.getMessage
//     // get(textRef.current.value)
//   }
//   return (
//     <>
//     <Items></Items>
//     <div class='chatCon'>
//       {/* <div class="chat-box" style={chatopen ? show : hide}></div> */}
//       <div class="footer">
//       {chatopen &&
//       <ChatPlay></ChatPlay>
//       }
//     </div>
//   {/* </div> */}
//     <div class="pop">
//       <p><img onClick={toggle} src="https://p7.hiclipart.com/preview/151/758/442/iphone-imessage-messages-logo-computer-icons-message.jpg" alt="" /></p>
//     </div>
//     </div>
//     </>
//   );
// }
