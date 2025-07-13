# LoginButtonView - SwiftUI Rive Animation Component

A complete SwiftUI view that implements an interactive login button with Rive animation feedback using `RiveViewModel` and state machine transitions.

## Features

- ✅ **Rive Animation Integration**: Uses `RiveViewModel` with state machine control
- ✅ **Interactive Feedback**: Visual feedback for all login states (Idle, Loading, Success, Error)
- ✅ **Form Validation**: Built-in username and password validation
- ✅ **Network Simulation**: 2-second simulated network request with random success/failure
- ✅ **State Management**: Proper SwiftUI state management with `@StateObject` and `@State`
- ✅ **Accessibility**: Full accessibility support with proper labels and states
- ✅ **Dark Mode Support**: Adaptive colors for light and dark themes
- ✅ **Comprehensive Documentation**: Detailed code comments and usage examples

## Requirements

- iOS 14.0+
- SwiftUI 2.0+
- RiveRuntime framework
- Xcode 12.0+

## Setup

### 1. Install RiveRuntime

Add RiveRuntime to your project using Swift Package Manager:

```swift
// In your Xcode project
// File → Add Package Dependencies
// URL: https://github.com/rive-app/rive-ios
```

### 2. Add Rive File

Place your `login_status.riv` file in your Xcode project's bundle. The file should contain:

- **State Machine**: `ButtonStates`
- **States**: `Idle`, `Loading`, `Success`, `Error`
- **Triggers**: `Tap`, `Succeed`, `Fail`

### 3. Import the Component

```swift
import SwiftUI
import RiveRuntime
```

## Usage

### Basic Implementation

```swift
struct ContentView: View {
    @State private var username = ""
    @State private var password = ""
    
    var body: some View {
        LoginButtonView(
            username: $username,
            password: $password,
            onLoginSuccess: { user in
                print("Login successful: \(user.username)")
                // Navigate to main app
            },
            onLoginError: { error in
                print("Login failed: \(error.localizedDescription)")
                // Show error alert
            }
        )
    }
}
```

### Complete Login Screen Example

```swift
struct LoginScreen: View {
    @State private var username = ""
    @State private var password = ""
    @State private var isLoggedIn = false
    @State private var currentUser: LoginButtonView.User?
    
    var body: some View {
        VStack(spacing: 20) {
            // Header
            Text("Welcome Back")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            // Login form
            VStack(spacing: 16) {
                TextField("Username", text: $username)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                SecureField("Password", text: $password)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
            }
            .padding(.horizontal)
            
            // Login button
            LoginButtonView(
                username: $username,
                password: $password,
                onLoginSuccess: { user in
                    currentUser = user
                    isLoggedIn = true
                },
                onLoginError: { error in
                    // Handle error
                }
            )
        }
        .padding()
    }
}
```

## API Reference

### LoginButtonView

#### Initializer

```swift
init(
    username: Binding<String>,
    password: Binding<String>,
    onLoginSuccess: @escaping (User) -> Void,
    onLoginError: @escaping (LoginError) -> Void
)
```

#### Parameters

- `username`: Binding to username input field
- `password`: Binding to password input field
- `onLoginSuccess`: Callback executed on successful login
- `onLoginError`: Callback executed on login error

#### User Model

```swift
struct User {
    let id: String
    let username: String
    let email: String
}
```

#### LoginError Enum

```swift
enum LoginError: Error, LocalizedError {
    case invalidCredentials
    case networkError
    case serverError
}
```

## Animation States

### State Machine Flow

1. **Idle** → **Loading**: Triggered by button tap
2. **Loading** → **Success**: Triggered by `Succeed` input after 2 seconds
3. **Loading** → **Error**: Triggered by `Fail` input after 2 seconds
4. **Success/Error** → **Idle**: Automatic reset after delay

### Rive Triggers

- `Tap`: Transitions to Loading state
- `Succeed`: Transitions to Success state
- `Fail`: Transitions to Error state

## Customization

### Styling

The component uses SwiftUI's built-in styling system. You can customize:

```swift
// Custom button styling
Button(action: handleLoginTap) {
    // Custom content
}
.buttonStyle(YourCustomButtonStyle())
```

### Animation Timing

Modify the timing constants in the component:

```swift
// Network simulation delay
requestTimer = Timer.scheduledTimer(withTimeInterval: 2.0, repeats: false) { _ in
    simulateLoginRequest()
}

// Success state duration
DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
    resetToIdle()
}

// Error state duration
DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
    resetToIdle()
}
```

### Form Validation

Customize validation logic:

```swift
private var isFormValid: Bool {
    !username.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
    !password.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
    password.count >= 6 // Add minimum password length
}
```

## Integration with Real Network Requests

Replace the simulation with actual network calls:

```swift
private func simulateLoginRequest() {
    // Replace with actual API call
    AuthService.login(username: username, password: password) { result in
        DispatchQueue.main.async {
            switch result {
            case .success(let user):
                self.handleLoginSuccess()
            case .failure(let error):
                self.handleLoginError()
            }
        }
    }
}
```

## Accessibility

The component includes:

- Proper accessibility labels
- VoiceOver support
- Dynamic Type support
- High contrast mode support

## Testing

### Unit Tests

```swift
import XCTest
@testable import YourApp

class LoginButtonViewTests: XCTestCase {
    func testFormValidation() {
        let view = LoginButtonView(
            username: .constant(""),
            password: .constant(""),
            onLoginSuccess: { _ in },
            onLoginError: { _ in }
        )
        
        // Test validation logic
    }
    
    func testLoginSuccess() {
        // Test success flow
    }
    
    func testLoginError() {
        // Test error flow
    }
}
```

### UI Tests

```swift
import XCTest

class LoginButtonViewUITests: XCTestCase {
    func testLoginFlow() {
        let app = XCUIApplication()
        app.launch()
        
        // Test UI interactions
        let usernameField = app.textFields["Username"]
        usernameField.tap()
        usernameField.typeText("testuser")
        
        let passwordField = app.secureTextFields["Password"]
        passwordField.tap()
        passwordField.typeText("password123")
        
        let loginButton = app.buttons["Sign In"]
        loginButton.tap()
        
        // Verify state changes
    }
}
```

## Troubleshooting

### Common Issues

1. **Rive file not found**: Ensure `login_status.riv` is added to your app bundle
2. **State machine not found**: Verify the state machine name is `ButtonStates`
3. **Animation not playing**: Check that RiveRuntime is properly linked
4. **Build errors**: Ensure iOS deployment target is 14.0+

### Debug Tips

```swift
// Add debug logging
private func setupRiveAnimation() {
    print("Setting up Rive animation...")
    // ... existing code
}

private func handleLoginTap() {
    print("Login button tapped")
    // ... existing code
}
```

## Performance Considerations

- The component uses `@StateObject` for efficient RiveViewModel management
- Animations are optimized for 60fps performance
- Memory management includes proper cleanup of timers
- State transitions are batched for smooth animations

## License

This component is part of the Aether project and follows the same licensing terms.

## Contributing

When contributing to this component:

1. Follow SwiftUI best practices
2. Maintain accessibility standards
3. Add comprehensive tests
4. Update documentation
5. Ensure backward compatibility

## Related Components

- `AetherGlassCard`: Glassmorphism card component
- `ProgressLineChart`: Progress visualization component
- Other Aether UI components

---

For more information, see the main Aether documentation or contact the development team. 