//
//  CustomViewTransitions.swift
//  Aether SwiftUI App
//
//  Sophisticated custom view transitions with asymmetric animations and
//  transition container views for complex, overlapping theme transitions.
//

import SwiftUI
import Combine

// MARK: - Transition Container View

/// Container view that can host both "from" and "to" view states simultaneously
/// for complex, overlapping animations during theme transitions
struct TransitionContainerView<FromView: View, ToView: View>: View {
    let fromView: FromView
    let toView: ToView
    let transitionProgress: Double
    let transitionType: CustomTransitionType
    let isTransitioning: Bool
    
    @State private var fromViewOpacity: Double = 1.0
    @State private var toViewOpacity: Double = 0.0
    @State private var fromViewOffset: CGSize = .zero
    @State private var toViewOffset: CGSize = .zero
    @State private var fromViewScale: CGFloat = 1.0
    @State private var toViewScale: CGFloat = 1.0
    @State private var fromViewRotation: Double = 0.0
    @State private var toViewRotation: Double = 0.0
    
    init(
        fromView: FromView,
        toView: ToView,
        transitionProgress: Double,
        transitionType: CustomTransitionType,
        isTransitioning: Bool
    ) {
        self.fromView = fromView
        self.toView = toView
        self.transitionProgress = transitionProgress
        self.transitionType = transitionType
        self.isTransitioning = isTransitioning
    }
    
    var body: some View {
        ZStack {
            // From view (outgoing)
            fromView
                .opacity(fromViewOpacity)
                .offset(fromViewOffset)
                .scaleEffect(fromViewScale)
                .rotationEffect(.degrees(fromViewRotation))
                .blur(radius: fromViewBlurRadius)
                .animation(.easeInOut(duration: 0.6), value: transitionProgress)
            
            // To view (incoming)
            toView
                .opacity(toViewOpacity)
                .offset(toViewOffset)
                .scaleEffect(toViewScale)
                .rotationEffect(.degrees(toViewRotation))
                .blur(radius: toViewBlurRadius)
                .animation(.easeInOut(duration: 0.6), value: transitionProgress)
        }
        .onChange(of: transitionProgress) { newProgress in
            updateTransitionState(progress: newProgress)
        }
        .onAppear {
            setupInitialState()
        }
    }
    
    // MARK: - Private Methods
    
    private func setupInitialState() {
        switch transitionType {
        case .slideInOut:
            fromViewOffset = .zero
            toViewOffset = CGSize(width: 300, height: 0)
            fromViewOpacity = 1.0
            toViewOpacity = 0.0
        case .scaleRotate:
            fromViewScale = 1.0
            toViewScale = 0.5
            fromViewRotation = 0.0
            toViewRotation = 180.0
        case .morphBlur:
            fromViewOpacity = 1.0
            toViewOpacity = 0.0
            fromViewScale = 1.0
            toViewScale = 0.8
        case .crossfadeOverlap:
            fromViewOpacity = 1.0
            toViewOpacity = 0.0
            fromViewOffset = .zero
            toViewOffset = CGSize(width: 50, height: 0)
        case .dissolveParticle:
            fromViewOpacity = 1.0
            toViewOpacity = 0.0
            fromViewScale = 1.0
            toViewScale = 1.2
        case .flipCard:
            fromViewRotation = 0.0
            toViewRotation = 90.0
            fromViewOpacity = 1.0
            toViewOpacity = 0.0
        }
    }
    
    private func updateTransitionState(progress: Double) {
        switch transitionType {
        case .slideInOut:
            fromViewOffset = CGSize(width: -300 * progress, height: 0)
            toViewOffset = CGSize(width: 300 * (1 - progress), height: 0)
            fromViewOpacity = 1.0 - progress
            toViewOpacity = progress
            
        case .scaleRotate:
            fromViewScale = 1.0 - (0.3 * progress)
            toViewScale = 0.5 + (0.5 * progress)
            fromViewRotation = progress * 90
            toViewRotation = 180 - (90 * progress)
            fromViewOpacity = 1.0 - progress
            toViewOpacity = progress
            
        case .morphBlur:
            fromViewOpacity = 1.0 - progress
            toViewOpacity = progress
            fromViewScale = 1.0 - (0.1 * progress)
            toViewScale = 0.8 + (0.2 * progress)
            
        case .crossfadeOverlap:
            fromViewOpacity = 1.0 - (progress * 0.7)
            toViewOpacity = progress
            fromViewOffset = CGSize(width: -50 * progress, height: 0)
            toViewOffset = CGSize(width: 50 * (1 - progress), height: 0)
            
        case .dissolveParticle:
            fromViewOpacity = 1.0 - progress
            toViewOpacity = progress
            fromViewScale = 1.0 + (0.2 * progress)
            toViewScale = 1.2 - (0.2 * progress)
            
        case .flipCard:
            if progress < 0.5 {
                fromViewRotation = progress * 90
                toViewRotation = 90
                fromViewOpacity = 1.0
                toViewOpacity = 0.0
            } else {
                fromViewRotation = 90
                toViewRotation = 90 - ((progress - 0.5) * 90)
                fromViewOpacity = 0.0
                toViewOpacity = 1.0
            }
        }
    }
    
