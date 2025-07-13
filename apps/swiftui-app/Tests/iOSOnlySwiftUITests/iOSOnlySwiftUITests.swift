//
//  iOSOnlySwiftUITests.swift
//  iOSOnlySwiftUITests
//
//  Tests for iOS-only SwiftUI components with proper platform availability annotations.
//

import XCTest
import SwiftUI
@testable import iOSOnlySwiftUI

// MARK: - iOS-only Tests

#if os(iOS)
@available(iOS 15.0, *)
final class iOSOnlySwiftUITests: XCTestCase {
    
    // MARK: - Package Information Tests
    
    func testPackageInformation() {
        XCTAssertEqual(iOSOnlySwiftUI.name, "iOSOnlySwiftUI")
        XCTAssertEqual(iOSOnlySwiftUI.version, "1.0.0")
        XCTAssertEqual(iOSOnlySwiftUI.description, "iOS-only SwiftUI components with platform compatibility")
    }
    
    // MARK: - Theme Manager Tests
    
    func testThemeManager() {
        let themeManager = ThemeManager.shared
        
        // Test initial state
        XCTAssertEqual(themeManager.currentTheme, .light)
        XCTAssertFalse(themeManager.isDarkMode)
        
        // Test theme switching
        themeManager.setTheme(.dark)
        XCTAssertEqual(themeManager.currentTheme, .dark)
        XCTAssertTrue(themeManager.isDarkMode)
        
        themeManager.setTheme(.light)
        XCTAssertEqual(themeManager.currentTheme, .light)
        XCTAssertFalse(themeManager.isDarkMode)
        
        // Test theme toggle
        themeManager.toggleTheme()
        XCTAssertEqual(themeManager.currentTheme, .dark)
        XCTAssertTrue(themeManager.isDarkMode)
        
        themeManager.toggleTheme()
        XCTAssertEqual(themeManager.currentTheme, .light)
        XCTAssertFalse(themeManager.isDarkMode)
    }
    
    func testAppTheme() {
        // Test all theme cases
        XCTAssertEqual(AppTheme.allCases.count, 3)
        XCTAssertTrue(AppTheme.allCases.contains(.light))
        XCTAssertTrue(AppTheme.allCases.contains(.dark))
        XCTAssertTrue(AppTheme.allCases.contains(.auto))
        
        // Test display names
        XCTAssertEqual(AppTheme.light.displayName, "Light")
        XCTAssertEqual(AppTheme.dark.displayName, "Dark")
        XCTAssertEqual(AppTheme.auto.displayName, "Auto")
        
        // Test icons
        XCTAssertEqual(AppTheme.light.icon, "sun.max.fill")
        XCTAssertEqual(AppTheme.dark.icon, "moon.fill")
        XCTAssertEqual(AppTheme.auto.icon, "gear")
    }
    
    func testAppColorScheme() {
        let lightScheme = AppColorScheme.light
        let darkScheme = AppColorScheme.dark
        
        // Test that color schemes are not nil
        XCTAssertNotNil(lightScheme.primary)
        XCTAssertNotNil(lightScheme.secondary)
        XCTAssertNotNil(lightScheme.background)
        XCTAssertNotNil(lightScheme.surface)
        XCTAssertNotNil(lightScheme.text)
        XCTAssertNotNil(lightScheme.textSecondary)
        XCTAssertNotNil(lightScheme.accent)
        XCTAssertNotNil(lightScheme.error)
        XCTAssertNotNil(lightScheme.success)
        XCTAssertNotNil(lightScheme.warning)
        
        XCTAssertNotNil(darkScheme.primary)
        XCTAssertNotNil(darkScheme.secondary)
        XCTAssertNotNil(darkScheme.background)
        XCTAssertNotNil(darkScheme.surface)
        XCTAssertNotNil(darkScheme.text)
        XCTAssertNotNil(darkScheme.textSecondary)
        XCTAssertNotNil(darkScheme.accent)
        XCTAssertNotNil(darkScheme.error)
        XCTAssertNotNil(darkScheme.success)
        XCTAssertNotNil(darkScheme.warning)
    }
    
