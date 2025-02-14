# Up or Nah?

<p align="center">
  <img src="assets/images/logo-hol.png" alt="Up or Nah? Logo" width="200"/>
</p>

A fun and addictive game where players guess which search term has more monthly Google searches. Test your knowledge of popular search trends!

## 🎮 How to Play

1. You'll be shown two search terms
2. Guess which term has more monthly Google searches
3. Choose "HIGHER" or "LOWER" to make your guess
4. Each correct guess adds to your score
5. Game ends when you make a wrong guess

## 🚀 Features

- Beautiful modern UI with gradient backgrounds and blur effects
- High score tracking with AsyncStorage
- Rich dataset of search terms with their monthly search volumes
- Smooth animations and transitions
- Cross-platform support (iOS and Android)

## 📱 Screens

1. **Game Screen**: Main gameplay screen where users make their guesses
2. **How to Play**: Instructions screen explaining game rules
3. **High Score**: Displays and tracks the user's highest score

## 🛠️ Technical Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **UI Components**:
  - expo-blur for blur effects
  - expo-linear-gradient for gradient backgrounds
  - react-native-safe-area-context for safe area handling
- **State Management**: Local state with AsyncStorage for persistence
- **Icons**: @expo/vector-icons (AntDesign)

## 📦 Dependencies

Major dependencies include:
```json
{
  "@expo/vector-icons": "^14.0.2",
  "@react-native-async-storage/async-storage": "^2.1.1",
  "expo": "~52.0.30",
  "expo-blur": "~14.0.3",
  "expo-linear-gradient": "^14.0.2",
  "expo-router": "~4.0.17",
  "react": "18.3.1",
  "react-native": "0.76.6"
}
```

## 🗃️ Data Structure

The game uses a JSON data structure for search terms:
```json
{
  "keyword": "string",      // Search term
  "searchVolume": number,   // Monthly search volume
  "author": "string",      // Image author credit
  "link": "string",        // Source link
  "image": "string",       // Image URL
  "id": number            // Unique identifier
}
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Use Expo Go app to run on your device or use an emulator

## 🎯 Future Improvements

- Add sound effects
- Implement multiplayer mode
- Add different categories of search terms
- Include weekly/monthly leaderboards
- Add social sharing features

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
