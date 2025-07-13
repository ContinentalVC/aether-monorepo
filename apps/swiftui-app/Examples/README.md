# Aether SwiftUI App

A comprehensive SwiftUI application demonstrating advanced iOS development patterns including Redux-like state management, Core Data persistence, theme management, interactive charts, and accessibility features.

## 🚀 Features

### Core Architecture
- **Redux-like State Management**: Immutable data patterns with pure reducer functions
- **Core Data Integration**: Persistent data storage with background context support
- **Theme Management**: Dynamic theme switching with dark mode support
- **Accessibility**: Full VoiceOver support with semantic labels and hints

### UI Components
- **AetherGlassCard**: Glassmorphism card component with theme integration
- **ProgressLineChart**: Interactive line chart with animations and haptic feedback
- **LoginButtonView**: Animated login button with multiple states
- **ThemeManager**: ObservableObject for theme switching and persistence

### Data Management
- **PDF Export**: Professional PDF report generation
- **Core Data CRUD**: Complete data persistence operations
- **Background Processing**: Non-blocking data operations

## 📋 Prerequisites

- **Xcode 15.0+** (for iOS 15.0+ and macOS 12.0+ support)
- **Swift 5.9+**
- **iOS 15.0+** or **macOS 12.0+** target device/simulator
- **macOS** for development (Xcode is macOS-only)

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd aether-monorepo/apps/swiftui-app
```

### 2. Open in Xcode
```bash
# Option 1: Open the Package.swift file directly
open Package.swift

# Option 2: Create an Xcode project (recommended for development)
# Create a new iOS App project in Xcode and add all Swift files
```

### 3. Add Files to Xcode Project
If creating a new Xcode project, add these files to your project:

**Core Files:**
- `AetherSwiftUIApp.swift` (main app entry point)
- `AppReducer.swift` (Redux-like state management)
- `CoreDataManager.swift` (Core Data operations)
- `ThemeManager.swift` (theme management)

**UI Components:**
- `AetherGlassCard.swift` (glassmorphism card)
- `ProgressLineChart.swift` (interactive chart)
- `LoginButtonView.swift` (animated login button)

**Example Views:**
- `AppStoreExample.swift` (reducer usage example)
- `ThemeManagerExample.swift` (theme switching example)
- `ProgressLineChartExample.swift` (chart usage example)
- `LoginExampleView.swift` (login button example)

**Utilities:**
- `PDFExporter.swift` (PDF generation)

**Core Data Model:**
- `ChartData.xcdatamodeld` (Core Data model file)

### 4. Configure Core Data
1. Add the `ChartData.xcdatamodeld` file to your Xcode project
2. Ensure the model is included in your app target
3. The `CoreDataManager` will automatically handle the Core Data stack

### 5. Set Up App Entry Point
Replace your default `ContentView` with one of the example views or create your own:

```swift
// In your main app file
@main
struct YourApp: App {
    @StateObject private var coreDataManager = CoreDataManager.shared
    @StateObject private var themeManager = ThemeManager()
    
    var body: some Scene {
        WindowGroup {
            ProgressLineChartExample() // or any other example view
                .environmentObject(coreDataManager)
                .environmentObject(themeManager)
                .preferredColorScheme(themeManager.isDarkMode ? .dark : .light)
        }
    }
}
```

## 🏃‍♂️ Running the App

### Using Swift Package Manager
```bash
# Build the package
swift build

# Run tests
swift test

# Run on iOS Simulator (requires Xcode project)
# Open in Xcode and press Cmd+R
```

### Using Xcode
1. **Open the project** in Xcode
2. **Select a target device** (iOS Simulator or physical device)
3. **Press Cmd+R** to build and run
4. **Press Cmd+U** to run tests

### Available Example Views
- **AppStoreExample**: Demonstrates Redux-like state management
- **ThemeManagerExample**: Shows theme switching and dark mode
- **ProgressLineChartExample**: Interactive chart with Core Data and PDF export
- **LoginExampleView**: Animated login button demonstration

## 🧪 Testing

### Running Tests
```bash
# Using Swift Package Manager
swift test

# Using Xcode
# Press Cmd+U or go to Product > Test
```

### Test Coverage
- **AppReducer Tests**: Comprehensive tests for state management
- **Unit Tests**: Individual component testing
- **Integration Tests**: Core Data and theme management

## 📱 App Features

### State Management
The app uses a Redux-like pattern with immutable data:

```swift
// Example usage
@StateObject private var appStore = AppStore(initialState: AppState())

// Dispatch actions
appStore.dispatch(.updateUserName("John Doe"))
appStore.dispatch(.incrementScore(10))
```

### Theme System
Dynamic theme switching with persistence:

```swift
@EnvironmentObject var themeManager: ThemeManager

// Switch themes
themeManager.setTheme(.purple)
themeManager.toggleDarkMode()
```

### Core Data Integration
Persistent data storage with background processing:

```swift
@EnvironmentObject var coreDataManager: CoreDataManager

// Save data
coreDataManager.saveChartData(label: "Sales", value: 150.0, x: 1.0, y: 150.0)

