import { useTheme } from "../../contexts/ThemeContext";
import SpectrumColorPicker from "../SpectrumColorPicker";
import GradientPicker from "../GradientPicker";
import ImagePicker from "../ImagePicker";
import "./BackgroundSelector.css";

/**
 * Background options configuration for the theme system
 *
 * This array defines all available background options organized by category:
 * - colors: Solid color backgrounds
 * - gradients: CSS gradient backgrounds
 * - images: Curated image backgrounds from Unsplash
 *
 * Each option includes:
 * - id: Unique identifier
 * - name: Display name for UI
 * - value: CSS background value to apply
 * - thumbnail: Smaller version for preview
 * - category: Grouping for organization
 */
const BACKGROUND_OPTIONS = [
  // Gradients - Curated 3x3 grid of beautiful gradients
  {
    id: "gradient-sunset",
    name: "Sunset",
    value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    thumbnail: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    category: "gradients",
  },
  {
    id: "gradient-ocean",
    name: "Ocean",
    value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    thumbnail: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    category: "gradients",
  },
  {
    id: "gradient-aurora",
    name: "Aurora",
    value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    thumbnail: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    category: "gradients",
  },
  {
    id: "gradient-purple",
    name: "Purple Dream",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    thumbnail: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    category: "gradients",
  },
  {
    id: "gradient-fire",
    name: "Fire",
    value: "linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)",
    thumbnail: "linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)",
    category: "gradients",
  },
  {
    id: "gradient-mint",
    name: "Mint Fresh",
    value: "linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)",
    thumbnail: "linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)",
    category: "gradients",
  },
  {
    id: "gradient-cosmic",
    name: "Cosmic",
    value: "linear-gradient(135deg, #667db6 0%, #0082c8 100%)",
    thumbnail: "linear-gradient(135deg, #667db6 0%, #0082c8 100%)",
    category: "gradients",
  },
  {
    id: "gradient-rose",
    name: "Rose Gold",
    value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    thumbnail: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    category: "gradients",
  },
  {
    id: "gradient-night",
    name: "Night Sky",
    value: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
    thumbnail: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
    category: "gradients",
  },

  // Curated Images (using Unsplash for safe, high-quality images)
  {
    id: "image-mountains",
    name: "Mountains",
    value:
      'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center") center/cover',
    thumbnail:
      'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&crop=center") center/cover',
    category: "images",
  },
  {
    id: "image-space",
    name: "Space",
    value:
      'url("https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920&h=1080&fit=crop&crop=center") center/cover',
    thumbnail:
      'url("https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=100&h=100&fit=crop&crop=center") center/cover',
    category: "images",
  },
  {
    id: "image-forest",
    name: "Forest",
    value:
      'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&crop=center") center/cover',
    thumbnail:
      'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop&crop=center") center/cover',
    category: "images",
  },
  {
    id: "image-ocean",
    name: "Ocean",
    value:
      'url("https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&h=1080&fit=crop&crop=center") center/cover',
    thumbnail:
      'url("https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=100&h=100&fit=crop&crop=center") center/cover',
    category: "images",
  },
  {
    id: "image-city",
    name: "City Lights",
    value:
      'url("https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&h=1080&fit=crop&crop=center") center/cover',
    thumbnail:
      'url("https://images.unsplash.com/photo-1514565131-fce0801e5785?w=100&h=100&fit=crop&crop=center") center/cover',
    category: "images",
  },
  {
    id: "image-abstract",
    name: "Abstract",
    value:
      'url("https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1920&h=1080&fit=crop&crop=center") center/cover',
    thumbnail:
      'url("https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=100&h=100&fit=crop&crop=center") center/cover',
    category: "images",
  },
];

/**
 * BackgroundSelector - Interface for selecting clock background themes
 *
 * This component provides a comprehensive background selection interface with
 * options organized by category (colors, gradients, images). It integrates
 * with the theme system to apply backgrounds to the entire application and
 * provides visual thumbnails for easy selection.
 *
 * Features:
 * - Categorized background options (solid colors, gradients, images)
 * - Visual thumbnails for preview before selection
 * - Integration with ThemeContext for immediate application
 * - Curated high-quality image backgrounds from Unsplash
 * - Accessible button labels and keyboard navigation
 *
 * Background Types:
 * - Solid Colors: Basic color backgrounds including light/dark themes
 * - Gradients: CSS linear gradients with artistic color combinations
 * - Images: Curated landscape and abstract images optimized for backgrounds
 *
 * Theme Integration:
 * - Uses theme context to get/set current background
 * - Backgrounds are applied to document body for full-screen coverage
 * - Changes persist across sessions via localStorage
 *
 * @returns {JSX.Element} Background selection interface with categorized options
 */
const BackgroundSelector = () => {
  const { background, setBackground } = useTheme();

  /**
   * Handle background selection and update theme context
   * @param {string} backgroundValue - CSS background value to apply
   */
  const handleBackgroundSelect = (backgroundValue) => {
    setBackground(backgroundValue);
  };

  /**
   * Group background options by category for organized display
   */
  const groupedOptions = BACKGROUND_OPTIONS.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {});

  /**
   * Human-readable category titles for UI display
   */
  const categoryTitles = {
    gradients: "Gradients",
    images: "Images",
  };

  /**
   * Handle custom color selection from spectrum picker
   * @param {string} color - Selected color value
   */
  const handleCustomColorSelect = (color) => {
    setBackground(color);
  };

  /**
   * Check if current background is a custom color (not in predefined options)
   */
  const isCustomColor = !BACKGROUND_OPTIONS.some(
    (option) => option.value === background
  );
  const currentCustomColor = isCustomColor ? background : "hsl(220, 100%, 50%)";

  return (
    <div className="background-selector">
      {/* Custom Color Picker Section */}
      <div className="background-category">
        <SpectrumColorPicker
          value={currentCustomColor}
          onChange={handleCustomColorSelect}
          label="Solid Colors"
        />
      </div>

      {/* Gradient Picker Section */}
      <div className="background-category">
        <GradientPicker
          value={background}
          onChange={setBackground}
          label="Gradients"
        />
      </div>

      {/* Image Picker Section */}
      <div className="background-category">
        <ImagePicker
          value={background}
          onChange={setBackground}
          label="Images"
        />
      </div>
    </div>
  );
};

export default BackgroundSelector;
