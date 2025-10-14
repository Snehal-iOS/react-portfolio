# React Portfolio

A cross-platform portfolio tracking application built with React Native and Expo, featuring Clean Architecture principles, dependency injection, and internationalization support.

## Features

- Portfolio overview with holdings management
- Real-time portfolio metrics and calculations
- Portfolio simulation capabilities
- Multi-language support (English, Arabic with RTL support)
- Cross-platform (iOS, Android, Web)
- Clean Architecture with dependency injection
- Type-safe routing with Expo Router

## Architecture

This project follows Clean Architecture principles with clear separation of concerns:

```
src/
├── core/                    # Shared utilities and infrastructure
│   ├── localization/       # i18n support with RTL
│   ├── theme/              # Design tokens (colors, spacing)
│   └── utils/              # Common utilities
└── features/
    └── portfolio/          # Portfolio feature module
        ├── application/    # Use cases and DI contexts
        ├── data/          # Repositories and data mappers
        ├── domain/        # Business logic and entities
        └── presentation/  # UI components and screens
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Run on your preferred platform:

   ```bash
   npm run ios      # iOS simulator
   npm run android  # Android emulator
   npm run web      # Web browser
   ```

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## Development

The app uses:

- **Expo Router** for file-based navigation
- **React Native Reanimated** for smooth animations
- **Context API** for state management and dependency injection
- **Custom hooks** for business logic encapsulation
- **Repository pattern** for data access abstraction

## Project Structure

- `/app` - Expo Router file-based routing
- `/src/core` - Shared infrastructure code
- `/src/features` - Feature modules with Clean Architecture
- `/assets` - Images, fonts, and other static resources

## Technologies

- React Native 0.81
- Expo SDK 54
- React 19
- TypeScript 5.9
- Expo Router 6
- React Native Reanimated 4

## License

Private
