import { useState } from "react";
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
 * Image configuration with local paths, thumbnails, and representative icons
 * Full images are used for actual backgrounds, thumbnails for picker performance
 */
const BACKGROUND_IMAGES = [
  // Row 1
  {
    path: "/images/backgrounds/image1.webp",
    thumbnail: "/images/backgrounds/thumbs/image1_thumb.webp",
    icon: FaMountain,
    name: "Mountains",
  },
  {
    path: "/images/backgrounds/image2.webp",
    thumbnail: "/images/backgrounds/thumbs/image2_thumb.webp",
    icon: FaTree,
    name: "Forest",
  },
  {
    path: "/images/backgrounds/image3.webp",
    thumbnail: "/images/backgrounds/thumbs/image3_thumb.webp",
    icon: FaWater,
    name: "Ocean",
  },
  {
    path: "/images/backgrounds/image4.webp",
    thumbnail: "/images/backgrounds/thumbs/image4_thumb.webp",
    icon: FaCity,
    name: "City",
  },

  // Row 2
  {
    path: "/images/backgrounds/image5.webp",
    thumbnail: "/images/backgrounds/thumbs/image5_thumb.webp",
    icon: FaSun,
    name: "Sunrise",
  },
  {
    path: "/images/backgrounds/image6.webp",
    thumbnail: "/images/backgrounds/thumbs/image6_thumb.webp",
    icon: FaMoon,
    name: "Night",
  },
  {
    path: "/images/backgrounds/image7.webp",
    thumbnail: "/images/backgrounds/thumbs/image7_thumb.webp",
    icon: FaCloud,
    name: "Sky",
  },
  {
    path: "/images/backgrounds/image8.webp",
    thumbnail: "/images/backgrounds/thumbs/image8_thumb.webp",
    icon: FaLeaf,
    name: "Nature",
  },

  // Row 3
  {
    path: "/images/backgrounds/image9.webp",
    thumbnail: "/images/backgrounds/thumbs/image9_thumb.webp",
    icon: FaFire,
    name: "Abstract",
  },
  {
    path: "/images/backgrounds/image10.webp",
    thumbnail: "/images/backgrounds/thumbs/image10_thumb.webp",
    icon: FaSnowflake,
    name: "Winter",
  },
  {
    path: "/images/backgrounds/image11.webp",
    thumbnail: "/images/backgrounds/thumbs/image11_thumb.webp",
    icon: FaStar,
    name: "Space",
  },
  {
    path: "/images/backgrounds/image12.webp",
    thumbnail: "/images/backgrounds/thumbs/image12_thumb.webp",
    icon: FaHeart,
    name: "Artistic",
  },

  // Row 4
  {
    path: "/images/backgrounds/image13.webp",
    thumbnail: "/images/backgrounds/thumbs/image13_thumb.webp",
    icon: FaGem,
    name: "Texture",
  },
  {
    path: "/images/backgrounds/image14.webp",
    thumbnail: "/images/backgrounds/thumbs/image14_thumb.webp",
    icon: FaFeather,
    name: "Minimal",
  },
  {
    path: "/images/backgrounds/image15.webp",
    thumbnail: "/images/backgrounds/thumbs/image15_thumb.webp",
    icon: FaSeedling,
    name: "Floral",
  },
  {
    path: "/images/backgrounds/image16.webp",
    thumbnail: "/images/backgrounds/thumbs/image16_thumb.webp",
    icon: FaPalette,
    name: "Colorful",
  },
];

/**
 * LazyImage - Performance-optimized image component with fallback
 */
const LazyImage = ({
  src,
  fallbackSrc,
  alt,
  className,
  style,
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = useState(fallbackSrc || src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (src) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoading(false);
        setHasError(false);
        onLoad && onLoad();
      };
      img.onerror = () => {
        setImageSrc(fallbackSrc || src);
        setIsLoading(false);
        setHasError(true);
        onError && onError();
      };
      img.src = src;
    }
  }, [src, fallbackSrc, onLoad, onError]);

  return (
    <div
      className={`${className} ${isLoading ? "loading" : ""} ${
        hasError ? "error" : ""
      }`}
      style={{
        ...style,
        backgroundImage: `url(${imageSrc})`,
        backgroundColor: isLoading ? "#f0f0f0" : "transparent",
      }}
    />
  );
};

/**
 * ImagePicker - Grid-based image background picker with performance optimizations
 *
 * This component provides a visual image picker with a 4x4 grid of
 * custom background images. Uses thumbnails for fast loading and lazy loading
 * for better performance.
 *
 * Features:
 * - Always visible 4x4 grid layout
 * - Thumbnail images for fast loading
 * - Lazy loading with fallbacks
 * - Icon overlays for image identification
 * - Performance optimized for mobile
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

  const [loadedImages, setLoadedImages] = useState(new Set());

  const handleImageLoad = (imagePath) => {
    setLoadedImages((prev) => new Set([...prev, imagePath]));
  };

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
            const isLoaded = loadedImages.has(image.path);

            return (
              <button
                key={index}
                className={`image-square ${isSelected ? "selected" : ""} ${
                  !isLoaded ? "loading" : ""
                }`}
                onClick={() => handleImageSelect(image.path)}
                title={image.name}
                aria-label={`Select ${image.name} background`}
              >
                <img
                  className="image-background"
                  src={image.thumbnail}
                  alt={image.name}
                  loading="lazy"
                  onLoad={() => handleImageLoad(image.path)}
                />
                <div className="image-overlay">
                  <IconComponent className="image-icon" aria-hidden="true" />
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
