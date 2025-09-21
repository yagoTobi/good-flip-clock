import "./GradientPicker.css";

/**
 * Curated collection of beautiful gradients
 * Organized in a 4x3 grid for perfect visual balance
 */
const GRADIENTS = [
  // Row 1 - Warm Colors (Reds, Oranges, Pinks)
  "linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)", // Fire (Red-Orange)
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", // Sunset (Pink-Peach)
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", // Rose Gold (Pink-Red)
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", // Peach (Orange-Peach)

  // Row 2 - Cool Colors (Blues, Greens, Teals)
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", // Ocean (Blue-Cyan)
  "linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)", // Mint Fresh (Cyan-Green)
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", // Aurora (Green-Teal)
  "linear-gradient(135deg, #667db6 0%, #0082c8 100%)", // Cosmic (Blue-Blue)

  // Row 3 - Purples and Neutrals
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Purple Dream (Blue-Purple)
  "linear-gradient(135deg, #ff8a80 0%, #ea80fc 100%)", // Neon Pink (Pink-Purple)
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", // Cotton Candy (Teal-Pink)
  "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)", // Night Sky (Dark Neutral)
];

/**
 * GradientPicker - Tight grid-based gradient picker
 *
 * This component provides a visual gradient picker with a 4x3 grid of
 * beautiful, curated gradients. Matches the design style of SpectrumColorPicker
 * for consistent UI experience.
 *
 * Features:
 * - Always visible 4x3 grid layout
 * - Seamless gradient squares with no spacing
 * - Smooth hover effects for better UX
 * - Consistent selection highlighting
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Current selected gradient value
 * @param {Function} props.onChange - Callback when gradient is selected
 * @param {string} props.label - Label for the gradient picker
 * @returns {JSX.Element} Gradient picker grid
 */
const GradientPicker = ({ value, onChange, label = "Gradients" }) => {
  /**
   * Handle gradient selection
   * @param {string} gradient - CSS gradient string
   */
  const handleGradientSelect = (gradient) => {
    onChange(gradient);
  };

  return (
    <div className="gradient-picker">
      <div className="gradient-header">
        <h4>{label}</h4>
      </div>

      <div className="gradient-grid-container">
        <div className="gradient-grid">
          {GRADIENTS.map((gradient, index) => (
            <button
              key={index}
              className={`gradient-square ${
                value === gradient ? "selected" : ""
              }`}
              style={{ background: gradient }}
              onClick={() => handleGradientSelect(gradient)}
              title={`Gradient ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradientPicker;
