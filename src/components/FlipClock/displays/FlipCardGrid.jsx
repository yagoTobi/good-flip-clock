import FlipCard from "../FlipCard";

/**
 * FlipCardGrid - Layout component for organizing flip cards in time display format
 *
 * This component provides a consistent layout structure for displaying time values
 * using flip cards. It handles the arrangement of main time units (hours/minutes or
 * minutes/seconds) and optionally includes a mini seconds display for clock mode.
 *
 * Layout Structure:
 * - Left card: Hours (in clock mode) or Minutes (in timer mode)
 * - Right card: Minutes (in clock mode) or Seconds (in timer mode)
 * - Mini seconds: Small seconds display (clock mode only)
 *
 * Features:
 * - Flexible value mapping based on display mode
 * - Optional mini seconds overlay for clock mode
 * - Consistent animation timing across all cards
 * - Responsive layout with proper spacing and alignment
 *
 * @param {Object} props - Component props
 * @param {string} props.leftValue - Current value for left flip card
 * @param {string} props.rightValue - Current value for right flip card
 * @param {string} props.prevLeftValue - Previous value for left card animation
 * @param {string} props.prevRightValue - Previous value for right card animation
 * @param {Object} props.flippingUnits - Animation state object
 * @param {boolean} props.flippingUnits.left - Whether left card should animate
 * @param {boolean} props.flippingUnits.right - Whether right card should animate
 * @param {boolean} props.flippingUnits.mini - Whether mini seconds should animate
 * @param {boolean} [props.showMiniSeconds=false] - Whether to show mini seconds display
 * @param {string} [props.miniSecondsValue="00"] - Current mini seconds value
 * @param {string} [props.prevMiniSecondsValue="00"] - Previous mini seconds value
 * @returns {JSX.Element} Grid layout with flip cards for time display
 */
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