// Fetch data
let chartData = coreDataManager.fetchChartData()
```

### Interactive Charts
Animated charts with haptic feedback and accessibility:

```swift
ProgressLineChart(
    data: chartData,
    animateOnAppear: true,
    enableHaptics: true
)
```

## 🔧 Configuration

### Core Data Model
The `ChartData` entity includes:
- `id`: UUID for unique identification
- `label`: String for data point labels
- `value`: Double for numerical values
- `x`, `y`: Double coordinates for positioning
- `colorHex`: String for custom colors
- `createdAt`: Date for timestamps

### Theme Configuration
Predefined themes available:
- **Light**: Clean, bright interface
- **Dark**: Dark mode with proper contrast
- **Purple**: Purple accent theme
- **Green**: Green accent theme

### Accessibility Features
- VoiceOver labels for all interactive elements
- Semantic grouping for chart data points
- Haptic feedback for user interactions
- Proper accessibility traits and hints

## 🚀 Potential Improvements

### 1. Architecture Enhancements

#### SwiftData Migration
```swift
// Consider migrating from Core Data to SwiftData for iOS 17+
@Model
class ChartData {
    var id: UUID
    var label: String
    var value: Double
    var x: Double
    var y: Double
    var colorHex: String?
    var createdAt: Date
}
```

#### Combine Integration
```swift
// Add Combine publishers for reactive data flow
class AppStore: ObservableObject {
    @Published private(set) var state: AppState
    private let subject = PassthroughSubject<AppAction, Never>()
    
    init(initialState: AppState) {
        self.state = initialState
        setupBindings()
    }
}
```

### 2. Performance Optimizations

#### Lazy Loading
```swift
// Implement lazy loading for large datasets
LazyVStack {
    ForEach(chartData) { data in
        ChartDataRow(data: data)
    }
}
```

#### Background Processing
```swift
// Enhanced background processing
Task.detached(priority: .background) {
    await processLargeDataset()
}
```

### 3. UI/UX Improvements

#### Custom Animations
```swift
// Add custom spring animations
.animation(.spring(response: 0.6, dampingFraction: 0.8), value: isAnimating)
```

#### Gesture Support
```swift
// Add gesture recognition
.gesture(
    DragGesture()
        .onChanged { value in
            // Handle drag interactions
        }
)
```

#### Advanced Charts
```swift
// Implement multi-series charts
MultiSeriesChart(
    datasets: [
        ChartDataset(data: salesData, color: .blue),
        ChartDataset(data: revenueData, color: .green)
    ]
)
```

### 4. Data Management

#### CloudKit Sync
```swift
// Add iCloud synchronization
class CloudKitManager: ObservableObject {
    func syncData() async throws {
        // Implement CloudKit sync
    }
}
```

#### Offline Support
```swift
// Implement offline-first architecture
class OfflineManager: ObservableObject {
    func queueOperation(_ operation: DataOperation) {
        // Queue operations for when online
    }
}
```

### 5. Testing Enhancements

#### UI Testing
```swift
// Add UI tests for critical user flows
class AetherSwiftUIAppUITests: XCTestCase {
    func testThemeSwitching() {
        // Test theme switching functionality
    }
}
```

#### Performance Testing
```swift
// Add performance benchmarks
func testChartRenderingPerformance() {
    measure {
        // Measure chart rendering performance
    }
}
```

### 6. Accessibility Improvements

#### Dynamic Type Support
```swift
// Support dynamic type scaling
.font(.system(size: 16, weight: .medium, design: .default))
.dynamicTypeSize(.large ... .accessibility3)
```

#### Voice Control
```swift
// Add voice control support
.accessibilityAction(named: "Export PDF") {
    exportPDF()
}
```

### 7. Security Enhancements

#### Data Encryption
```swift
// Encrypt sensitive data
class SecureStorage {
    func encrypt(_ data: Data) throws -> Data {
        // Implement encryption
    }
}
```

#### Biometric Authentication
```swift
// Add biometric authentication
class BiometricAuth {
    func authenticate() async throws -> Bool {
        // Implement biometric auth
    }
}
```

### 8. Analytics and Monitoring

#### Crash Reporting
```swift
// Integrate crash reporting
import Crashlytics

func logError(_ error: Error) {
    Crashlytics.crashlytics().record(error: error)
}
```

#### Performance Monitoring
```swift
// Add performance monitoring
class PerformanceMonitor {
    func trackEvent(_ event: String, parameters: [String: Any]? = nil) {
        // Track performance metrics
    }
}
```

## 📚 Additional Resources

### Documentation
- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui)
- [Core Data Programming Guide](https://developer.apple.com/documentation/coredata)
- [SwiftData Documentation](https://developer.apple.com/documentation/swiftdata)

### Best Practices
- Follow SwiftUI lifecycle patterns
- Use `@StateObject` for owned objects
- Use `@EnvironmentObject` for shared objects
- Implement proper error handling
- Test on multiple device sizes

### Performance Tips
- Use `LazyVStack` and `LazyHStack` for large lists
- Minimize view updates with proper state management
- Use background tasks for heavy operations
- Profile with Instruments for performance bottlenecks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This SwiftUI app demonstrates advanced iOS development patterns and is designed for educational and reference purposes. For production use, ensure proper error handling, security measures, and performance optimization. 