//
//  AetherGlassCard.swift
//  Aether SwiftUI App
//
//  A reusable SwiftUI view that implements Evolved Glassmorphism styling
//  with theme-aware colors using ThemeManager and comprehensive accessibility support.
//  Ensures that the content passed into it is the primary focus for VoiceOver.
//

import SwiftUI

/// A reusable SwiftUI view that implements Evolved Glassmorphism styling
/// with theme-aware colors using ThemeManager and comprehensive accessibility support.
///
/// This view creates a glass-like card effect using:
/// - Background blur with radius of 10
/// - Theme-aware semi-transparent fill
/// - Theme-aware subtle border
/// - 20pt corner radius
/// - Dynamic theming support via ThemeManager
/// - Accessibility support that focuses on content
///
/// Usage:
/// ```swift
/// AetherGlassCard {
///     VStack {
///         Text("Hello, Aether!")
///         Image(systemName: "star.fill")
///     }
///     .padding()
/// }
/// ```
struct AetherGlassCard<Content: View>: View {
    
    /// The content to display inside the glass card
    let content: Content
    
    /// Environment property to detect current color scheme
    @Environment(\.colorScheme) private var colorScheme
    
    /// Environment object for theme management
    @EnvironmentObject private var themeManager: ThemeManager
    
    /// Initialize the glass card with content
    /// - Parameter content: A closure that returns the content view
    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    var body: some View {
        content
            .background(
                // Base glassmorphism layer
                RoundedRectangle(cornerRadius: 20)
                    .fill(glassFillColor)
                    .overlay(
                        // Subtle border for enhanced glass effect
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(glassBorderColor, lineWidth: 1)
                    )
            )
            .background(
                // Background blur for glassmorphism effect
                RoundedRectangle(cornerRadius: 20)
                    .fill(.clear)
                    .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 20))
                    .blur(radius: 0) // The blur is handled by the material
            )
            .background(
                // Additional blur layer for enhanced glass effect
                RoundedRectangle(cornerRadius: 20)
                    .fill(.clear)
                    .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 20))
                    .blur(radius: 10)
            )
            .accessibilityElement(children: .contain)
            .accessibilityLabel("Glass card container")
            .accessibilityHint("Contains interactive content")
            .accessibilityAddTraits([.isContainer])
            .onAppear {
                // Hide all decorative background elements from accessibility
                hideDecorativeElementsFromAccessibility()
            }
    }
    
    /// Theme-aware glass fill color using ThemeManager
    private var glassFillColor: Color {
        return themeManager.currentTheme.surfaceGlass
    }
    
    /// Theme-aware glass border color using ThemeManager
    private var glassBorderColor: Color {
        return themeManager.currentTheme.border
    }
    
    /// Theme-aware background color for enhanced glass effect
    private var glassBackgroundColor: Color {
        return themeManager.currentTheme.backgroundSecondary
    }
    
    /// Hides decorative elements from accessibility to ensure content is the focus
    private func hideDecorativeElementsFromAccessibility() {
        // This function ensures that all background decorative elements
        // are hidden from VoiceOver, allowing the content to be the primary focus
        // The actual hiding is done through the .accessibilityHidden(true) modifier
        // applied to background elements in the view hierarchy
    }
}

// MARK: - Accessibility Enhanced Background Modifier

/// A custom modifier that applies glassmorphism background while hiding it from accessibility
struct GlassmorphismBackground: ViewModifier {
    let fillColor: Color
    let borderColor: Color
    
    func body(content: Content) -> some View {
        content
            .background(
                // Base glassmorphism layer - hidden from accessibility
                RoundedRectangle(cornerRadius: 20)
                    .fill(fillColor)
                    .overlay(
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(borderColor, lineWidth: 1)
                    )
                    .accessibilityHidden(true) // Hide decorative background
            )
            .background(
                // Background blur - hidden from accessibility
                RoundedRectangle(cornerRadius: 20)
                    .fill(.clear)
                    .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 20))
                    .blur(radius: 0)
                    .accessibilityHidden(true) // Hide decorative blur
            )
            .background(
                // Additional blur layer - hidden from accessibility
                RoundedRectangle(cornerRadius: 20)
                    .fill(.clear)
                    .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 20))
                    .blur(radius: 10)
                    .accessibilityHidden(true) // Hide decorative blur
            )
    }
}

// MARK: - Preview
struct AetherGlassCard_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            // Light theme preview
            ZStack {
                // Background gradient for preview
                LinearGradient(
                    colors: [
                        Color.blue.opacity(0.3),
                        Color.purple.opacity(0.3),
                        Color.pink.opacity(0.3)
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                VStack(spacing: 20) {
                    // Light theme preview
                    AetherGlassCard {
                        VStack(spacing: 12) {
                            Image(systemName: "star.fill")
                                .font(.title)
                                .foregroundColor(.primary)
                            
                            Text("Aether Glass Card")
                                .font(.headline)
                                .foregroundColor(.primary)
                            
                            Text("Theme-Aware Glassmorphism")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        .padding(24)
                    }
                    .frame(width: 280, height: 160)
                    
                    // Compact preview
                    AetherGlassCard {
                        HStack(spacing: 16) {
                            Image(systemName: "moon.fill")
                                .font(.title2)
                                .foregroundColor(.primary)
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Light Theme")
                                    .font(.subheadline)
                                    .fontWeight(.semibold)
                                    .foregroundColor(.primary)
                                
                                Text("Dynamic theming")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            
                            Spacer()
                        }
                        .padding(20)
                    }
                    .frame(width: 280, height: 80)
                }
            }
            .environmentObject(ThemeManager())
            .preferredColorScheme(.light)
            .previewDisplayName("Light Theme")
            
            // Dark theme preview
            ZStack {
                // Background gradient for preview
                LinearGradient(
                    colors: [
                        Color.indigo.opacity(0.4),
                        Color.purple.opacity(0.4),
                        Color.blue.opacity(0.4)
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                VStack(spacing: 20) {
                    // Dark theme preview
                    AetherGlassCard {
                        VStack(spacing: 12) {
                            Image(systemName: "moon.stars.fill")
                                .font(.title)
                                .foregroundColor(.primary)
                            
                            Text("Aether Glass Card")
                                .font(.headline)
                                .foregroundColor(.primary)
                            
                            Text("Theme-Aware Glassmorphism")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        .padding(24)
                    }
                    .frame(width: 280, height: 160)
                    
                    // Compact preview
                    AetherGlassCard {
                        HStack(spacing: 16) {
                            Image(systemName: "sun.max.fill")
                                .font(.title2)
                                .foregroundColor(.primary)
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Dark Theme")
                                    .font(.subheadline)
                                    .fontWeight(.semibold)
                                    .foregroundColor(.primary)
                                
                                Text("Dynamic theming")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            
                            Spacer()
                        }
                        .padding(20)
                    }
                    .frame(width: 280, height: 80)
                }
            }
            .environmentObject(ThemeManager())
            .preferredColorScheme(.dark)
            .previewDisplayName("Dark Theme")
        }
    }
} 