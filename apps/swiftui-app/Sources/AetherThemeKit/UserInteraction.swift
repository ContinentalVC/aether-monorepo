//
//  UserInteraction.swift
//  AetherSwiftUIApp
//
//  Created by AI Assistant
//  Copyright © 2025 Aether Design System. All rights reserved.
//

import SwiftUI
import CoreHaptics

// MARK: - User Interaction Foundation
/// Comprehensive user interaction system implementing advanced animations, gestures, and haptic feedback

// MARK: - Advanced Animation and Easing
struct AdvancedAnimation {
    // MARK: - Custom Easing Functions
    static let easeOutBack = Animation.timingCurve(0.175, 0.885, 0.32, 1.275, duration: 0.6)
    static let easeInBack = Animation.timingCurve(0.6, -0.28, 0.735, 0.045, duration: 0.6)
    static let easeInOutBack = Animation.timingCurve(0.68, -0.55, 0.265, 1.55, duration: 0.6)
    
    static let easeOutElastic = Animation.timingCurve(0.175, 0.885, 0.32, 1.275, duration: 0.8)
    static let easeInElastic = Animation.timingCurve(0.6, -0.28, 0.735, 0.045, duration: 0.8)
    
    static let easeOutBounce = Animation.timingCurve(0.175, 0.885, 0.32, 1.275, duration: 0.7)
    static let easeInBounce = Animation.timingCurve(0.6, -0.28, 0.735, 0.045, duration: 0.7)
    
    // MARK: - Native iOS Animation Curves
    static let nativeEaseOut = Animation.timingCurve(0.25, 0.46, 0.45, 0.94, duration: 0.3)
    static let nativeEaseIn = Animation.timingCurve(0.55, 0.055, 0.675, 0.19, duration: 0.3)
    static let nativeEaseInOut = Animation.timingCurve(0.645, 0.045, 0.355, 1, duration: 0.3)
    
    // MARK: - Choreographed Animation Patterns
    static func choreographedAppear(delay: Double = 0) -> Animation {
        return .easeOut(duration: 0.6)
            .delay(delay)
    }
    
    static func choreographedDisappear() -> Animation {
        return .easeIn(duration: 0.4)
    }
    
    static func springWithDamping(_ damping: Double, response: Double = 0.5) -> Animation {
        return .spring(response: response, dampingFraction: damping)
    }
}

// MARK: - Gesture Support
struct AdvancedGestureSupport {
    // MARK: - Standard Gestures
    static func tapGesture(action: @escaping () -> Void) -> some Gesture {
        TapGesture()
            .onEnded { _ in
                action()
            }
    }
    
    static func longPressGesture(action: @escaping () -> Void) -> some Gesture {
        LongPressGesture(minimumDuration: 0.5)
            .onEnded { _ in
                action()
            }
    }
    
    static func dragGesture(
        onChanged: @escaping (DragGesture.Value) -> Void,
        onEnded: @escaping (DragGesture.Value) -> Void
    ) -> some Gesture {
        DragGesture()
            .onChanged(onChanged)
            .onEnded(onEnded)
    }
    
    // MARK: - Complex Gestures
    static func pinchGesture(
        onChanged: @escaping (MagnificationGesture.Value) -> Void,
        onEnded: @escaping (MagnificationGesture.Value) -> Void
    ) -> some Gesture {
        MagnificationGesture()
            .onChanged(onChanged)
            .onEnded(onEnded)
    }
    
    static func rotationGesture(
        onChanged: @escaping (RotationGesture.Value) -> Void,
        onEnded: @escaping (RotationGesture.Value) -> Void
    ) -> some Gesture {
        RotationGesture()
            .onChanged(onChanged)
            .onEnded(onEnded)
    }
    
    // MARK: - Simultaneous Gestures
    static func simultaneousGestures<T: Gesture, U: Gesture>(
        _ first: T,
        _ second: U
    ) -> some Gesture {
        first.simultaneously(with: second)
    }
}

// MARK: - Interactive Chart Component
struct InteractiveChartView: View {
    @State private var selectedPoint: Int? = nil
    @State private var isAnimating = false
    @State private var scale: CGFloat = 1.0
    @State private var offset: CGSize = .zero
    @StateObject private var hapticManager = HapticFeedbackManager()
    
    let data: [Double] = [10, 25, 15, 30, 20, 35, 25, 40, 30, 45]
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Interactive Chart")
                .font(.title)
                .fontWeight(.bold)
            