    private var fromViewBlurRadius: CGFloat {
        switch transitionType {
        case .morphBlur:
            return 2.0 * transitionProgress
        case .crossfadeOverlap:
            return 1.0 * transitionProgress
        default:
            return 0.0
        }
    }
    
    private var toViewBlurRadius: CGFloat {
        switch transitionType {
        case .morphBlur:
            return 2.0 * (1 - transitionProgress)
        case .crossfadeOverlap:
            return 1.0 * (1 - transitionProgress)
        default:
            return 0.0
        }
    }
}

// MARK: - Custom Transition Types

/// Sophisticated custom transition types with asymmetric behaviors
enum CustomTransitionType: String, CaseIterable {
    case slideInOut = "Slide In/Out"
    case scaleRotate = "Scale & Rotate"
    case morphBlur = "Morph & Blur"
    case crossfadeOverlap = "Crossfade Overlap"
    case dissolveParticle = "Dissolve Particle"
    case flipCard = "Flip Card"
    
    var description: String {
        switch self {
        case .slideInOut:
            return "Asymmetric slide with fade"
        case .scaleRotate:
            return "Scale and rotation combination"
        case .morphBlur:
            return "Morphing with blur effects"
        case .crossfadeOverlap:
            return "Overlapping crossfade"
        case .dissolveParticle:
            return "Particle-like dissolve"
        case .flipCard:
            return "3D card flip effect"
        }
    }
    
    var duration: Double {
        switch self {
        case .slideInOut: return 0.8
        case .scaleRotate: return 1.0
        case .morphBlur: return 0.9
        case .crossfadeOverlap: return 0.7
        case .dissolveParticle: return 0.6
        case .flipCard: return 1.2
        }
    }
}

// MARK: - Custom AnyTransition Extensions

extension AnyTransition {
    /// Custom asymmetric transition for theme switching
    static func customThemeTransition(
        type: CustomTransitionType,
        progress: Double
    ) -> AnyTransition {
        switch type {
        case .slideInOut:
            return .asymmetric(
                insertion: .move(edge: .trailing).combined(with: .opacity),
                removal: .move(edge: .leading).combined(with: .opacity)
            )
        case .scaleRotate:
            return .asymmetric(
                insertion: .scale(scale: 0.5).combined(with: .rotation(.degrees(180))),
                removal: .scale(scale: 1.5).combined(with: .rotation(.degrees(-90)))
            )
        case .morphBlur:
            return .asymmetric(
                insertion: .scale(scale: 0.8).combined(with: .blur(radius: 2)),
                removal: .scale(scale: 1.2).combined(with: .blur(radius: 4))
            )
        case .crossfadeOverlap:
            return .asymmetric(
                insertion: .move(edge: .trailing).combined(with: .opacity),
                removal: .move(edge: .leading).combined(with: .opacity)
            )
        case .dissolveParticle:
            return .asymmetric(
                insertion: .scale(scale: 1.2).combined(with: .opacity),
                removal: .scale(scale: 0.8).combined(with: .opacity)
            )
        case .flipCard:
            return .asymmetric(
                insertion: .rotation3D(angle: .degrees(90), axis: (x: 0, y: 1, z: 0)),
                removal: .rotation3D(angle: .degrees(-90), axis: (x: 0, y: 1, z: 0))
            )
        }
    }
    
    /// 3D rotation transition
    static func rotation3D(
        angle: Angle,
        axis: (x: Double, y: Double, z: Double)
    ) -> AnyTransition {
        return .modifier(
            active: Rotation3DModifier(angle: angle, axis: axis),
            identity: Rotation3DModifier(angle: .zero, axis: axis)
        )
    }
}

// MARK: - 3D Rotation Modifier

/// Custom modifier for 3D rotation effects
struct Rotation3DModifier: ViewModifier {
    let angle: Angle
    let axis: (x: Double, y: Double, z: Double)
    
    func body(content: Content) -> some View {
        content
            .rotation3DEffect(angle, axis: axis)
    }
}

// MARK: - Advanced Transition Manager

/// Advanced manager for handling sophisticated custom transitions
class AdvancedTransitionManager: ObservableObject {
    @Published var transitionProgress: Double = 0.0
    @Published var isTransitioning = false
    @Published var currentTransitionType: CustomTransitionType = .slideInOut
    @Published var fromTheme: Theme?
    @Published var toTheme: Theme?
    
    private var animationTimer: Timer?
    private var cancellables = Set<AnyCancellable>()
    
