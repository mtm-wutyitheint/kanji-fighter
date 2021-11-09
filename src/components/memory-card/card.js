import classnames from "classnames";
import memory from "../../img/14.png";
import hiragana from "../../img/15.png";
import "./card.scss";

const MemoryCard = ({ onClick, card, type, index, isInactive, isFlipped, isDisabled }) => {

  const handleClick = () => {
    !isFlipped && !isDisabled && onClick(index, type);
  };

  return (
    <div
      className={classnames("card", {
        "is-flipped": isFlipped,
        "is-inactive": isInactive
      })}
      onClick={() => handleClick()}
    >
      {/* {index}\{card.id} */}
      <div className="card-face card-font-face">
        <img src={type === 'furigana' ? hiragana : memory} alt={type === 'furigana' ? 'furigana' : memory} />
      </div>
      <div className="card-face card-back-face">
        <h4>{card[type]}</h4>
      </div>
    </div>
  );
};

export default MemoryCard;