            // Chart Container
            GeometryReader { geometry in
                ZStack {
                    // Chart Background
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.gray.opacity(0.1))
                        .frame(height: 200)
                    
                    // Chart Bars
                    HStack(alignment: .bottom, spacing: 8) {
                        ForEach(0..<data.count, id: \.self) { index in
                            VStack {
                                // Bar
                                RoundedRectangle(cornerRadius: 4)
                                    .fill(selectedPoint == index ? Color.blue : Color.gray.opacity(0.6))
                                    .frame(width: 20, height: CGFloat(data[index]) * 3)
                                    .scaleEffect(selectedPoint == index ? 1.1 : 1.0)
                                    .animation(AdvancedAnimation.springWithDamping(0.7), value: selectedPoint)
                                    .onTapGesture {
                                        withAnimation(AdvancedAnimation.choreographedAppear()) {
                                            selectedPoint = selectedPoint == index ? nil : index
                                        }
                                        hapticManager.playSuccessHaptic()
                                    }
                                    .accessibilityLabel("Data point \(index + 1)")
                                    .accessibilityValue("Value: \(Int(data[index]))")
                                    .accessibilityHint("Double tap to select this data point")
                                
                                // Value Label
                                if selectedPoint == index {
                                    Text("\(Int(data[index]))")
                                        .font(.caption)
                                        .fontWeight(.semibold)
                                        .foregroundColor(.blue)
                                        .transition(.scale.combined(with: .opacity))
                                }
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 20)
                }
            }
            .frame(height: 200)
            .scaleEffect(scale)
            .offset(offset)
            .gesture(
                AdvancedGestureSupport.simultaneousGestures(
                    AdvancedGestureSupport.pinchGesture(
                        onChanged: { value in
                            scale = value
                        },
                        onEnded: { _ in
                            withAnimation(AdvancedAnimation.nativeEaseOut) {
                                scale = max(0.5, min(2.0, scale))
                            }
                        }
                    ),
                    AdvancedGestureSupport.dragGesture(
                        onChanged: { value in
                            offset = value.translation
                        },
                        onEnded: { _ in
                            withAnimation(AdvancedAnimation.nativeEaseOut) {
                                offset = .zero
                            }
                        }
                    )
                )
            )
            
            // Controls
            VStack(spacing: 15) {
                Button("Animate Chart") {
                    animateChart()
                }
                .buttonStyle(.borderedProminent)
                
                Button("Reset Selection") {
                    withAnimation(AdvancedAnimation.choreographedDisappear()) {
                        selectedPoint = nil
                    }
                }
                .buttonStyle(.bordered)
                
                Button("Test Haptic Feedback") {
                    hapticManager.playSuccessHaptic()
                }
                .buttonStyle(.bordered)
            }
        }
        .padding()
    }
    
    private func animateChart() {
        isAnimating = true
        
        // Animate each bar sequentially
        for index in 0..<data.count {
            DispatchQueue.main.asyncAfter(deadline: .now() + Double(index) * 0.1) {
                withAnimation(AdvancedAnimation.easeOutBack) {
                    // Trigger animation by temporarily selecting each point
                    selectedPoint = index
                }
                
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                    withAnimation(AdvancedAnimation.easeInBack) {
                        selectedPoint = nil
                    }
                }
                
                hapticManager.playSuccessHaptic()
            }
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + Double(data.count) * 0.1 + 0.5) {
            isAnimating = false
        }
    }
}

// MARK: - Gesture-Based Data Visualization
struct GestureDataVisualization: View {
    @State private var dataPoints: [CGPoint] = []
    @State private var selectedPoint: Int? = nil
    @State private var isDrawing = false
    @StateObject private var hapticManager = HapticFeedbackManager()
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Gesture Data Visualization")
                .font(.title)
                .fontWeight(.bold)
            
            // Drawing Canvas
            GeometryReader { geometry in
                ZStack {
                    // Background
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.gray.opacity(0.1))
                    
                    // Data Points
                    ForEach(0..<dataPoints.count, id: \.self) { index in
                        Circle()
                            .fill(selectedPoint == index ? Color.red : Color.blue)
                            .frame(width: 20, height: 20)
                            .position(dataPoints[index])
                            .scaleEffect(selectedPoint == index ? 1.5 : 1.0)
                            .animation(AdvancedAnimation.springWithDamping(0.7), value: selectedPoint)
                            .onTapGesture {
                                withAnimation(AdvancedAnimation.choreographedAppear()) {
                                    selectedPoint = selectedPoint == index ? nil : index
                                }
                                hapticManager.playSuccessHaptic()
                            }
                            .accessibilityLabel("Data point \(index + 1)")
                            .accessibilityValue("Position: \(Int(dataPoints[index].x)), \(Int(dataPoints[index].y))")
                    }
                    
                    // Connection Lines
                    Path { path in
                        guard dataPoints.count > 1 else { return }
                        path.move(to: dataPoints[0])
                        for point in dataPoints.dropFirst() {
                            path.addLine(to: point)
                        }
                    }
                    .stroke(Color.gray.opacity(0.5), lineWidth: 2)
                }
            }
            .frame(height: 300)
            .gesture(
                AdvancedGestureSupport.dragGesture(
                    onChanged: { value in
                        if !isDrawing {
                            isDrawing = true
                            dataPoints.append(value.location)
                            hapticManager.playWarningHaptic()
                        } else {
                            dataPoints.append(value.location)
                        }
                    },
                    onEnded: { _ in
                        isDrawing = false
                        hapticManager.playSuccessHaptic()
                    }
                )
            )
            
            // Controls
            VStack(spacing: 15) {
                Button("Clear Points") {
                    withAnimation(AdvancedAnimation.choreographedDisappear()) {
                        dataPoints.removeAll()
                        selectedPoint = nil
                    }
                }
                .buttonStyle(.borderedProminent)
                
                Button("Generate Random Points") {
                    generateRandomPoints()
                }
                .buttonStyle(.bordered)
                
                Text("Points: \(dataPoints.count)")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
    }
    
    private func generateRandomPoints() {
        dataPoints.removeAll()
        selectedPoint = nil
        
        for _ in 0..<10 {
            let x = CGFloat.random(in: 50...300)
            let y = CGFloat.random(in: 50...250)
            dataPoints.append(CGPoint(x: x, y: y))
        }
        
        hapticManager.playSuccessHaptic()
    }
}

