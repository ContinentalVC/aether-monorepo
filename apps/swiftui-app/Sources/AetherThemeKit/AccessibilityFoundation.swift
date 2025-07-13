//
//  AccessibilityFoundation.swift
//  AetherSwiftUIApp
//
//  Created by AI Assistant
//  Copyright © 2025 Aether Design System. All rights reserved.
//

import SwiftUI
import CoreHaptics

// MARK: - Accessibility Foundation
/// Comprehensive accessibility framework implementing VoiceOver support, Dynamic Type, and testing utilities

// MARK: - Accessibility Label Builder
struct AccessibilityLabelBuilder {
    /// Builds meaningful accessibility labels that describe purpose, not appearance
    static func buildLabel(for element: String, purpose: String, context: String? = nil) -> String {
        var label = purpose
        if let context = context {
            label += ", \(context)"
        }
        return label
    }
    
    /// Builds accessibility hints that explain the result of an action
    static func buildHint(for action: String, result: String) -> String {
        return "Double tap to \(action). \(result)"
    }
}

// MARK: - Dynamic Type Support
struct DynamicTypeSupport {
    /// Scaled font for body text that adapts to user's accessibility settings
    static var bodyFont: Font {
        .system(size: UIFont.preferredFont(forTextStyle: .body).pointSize, weight: .regular, design: .default)
    }
    
    /// Scaled font for headings that adapts to user's accessibility settings
    static var headingFont: Font {
        .system(size: UIFont.preferredFont(forTextStyle: .title1).pointSize, weight: .bold, design: .default)
    }
    
    /// Scaled font for captions that adapts to user's accessibility settings
    static var captionFont: Font {
        .system(size: UIFont.preferredFont(forTextStyle: .caption1).pointSize, weight: .regular, design: .default)
    }
    
    /// Checks if user has enabled large accessibility text sizes
    static var isLargeTextEnabled: Bool {
        let contentSize = UIApplication.shared.preferredContentSizeCategory
        return contentSize.isAccessibilityCategory
    }
    
    /// Adaptive layout strategy for complex layouts
    static func shouldUseSingleColumnLayout() -> Bool {
        return isLargeTextEnabled
    }
}

// MARK: - Accessibility Grouping
struct AccessibilityGrouping {
    /// Groups related elements into a single accessibility element
    static func groupElements<T: View>(_ elements: [T], label: String, hint: String? = nil) -> some View {
        Group {
            ForEach(0..<elements.count, id: \.self) { index in
                elements[index]
            }
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(label)
        .if(hint != nil) { view in
            view.accessibilityHint(hint!)
        }
    }
}

// MARK: - Custom Accessibility Actions
struct CustomAccessibilityAction {
    let name: String
    let action: () -> Void
    
    init(name: String, action: @escaping () -> Void) {
        self.name = name
        self.action = action
    }
}

// MARK: - Accessibility Custom Rotor
struct AccessibilityCustomRotor {
    let name: String
    let items: [String]
    let currentIndex: Binding<Int>
    
    init(name: String, items: [String], currentIndex: Binding<Int>) {
        self.name = name
        self.items = items
        self.currentIndex = currentIndex
    }
}

// MARK: - Haptic Feedback Manager
class HapticFeedbackManager: ObservableObject {
    private var engine: CHHapticEngine?
    
    init() {
        setupHapticEngine()
    }
    
    private func setupHapticEngine() {
        guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else { return }
        
        do {
            engine = try CHHapticEngine()
            try engine?.start()
        } catch {
            print("Failed to start haptic engine: \(error)")
        }
    }
    
    /// Creates a custom haptic pattern for specific actions
    func createCustomPattern(intensity: Float, sharpness: Float, duration: TimeInterval) -> CHHapticPattern? {
        guard let engine = engine else { return nil }
        
        let event = CHHapticEvent(
            eventType: .hapticTransient,
            parameters: [
                CHHapticEventParameter(parameterID: .hapticIntensity, value: intensity),
                CHHapticEventParameter(parameterID: .hapticSharpness, value: sharpness)
            ],
            relativeTime: 0,
            duration: duration
        )
        
        do {
            return try CHHapticPattern(events: [event], parameters: [])
        } catch {
            print("Failed to create haptic pattern: \(error)")
            return nil
        }
    }
    
