//
//  AppReducerTests.swift
//  Aether SwiftUI App Tests
//
//  Comprehensive unit tests for the appReducer function using XCTest framework.
//  Tests cover all actions including updateUserName and incrementScore,
//  verifying immutable state updates and correct behavior for both
//  mutable and pure function versions of the reducer.
//

import XCTest
@testable import AetherSwiftUIApp

/// Comprehensive test suite for the appReducer function
/// 
/// This test class verifies:
/// - All actions are handled correctly
/// - State is updated immutably (no side effects)
/// - Both mutable and pure function versions work correctly
/// - Edge cases and error conditions are handled properly
/// - State transitions are predictable and consistent
class AppReducerTests: XCTestCase {
    
    // MARK: - Test Properties
    
    /// Default test state for consistent testing
    private var defaultState: AppState!
    
    /// Test user profile for consistent testing
    private var testProfile: UserProfile!
    
    /// Test settings for consistent testing
    private var testSettings: Settings!
    
    // MARK: - Setup and Teardown
    
    override func setUpWithError() throws {
        try super.setUpWithError()
        
        // Create consistent test data
        testProfile = UserProfile(name: "Test User", score: 100)
        testSettings = Settings(isDarkMode: false, notificationsEnabled: true, autoSave: true)
        defaultState = AppState(profile: testProfile, settings: testSettings)
    }
    
    override func tearDownWithError() throws {
        defaultState = nil
        testProfile = nil
        testSettings = nil
        try super.tearDownWithError()
    }
    
    // MARK: - Update User Name Tests
    
    /// Test updateUserName action with mutable reducer
    func testUpdateUserName_MutableReducer() throws {
        // Given
        var state = defaultState
        let newName = "Updated User"
        
        // When
        let result = appReducer(state: &state, action: .updateUserName(newName))
        
        // Then
        XCTAssertEqual(result.profile.name, newName, "User name should be updated to new value")
        XCTAssertEqual(result.profile.score, defaultState.profile.score, "Score should remain unchanged")
        XCTAssertEqual(result.settings, defaultState.settings, "Settings should remain unchanged")
        
        // Verify state was mutated
        XCTAssertEqual(state.profile.name, newName, "Original state should be mutated")
    }
    
    /// Test updateUserName action with pure reducer
    func testUpdateUserName_PureReducer() throws {
        // Given
        let state = defaultState
        let newName = "Updated User"
        
        // When
        let result = appReducerPure(state: state, action: .updateUserName(newName))
        
        // Then
        XCTAssertEqual(result.profile.name, newName, "User name should be updated to new value")
        XCTAssertEqual(result.profile.score, defaultState.profile.score, "Score should remain unchanged")
        XCTAssertEqual(result.settings, defaultState.settings, "Settings should remain unchanged")
        
        // Verify original state was not mutated
        XCTAssertEqual(state.profile.name, defaultState.profile.name, "Original state should not be mutated")
    }
    
    /// Test updateUserName with empty string
    func testUpdateUserName_EmptyString() throws {
        // Given
        var state = defaultState
        let emptyName = ""
        
        // When
        let result = appReducer(state: &state, action: .updateUserName(emptyName))
        
        // Then
        XCTAssertEqual(result.profile.name, emptyName, "User name should be updated to empty string")
        XCTAssertEqual(result.profile.score, defaultState.profile.score, "Score should remain unchanged")
    }
    
    /// Test updateUserName with special characters
    func testUpdateUserName_SpecialCharacters() throws {
        // Given
        let state = defaultState
        let specialName = "User@123!@#$%^&*()"
        
        // When
        let result = appReducerPure(state: state, action: .updateUserName(specialName))
        
        // Then
        XCTAssertEqual(result.profile.name, specialName, "User name should handle special characters")
    }
    
    /// Test updateUserName with very long name
    func testUpdateUserName_VeryLongName() throws {
        // Given
        let state = defaultState
        let longName = String(repeating: "A", count: 1000)
        
        // When
        let result = appReducerPure(state: state, action: .updateUserName(longName))
        
        // Then
        XCTAssertEqual(result.profile.name, longName, "User name should handle very long strings")
    }
    
