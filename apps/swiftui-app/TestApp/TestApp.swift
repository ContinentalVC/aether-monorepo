//
//  TestApp.swift
//  TestApp
//
//  Simple test app to verify iOSOnlySwiftUI package functionality
//

import SwiftUI
import iOSOnlySwiftUI

@main
struct TestApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

struct ContentView: View {
    @State private var isAnimating = false
    @State private var selectedColor = Color.blue
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Header
                    VStack {
                        Text("iOSOnlySwiftUI Package Test")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .multilineTextAlignment(.center)
                        
                        Text("Testing iOS-only SwiftUI components")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding()
                    
                    // Test MetricCard
                    MetricCard(
                        title: "Test Metric",
                        value: "42",
                        subtitle: "Test subtitle",
                        icon: "chart.bar.fill"
                    )
                    .padding(.horizontal)
                    
                    // Test InteractiveButton
                    InteractiveButton(
                        title: "Test Button",
                        icon: "star.fill",
                        action: {
                            print("Button tapped!")
                        }
                    )
                    .padding(.horizontal)
                    
                    // Test ProgressIndicator
                    ProgressIndicator(
                        progress: 0.75,
                        title: "Test Progress",
                        subtitle: "75% complete"
                    )
                    .padding(.horizontal)
                    
                    // Test AnimatedCard
                    AnimatedCard(
                        title: "Animated Card",
                        subtitle: "This card animates on tap",
                        icon: "heart.fill"
                    ) {
                        print("Card tapped!")
                    }
                    .padding(.horizontal)
                    
                    // Test HapticFeedbackManager
                    Button("Test Haptic Feedback") {
                        HapticFeedbackManager.shared.trigger(.success)
                    }
                    .buttonStyle(.borderedProminent)
                    .padding(.horizontal)
                    
                    Spacer()
                }
            }
            .navigationTitle("Package Test")
        }
    }
}

#Preview {
    ContentView()
} 