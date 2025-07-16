import FlipCard from "../FlipCard";

function FlipCardGrid({
  leftValue,
  rightValue,
  prevLeftValue,
  prevRightValue,
  flippingUnits,
  showMiniSeconds = false,
  miniSecondsValue = "00",
  prevMiniSecondsValue = "00",
}) {
  return (
    <div className="time-display">
      {/* Left card (Hours in Clock, Minutes in Timer) */}
      <FlipCard
        value={leftValue}
        prevValue={prevLeftValue}
        isFlipping={flippingUnits.left}
      />

      {/* Right card (Minutes in Clock, Seconds in Timer) */}
      <div className="minutes-group">
        <FlipCard
          value={rightValue}
          prevValue={prevRightValue}
          isFlipping={flippingUnits.right}
        />

        {/* Mini seconds only in Clock mode */}
        {showMiniSeconds && (
          <div className="seconds-overlay">
            <FlipCard
              value={miniSecondsValue}
              prevValue={prevMiniSecondsValue}
              isFlipping={flippingUnits.mini}
              size="mini"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FlipCardGrid;