    // MARK: - Increment Score Tests
    
    /// Test incrementScore action with mutable reducer
    func testIncrementScore_MutableReducer() throws {
        // Given
        var state = defaultState
        let incrementAmount = 50
        
        // When
        let result = appReducer(state: &state, action: .incrementScore(incrementAmount))
        
        // Then
        XCTAssertEqual(result.profile.score, defaultState.profile.score + incrementAmount, "Score should be incremented by specified amount")
        XCTAssertEqual(result.profile.name, defaultState.profile.name, "User name should remain unchanged")
        XCTAssertEqual(result.settings, defaultState.settings, "Settings should remain unchanged")
        
        // Verify state was mutated
        XCTAssertEqual(state.profile.score, defaultState.profile.score + incrementAmount, "Original state should be mutated")
    }
    
    /// Test incrementScore action with pure reducer
    func testIncrementScore_PureReducer() throws {
        // Given
        let state = defaultState
        let incrementAmount = 50
        
        // When
        let result = appReducerPure(state: state, action: .incrementScore(incrementAmount))
        
        // Then
        XCTAssertEqual(result.profile.score, defaultState.profile.score + incrementAmount, "Score should be incremented by specified amount")
        XCTAssertEqual(result.profile.name, defaultState.profile.name, "User name should remain unchanged")
        XCTAssertEqual(result.settings, defaultState.settings, "Settings should remain unchanged")
        
        // Verify original state was not mutated
        XCTAssertEqual(state.profile.score, defaultState.profile.score, "Original state should not be mutated")
    }
    
    /// Test incrementScore with zero
    func testIncrementScore_Zero() throws {
        // Given
        var state = defaultState
        let initialScore = state.profile.score
        
        // When
        let result = appReducer(state: &state, action: .incrementScore(0))
        
        // Then
        XCTAssertEqual(result.profile.score, initialScore, "Score should remain unchanged when incrementing by zero")
    }
    
    /// Test incrementScore with negative value
    func testIncrementScore_NegativeValue() throws {
        // Given
        let state = defaultState
        let initialScore = state.profile.score
        let negativeIncrement = -30
        
        // When
        let result = appReducerPure(state: state, action: .incrementScore(negativeIncrement))
        
        // Then
        XCTAssertEqual(result.profile.score, initialScore + negativeIncrement, "Score should be decremented by negative value")
    }
    
    /// Test incrementScore with large positive value
    func testIncrementScore_LargePositiveValue() throws {
        // Given
        let state = defaultState
        let largeIncrement = 1000000
        
        // When
        let result = appReducerPure(state: state, action: .incrementScore(largeIncrement))
        
        // Then
        XCTAssertEqual(result.profile.score, defaultState.profile.score + largeIncrement, "Score should handle large positive increments")
    }
    
    /// Test incrementScore with large negative value
    func testIncrementScore_LargeNegativeValue() throws {
        // Given
        let state = defaultState
        let largeNegativeIncrement = -1000000
        
        // When
        let result = appReducerPure(state: state, action: .incrementScore(largeNegativeIncrement))
        
        // Then
        XCTAssertEqual(result.profile.score, defaultState.profile.score + largeNegativeIncrement, "Score should handle large negative increments")
    }
    
    // MARK: - Reset Score Tests
    
    /// Test resetScore action with mutable reducer
    func testResetScore_MutableReducer() throws {
        // Given
        var state = defaultState
        
        // When
        let result = appReducer(state: &state, action: .resetScore)
        
        // Then
        XCTAssertEqual(result.profile.score, 0, "Score should be reset to zero")
        XCTAssertEqual(result.profile.name, defaultState.profile.name, "User name should remain unchanged")
        XCTAssertEqual(result.settings, defaultState.settings, "Settings should remain unchanged")
    }
    