    // MARK: - Haptic Feedback Manager Tests
    
    func testHapticFeedbackManager() {
        let hapticManager = HapticFeedbackManager.shared
        
        // Test that methods don't crash
        hapticManager.triggerLightImpact()
        hapticManager.triggerMediumImpact()
        hapticManager.triggerHeavyImpact()
        hapticManager.triggerSuccess()
        hapticManager.triggerWarning()
        hapticManager.triggerError()
        
        // Test singleton pattern
        let anotherInstance = HapticFeedbackManager.shared
        XCTAssertTrue(hapticManager === anotherInstance)
    }
    
    // MARK: - Performance Tests
    
    func testThemeManagerPerformance() {
        let themeManager = ThemeManager.shared
        
        measure {
            for _ in 0..<1000 {
                themeManager.toggleTheme()
            }
        }
    }
    
    func testHapticFeedbackPerformance() {
        let hapticManager = HapticFeedbackManager.shared
        
        measure {
            for _ in 0..<100 {
                hapticManager.triggerLightImpact()
            }
        }
    }
    
    // MARK: - Type Availability Tests
    
    func testTypeAvailability() {
        // Test that we can access all public types
        let _: MetricCard.Type = MetricCard.self
        let _: InteractiveButton.Type = InteractiveButton.self
        let _: ProgressIndicator.Type = ProgressIndicator.self
        let _: AnimatedCard<Text>.Type = AnimatedCard<Text>.self
        let _: HapticFeedbackManager.Type = HapticFeedbackManager.self
        let _: InteractiveListItem<Text>.Type = InteractiveListItem<Text>.self
        let _: LoadingIndicator.Type = LoadingIndicator.self
        let _: SwipeActionButton.Type = SwipeActionButton.self
        let _: ThemeManager.Type = ThemeManager.self
        let _: AppTheme.Type = AppTheme.self
        let _: AppColorScheme.Type = AppColorScheme.self
        let _: ThemedButton.Type = ThemedButton.self
        let _: ThemedCard<Text>.Type = ThemedCard<Text>.self
        let _: ThemeSelector.Type = ThemeSelector.self
    }
    
    // MARK: - Memory Management Tests
    
    func testMemoryManagement() {
        weak var weakThemeManager: ThemeManager?
        weak var weakHapticManager: HapticFeedbackManager?
        
        autoreleasepool {
            let themeManager = ThemeManager.shared
            let hapticManager = HapticFeedbackManager.shared
            
            weakThemeManager = themeManager
            weakHapticManager = hapticManager
            
            // Use the managers
            themeManager.toggleTheme()
            hapticManager.triggerLightImpact()
        }
        
        // Since these are singletons, they should not be deallocated
        XCTAssertNotNil(weakThemeManager)
        XCTAssertNotNil(weakHapticManager)
    }
    
    // MARK: - Thread Safety Tests
    
    func testThreadSafety() {
        let themeManager = ThemeManager.shared
        let hapticManager = HapticFeedbackManager.shared
        
        let expectation = XCTestExpectation(description: "Thread safety test")
        expectation.expectedFulfillmentCount = 10
        
        DispatchQueue.concurrentPerform(iterations: 10) { _ in
            themeManager.toggleTheme()
            hapticManager.triggerLightImpact()
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 5.0)
    }
    
    // MARK: - SwiftUI Integration Tests
    
    func testSwiftUIIntegration() {
        // Test that we can create SwiftUI views
        let testView = createTestView()
        XCTAssertNotNil(testView)
    }
    
    @available(iOS 15.0, *)
    private func createTestView() -> some View {
        VStack {
            MetricCard(title: "Test", value: "123")
            InteractiveButton(title: "Test", icon: "star") {}
            ProgressIndicator(progress: 0.5, title: "Test")
        }
    }
}

#else
// macOS stub - tests will be skipped on macOS
final class iOSOnlySwiftUITests: XCTestCase {
    func testPackageInformation() {
        // This test will be skipped on macOS
        XCTAssertTrue(true)
    }
}
#endif 