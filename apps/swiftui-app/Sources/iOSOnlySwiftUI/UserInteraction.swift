//
//  UserInteraction.swift
//  iOSOnlySwiftUI
//
//  iOS-only SwiftUI components for user interaction and feedback
//  with proper platform availability annotations and no UIKit dependencies.
//

#if os(iOS)
import SwiftUI

// MARK: - Metric Card Component

@available(iOS 15.0, *)
public struct MetricCard: View {
    let title: String
    let value: String
    let color: Color
    let isSelected: Bool
    let delay: Double
    
    @State private var isVisible = false
    
    public init(
        title: String,
        value: String,
        color: Color = .blue,
        isSelected: Bool = false,
        delay: Double = 0.0
    ) {
        self.title = title
        self.value = value
        self.color = color
        self.isSelected = false
        self.delay = delay
    }
    
    public var body: some View {
        VStack(spacing: 8) {
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
            
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(color)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.gray.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(isSelected ? color : Color.clear, lineWidth: 2)
                )
        )
        .scaleEffect(isVisible ? 1.0 : 0.8)
        .opacity(isVisible ? 1.0 : 0.0)
        .animation(.spring(response: 0.6, dampingFraction: 0.8).delay(delay), value: isVisible)
        .onAppear {
            isVisible = true
        }
    }
}

// MARK: - Interactive Button Component

@available(iOS 15.0, *)
public struct InteractiveButton: View {
    let title: String
    let icon: String
    let action: () -> Void
    
    @State private var isPressed = false
    @State private var isHovered = false
    
    public init(title: String, icon: String, action: @escaping () -> Void) {
        self.title = title
        self.icon = icon
        self.action = action
    }
    
    public var body: some View {
        Button(action: {
            withAnimation(.easeInOut(duration: 0.1)) {
                isPressed = true
            }
            
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                withAnimation(.easeInOut(duration: 0.1)) {
                    isPressed = false
                }
                action()
            }
        }) {
            HStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 16, weight: .medium))
                Text(title)
                    .font(.system(size: 16, weight: .medium))
            }
            .foregroundColor(.white)
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
            .background(
                RoundedRectangle(cornerRadius: 10)
                    .fill(Color.blue)
                    .scaleEffect(isPressed ? 0.95 : 1.0)
                    .shadow(color: .black.opacity(0.2), radius: isPressed ? 2 : 4, x: 0, y: isPressed ? 1 : 2)
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Progress Indicator Component

@available(iOS 15.0, *)
public struct ProgressIndicator: View {
    let progress: Double
    let title: String
    let color: Color
    
    @State private var animatedProgress: Double = 0
    
    public init(progress: Double, title: String, color: Color = .blue) {
        self.progress = progress
        self.title = title
        self.color = color
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(title)
                    .font(.caption)
                    .foregroundColor(.secondary)
                Spacer()
                Text("\(Int(animatedProgress * 100))%")
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(color)
            }
            
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color.gray.opacity(0.2))
                        .frame(height: 8)
                    
                    RoundedRectangle(cornerRadius: 4)
                        .fill(color)
                        .frame(width: geometry.size.width * animatedProgress, height: 8)
                        .animation(.easeInOut(duration: 1.0), value: animatedProgress)
                }
            }
            .frame(height: 8)
        }
        .onAppear {
            animatedProgress = progress
        }
        .onChange(of: progress) { newValue in
            animatedProgress = newValue
        }
    }
}

// MARK: - Animated Card Component

@available(iOS 15.0, *)
public struct AnimatedCard<Content: View>: View {
    let content: Content
    let cornerRadius: CGFloat
    let shadowRadius: CGFloat
    let delay: Double
    
    @State private var isVisible = false
    @State private var isHovered = false
    
    public init(
        cornerRadius: CGFloat = 12,
        shadowRadius: CGFloat = 8,
        delay: Double = 0.0,
        @ViewBuilder content: () -> Content
    ) {
        self.cornerRadius = cornerRadius
        self.shadowRadius = shadowRadius
        self.delay = delay
        self.content = content()
    }
    