    // MARK: - Public Methods
    
    /// Perform a sophisticated custom transition
    func performCustomTransition(
        from theme: Theme,
        to newTheme: Theme,
        type: CustomTransitionType,
        completion: @escaping () -> Void
    ) {
        guard !isTransitioning else { return }
        
        fromTheme = theme
        toTheme = newTheme
        currentTransitionType = type
        isTransitioning = true
        transitionProgress = 0.0
        
        // Start animation timer
        let duration = type.duration
        let steps = 60 // 60fps
        let stepDuration = duration / Double(steps)
        
        animationTimer = Timer.scheduledTimer(withTimeInterval: stepDuration, repeats: true) { [weak self] timer in
            guard let self = self else {
                timer.invalidate()
                return
            }
            
            self.transitionProgress += 1.0 / Double(steps)
            
            if self.transitionProgress >= 1.0 {
                self.completeTransition(completion: completion)
                timer.invalidate()
            }
        }
    }
    
    /// Create a transition container view
    func createTransitionContainer<FromView: View, ToView: View>(
        fromView: FromView,
        toView: ToView
    ) -> TransitionContainerView<FromView, ToView> {
        return TransitionContainerView(
            fromView: fromView,
            toView: toView,
            transitionProgress: transitionProgress,
            transitionType: currentTransitionType,
            isTransitioning: isTransitioning
        )
    }
    
    // MARK: - Private Methods
    
    private func completeTransition(completion: @escaping () -> Void) {
        withAnimation(.easeOut(duration: 0.2)) {
            isTransitioning = false
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            self.transitionProgress = 0.0
            self.fromTheme = nil
            self.toTheme = nil
            completion()
        }
    }
}

// MARK: - Transition Preview Components

/// Preview component for demonstrating custom transitions
struct TransitionPreviewCard: View {
    let theme: Theme
    let title: String
    let subtitle: String
    
    var body: some View {
        VStack(spacing: 16) {
            // Header
            HStack {
                Circle()
                    .fill(Color(theme.primary))
                    .frame(width: 40, height: 40)
                
                VStack(alignment: .leading) {
                    Text(title)
                        .font(.headline)
                        .foregroundColor(Color(theme.textPrimary))
                    
                    Text(subtitle)
                        .font(.caption)
                        .foregroundColor(Color(theme.textSecondary))
                }
                
                Spacer()
                
                Button("Action") {
                    // Demo action
                }
                .buttonStyle(.borderedProminent)
                .tint(Color(theme.primary))
            }
            
            Divider()
                .background(Color(theme.border))
            
            // Content
            HStack {
                VStack(alignment: .leading, spacing: 8) {
                    Label("Primary Color", systemImage: "circle.fill")
                        .foregroundColor(Color(theme.primary))
                    
                    Label("Secondary Color", systemImage: "circle.fill")
                        .foregroundColor(Color(theme.secondary))
                    
                    Label("Success Color", systemImage: "checkmark.circle.fill")
                        .foregroundColor(Color(theme.success))
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 8) {
                    Text("Sample Text")
                        .font(.caption)
                        .foregroundColor(Color(theme.textPrimary))
                    
                    Text("Secondary Text")
                        .font(.caption2)
                        .foregroundColor(Color(theme.textSecondary))
                }
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color(theme.surface))
                .shadow(color: Color(theme.shadow), radius: 4, x: 0, y: 2)
        )
    }
}

// MARK: - View Extensions

extension View {
    /// Apply custom theme transition
    func customThemeTransition(
        _ type: CustomTransitionType,
        progress: Double
    ) -> some View {
        self.transition(.customThemeTransition(type: type, progress: progress))
    }
    
    /// Apply 3D rotation effect
    func rotation3D(
        _ angle: Angle,
        axis: (x: Double, y: Double, z: Double) = (0, 1, 0)
    ) -> some View {
        self.rotation3DEffect(angle, axis: axis)
    }
}

// MARK: - Environment Values

private struct AdvancedTransitionManagerKey: EnvironmentKey {
    static let defaultValue: AdvancedTransitionManager? = nil
}

extension EnvironmentValues {
    var advancedTransitionManager: AdvancedTransitionManager? {
        get { self[AdvancedTransitionManagerKey.self] }
        set { self[AdvancedTransitionManagerKey.self] = newValue }
    }
}

// MARK: - View Modifier

struct AdvancedTransitionManagerModifier: ViewModifier {
    let transitionManager: AdvancedTransitionManager
    
    func body(content: Content) -> some View {
        content.environment(\.advancedTransitionManager, transitionManager)
    }
}

extension View {
    func advancedTransitionManager(_ transitionManager: AdvancedTransitionManager) -> some View {
        modifier(AdvancedTransitionManagerModifier(transitionManager: transitionManager))
    }
} 