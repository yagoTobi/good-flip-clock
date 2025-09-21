# Background Images

Place your 16 custom background images in this folder.

## File Naming Convention

Name your images as follows:

- `image1.jpg` - Mountains (🏔️)
- `image2.jpg` - Forest (🌲)
- `image3.jpg` - Ocean (🌊)
- `image4.jpg` - City (🏙️)
- `image5.jpg` - Sunrise (☀️)
- `image6.jpg` - Night (🌙)
- `image7.jpg` - Sky (☁️)
- `image8.jpg` - Nature (🍃)
- `image9.jpg` - Abstract (🔥)
- `image10.jpg` - Winter (❄️)
- `image11.jpg` - Space (⭐)
- `image12.jpg` - Artistic (❤️)
- `image13.jpg` - Texture (💎)
- `image14.jpg` - Minimal (🪶)
- `image15.jpg` - Floral (�))
- `image16.jpg` - Colorful (🎨)

## Supported Formats

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`

## Recommended Size

- **Resolution**: 1920x1080 or higher
- **Aspect Ratio**: 16:9 (landscape)
- **File Size**: Under 2MB for optimal loading

## Customizing Icons and Names

To change the icons or names, edit the `BACKGROUND_IMAGES` array in:
`src/components/ImagePicker/ImagePicker.jsx`

Each image object has:

```javascript
{
  path: "/images/backgrounds/image1.jpg",
  icon: FaMountain,  // React icon component
  name: "Mountains"  // Display name for tooltip
}
```

## Available Icons

The component uses React Icons (FontAwesome). You can choose from:

- FaMountain, FaTree, FaWater, FaCity
- FaSun, FaMoon, FaCloud, FaLeaf
- FaFire, FaSnowflake, FaStar, FaHeart
- FaGem, FaFeather, FaSeedling, FaPalette
- And many more from the `react-icons/fa` library
