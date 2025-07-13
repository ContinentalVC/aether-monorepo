//
//  AppReducer.swift
//  Aether SwiftUI App
//
//  Redux-like reducer function for immutable state management
//  using the ImmutableData pattern in SwiftUI.
//

import Foundation

// MARK: - State Models

/// Global application state following the ImmutableData pattern
/// All properties are value types to ensure immutability
struct AppState {
    var profile: UserProfile
    var settings: Settings
    
    /// Initialize with default values
    init(profile: UserProfile = UserProfile(), settings: Settings = Settings()) {
        self.profile = profile
        self.settings = settings
    }
}

/// User profile information
struct UserProfile {
    var name: String
    var score: Int
    
    /// Initialize with default values
    init(name: String = "", score: Int = 0) {
        self.name = name
        self.score = score
    }
}

/// Application settings
struct Settings {
    var isDarkMode: Bool
    var notificationsEnabled: Bool
    var autoSave: Bool
    
    /// Initialize with default values
    init(isDarkMode: Bool = false, notificationsEnabled: Bool = true, autoSave: Bool = true) {
        self.isDarkMode = isDarkMode
        self.notificationsEnabled = notificationsEnabled
        self.autoSave = autoSave
    }
}

// MARK: - Actions

/// Actions that can be dispatched to modify the application state
/// Each action represents a specific state change
enum AppAction {
    case updateUserName(String)
    case incrementScore(Int)
    case resetScore
    case toggleDarkMode
    case toggleNotifications
    case toggleAutoSave
    case updateSettings(Settings)
    case resetProfile
    case resetAll
}

// MARK: - Reducer Function

/// Main reducer function that handles all state updates immutably
/// 
/// This function follows the Redux pattern where:
/// - State is treated as immutable
/// - Actions describe what happened
/// - Reducer describes how state changes in response to actions
/// - Each action creates new state instances rather than mutating existing ones
///
/// - Parameter state: The current application state (passed by reference for performance)
/// - Parameter action: The action to process
/// - Returns: A new AppState instance with the updated values
@discardableResult
func appReducer(state: inout AppState, action: AppAction) -> AppState {
    switch action {
    case .updateUserName(let newName):
        // Create a new UserProfile instance with the updated name
        let updatedProfile = UserProfile(
            name: newName,
            score: state.profile.score
        )
        
        // Create a new AppState instance with the updated profile
        state = AppState(
            profile: updatedProfile,
            settings: state.settings
        )
        
    case .incrementScore(let amount):
        // Create a new UserProfile instance with the incremented score
        let updatedProfile = UserProfile(
            name: state.profile.name,
            score: state.profile.score + amount
        )
        
        // Create a new AppState instance with the updated profile
        state = AppState(
            profile: updatedProfile,
            settings: state.settings
        )
        
    case .resetScore:
        // Create a new UserProfile instance with score reset to 0
        let updatedProfile = UserProfile(
            name: state.profile.name,
            score: 0
        )
        
        // Create a new AppState instance with the updated profile
        state = AppState(
            profile: updatedProfile,
            settings: state.settings
        )
        
    case .toggleDarkMode:
        // Create a new Settings instance with toggled dark mode
        let updatedSettings = Settings(
            isDarkMode: !state.settings.isDarkMode,
            notificationsEnabled: state.settings.notificationsEnabled,
            autoSave: state.settings.autoSave
        )
        
        // Create a new AppState instance with the updated settings
        state = AppState(
            profile: state.profile,
            settings: updatedSettings
        )
        
    case .toggleNotifications:
        // Create a new Settings instance with toggled notifications
        let updatedSettings = Settings(
            isDarkMode: state.settings.isDarkMode,
            notificationsEnabled: !state.settings.notificationsEnabled,
            autoSave: state.settings.autoSave
        )
        
        // Create a new AppState instance with the updated settings
        state = AppState(
            profile: state.profile,
            settings: updatedSettings
        )
        
    case .toggleAutoSave:
        // Create a new Settings instance with toggled auto save
        let updatedSettings = Settings(
            isDarkMode: state.settings.isDarkMode,
            notificationsEnabled: state.settings.notificationsEnabled,
            autoSave: !state.settings.autoSave
        )
        
        // Create a new AppState instance with the updated settings
        state = AppState(
            profile: state.profile,
            settings: updatedSettings
        )
        
    case .updateSettings(let newSettings):
        // Create a new AppState instance with the completely new settings
        state = AppState(
            profile: state.profile,
            settings: newSettings
        )
        
    case .resetProfile:
        // Create a new AppState instance with a fresh UserProfile
        state = AppState(
            profile: UserProfile(),
            settings: state.settings
        )
        
    case .resetAll:
        // Create a completely new AppState instance with default values
        state = AppState()
    }
    
    return state
}

// MARK: - Alternative Pure Function Approach

