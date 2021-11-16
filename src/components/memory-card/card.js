import classnames from "classnames";
import "./card.scss";

const MemoryCard = ({
  onClick,
  card,
  type,
  index,
  isInactive,
  isFlipped,
  isDisabled,
}) => {
  const handleClick = () => {
    !isFlipped && !isDisabled && onClick(index, type);
  };

  return (
    <div
      className={classnames("card", {
        "is-flipped": isFlipped,
        "is-inactive": isInactive,
      })}
      onClick={() => handleClick()}
    >
      <div className="card-face card-back-face">
        <h4>{card[type]}</h4>
      </div>
    </div>
  );
};

export default MemoryCard;