// MARK: - Animated Dashboard Component
struct AnimatedDashboardView: View {
    @State private var isVisible = false
    @State private var selectedMetric = 0
    @StateObject private var hapticManager = HapticFeedbackManager()
    
    let metrics = [
        ("Revenue", "$125K", Color.green),
        ("Users", "2.4K", Color.blue),
        ("Growth", "+12%", Color.orange),
        ("Engagement", "89%", Color.purple)
    ]
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Animated Dashboard")
                .font(.title)
                .fontWeight(.bold)
                .opacity(isVisible ? 1 : 0)
                .animation(AdvancedAnimation.choreographedAppear(delay: 0.1), value: isVisible)
            
            // Metrics Grid
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 15) {
                ForEach(0..<metrics.count, id: \.self) { index in
                    MetricCard(
                        title: metrics[index].0,
                        value: metrics[index].1,
                        color: metrics[index].2,
                        isSelected: selectedMetric == index,
                        delay: Double(index) * 0.1
                    )
                    .onTapGesture {
                        withAnimation(AdvancedAnimation.springWithDamping(0.7)) {
                            selectedMetric = index
                        }
                        hapticManager.playSuccessHaptic()
                    }
                    .accessibilityLabel("\(metrics[index].0) metric")
                    .accessibilityValue("\(metrics[index].1)")
                    .accessibilityHint("Double tap to select this metric")
                }
            }
            .opacity(isVisible ? 1 : 0)
            .animation(AdvancedAnimation.choreographedAppear(delay: 0.3), value: isVisible)
            
            // Controls
            VStack(spacing: 15) {
                Button("Animate Dashboard") {
                    animateDashboard()
                }
                .buttonStyle(.borderedProminent)
                
                Button("Reset Selection") {
                    withAnimation(AdvancedAnimation.choreographedDisappear()) {
                        selectedMetric = 0
                    }
                }
                .buttonStyle(.bordered)
            }
            .opacity(isVisible ? 1 : 0)
            .animation(AdvancedAnimation.choreographedAppear(delay: 0.5), value: isVisible)
        }
        .padding()
        .onAppear {
            isVisible = true
        }
    }
    
    private func animateDashboard() {
        isVisible = false
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            withAnimation(AdvancedAnimation.easeOutBack) {
                isVisible = true
            }
        }
        
        hapticManager.playSuccessHaptic()
    }
}

// MARK: - Metric Card Component
@available(iOS 15.0, *)
struct MetricCard: View {
    let title: String
    let value: String
    let color: Color
    let isSelected: Bool
    let delay: Double
    
    @State private var isVisible = false
    
    var body: some View {
        VStack(spacing: 8) {
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
            
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(color)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.gray.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(color, lineWidth: isSelected ? 2 : 0)
                )
        )
        .scaleEffect(isSelected ? 1.05 : 1.0)
        .opacity(isVisible ? 1 : 0)
        .animation(AdvancedAnimation.choreographedAppear(delay: delay), value: isVisible)
        .onAppear {
            isVisible = true
        }
    }
}

// MARK: - User Interaction Testing View
@available(iOS 15.0, *)
struct UserInteractionTestingView: View {
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            InteractiveChartView()
                .tabItem {
                    Image(systemName: "chart.bar.fill")
                    Text("Chart")
                }
                .tag(0)
            
            GestureDataVisualization()
                .tabItem {
                    Image(systemName: "hand.draw.fill")
                    Text("Gestures")
                }
                .tag(1)
            
            AnimatedDashboardView()
                .tabItem {
                    Image(systemName: "square.grid.2x2.fill")
                    Text("Dashboard")
                }
                .tag(2)
        }
        .navigationTitle("User Interaction")
        .navigationBarTitleDisplayMode(.large)
    }
}

// MARK: - Preview
#Preview {
    NavigationView {
        UserInteractionTestingView()
    }
} 