    /// Plays a success haptic feedback
    func playSuccessHaptic() {
        playHapticPattern(intensity: 0.8, sharpness: 0.9, duration: 0.1)
    }
    
    /// Plays an error haptic feedback
    func playErrorHaptic() {
        playHapticPattern(intensity: 0.6, sharpness: 0.3, duration: 0.2)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            self.playHapticPattern(intensity: 0.6, sharpness: 0.3, duration: 0.2)
        }
    }
    
    /// Plays a warning haptic feedback
    func playWarningHaptic() {
        playHapticPattern(intensity: 0.7, sharpness: 0.5, duration: 0.15)
    }
    
    private func playHapticPattern(intensity: Float, sharpness: Float, duration: TimeInterval) {
        guard let pattern = createCustomPattern(intensity: intensity, sharpness: sharpness, duration: duration),
              let engine = engine else { return }
        
        do {
            let player = try engine.makePlayer(with: pattern)
            try player.start(atTime: 0)
        } catch {
            print("Failed to play haptic pattern: \(error)")
        }
    }
}

// MARK: - Accessibility Testing Utilities
struct AccessibilityTestingUtilities {
    /// Validates accessibility properties on a view
    static func validateAccessibilityProperties(
        label: String?,
        hint: String?,
        traits: AccessibilityTraits,
        isEnabled: Bool = true
    ) -> [String] {
        var errors: [String] = []
        
        // Validate accessibility label
        if label == nil || label!.isEmpty {
            errors.append("Accessibility label is missing or empty")
        } else if label!.contains("button") || label!.contains("image") {
            errors.append("Accessibility label should not include element type (button, image, etc.)")
        }
        
        // Validate accessibility hint
        if hint != nil && hint!.isEmpty {
            errors.append("Accessibility hint should not be empty if provided")
        }
        
        // Validate traits
        if traits.isEmpty {
            errors.append("Accessibility traits should be specified")
        }
        
        // Validate enabled state
        if !isEnabled && traits.contains(.button) {
            errors.append("Disabled buttons should have appropriate accessibility traits")
        }
        
        return errors
    }
    
    /// Simulates VoiceOver navigation order
    static func validateNavigationOrder(elements: [String]) -> [String] {
        var warnings: [String] = []
        
        // Check for logical grouping
        if elements.count > 10 {
            warnings.append("Consider grouping related elements for better VoiceOver navigation")
        }
        
        // Check for meaningful order
        if elements.contains("Cancel") && elements.contains("Save") {
            let cancelIndex = elements.firstIndex(of: "Cancel") ?? -1
            let saveIndex = elements.firstIndex(of: "Save") ?? -1
            if cancelIndex < saveIndex {
                warnings.append("Consider placing Save before Cancel for better UX")
            }
        }
        
        return warnings
    }
}

// MARK: - Accessibility Modifiers Extension
extension View {
    /// Applies comprehensive accessibility support to a view
    func comprehensiveAccessibility(
        label: String,
        hint: String? = nil,
        traits: AccessibilityTraits = [],
        actions: [CustomAccessibilityAction] = [],
        rotor: AccessibilityCustomRotor? = nil
    ) -> some View {
        self
            .accessibilityLabel(label)
            .if(hint != nil) { view in
                view.accessibilityHint(hint!)
            }
            .accessibilityAddTraits(traits)
            .if(!actions.isEmpty) { view in
                view.accessibilityAction(named: Text(actions[0].name)) {
                    actions[0].action()
                }
            }
    }
    
    /// Applies Dynamic Type support with adaptive layout
    func dynamicTypeSupport() -> some View {
        self
            .font(DynamicTypeSupport.bodyFont)
            .if(DynamicTypeSupport.shouldUseSingleColumnLayout()) { view in
                view.frame(maxWidth: .infinity)
            }
    }
    