    public var body: some View {
        content
            .padding()
            .background(Color.white)
            .cornerRadius(cornerRadius)
            .shadow(
                color: Color.black.opacity(0.1),
                radius: isVisible ? shadowRadius : 0,
                x: 0,
                y: isVisible ? 4 : 0
            )
            .scaleEffect(isVisible ? 1.0 : 0.9)
            .opacity(isVisible ? 1.0 : 0.0)
            .animation(.spring(response: 0.6, dampingFraction: 0.8).delay(delay), value: isVisible)
            .onAppear {
                isVisible = true
            }
    }
}

// MARK: - Haptic Feedback Manager

@available(iOS 15.0, *)
public class HapticFeedbackManager {
    public static let shared = HapticFeedbackManager()
    
    private init() {}
    
    public func impact(style: UIImpactFeedbackGenerator.FeedbackStyle) {
        let generator = UIImpactFeedbackGenerator(style: style)
        generator.impactOccurred()
    }
    
    public func notification(type: UINotificationFeedbackGenerator.FeedbackType) {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(type)
    }
    
    public func selection() {
        let generator = UISelectionFeedbackGenerator()
        generator.selectionChanged()
    }
}

// MARK: - Interactive List Item

@available(iOS 15.0, *)
public struct InteractiveListItem<Content: View>: View {
    let content: Content
    let onTap: () -> Void
    let onLongPress: (() -> Void)?
    
    @State private var isPressed = false
    
    public init(
        onTap: @escaping () -> Void,
        onLongPress: (() -> Void)? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self.content = content()
        self.onTap = onTap
        self.onLongPress = onLongPress
    }
    
    public var body: some View {
        content
            .padding()
            .background(Color.white)
            .cornerRadius(8)
            .scaleEffect(isPressed ? 0.98 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: isPressed)
            .onTapGesture {
                HapticFeedbackManager.shared.impact(style: .light)
                onTap()
            }
            .onLongPressGesture {
                HapticFeedbackManager.shared.impact(style: .medium)
                onLongPress?()
            } onPressingChanged: { pressing in
                isPressed = pressing
            }
    }
}

// MARK: - Loading Indicator

@available(iOS 15.0, *)
public struct LoadingIndicator: View {
    let text: String
    let color: Color
    
    @State private var isAnimating = false
    
    public init(text: String = "Loading...", color: Color = .blue) {
        self.text = text
        self.color = color
    }
    
    public var body: some View {
        VStack(spacing: 16) {
            Circle()
                .trim(from: 0, to: 0.7)
                .stroke(color, lineWidth: 4)
                .frame(width: 40, height: 40)
                .rotationEffect(Angle(degrees: isAnimating ? 360 : 0))
                .animation(.linear(duration: 1).repeatForever(autoreverses: false), value: isAnimating)
            
            Text(text)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .onAppear {
            isAnimating = true
        }
    }
}

// MARK: - Swipe Action Button

@available(iOS 15.0, *)
public struct SwipeActionButton: View {
    let title: String
    let icon: String
    let color: Color
    let action: () -> Void
    
    @State private var isPressed = false
    
    public init(title: String, icon: String, color: Color = .red, action: @escaping () -> Void) {
        self.title = title
        self.icon = icon
        self.color = color
        self.action = action
    }
    
    public var body: some View {
        Button(action: {
            HapticFeedbackManager.shared.impact(style: .medium)
            action()
        }) {
            VStack(spacing: 4) {
                Image(systemName: icon)
                    .font(.system(size: 20, weight: .medium))
                Text(title)
                    .font(.caption)
                    .fontWeight(.medium)
            }
            .foregroundColor(.white)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(color)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Preview

@available(iOS 15.0, *)
struct UserInteraction_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            MetricCard(title: "Total Users", value: "1,234", color: .blue)
            
            InteractiveButton(title: "Tap Me", icon: "hand.tap") {
                print("Button tapped")
            }
            
            ProgressIndicator(progress: 0.75, title: "Upload Progress")
            
            AnimatedCard {
                Text("Animated Card Content")
                    .font(.headline)
            }
            
            InteractiveListItem(onTap: {
                print("Item tapped")
            }) {
                Text("Interactive List Item")
            }
            
            LoadingIndicator()
        }
        .padding()
        .previewLayout(.sizeThatFits)
    }
}

#endif 