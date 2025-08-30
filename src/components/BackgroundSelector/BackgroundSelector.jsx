import { useTheme } from "../../contexts/ThemeContext";
import "./BackgroundSelector.css";

const BACKGROUND_OPTIONS = [
  // Solid Colors
  {
    id: "default",
    name: "Default",
    value: "default",
    thumbnail: "#1a1a1a",
    category: "colors",
  },
  {
    id: "dark",
    name: "Dark",
    value: "#0a0a0a",
    thumbnail: "#0a0a0a",
    category: "colors",
  },
  {
    id: "light",
    name: "Light",
    value: "#f5f5f5",
    thumbnail: "#f5f5f5",
    category: "colors",
  },
  {
    id: "white",
    name: "White",
    value: "#ffffff",
    thumbnail: "#ffffff",
    category: "colors",
  },
  {
    id: "red",
    name: "Red",
    value: "#dc2626",
    thumbnail: "#dc2626",
    category: "colors",
  },
  {
    id: "orange",
    name: "Orange",
    value: "#ea580c",
    thumbnail: "#ea580c",
    category: "colors",
  },
  {
    id: "yellow",
    name: "Yellow",
    value: "#ca8a04",
    thumbnail: "#ca8a04",
    category: "colors",
  },
  {
    id: "green",
    name: "Green",
    value: "#16a34a",
    thumbnail: "#16a34a",
    category: "colors",
  },
  {
    id: "blue",
    name: "Blue",
    value: "#2563eb",
    thumbnail: "#2563eb",
    category: "colors",
  },
  {
    id: "indigo",
    name: "Indigo",
    value: "#4f46e5",
    thumbnail: "#4f46e5",
    category: "colors",
  },
  {
    id: "purple",
    name: "Purple",
    value: "#9333ea",
    thumbnail: "#9333ea",
    category: "colors",
  },
  {
    id: "pink",
    name: "Pink",
    value: "#ec4899",
    thumbnail: "#ec4899",
    category: "colors",
  },
  {
    id: "teal",
    name: "Teal",
    value: "#0d9488",
    thumbnail: "#0d9488",
    category: "colors",
  },
  {
    id: "cyan",
    name: "Cyan",
    value: "#0891b2",
    thumbnail: "#0891b2",
    category: "colors",
  },
  {
    id: "navy",
    name: "Navy",
    value: "#1e3a8a",
    thumbnail: "#1e3a8a",
    category: "colors",
  },
  {
    id: "forest",
    name: "Forest",
    value: "#166534",
    thumbnail: "#166534",
    category: "colors",
  },

  // Gradients
  {
    id: "gradient-blue",
    name: "Blue Wave",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    thumbnail: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    category: "gradients",
  },
  {
    id: "gradient-sunset",
    name: "Sunset",
    value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    thumbnail: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
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
    id: "gradient-fire",
    name: "Fire",
    value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
    thumbnail: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
    category: "gradients",
  },
  {
    id: "gradient-cosmic",
    name: "Cosmic",
    value:
      "linear-gradient(135deg, #667db6 0%, #0082c8 25%, #0082c8 75%, #667db6 100%)",
    thumbnail:
      "linear-gradient(135deg, #667db6 0%, #0082c8 25%, #0082c8 75%, #667db6 100%)",
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

const BackgroundSelector = () => {
  const { background, setBackground } = useTheme();

  const handleBackgroundSelect = (backgroundValue) => {
    setBackground(backgroundValue);
  };

  // Group options by category
  const groupedOptions = BACKGROUND_OPTIONS.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {});

  const categoryTitles = {
    colors: "Solid Colors",
    gradients: "Gradients",
    images: "Images",
  };

  return (
    <div className="background-selector">
      <h3>Choose Background</h3>
      {Object.entries(groupedOptions).map(([category, options]) => (
        <div key={category} className="background-category">
          <h4 className="category-title">{categoryTitles[category]}</h4>
          <div className="background-options">
            {options.map((option) => (
              <button
                key={option.id}
                className={`background-option ${
                  background === option.value ? "selected" : ""
                }`}
                onClick={() => handleBackgroundSelect(option.value)}
                aria-label={`Select ${option.name} background`}
                title={option.name}
              >
                <div
                  className="background-thumbnail"
                  style={{ background: option.thumbnail }}
                />
                <span className="background-name">{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BackgroundSelector;