    /// Test resetScore action with pure reducer
    func testResetScore_PureReducer() throws {
        // Given
        let state = defaultState
        
        // When
        let result = appReducerPure(state: state, action: .resetScore)
        
        // Then
        XCTAssertEqual(result.profile.score, 0, "Score should be reset to zero")
        XCTAssertEqual(result.profile.name, defaultState.profile.name, "User name should remain unchanged")
        XCTAssertEqual(result.settings, defaultState.settings, "Settings should remain unchanged")
    }
    
    // MARK: - Settings Tests
    
    /// Test toggleDarkMode action
    func testToggleDarkMode() throws {
        // Given
        let state = defaultState
        let initialDarkMode = state.settings.isDarkMode
        
        // When
        let result = appReducerPure(state: state, action: .toggleDarkMode)
        
        // Then
        XCTAssertEqual(result.settings.isDarkMode, !initialDarkMode, "Dark mode should be toggled")
        XCTAssertEqual(result.profile, defaultState.profile, "Profile should remain unchanged")
        XCTAssertEqual(result.settings.notificationsEnabled, defaultState.settings.notificationsEnabled, "Notifications should remain unchanged")
        XCTAssertEqual(result.settings.autoSave, defaultState.settings.autoSave, "Auto save should remain unchanged")
    }
    
    /// Test toggleNotifications action
    func testToggleNotifications() throws {
        // Given
        let state = defaultState
        let initialNotifications = state.settings.notificationsEnabled
        
        // When
        let result = appReducerPure(state: state, action: .toggleNotifications)
        
        // Then
        XCTAssertEqual(result.settings.notificationsEnabled, !initialNotifications, "Notifications should be toggled")
        XCTAssertEqual(result.profile, defaultState.profile, "Profile should remain unchanged")
        XCTAssertEqual(result.settings.isDarkMode, defaultState.settings.isDarkMode, "Dark mode should remain unchanged")
        XCTAssertEqual(result.settings.autoSave, defaultState.settings.autoSave, "Auto save should remain unchanged")
    }
    
    /// Test toggleAutoSave action
    func testToggleAutoSave() throws {
        // Given
        let state = defaultState
        let initialAutoSave = state.settings.autoSave
        
        // When
        let result = appReducerPure(state: state, action: .toggleAutoSave)
        
        // Then
        XCTAssertEqual(result.settings.autoSave, !initialAutoSave, "Auto save should be toggled")
        XCTAssertEqual(result.profile, defaultState.profile, "Profile should remain unchanged")
        XCTAssertEqual(result.settings.isDarkMode, defaultState.settings.isDarkMode, "Dark mode should remain unchanged")
        XCTAssertEqual(result.settings.notificationsEnabled, defaultState.settings.notificationsEnabled, "Notifications should remain unchanged")
    }
    
    /// Test updateSettings action
    func testUpdateSettings() throws {
        // Given
        let state = defaultState
        let newSettings = Settings(isDarkMode: true, notificationsEnabled: false, autoSave: false)
        
        // When
        let result = appReducerPure(state: state, action: .updateSettings(newSettings))
        
        // Then
        XCTAssertEqual(result.settings, newSettings, "Settings should be completely replaced")
        XCTAssertEqual(result.profile, defaultState.profile, "Profile should remain unchanged")
    }
    
    // MARK: - Reset Tests
    
    /// Test resetProfile action
    func testResetProfile() throws {
        // Given
        let state = defaultState
        
        // When
        let result = appReducerPure(state: state, action: .resetProfile)
        
        // Then
        XCTAssertEqual(result.profile.name, "", "Profile name should be reset to empty string")
        XCTAssertEqual(result.profile.score, 0, "Profile score should be reset to zero")
        XCTAssertEqual(result.settings, defaultState.settings, "Settings should remain unchanged")
    }
    
    /// Test resetAll action
    func testResetAll() throws {
        // Given
        let state = defaultState
        
        // When
        let result = appReducerPure(state: state, action: .resetAll)
        
        // Then
        XCTAssertEqual(result.profile.name, "", "Profile name should be reset to empty string")
        XCTAssertEqual(result.profile.score, 0, "Profile score should be reset to zero")
        XCTAssertEqual(result.settings.isDarkMode, false, "Dark mode should be reset to false")
        XCTAssertEqual(result.settings.notificationsEnabled, true, "Notifications should be reset to true")
        XCTAssertEqual(result.settings.autoSave, true, "Auto save should be reset to true")
    }
    