/// Alternative pure function approach that doesn't modify the input state
/// This version is more functional and easier to test
/// 
/// - Parameter state: The current application state
/// - Parameter action: The action to process
/// - Returns: A new AppState instance with the updated values
func appReducerPure(state: AppState, action: AppAction) -> AppState {
    switch action {
    case .updateUserName(let newName):
        return AppState(
            profile: UserProfile(
                name: newName,
                score: state.profile.score
            ),
            settings: state.settings
        )
        
    case .incrementScore(let amount):
        return AppState(
            profile: UserProfile(
                name: state.profile.name,
                score: state.profile.score + amount
            ),
            settings: state.settings
        )
        
    case .resetScore:
        return AppState(
            profile: UserProfile(
                name: state.profile.name,
                score: 0
            ),
            settings: state.settings
        )
        
    case .toggleDarkMode:
        return AppState(
            profile: state.profile,
            settings: Settings(
                isDarkMode: !state.settings.isDarkMode,
                notificationsEnabled: state.settings.notificationsEnabled,
                autoSave: state.settings.autoSave
            )
        )
        
    case .toggleNotifications:
        return AppState(
            profile: state.profile,
            settings: Settings(
                isDarkMode: state.settings.isDarkMode,
                notificationsEnabled: !state.settings.notificationsEnabled,
                autoSave: state.settings.autoSave
            )
        )
        
    case .toggleAutoSave:
        return AppState(
            profile: state.profile,
            settings: Settings(
                isDarkMode: state.settings.isDarkMode,
                notificationsEnabled: state.settings.notificationsEnabled,
                autoSave: !state.settings.autoSave
            )
        )
        
    case .updateSettings(let newSettings):
        return AppState(
            profile: state.profile,
            settings: newSettings
        )
        
    case .resetProfile:
        return AppState(
            profile: UserProfile(),
            settings: state.settings
        )
        
    case .resetAll:
        return AppState()
    }
}

// MARK: - Usage Examples

/// Example usage of the reducer functions
struct ReducerExamples {
    
    /// Example of using the mutable reducer
    static func mutableReducerExample() {
        var appState = AppState(
            profile: UserProfile(name: "John", score: 100),
            settings: Settings(isDarkMode: false, notificationsEnabled: true, autoSave: true)
        )
        
        print("Initial state: \(appState)")
        
        // Update user name
        appReducer(state: &appState, action: .updateUserName("Jane"))
        print("After updating name: \(appState)")
        
        // Increment score
        appReducer(state: &appState, action: .incrementScore(50))
        print("After incrementing score: \(appState)")
        
        // Toggle dark mode
        appReducer(state: &appState, action: .toggleDarkMode)
        print("After toggling dark mode: \(appState)")
    }
    
    /// Example of using the pure reducer
    static func pureReducerExample() {
        let initialState = AppState(
            profile: UserProfile(name: "John", score: 100),
            settings: Settings(isDarkMode: false, notificationsEnabled: true, autoSave: true)
        )
        
        print("Initial state: \(initialState)")
        
        // Update user name
        let stateAfterNameUpdate = appReducerPure(state: initialState, action: .updateUserName("Jane"))
        print("After updating name: \(stateAfterNameUpdate)")
        
        // Increment score
        let stateAfterScoreIncrement = appReducerPure(state: stateAfterNameUpdate, action: .incrementScore(50))
        print("After incrementing score: \(stateAfterScoreIncrement)")
        
        // Toggle dark mode
        let stateAfterDarkModeToggle = appReducerPure(state: stateAfterScoreIncrement, action: .toggleDarkMode)
        print("After toggling dark mode: \(stateAfterDarkModeToggle)")
    }
}

// MARK: - SwiftUI Integration

/// ObservableObject wrapper for integrating with SwiftUI
/// This provides a bridge between the immutable reducer pattern and SwiftUI's reactive system
class AppStore: ObservableObject {
    @Published private(set) var state: AppState
    
    init(initialState: AppState = AppState()) {
        self.state = initialState
    }
    
    /// Dispatch an action to update the state
    /// - Parameter action: The action to dispatch
    func dispatch(_ action: AppAction) {
        // Use the pure reducer to get the new state
        let newState = appReducerPure(state: state, action: action)
        
        // Update the published state on the main thread
        DispatchQueue.main.async {
            self.state = newState
        }
    }
    
    /// Dispatch multiple actions in sequence
    /// - Parameter actions: Array of actions to dispatch
    func dispatch(_ actions: [AppAction]) {
        var currentState = state
        
        for action in actions {
            currentState = appReducerPure(state: currentState, action: action)
        }
        
        DispatchQueue.main.async {
            self.state = currentState
        }
    }
}

// MARK: - Extensions for Convenience

extension AppState: CustomStringConvertible {
    var description: String {
        return """
        AppState(
            profile: UserProfile(name: "\(profile.name)", score: \(profile.score)),
            settings: Settings(isDarkMode: \(settings.isDarkMode), notificationsEnabled: \(settings.notificationsEnabled), autoSave: \(settings.autoSave))
        )
        """
    }
}

extension UserProfile: CustomStringConvertible {
    var description: String {
        return "UserProfile(name: \"\(name)\", score: \(score))"
    }
}

extension Settings: CustomStringConvertible {
    var description: String {
        return "Settings(isDarkMode: \(isDarkMode), notificationsEnabled: \(notificationsEnabled), autoSave: \(autoSave))"
    }
} 