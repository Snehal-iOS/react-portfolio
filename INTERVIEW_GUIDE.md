# React Native Portfolio App - Interview Preparation Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Deep Dive](#architecture-deep-dive)
3. [React Native Fundamentals](#react-native-fundamentals)
4. [React Hooks Explained](#react-hooks-explained)
5. [Key Design Patterns](#key-design-patterns)
6. [Component Analysis](#component-analysis)
7. [Performance Optimizations](#performance-optimizations)
8. [Common Interview Questions](#common-interview-questions)

---

## Project Overview

### What This App Does
A **portfolio tracking application** that displays:
- Investment portfolio overview with total value
- Individual stock holdings (Apple, Tesla, Microsoft, etc.)
- Profit/Loss metrics for each holding
- Real-time price updates (simulated every 1 second)
- Multi-language support (English & Arabic with RTL)

### Tech Stack
- **React Native 0.81.4** - Cross-platform mobile framework
- **Expo SDK 54** - Development platform and tooling
- **React 19.1.0** - UI library
- **Expo Router 6** - File-based navigation
- **PropTypes** - Runtime type validation
- **Context API** - State management and dependency injection

---

## Architecture Deep Dive

### Clean Architecture Implementation

The app follows **Clean Architecture** with four distinct layers:

```
┌─────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (UI)                            │
│  • Components (HoldingCard, PortfolioHeader)        │
│  • Screens (PortfolioScreen)                        │
│  • Hooks (usePortfolioOverview)                     │
│  • Depends on: Application Layer                    │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  APPLICATION LAYER (Use Cases & DI)                 │
│  • Context providers (PortfolioProvider)            │
│  • Use case creation and dependency injection       │
│  • Depends on: Domain Layer                         │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  DOMAIN LAYER (Business Logic)                      │
│  • Entities (Portfolio, Holding)                    │
│  • Use cases (getPortfolioOverview)                 │
│  • Repository interfaces (PortfolioRepository)      │
│  • Services (portfolioMetrics, portfolioSimulator)  │
│  • Framework-independent                            │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  DATA LAYER (Data Access)                           │
│  • Repository implementations (RemoteRepository)    │
│  • Data mappers (portfolioMapper)                   │
│  • API integration                                  │
│  • Depends on: Domain Layer                         │
└─────────────────────────────────────────────────────┘
```

### Why Clean Architecture?

**Benefits:**
1. **Testability** - Each layer can be tested independently
2. **Maintainability** - Easy to locate and fix bugs
3. **Scalability** - Simple to add new features
4. **Flexibility** - Can swap implementations (API → Local Storage)
5. **Professional** - Industry standard for large applications

**Example: Switching Data Sources**
```javascript
// Currently using remote API:
const repository = new RemotePortfolioRepository();

// Want offline support? Just swap the implementation:
const repository = isOnline
  ? new RemotePortfolioRepository()
  : new LocalPortfolioRepository();

// All business logic remains unchanged!
```

---

## React Native Fundamentals

### Core Components

```javascript
// View - Container (like <div> in web)
<View style={{ flex: 1, padding: 16 }}>
  <Text>Hello</Text>
</View>

// Text - Display text (like <p> or <span>)
<Text style={{ fontSize: 16, color: '#000' }}>
  Portfolio Value
</Text>

// ScrollView - Scrollable container
<ScrollView>
  {/* Long content */}
</ScrollView>

// Pressable - Touchable element
<Pressable onPress={() => console.log('Pressed')}>
  <Text>Click Me</Text>
</Pressable>

// SafeAreaView - Respects device notches/status bar
<SafeAreaView>
  {/* Content safe from notches */}
</SafeAreaView>
```

### Styling in React Native

```javascript
// No CSS classes, use StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,              // Takes full available height
    backgroundColor: '#FFF',
    padding: 16,          // No 'px' suffix, just numbers
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',    // String, not number
    color: '#000',
  }
});

// Apply styles:
<View style={styles.container}>
  <Text style={styles.text}>Hello</Text>
</View>

// Multiple styles (array):
<View style={[styles.base, styles.extra, isActive && styles.active]}>
```

### Flexbox (Default Layout)

```javascript
// Row layout (horizontal)
<View style={{ flexDirection: 'row' }}>
  <View style={{ flex: 1 }}>Left</View>
  <View style={{ flex: 2 }}>Right (twice as wide)</View>
</View>

// Column layout (vertical - default)
<View style={{ flexDirection: 'column' }}>
  <View>Top</View>
  <View>Bottom</View>
</View>

// Alignment
<View style={{
  justifyContent: 'center',    // Main axis (vertical if column)
  alignItems: 'center',         // Cross axis (horizontal if column)
}}>
```

---

## React Hooks Explained

### useState - State Management

```javascript
const [count, setCount] = useState(0);
//     ^         ^              ^
//     |         |              |
//  current   updater      initial value
//   value    function
```

**How it works:**
- Creates a state variable that React watches
- When state changes → React re-renders the component
- State persists between renders

**Example from PortfolioScreen:**
```javascript
const [state, setState] = useState({
  portfolio: null,
  metadata: { holdingsCount: 0, marketValue: 0 },
  status: "loading",
  error: null,
});

// Update state:
setState({ ...state, status: "success" });
// React detects change → re-renders component
```

**Functional updates:**
```javascript
// When new state depends on old state:
setState((prevState) => ({
  ...prevState,
  portfolio: newPortfolio
}));
```

---

### useEffect - Side Effects

```javascript
useEffect(() => {
  // Setup code (runs after render)
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  // Cleanup function (runs before next effect or unmount)
  return () => {
    clearInterval(timer);
  };
}, [dependency]);  // Dependency array
```

**When it runs:**
- After every render (if no dependency array)
- After first render only (if empty array `[]`)
- When dependencies change (if dependencies specified)

**Example from usePortfolioOverview:**
```javascript
useEffect(() => {
  let isMounted = true;  // Track if component still exists

  (async () => {
    try {
      const result = await getPortfolioOverview();
      if (isMounted) {  // Prevent setState on unmounted component
        setState({ ...result, status: "success" });
      }
    } catch (error) {
      if (isMounted) {
        setState((prev) => ({ ...prev, status: "error", error }));
      }
    }
  })();

  return () => {
    isMounted = false;  // Component unmounting
  };
}, [getPortfolioOverview]);
```

**Why isMounted pattern?**
Prevents this bug:
1. Component mounts → Fetch data (takes 2 seconds)
2. User navigates away → Component unmounts
3. Fetch completes → Tries to setState on unmounted component
4. **Error!** "Can't perform a React state update on an unmounted component"

**IIFE Pattern (Immediately Invoked Function Expression):**
```javascript
// useEffect callback can't be async directly:
// ❌ This doesn't work:
useEffect(async () => {
  await getData();
}, []);

// ✅ Use IIFE instead:
useEffect(() => {
  (async () => {
    await getData();
  })();
}, []);
```

---

### useContext - Consume Context

```javascript
// 1. Create context
const ThemeContext = createContext({ theme: 'light' });

// 2. Provide value
<ThemeContext.Provider value={{ theme: 'dark' }}>
  <App />
</ThemeContext.Provider>

// 3. Consume in any child component
const { theme } = useContext(ThemeContext);
```

**Example from app:**
```javascript
// Provider (PortfolioProvider.jsx):
<PortfolioUseCasesContext.Provider value={value}>
  {children}
</PortfolioUseCasesContext.Provider>

// Consumer (usePortfolioOverview.js):
const { getPortfolioOverview } = useContext(PortfolioUseCasesContext);
```

**Why Context over Prop Drilling?**

**Without Context (Bad):**
```javascript
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <Profile user={user} />  // Passed through 4 levels!
    </Sidebar>
  </Layout>
</App>
```

**With Context (Good):**
```javascript
<UserContext.Provider value={user}>
  <App>
    <Layout>
      <Sidebar>
        <Profile />  // Accesses user directly!
      </Sidebar>
    </Layout>
  </App>
</UserContext.Provider>
```

---

### useRef - Persistent Container

```javascript
const timerRef = useRef(null);
//       ^          ^
//       |          |
//   current    initial value
//   property

// Update ref (doesn't trigger re-render):
timerRef.current = setInterval(...);

// Access ref:
clearInterval(timerRef.current);
```

**Differences: useState vs useRef**

| Feature | useState | useRef |
|---------|----------|--------|
| Triggers re-render | ✅ Yes | ❌ No |
| Persists across renders | ✅ Yes | ✅ Yes |
| Use for UI data | ✅ Yes | ❌ No |
| Use for timers/DOM | ❌ No | ✅ Yes |

**Example:**
```javascript
// useState: Count affects UI
const [count, setCount] = useState(0);
<Text>{count}</Text>  // Re-renders when count changes

// useRef: Just need to remember timer ID
const timerRef = useRef(null);
timerRef.current = setInterval(...);  // No re-render
```

---

### useMemo - Memoize Values

```javascript
const expensiveValue = useMemo(
  () => {
    // Expensive calculation
    return items.filter(i => i.price > 100).map(format);
  },
  [items]  // Only recalculate if items change
);
```

**When to use:**
- Expensive computations
- Creating objects/arrays passed to Context
- Filtering/sorting large lists

**Example from PortfolioProvider:**
```javascript
const value = useMemo(
  () => ({
    getPortfolioOverview: createGetPortfolioOverviewUseCase(repository),
  }),
  []  // Empty deps = calculate once, never again
);
```

**Why needed?**
```javascript
// ❌ Without useMemo:
const value = { getPortfolioOverview: ... };
// New object every render → All consumers re-render

// ✅ With useMemo:
const value = useMemo(() => ({ ... }), []);
// Same object reference → Consumers don't re-render unnecessarily
```

---

### useCallback - Memoize Functions

```javascript
const handlePress = useCallback(
  (holding) => {
    console.log(holding);
  },
  []  // Dependencies
);
```

**When to use:**
- Passing callbacks to optimized child components
- Functions used in useEffect dependencies
- Context values

**Example from LocalizationProvider:**
```javascript
const toggleLocale = useCallback(() => {
  setLocale((prev) => {
    const currentIndex = availableLocales.indexOf(prev);
    const nextIndex = (currentIndex + 1) % availableLocales.length;
    return availableLocales[nextIndex];
  });
}, []);
```

**useMemo vs useCallback:**

| Hook | Caches | Example |
|------|--------|---------|
| `useMemo` | **Values** | `useMemo(() => obj, [])` |
| `useCallback` | **Functions** | `useCallback(() => {}, [])` |

```javascript
// These are equivalent:
const memoizedCallback = useCallback(() => {}, []);
const memoizedCallback = useMemo(() => () => {}, []);
```

---

## Key Design Patterns

### Repository Pattern

**Purpose:** Abstract data access behind an interface

**Structure:**
```javascript
// 1. Abstract Repository (Interface)
export default class PortfolioRepository {
  async getPortfolio() {
    throw new Error('Must implement getPortfolio');
  }
}

// 2. Concrete Implementation
export default class RemotePortfolioRepository extends PortfolioRepository {
  async getPortfolio() {
    const response = await fetch(PORTFOLIO_API_URL);
    if (!response.ok) throw new Error('Failed to load');
    return response.json();
  }
}

// 3. Usage (Dependency Injection)
const repository = new RemotePortfolioRepository();
const useCase = createGetPortfolioOverviewUseCase(repository);
```

**Benefits:**
- ✅ Easy to test (inject fake repository)
- ✅ Easy to swap implementations (API → Local Storage)
- ✅ Business logic independent of data source

**Example: Adding Offline Support**
```javascript
// Create new implementation:
class LocalPortfolioRepository extends PortfolioRepository {
  async getPortfolio() {
    return AsyncStorage.getItem('portfolio');
  }
}

// Switch in ONE place:
const repository = isOnline
  ? new RemotePortfolioRepository()
  : new LocalPortfolioRepository();

// All components work unchanged! 🎉
```

---

### Dependency Injection (DI)

**Without DI (Bad):**
```javascript
function getPortfolioOverview() {
  const repository = new RemotePortfolioRepository();  // Hardcoded!
  return repository.getPortfolio();
}

// Problems:
// - Can't test with fake data
// - Can't switch to local storage
// - Tightly coupled to RemotePortfolioRepository
```

**With DI (Good):**
```javascript
function createGetPortfolioOverviewUseCase(repository) {
  return async () => {
    return repository.getPortfolio();  // Uses injected dependency
  };
}

// Usage:
const remoteRepo = new RemotePortfolioRepository();
const useCase = createGetPortfolioOverviewUseCase(remoteRepo);

// Testing:
const fakeRepo = new FakePortfolioRepository();
const testUseCase = createGetPortfolioOverviewUseCase(fakeRepo);
```

**Benefits:**
1. **Testability** - Inject fake/mock dependencies
2. **Flexibility** - Easy to swap implementations
3. **Decoupling** - Components don't know implementation details

---

### Provider Pattern (Context API)

**Purpose:** Share data across component tree without prop drilling

**Implementation:**
```javascript
// 1. Create Context
const PortfolioUseCasesContext = createContext(defaultValue);

// 2. Create Provider Component
const PortfolioProvider = ({ children }) => {
  const value = useMemo(() => ({
    getPortfolioOverview: createUseCase(repository),
  }), []);

  return (
    <PortfolioUseCasesContext.Provider value={value}>
      {children}
    </PortfolioUseCasesContext.Provider>
  );
};

// 3. Wrap App
<PortfolioProvider>
  <App />
</PortfolioProvider>

// 4. Consume anywhere
const { getPortfolioOverview } = useContext(PortfolioUseCasesContext);
```

---

### Custom Hooks Pattern

**Purpose:** Extract and reuse stateful logic

**Example: usePortfolioOverview**
```javascript
export default function usePortfolioOverview() {
  const [state, setState] = useState({
    portfolio: null,
    status: "loading",
    error: null,
  });

  const { getPortfolioOverview } = useContext(PortfolioUseCasesContext);

  useEffect(() => {
    // Fetch data
    getPortfolioOverview().then(result => {
      setState({ ...result, status: "success" });
    });
  }, []);

  return state;  // Return stateful data
}

// Usage in any component:
const { portfolio, status, error } = usePortfolioOverview();
```

**Benefits:**
- ✅ Reusable logic across components
- ✅ Easier to test
- ✅ Cleaner component code
- ✅ Follow Single Responsibility Principle

---

## Component Analysis

### PortfolioScreen.jsx

**Responsibilities:**
- Display portfolio overview and holdings list
- Handle loading, error, and success states
- Manage user interactions

**Key Patterns:**

```javascript
// 1. Custom hooks for data and localization
const { portfolio, metadata, status, error } = usePortfolioOverview();
const { t, isRTL } = useLocalization();

// 2. Conditional rendering based on status
if (status === "loading") {
  return <LoadingScreen />;
}
if (status === "error") {
  return <ErrorScreen />;
}

// 3. Event handler
const handleHoldingPress = (holding) => {
  // Future: Navigate to detail screen
};

// 4. RTL support with conditional styles
<View style={[styles.container, isRTL && styles.containerRtl]}>
```

**Flow:**
1. Component mounts → `usePortfolioOverview()` fetches data
2. Show loading spinner while `status === "loading"`
3. Data arrives → `status === "success"` → Show portfolio
4. Error occurs → `status === "error"` → Show error message

---

### usePortfolioOverview.js (Custom Hook)

**Responsibilities:**
- Fetch portfolio data
- Simulate real-time updates
- Manage loading/error states

**Key Logic:**

```javascript
// 1. State management
const [state, setState] = useState({
  portfolio: null,
  metadata: { holdingsCount: 0, marketValue: 0 },
  status: "loading",
  error: null,
});

// 2. Fetch data on mount
useEffect(() => {
  let isMounted = true;

  getPortfolioOverview().then(result => {
    if (isMounted) {
      setState({ ...result, status: "success" });
    }
  });

  return () => { isMounted = false; };
}, []);

// 3. Simulate real-time updates (every 1 second)
useEffect(() => {
  if (status === "success") {
    const timer = setInterval(() => {
      setState(prev => ({
        ...prev,
        portfolio: simulatePortfolioUpdate(prev.portfolio)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }
}, [status]);
```

---

### HoldingCard.jsx

**Responsibilities:**
- Display individual holding information
- Show P&L with color coding (green/red)
- Support RTL layout
- Handle press interactions

**Key Features:**

```javascript
// 1. Conditional styling based on P&L
const isNegative = holding.pnlValue < 0;
const color = isNegative ? colors.negative : colors.positive;

// 2. Icons based on trend
<Feather
  name={isNegative ? "trending-down" : "trending-up"}
  color={color}
/>

// 3. RTL support throughout
<View style={[styles.row, isRTL && styles.rowReverse]}>

// 4. Press feedback
<Pressable
  style={({ pressed }) => [
    styles.card,
    pressed && styles.cardPressed  // Scale down when pressed
  ]}
  onPress={() => onPress?.(holding)}
>

// 5. PropTypes validation
HoldingCard.propTypes = {
  holding: PropTypes.shape({
    symbol: PropTypes.string.isRequired,
    pnlValue: PropTypes.number.isRequired,
    // ...
  }).isRequired,
  onPress: PropTypes.func,
};
```

---

### LocalizationProvider.jsx

**Responsibilities:**
- Manage current language
- Provide translation function
- Track RTL state

**Key Features:**

```javascript
// 1. Language state
const [locale, setLocale] = useState("en");

// 2. Toggle between languages
const toggleLocale = useCallback(() => {
  setLocale((prev) => {
    const currentIndex = availableLocales.indexOf(prev);  // 0 (en)
    const nextIndex = (currentIndex + 1) % availableLocales.length;  // 1 (ar)
    return availableLocales[nextIndex];  // "ar"
  });
}, []);

// 3. Translation function
const t = (key) => resolveTranslation(locale, key);
// t("common.loading") → "Loading portfolio…" or "جارٍ تحميل المحفظة…"

// 4. RTL detection
const isRTL = locale === "ar";
```

**Translation Resolution:**
```javascript
function resolveTranslation(locale, key) {
  // key: "common.loading"
  const segments = key.split(".");  // ["common", "loading"]
  let node = translations[locale];  // translations["en"]

  // Walk through object:
  for (const segment of segments) {
    node = node[segment];  // node["common"] → node["loading"]
  }

  return typeof node === "string" ? node : key;
}
```

---

### ErrorBoundary.jsx

**Responsibilities:**
- Catch React errors in component tree
- Display user-friendly error message
- Log errors (development + production)

**Key Methods:**

```javascript
// 1. Update state when error occurs
static getDerivedStateFromError(error) {
  return { hasError: true, error };
}

// 2. Log error details
componentDidCatch(error, errorInfo) {
  if (__DEV__) {
    console.error("Error:", error, errorInfo);
  }
  // In production: Send to Sentry, Bugsnag, etc.
}

// 3. Render fallback UI or children
render() {
  if (this.state.hasError) {
    return <ErrorFallbackUI />;
  }
  return this.props.children;
}
```

**What It Catches:**
- ✅ Rendering errors
- ✅ Lifecycle method errors
- ✅ Constructor errors

**What It Doesn't Catch:**
- ❌ Event handlers (use try/catch)
- ❌ Async code (promises, setTimeout)
- ❌ Server-side rendering
- ❌ Errors in error boundary itself

---

## Performance Optimizations

### 1. useMemo for Context Values

```javascript
// ❌ Without useMemo (Bad):
const value = {
  getPortfolioOverview: createUseCase(repository)
};
// New object every render → All Context consumers re-render

// ✅ With useMemo (Good):
const value = useMemo(() => ({
  getPortfolioOverview: createUseCase(repository)
}), []);
// Same object reference → No unnecessary re-renders
```

---

### 2. useCallback for Event Handlers

```javascript
// ❌ Without useCallback:
const toggleLocale = () => {
  setLocale(prev => /* ... */);
};
// New function every render → Child components re-render

// ✅ With useCallback:
const toggleLocale = useCallback(() => {
  setLocale(prev => /* ... */);
}, []);
// Same function reference → Child components don't re-render
```

---

### 3. Cleanup in useEffect

```javascript
useEffect(() => {
  const timer = setInterval(() => {
    updateData();
  }, 1000);

  // Cleanup prevents memory leaks:
  return () => {
    clearInterval(timer);
  };
}, []);
```

---

### 4. Conditional Style Arrays

```javascript
// Efficient: Only applies RTL styles when needed
<View style={[
  styles.container,
  isRTL && styles.containerRtl  // Short-circuit evaluation
]}>
```

---

### 5. Design Tokens (Theme System)

```javascript
// Centralized values → Easy to update globally
import colors from 'core/theme/colors';
import spacing from 'core/theme/spacing';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundPrimary,
    padding: spacing.md,
  }
});
```

---

## Common Interview Questions

### Q1: Explain this app's architecture

**Answer:**
"This app follows Clean Architecture with four distinct layers:

1. **Domain Layer** - Contains business logic (entities, use cases, repository interfaces). It's framework-independent and doesn't know about React or data sources.

2. **Data Layer** - Implements repository interfaces to fetch data from APIs. It maps raw API responses to domain entities.

3. **Application Layer** - Manages dependency injection through Context API. It creates use cases with proper dependencies and provides them to the presentation layer.

4. **Presentation Layer** - React components, hooks, and screens. It only depends on the application layer and handles UI concerns.

This separation provides several benefits:
- Each layer is independently testable
- We can swap implementations (API → local storage) without changing business logic
- Code is more maintainable as concerns are clearly separated
- It's easier to onboard new developers as the structure is predictable"

---

### Q2: Why use Context API instead of Redux?

**Answer:**
"For this application, Context API is the right choice because:

1. **Simple State Requirements** - We're primarily sharing use cases and localization, not complex global state
2. **Less Boilerplate** - No need for actions, reducers, middleware, or store configuration
3. **Built-in** - No external dependencies to manage
4. **Sufficient** - We don't need Redux DevTools or time-travel debugging

However, I'd consider Redux or Zustand for:
- Complex state with many interdependencies
- Need for debugging tools
- Large teams requiring strict patterns
- Apps with hundreds of actions

For this portfolio app, Context API keeps the code simple while meeting all requirements."

---

### Q3: Explain useEffect cleanup and why it's important

**Answer:**
"useEffect cleanup functions prevent memory leaks and bugs. Let me explain with an example from our portfolio hook:

```javascript
useEffect(() => {
  // Start a timer for real-time updates
  const timer = setInterval(() => {
    updatePortfolio();
  }, 1000);

  // Cleanup function
  return () => {
    clearInterval(timer);
  };
}, []);
```

Without cleanup:
1. Component unmounts (user navigates away)
2. Timer keeps running in background
3. Timer tries to update state on unmounted component
4. Results in memory leak and console warnings

The cleanup function runs:
- Before the effect runs again (when dependencies change)
- When the component unmounts

We also use the `isMounted` pattern to prevent setState on unmounted components:

```javascript
useEffect(() => {
  let isMounted = true;

  fetchData().then(result => {
    if (isMounted) {  // Only update if still mounted
      setState(result);
    }
  });

  return () => { isMounted = false; };
}, []);
```

This is especially important for async operations that might complete after the component unmounts."

---

### Q4: Explain the difference between useState and useRef

**Answer:**
"useState and useRef both persist values across renders, but have different purposes:

**useState:**
- Triggers re-render when updated
- Use for data that affects the UI
- Example: count displayed on screen

```javascript
const [count, setCount] = useState(0);
setCount(count + 1);  // Re-renders component
```

**useRef:**
- Doesn't trigger re-render when updated
- Persists across renders
- Use for: DOM references, timers, previous values
- Example: storing interval ID

```javascript
const timerRef = useRef(null);
timerRef.current = setInterval(() => {}, 1000);  // No re-render
clearInterval(timerRef.current);
```

In our portfolio hook, we use useRef for the simulation timer because:
1. We need to store the interval ID to clear it later
2. Updating the timer ID shouldn't trigger a re-render
3. The ID needs to persist across renders

This demonstrates understanding when to optimize and avoid unnecessary re-renders."

---

### Q5: How does your internationalization system work?

**Answer:**
"Our i18n system has three main parts:

**1. Translation Object Structure:**
```javascript
const translations = {
  en: {
    common: { loading: 'Loading...' },
    portfolio: { netValue: 'Net Value' }
  },
  ar: {
    common: { loading: 'جارٍ التحميل...' },
    portfolio: { netValue: 'صافي القيمة' }
  }
};
```

**2. Resolution Function:**
Takes a key like 'common.loading' and navigates through the object:
```javascript
function resolveTranslation(locale, key) {
  const segments = key.split('.');  // ['common', 'loading']
  let node = translations[locale];

  for (const segment of segments) {
    node = node[segment];
  }

  return typeof node === 'string' ? node : key;
}
```

**3. Provider with Context:**
Manages current locale and provides translation function:
```javascript
const LocalizationProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');

  const value = useMemo(() => ({
    locale,
    isRTL: locale === 'ar',
    toggleLocale: () => setLocale(/* toggle logic */),
    t: (key) => resolveTranslation(locale, key)
  }), [locale]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};
```

Components use it like this:
```javascript
const { t, isRTL } = useLocalization();
<Text>{t('common.loading')}</Text>
<View style={[styles.row, isRTL && styles.rowReverse]}>
```

The system also handles RTL layouts for Arabic, flipping UI elements and text alignment appropriately."

---

### Q6: Explain PropTypes and how they compare to TypeScript

**Answer:**
"PropTypes provide runtime type validation for React components:

```javascript
HoldingCard.propTypes = {
  holding: PropTypes.shape({
    symbol: PropTypes.string.isRequired,
    pnlValue: PropTypes.number.isRequired,
  }).isRequired,
  onPress: PropTypes.func,
};
```

**How they work:**
- In development, React checks props against defined types
- Warns in console if types don't match
- Stripped out in production builds

**PropTypes vs TypeScript:**

| Feature | PropTypes | TypeScript |
|---------|-----------|-----------|
| When checked | Runtime | Compile-time |
| Performance impact | Development only | None (compiled away) |
| Type coverage | Props only | Everything |
| IDE support | Limited | Excellent |
| Learning curve | Easy | Steeper |
| Migration effort | Low | Medium-High |

**My recommendation:**
For this portfolio app, PropTypes are sufficient as:
- The codebase is small and manageable
- Runtime validation catches integration bugs
- Lower barrier for JavaScript developers

For larger production apps, I'd recommend TypeScript because:
- Catches bugs at compile-time
- Better IDE autocomplete and refactoring
- Self-documenting code
- Prevents entire classes of bugs
- Better for team collaboration

A good migration path is:
1. Start with PropTypes
2. Add TypeScript gradually (rename .js to .ts)
3. Strict mode for new files
4. Gradually type existing files"

---

### Q7: What is the Repository Pattern and why use it?

**Answer:**
"The Repository Pattern abstracts data access behind an interface, decoupling business logic from data sources.

**Structure:**
```javascript
// 1. Abstract interface
class PortfolioRepository {
  async getPortfolio() {
    throw new Error('Must implement');
  }
}

// 2. Concrete implementation
class RemotePortfolioRepository extends PortfolioRepository {
  async getPortfolio() {
    return fetch(API_URL).then(r => r.json());
  }
}

// 3. Dependency injection
const repository = new RemotePortfolioRepository();
const useCase = createUseCase(repository);
```

**Benefits:**

**1. Testability:**
```javascript
// Production:
const realRepo = new RemotePortfolioRepository();

// Testing:
const fakeRepo = {
  getPortfolio: () => Promise.resolve(mockData)
};

const useCase = createUseCase(fakeRepo);  // Easy to test!
```

**2. Flexibility:**
```javascript
// Switch implementations without changing business logic:
const repository = isOnline
  ? new RemotePortfolioRepository()
  : new LocalPortfolioRepository();
```

**3. Separation of Concerns:**
- Domain layer defines what data is needed
- Data layer handles how to get it
- Clear boundaries between layers

**Real-world example:**
If we need to add offline support:
1. Create LocalPortfolioRepository
2. Inject it instead of RemotePortfolioRepository
3. All components and use cases work unchanged

This is much better than having fetch calls scattered throughout components."

---

### Q8: Explain Error Boundaries and what they catch

**Answer:**
"Error Boundaries are React components that catch JavaScript errors in their child component tree, log them, and display a fallback UI instead of crashing the entire app.

**Implementation:**
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error reporting service
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallbackUI />;
    }
    return this.props.children;
  }
}
```

**What they catch:**
✅ Errors during rendering
✅ Lifecycle method errors
✅ Constructor errors

**What they don't catch:**
❌ Event handlers (use try/catch)
❌ Async code (setTimeout, promises)
❌ Server-side rendering errors
❌ Errors in the error boundary itself

**Example of what's caught:**
```javascript
function BuggyComponent() {
  const items = undefined;
  return items.map(i => <Text>{i}</Text>);  // ✅ Caught!
}
```

**Example of what's NOT caught:**
```javascript
function BuggyComponent() {
  const handleClick = () => {
    throw new Error('Click error');  // ❌ Not caught - use try/catch
  };
  return <Button onPress={handleClick} />;
}
```

**Why use them:**
1. **User Experience** - Show friendly error instead of white screen
2. **Production Safety** - App doesn't completely crash
3. **Error Tracking** - Log errors to services like Sentry
4. **Debugging** - See which component tree caused the error

**Important:** Must be class components - React doesn't have hook equivalents for `getDerivedStateFromError` and `componentDidCatch` yet."

---

### Q9: What improvements would you make for production?

**Answer:**
"Great question! Here are enhancements I'd prioritize:

**1. TypeScript Migration**
- Compile-time type safety
- Better IDE support
- Self-documenting code
- Prevents runtime type errors

**2. Testing**
```javascript
// Unit tests with Jest
describe('usePortfolioOverview', () => {
  it('should fetch portfolio on mount', async () => {
    // Test implementation
  });
});

// Integration tests with React Native Testing Library
it('should display holdings', () => {
  render(<PortfolioScreen />);
  expect(screen.getByText('Apple Inc.')).toBeTruthy();
});
```

**3. Error Reporting**
```javascript
// Sentry integration in ErrorBoundary
componentDidCatch(error, errorInfo) {
  Sentry.captureException(error, {
    contexts: { react: { componentStack: errorInfo.componentStack } }
  });
}
```

**4. Performance Optimizations**
- `React.memo` for expensive components
- `FlatList` instead of `.map()` for large lists
- Image optimization with `expo-image`
- Code splitting for faster initial load

**5. Offline Support**
```javascript
// AsyncStorage for caching
class LocalPortfolioRepository extends PortfolioRepository {
  async getPortfolio() {
    const cached = await AsyncStorage.getItem('portfolio');
    if (cached) return JSON.parse(cached);

    const fresh = await this.remoteRepo.getPortfolio();
    await AsyncStorage.setItem('portfolio', JSON.stringify(fresh));
    return fresh;
  }
}
```

**6. Accessibility**
```javascript
<Pressable
  accessible={true}
  accessibilityLabel="View Apple stock details"
  accessibilityRole="button"
  accessibilityHint="Double tap to open detailed view"
>
```

**7. CI/CD Pipeline**
```yaml
# GitHub Actions
- name: Run Tests
  run: npm test
- name: Run Linter
  run: npm run lint
- name: Build iOS
  run: expo build:ios
- name: Submit to App Store
  run: expo submit:ios
```

**8. Analytics & Monitoring**
- Firebase Analytics for user behavior
- Performance monitoring
- Crash analytics

**Priority order depends on:**
- Team size and skills
- Timeline and deadlines
- User base and requirements
- Business needs"

---

### Q10: Explain async/await and Promises

**Answer:**
"Async/await is syntactic sugar over Promises, making asynchronous code look synchronous.

**Promises:**
```javascript
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

**Async/Await (Same thing, cleaner):**
```javascript
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

**Key concepts:**

**1. await pauses execution:**
```javascript
console.log('1');
const data = await fetch(url);  // Pauses here until resolved
console.log('2');  // Only runs after fetch completes
```

**2. async functions always return Promises:**
```javascript
async function getNumber() {
  return 42;
}

getNumber();  // Returns Promise<42>
getNumber().then(n => console.log(n));  // 42
```

**3. Error handling:**
```javascript
// Promise:
fetch(url)
  .then(r => r.json())
  .catch(err => console.error(err));

// Async/await:
try {
  const response = await fetch(url);
  const data = await response.json();
} catch (error) {
  console.error(error);
}
```

**In our app:**
```javascript
// Repository:
async getPortfolio() {
  const response = await fetch(PORTFOLIO_API_URL);
  if (!response.ok) throw new Error('Failed');
  return response.json();
}

// Hook (with IIFE because useEffect can't be async):
useEffect(() => {
  (async () => {
    try {
      const result = await getPortfolioOverview();
      setState({ ...result, status: 'success' });
    } catch (error) {
      setState({ status: 'error', error });
    }
  })();
}, []);
```

**When to use:**
- API calls
- Database queries
- File operations
- Any operation that takes time

**Benefits over Promises:**
- More readable (looks like synchronous code)
- Easier error handling with try/catch
- Better debugging (call stack preserved)"

---

## Key Takeaways for Interview

### Technical Strengths to Highlight

1. **Clean Architecture** ✅
   - Professional code organization
   - Clear separation of concerns
   - Easy to test and maintain

2. **Dependency Injection** ✅
   - Repository pattern
   - Context API for DI
   - Testable and flexible

3. **React Best Practices** ✅
   - Custom hooks for reusable logic
   - Proper useEffect cleanup
   - Performance optimizations (useMemo, useCallback)

4. **Error Handling** ✅
   - Error Boundary for UI errors
   - Try/catch for async operations
   - User-friendly error messages

5. **Type Safety** ✅
   - PropTypes for runtime validation
   - Clear prop interfaces

6. **Internationalization** ✅
   - Multi-language support
   - RTL layout support
   - Centralized translations

7. **Code Quality** ✅
   - JSDoc documentation
   - Consistent code style
   - Design tokens (theme system)

8. **Production-Ready** ✅
   - Error boundaries
   - Performance optimizations
   - Proper cleanup and memory management

---

## What Makes This Code Senior-Level

✅ **Architecture** - Clean Architecture with clear layers
✅ **Patterns** - Repository, DI, Provider patterns
✅ **Testing** - Code is testable (DI, separation of concerns)
✅ **Performance** - Proper use of useMemo, useCallback
✅ **Maintainability** - Clear structure, documentation
✅ **Scalability** - Easy to add features
✅ **Best Practices** - Cleanup, error handling, PropTypes
✅ **International** - i18n + RTL from day one
✅ **Professional** - Industry-standard patterns

---

## Interview Tips

1. **Explain WHY, not just WHAT**
   - Don't just describe what the code does
   - Explain why you chose this approach
   - Discuss trade-offs and alternatives

2. **Show understanding of fundamentals**
   - Explain how hooks work internally
   - Discuss React's rendering cycle
   - Understand when re-renders occur

3. **Be honest about limitations**
   - "PropTypes are good, but TypeScript is better for large apps"
   - "Context is fine here, but Redux might be better for X"
   - Shows mature thinking

4. **Discuss improvements**
   - TypeScript migration
   - Testing strategy
   - Performance monitoring
   - CI/CD pipeline

5. **Relate to real-world scenarios**
   - How would this scale?
   - How would you add offline support?
   - How would you debug production issues?

---

## Additional Resources

### Official Documentation
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Hooks Reference](https://react.dev/reference/react)
- [Expo Documentation](https://docs.expo.dev/)

### Articles
- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

### Books
- "Clean Architecture" by Robert C. Martin
- "Designing Data-Intensive Applications" by Martin Kleppmann
- "You Don't Know JS" series by Kyle Simpson

---

## Practice Questions to Prepare

1. Walk me through this app's data flow from API to UI
2. How would you add authentication to this app?
3. Explain how the real-time simulation works
4. How would you test the usePortfolioOverview hook?
5. What happens when you switch languages?
6. How does the error boundary protect the app?
7. Explain the lifecycle of a component in this app
8. How would you add a new feature (e.g., stock search)?
9. What's the performance impact of the 1-second timer?
10. How would you deploy this to production?

---

**Good luck with your interview!** 🚀

You have a solid, professional codebase that demonstrates senior-level thinking. Focus on explaining your architectural decisions and showing deep understanding of the concepts. Remember: it's not just about making it work, it's about making it maintainable, testable, and scalable.
