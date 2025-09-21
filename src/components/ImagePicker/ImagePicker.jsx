import {
  FaMountain,
  FaTree,
  FaWater,
  FaCity,
  FaSun,
  FaMoon,
  FaCloud,
  FaLeaf,
  FaFire,
  FaSnowflake,
  FaStar,
  FaHeart,
  FaGem,
  FaFeather,
  FaSeedling,
  FaPalette,
} from "react-icons/fa";
import "./ImagePicker.css";

/**
 * Image configuration with local paths and representative icons
 * Place your 16 images in public/images/backgrounds/ folder
 * Name them: image1.jpg, image2.jpg, etc. (or update the paths below)
 */
const BACKGROUND_IMAGES = [
  // Row 1
  {
    path: "/images/backgrounds/image1.jpg",
    icon: FaMountain,
    name: "Mountains",
  },
  { path: "/images/backgrounds/image2.jpg", icon: FaTree, name: "Forest" },
  { path: "/images/backgrounds/image3.jpg", icon: FaWater, name: "Ocean" },
  { path: "/images/backgrounds/image4.jpg", icon: FaCity, name: "City" },

  // Row 2
  { path: "/images/backgrounds/image5.jpg", icon: FaSun, name: "Sunrise" },
  { path: "/images/backgrounds/image6.jpg", icon: FaMoon, name: "Night" },
  { path: "/images/backgrounds/image7.jpg", icon: FaCloud, name: "Sky" },
  { path: "/images/backgrounds/image8.jpg", icon: FaLeaf, name: "Nature" },

  // Row 3
  { path: "/images/backgrounds/image9.jpg", icon: FaFire, name: "Abstract" },
  {
    path: "/images/backgrounds/image10.jpg",
    icon: FaSnowflake,
    name: "Winter",
  },
  { path: "/images/backgrounds/image11.jpg", icon: FaStar, name: "Space" },
  { path: "/images/backgrounds/image12.jpg", icon: FaHeart, name: "Artistic" },

  // Row 4
  { path: "/images/backgrounds/image13.jpg", icon: FaGem, name: "Texture" },
  { path: "/images/backgrounds/image14.jpg", icon: FaFeather, name: "Minimal" },
  { path: "/images/backgrounds/image15.jpg", icon: FaSeedling, name: "Floral" },
  {
    path: "/images/backgrounds/image16.jpg",
    icon: FaPalette,
    name: "Colorful",
  },
];

/**
 * ImagePicker - Grid-based image background picker
 *
 * This component provides a visual image picker with a 4x4 grid of
 * custom background images. Each image has a representative icon overlay
 * for better identification and consistent UI.
 *
 * Features:
 * - Always visible 4x4 grid layout
 * - Icon overlays for image identification
 * - Seamless grid with no spacing
 * - Consistent with other picker components
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Current selected image URL
 * @param {Function} props.onChange - Callback when image is selected
 * @param {string} props.label - Label for the image picker
 * @returns {JSX.Element} Image picker grid
 */
const ImagePicker = ({ value, onChange, label = "Images" }) => {
  /**
   * Handle image selection
   * @param {string} imagePath - Path to the selected image
   */
  const handleImageSelect = (imagePath) => {
    const imageUrl = `url("${imagePath}") center/cover`;
    onChange(imageUrl);
  };

  /**
   * Check if current background matches an image
   */
  const getCurrentImage = () => {
    for (const image of BACKGROUND_IMAGES) {
      const imageUrl = `url("${image.path}") center/cover`;
      if (value === imageUrl) {
        return image.path;
      }
    }
    return null;
  };

  const selectedImage = getCurrentImage();

  return (
    <div className="image-picker">
      <div className="image-header">
        <h4>{label}</h4>
      </div>

      <div className="image-grid-container">
        <div className="image-grid">
          {BACKGROUND_IMAGES.map((image, index) => {
            const IconComponent = image.icon;
            const isSelected = selectedImage === image.path;

            return (
              <button
                key={index}
                className={`image-square ${isSelected ? "selected" : ""}`}
                onClick={() => handleImageSelect(image.path)}
                title={image.name}
              >
                <div
                  className="image-background"
                  style={{ backgroundImage: `url(${image.path})` }}
                />
                <div className="image-overlay">
                  <IconComponent className="image-icon" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ImagePicker;