    // MARK: - Immutability Tests
    
    /// Test that mutable reducer doesn't affect original state when using pure function
    func testImmutability_MutableReducer() throws {
        // Given
        var state = defaultState
        let originalState = state
        
        // When
        _ = appReducer(state: &state, action: .updateUserName("New Name"))
        _ = appReducer(state: &state, action: .incrementScore(50))
        
        // Then
        XCTAssertNotEqual(state.profile.name, originalState.profile.name, "State should be mutated")
        XCTAssertNotEqual(state.profile.score, originalState.profile.score, "State should be mutated")
    }
    
    /// Test that pure reducer doesn't affect original state
    func testImmutability_PureReducer() throws {
        // Given
        let state = defaultState
        let originalState = state
        
        // When
        let result1 = appReducerPure(state: state, action: .updateUserName("New Name"))
        let result2 = appReducerPure(state: result1, action: .incrementScore(50))
        
        // Then
        XCTAssertEqual(state.profile.name, originalState.profile.name, "Original state should not be mutated")
        XCTAssertEqual(state.profile.score, originalState.profile.score, "Original state should not be mutated")
        XCTAssertNotEqual(result2.profile.name, originalState.profile.name, "Result should be different")
        XCTAssertNotEqual(result2.profile.score, originalState.profile.score, "Result should be different")
    }
    
    // MARK: - Multiple Actions Tests
    
    /// Test multiple actions in sequence with mutable reducer
    func testMultipleActions_MutableReducer() throws {
        // Given
        var state = defaultState
        
        // When
        _ = appReducer(state: &state, action: .updateUserName("John"))
        _ = appReducer(state: &state, action: .incrementScore(25))
        _ = appReducer(state: &state, action: .toggleDarkMode)
        let finalResult = appReducer(state: &state, action: .incrementScore(75))
        
        // Then
        XCTAssertEqual(finalResult.profile.name, "John", "Final name should be 'John'")
        XCTAssertEqual(finalResult.profile.score, 200, "Final score should be 200 (100 + 25 + 75)")
        XCTAssertEqual(finalResult.settings.isDarkMode, true, "Dark mode should be toggled to true")
    }
    
    /// Test multiple actions in sequence with pure reducer
    func testMultipleActions_PureReducer() throws {
        // Given
        let state = defaultState
        
        // When
        let result1 = appReducerPure(state: state, action: .updateUserName("John"))
        let result2 = appReducerPure(state: result1, action: .incrementScore(25))
        let result3 = appReducerPure(state: result2, action: .toggleDarkMode)
        let finalResult = appReducerPure(state: result3, action: .incrementScore(75))
        
        // Then
        XCTAssertEqual(finalResult.profile.name, "John", "Final name should be 'John'")
        XCTAssertEqual(finalResult.profile.score, 200, "Final score should be 200 (100 + 25 + 75)")
        XCTAssertEqual(finalResult.settings.isDarkMode, true, "Dark mode should be toggled to true")
        XCTAssertEqual(state.profile.name, defaultState.profile.name, "Original state should remain unchanged")
    }
    
    // MARK: - Edge Cases Tests
    
    /// Test with default AppState
    func testWithDefaultAppState() throws {
        // Given
        let defaultState = AppState()
        
        // When
        let result = appReducerPure(state: defaultState, action: .updateUserName("Test"))
        
        // Then
        XCTAssertEqual(result.profile.name, "Test", "Should work with default state")
        XCTAssertEqual(result.profile.score, 0, "Default score should be 0")
        XCTAssertEqual(result.settings.isDarkMode, false, "Default dark mode should be false")
    }
    
