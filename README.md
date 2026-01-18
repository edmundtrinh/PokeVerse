# PokéVerse 🌟

A comprehensive Pokémon companion app built with React Native and Expo, bringing the complete Pokémon experience to your mobile device.

## ✨ Features

### 🔍 **Interactive Pokédex** (Fully Featured)
Explore the complete world of Pokémon with our advanced Pokédex:

- **Complete Pokémon Database**: Browse all Pokémon from Generation I through IX (Kanto to Paldea)
- **Advanced Search & Filtering**: Search by name, number, type, generation, or region
- **Detailed Pokémon Information**: 
  - High-quality sprites and official artwork
  - Complete stats, abilities, and type information
  - Pokémon descriptions and classification data
  - Height, weight, and habitat details
- **Multiple Form Support**: View alternate forms for Pokémon like Deoxys, Rotom, and regional variants
- **Sprite Customization**:
  - Choose from different generations and game versions
  - Toggle between normal and shiny variants
  - View front/back sprites and male/female differences
  - Support for animated sprites from Black/White
  - Smart fallback system for generation-specific sprite availability
- **Performance Optimizations**:
  - LRU image caching for fast sprite loading
  - Generation-aware preloading for smooth scrolling
  - All 1025 Pokémon loaded upfront for instant filtering
- **Personal Collection**: 
  - Mark favorite Pokémon with a heart system
  - Filter to view only your favorites
  - Persistent favorites saved across app sessions
- **Evolution Chains**: Explore complete evolutionary paths
- **Responsive Design**: Smooth animations and intuitive navigation

### 🃏 **Trading Cards** (Coming Soon)
Digital Pokémon Trading Card Game experience:
- Card collection and deck building
- Browse official TCG artwork and card details
- Deck management and strategy planning

### ⚔️ **Team Builder** (Planned)
Showdown-style competitive team building:
- Create and manage competitive Pokémon teams
- Team analysis and strategy recommendations
- Export teams for battle simulators

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- iOS Simulator, Android Emulator, or Expo Go app

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/edmundtrinh/PokeVerse.git
   cd PokeVerse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

### Running on Different Platforms

#### 📱 **On Your Phone (Expo Go)**
1. Install [Expo Go](https://expo.dev/client) from the App Store or Google Play
2. Run `npm start` in your terminal
3. Scan the QR code with Expo Go (Android) or Camera app (iOS)

#### 📱 **iOS Simulator**
```bash
npm run ios
```
*Requires Xcode installed on macOS*

#### 🤖 **Android Emulator**
```bash
npm run android
```
*Requires Android Studio and an Android Virtual Device*

#### 🌐 **Web Browser**
```bash
npm run web
```
*Great for quick testing and development*

## 🎮 How to Use

### Exploring Pokémon
1. **Browse**: Scroll through the complete Pokédex or use the search bar
2. **Filter**: Use type filters or generation selectors to narrow your search
3. **Discover**: Tap any Pokémon card to view detailed information
4. **Customize**: Use the settings button (TM disk icon) to adjust sprite preferences
5. **Collect**: Tap the heart icon to add Pokémon to your favorites

### Advanced Features
- **Forms**: For Pokémon with multiple forms, use the form selector to explore variants
- **Sprite Options**: Change between different game versions, shiny variants, and orientations
- **Search Tips**: Search by name ("Pikachu"), number ("25"), or type ("Electric")
- **Generation Filtering**: Focus on specific regions like "Kanto" or "Galar"

## 🏗️ Built With

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build system
- **TypeScript**: Type-safe JavaScript development
- **PokéAPI**: Comprehensive Pokémon data source
- **React Native Reanimated**: Smooth animations and transitions

## 🔄 Development Status

- ✅ **Pokédex**: Fully featured and polished
- ✅ **Image Caching**: LRU cache with smart preloading
- ✅ **Cross-Platform**: Validated on iOS and Android
- 🚧 **Trading Cards**: In development
- 📋 **Team Builder**: Planned for future release
- 🎨 **UI/UX**: Continuously improving

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, feature enhancements, or UI improvements, feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing comprehensive Pokémon data
- The Pokémon Company for creating this amazing universe
- The open-source community for the tools and libraries that make this possible

---

**Catch 'em all in the digital world! 🎯**