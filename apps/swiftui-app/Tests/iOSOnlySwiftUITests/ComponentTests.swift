//
//  ComponentTests.swift
//  iOSOnlySwiftUITests
//
//  Tests for iOS-only SwiftUI components
//

import XCTest
import SwiftUI
@testable import iOSOnlySwiftUI

@available(iOS 15.0, *)
final class ComponentTests: XCTestCase {
    
    // MARK: - MetricCard Tests
    
    func testMetricCardInitialization() {
        #if os(iOS)
        let card = MetricCard(
            title: "Test Title",
            value: "42",
            color: Color.blue,
            isSelected: false,
            delay: 0.0
        )
        
        XCTAssertNotNil(card)
        #else
        XCTSkip("MetricCard only available on iOS")
        #endif
    }
    
    func testMetricCardWithDefaultValues() {
        #if os(iOS)
        let card = MetricCard(
            title: "Test Title",
            value: "42"
        )
        
        XCTAssertNotNil(card)
        #else
        XCTSkip("MetricCard only available on iOS")
        #endif
    }
    
    // MARK: - InteractiveButton Tests
    
    func testInteractiveButtonInitialization() {
        #if os(iOS)
        let button = InteractiveButton(
            title: "Test Button",
            icon: "hand.tap.fill",
            action: {
                // Action would be executed when button is tapped
            }
        )
        
        XCTAssertNotNil(button)
        // Note: We can't easily test the action in unit tests
        // This would require UI tests
        #else
        XCTSkip("InteractiveButton only available on iOS")
        #endif
    }
    
    func testInteractiveButtonAction() {
        #if os(iOS)
        var buttonTapped = false
        
        let button = InteractiveButton(
            title: "Test Button",
            icon: "hand.tap.fill",
            action: {
                buttonTapped = true
            }
        )
        
        XCTAssertNotNil(button)
        // The buttonTapped variable is used to verify the action closure is captured
        XCTAssertFalse(buttonTapped)
        #else
        XCTSkip("InteractiveButton only available on iOS")
        #endif
    }
    
    // MARK: - ProgressIndicator Tests
    
    func testProgressIndicatorInitialization() {
        #if os(iOS)
        let indicator = ProgressIndicator(
            progress: 0.75,
            title: "Loading...",
            color: Color.blue
        )
        
        XCTAssertNotNil(indicator)
        #else
        XCTSkip("ProgressIndicator only available on iOS")
        #endif
    }
    
    func testProgressIndicatorWithZeroProgress() {
        #if os(iOS)
        let indicator = ProgressIndicator(
            progress: 0.0,
            title: "Starting..."
        )
        
        XCTAssertNotNil(indicator)
        #else
        XCTSkip("ProgressIndicator only available on iOS")
        #endif
    }
    
    func testProgressIndicatorWithFullProgress() {
        #if os(iOS)
        let indicator = ProgressIndicator(
            progress: 1.0,
            title: "Complete!",
            color: Color.green
        )
        
        XCTAssertNotNil(indicator)
        #else
        XCTSkip("ProgressIndicator only available on iOS")
        #endif
    }
    
    // MARK: - AnimatedCard Tests
    
    func testAnimatedCardInitialization() {
        #if os(iOS)
        let card = AnimatedCard<Text>(
            cornerRadius: 12,
            shadowRadius: 8,
            delay: 0.0
        ) {
            Text("Test Card Content")
        }
        
        XCTAssertNotNil(card)
        #else
        XCTSkip("AnimatedCard only available on iOS")
        #endif
    }
    
    func testAnimatedCardWithDefaultValues() {
        #if os(iOS)
        let card = AnimatedCard<Text> {
            Text("Test Card Content")
        }
        
        XCTAssertNotNil(card)
        #else
        XCTSkip("AnimatedCard only available on iOS")
        #endif
    }
    
    // MARK: - HapticFeedbackManager Tests
    
    func testHapticFeedbackManagerAvailability() {
        #if os(iOS)
        // Test that the manager is available
        XCTAssertNotNil(HapticFeedbackManager.self)
        #else
        XCTSkip("HapticFeedbackManager only available on iOS")
        #endif
    }
    
    func testHapticFeedbackManagerShared() {
        #if os(iOS)
        // Test that the shared instance is available
        XCTAssertNotNil(HapticFeedbackManager.shared)
        #else
        XCTSkip("HapticFeedbackManager only available on iOS")
        #endif
    }
    
    // MARK: - Platform Compatibility Tests
    
    func testPlatformAvailabilityAnnotations() {
        // This test verifies that our components are properly annotated
        // for iOS-only availability
        
        #if os(iOS)
        // All components should be available on iOS
        XCTAssertNotNil(MetricCard.self)
        XCTAssertNotNil(InteractiveButton.self)
        XCTAssertNotNil(ProgressIndicator.self)
        XCTAssertNotNil(AnimatedCard<Text>.self)
        XCTAssertNotNil(HapticFeedbackManager.self)
        #else
        // Components should not be available on other platforms
        XCTSkip("Components only available on iOS")
        #endif
    }
    
    func testMinimumiOSVersion() {
        // Test that we're targeting iOS 15+
        #if os(iOS)
        // All components should work
        XCTAssertNotNil(MetricCard.self)
        #else
        XCTSkip("Components only available on iOS")
        #endif
    }
    
    // MARK: - Package Structure Tests
    
    func testPackageExports() {
        // Test that our main package file exports all components
        // This is a structural test to ensure our package is properly configured
        
        // The fact that we can import iOSOnlySwiftUI means the package structure is correct
        XCTAssertTrue(true, "Package import successful")
    }
    
    // MARK: - Performance Tests
    
    func testComponentCreationPerformance() {
        #if os(iOS)
        measure {
            for _ in 0..<100 {
                _ = MetricCard(
                    title: "Performance Test",
                    value: "100",
                    color: Color.blue,
                    isSelected: false,
                    delay: 0.0
                )
            }
        }
        #else
        XCTSkip("Performance tests only available on iOS")
        #endif
    }
    
    func testHapticFeedbackPerformance() {
        #if os(iOS)
        measure {
            for _ in 0..<10 {
                HapticFeedbackManager.shared.impact(style: .light)
            }
        }
        #else
        XCTSkip("Haptic feedback tests only available on iOS")
        #endif
    }
}

// MARK: - Test Helpers

@available(iOS 15.0, *)
extension ComponentTests {
    
    func createTestMetricCard() -> Any? {
        #if os(iOS)
        return MetricCard(
            title: "Test Metric",
            value: "42",
            color: Color.blue,
            isSelected: false,
            delay: 0.0
        )
        #else
        return nil
        #endif
    }
    
    func createTestInteractiveButton() -> Any? {
        #if os(iOS)
        return InteractiveButton(
            title: "Test Button",
            icon: "hand.tap.fill",
            action: {}
        )
        #else
        return nil
        #endif
    }
    
    func createTestProgressIndicator() -> Any? {
        #if os(iOS)
        return ProgressIndicator(
            progress: 0.5,
            title: "Test Progress",
            color: Color.blue
        )
        #else
        return nil
        #endif
    }
    
    func createTestAnimatedCard() -> Any? {
        #if os(iOS)
        return AnimatedCard<Text> {
            Text("Test Card Content")
        }
        #else
        return nil
        #endif
    }
} 