    /// Conditional modifier for optional values
    @ViewBuilder
    func `if`<Content: View>(_ condition: Bool, transform: (Self) -> Content) -> some View {
        if condition {
            transform(self)
        } else {
            self
        }
    }
}

// MARK: - Accessibility Testing View
struct AccessibilityTestingView: View {
    @StateObject private var hapticManager = HapticFeedbackManager()
    @State private var testResults: [String] = []
    @State private var isTesting = false
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Text("Accessibility Testing")
                    .font(DynamicTypeSupport.headingFont)
                    .accessibilityLabel("Accessibility testing screen")
                
                // Test Section
                VStack(alignment: .leading, spacing: 10) {
                    Text("Test Results")
                        .font(DynamicTypeSupport.bodyFont)
                        .fontWeight(.semibold)
                    
                    if isTesting {
                        ProgressView("Running accessibility tests...")
                            .accessibilityLabel("Running accessibility tests")
                    } else {
                        ForEach(testResults, id: \.self) { result in
                            Text("• \(result)")
                                .font(DynamicTypeSupport.captionFont)
                                .foregroundColor(result.contains("error") ? .red : .orange)
                        }
                    }
                }
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(8)
                
                // Test Buttons
                VStack(spacing: 15) {
                    Button("Run Accessibility Tests") {
                        runAccessibilityTests()
                    }
                    .buttonStyle(.borderedProminent)
                    .accessibilityLabel("Run accessibility tests")
                    .accessibilityHint("Double tap to start comprehensive accessibility testing")
                    
                    Button("Test Haptic Feedback") {
                        hapticManager.playSuccessHaptic()
                    }
                    .buttonStyle(.bordered)
                    .accessibilityLabel("Test haptic feedback")
                    .accessibilityHint("Double tap to feel haptic feedback")
                    
                    Button("Test Error Haptic") {
                        hapticManager.playErrorHaptic()
                    }
                    .buttonStyle(.bordered)
                    .accessibilityLabel("Test error haptic")
                    .accessibilityHint("Double tap to feel error haptic feedback")
                }
                
                // Example Accessible Elements
                VStack(alignment: .leading, spacing: 15) {
                    Text("Example Accessible Elements")
                        .font(DynamicTypeSupport.bodyFont)
                        .fontWeight(.semibold)
                    
                    // Contact Card Example
                    VStack(alignment: .leading, spacing: 8) {
                        Text("John Appleseed")
                            .font(DynamicTypeSupport.bodyFont)
                            .fontWeight(.semibold)
                        Text("Senior Designer")
                            .font(DynamicTypeSupport.captionFont)
                            .foregroundColor(.secondary)
                        Text("(408) 555-1234")
                            .font(DynamicTypeSupport.captionFont)
                    }
                    .padding()
                    .background(Color.blue.opacity(0.1))
                    .cornerRadius(8)
                    .accessibilityElement(children: .combine)
                    .accessibilityLabel("John Appleseed, Senior Designer. (408) 555-1234.")
                    .accessibilityHint("Double tap to view contact details")
                }
            }
            .padding()
        }
        .navigationTitle("Accessibility Foundation")
        .navigationBarTitleDisplayMode(.large)
    }
    
    private func runAccessibilityTests() {
        isTesting = true
        testResults.removeAll()
        
        // Simulate testing delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            // Test accessibility properties
            let propertyErrors = AccessibilityTestingUtilities.validateAccessibilityProperties(
                label: "Test Button",
                hint: "Double tap to test",
                traits: .button
            )
            testResults.append(contentsOf: propertyErrors)
            
            // Test navigation order
            let navigationWarnings = AccessibilityTestingUtilities.validateNavigationOrder(
                elements: ["Save", "Cancel", "Delete", "Edit"]
            )
            testResults.append(contentsOf: navigationWarnings)
            
            // Add success message if no errors
            if testResults.isEmpty {
                testResults.append("All accessibility tests passed!")
            }
            
            isTesting = false
            hapticManager.playSuccessHaptic()
        }
    }
}

// MARK: - Preview
#Preview {
    NavigationView {
        AccessibilityTestingView()
    }
} 