    /// Test with custom UserProfile and Settings
    func testWithCustomState() throws {
        // Given
        let customProfile = UserProfile(name: "Custom User", score: 999)
        let customSettings = Settings(isDarkMode: true, notificationsEnabled: false, autoSave: false)
        let customState = AppState(profile: customProfile, settings: customSettings)
        
        // When
        let result = appReducerPure(state: customState, action: .incrementScore(1))
        
        // Then
        XCTAssertEqual(result.profile.name, "Custom User", "Custom name should be preserved")
        XCTAssertEqual(result.profile.score, 1000, "Custom score should be incremented")
        XCTAssertEqual(result.settings.isDarkMode, true, "Custom dark mode should be preserved")
        XCTAssertEqual(result.settings.notificationsEnabled, false, "Custom notifications should be preserved")
        XCTAssertEqual(result.settings.autoSave, false, "Custom auto save should be preserved")
    }
    
    // MARK: - Performance Tests
    
    /// Test performance of multiple actions with mutable reducer
    func testPerformance_MutableReducer() throws {
        // Given
        var state = defaultState
        
        // When
        measure {
            for i in 0..<1000 {
                _ = appReducer(state: &state, action: .incrementScore(1))
            }
        }
        
        // Then
        XCTAssertEqual(state.profile.score, defaultState.profile.score + 1000, "Final score should be incremented by 1000")
    }
    
    /// Test performance of multiple actions with pure reducer
    func testPerformance_PureReducer() throws {
        // Given
        var state = defaultState
        
        // When
        measure {
            for i in 0..<1000 {
                state = appReducerPure(state: state, action: .incrementScore(1))
            }
        }
        
        // Then
        XCTAssertEqual(state.profile.score, defaultState.profile.score + 1000, "Final score should be incremented by 1000")
    }
    
    // MARK: - Consistency Tests
    
    /// Test that both reducers produce same results for same actions
    func testConsistencyBetweenReducers() throws {
        // Given
        var mutableState = defaultState
        var pureState = defaultState
        
        // When
        let mutableResult = appReducer(state: &mutableState, action: .updateUserName("Test"))
        let pureResult = appReducerPure(state: defaultState, action: .updateUserName("Test"))
        
        // Then
        XCTAssertEqual(mutableResult.profile.name, pureResult.profile.name, "Both reducers should produce same name")
        XCTAssertEqual(mutableResult.profile.score, pureResult.profile.score, "Both reducers should produce same score")
        XCTAssertEqual(mutableResult.settings, pureResult.settings, "Both reducers should produce same settings")
    }
    
    /// Test that multiple actions produce consistent results
    func testConsistencyMultipleActions() throws {
        // Given
        let actions: [AppAction] = [
            .updateUserName("Alice"),
            .incrementScore(10),
            .toggleDarkMode,
            .incrementScore(20),
            .toggleNotifications,
            .incrementScore(30)
        ]
        
        // When
        var mutableState = defaultState
        var pureState = defaultState
        
        for action in actions {
            _ = appReducer(state: &mutableState, action: action)
            pureState = appReducerPure(state: pureState, action: action)
        }
        
        // Then
        XCTAssertEqual(mutableState.profile.name, pureState.profile.name, "Both reducers should produce same final name")
        XCTAssertEqual(mutableState.profile.score, pureState.profile.score, "Both reducers should produce same final score")
        XCTAssertEqual(mutableState.settings, pureState.settings, "Both reducers should produce same final settings")
    }
}

// MARK: - Test Helpers

extension AppReducerTests {
    
    /// Helper method to create a test state with specific values
    private func createTestState(name: String, score: Int, isDarkMode: Bool) -> AppState {
        let profile = UserProfile(name: name, score: score)
        let settings = Settings(isDarkMode: isDarkMode, notificationsEnabled: true, autoSave: true)
        return AppState(profile: profile, settings: settings)
    }
    
    /// Helper method to verify state properties
    private func verifyState(_ state: AppState, expectedName: String, expectedScore: Int, expectedDarkMode: Bool) {
        XCTAssertEqual(state.profile.name, expectedName, "Profile name should match expected value")
        XCTAssertEqual(state.profile.score, expectedScore, "Profile score should match expected value")
        XCTAssertEqual(state.settings.isDarkMode, expectedDarkMode, "Dark mode should match expected value")
    }
} 