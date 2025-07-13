//
//  InteractiveThemeFeedback.swift
//  Aether SwiftUI App
//
//  Interactive user feedback system for theme creation with real-time accessibility validation.
//  Provides immediate, clear, and actionable feedback when users select inaccessible color combinations.
//

import SwiftUI
import Combine

// MARK: - Feedback Types

enum FeedbackType {
    case success
    case warning
    case error
    case info
    
    var icon: String {
        switch self {
        case .success: return "checkmark.circle.fill"
        case .warning: return "exclamationmark.triangle.fill"
        case .error: return "xmark.circle.fill"
        case .info: return "info.circle.fill"
        }
    }
    
    var color: Color {
        switch self {
        case .success: return .green
        case .warning: return .orange
        case .error: return .red
        case .info: return .blue
        }
    }
}

// MARK: - Feedback Message

struct FeedbackMessage: Identifiable {
    let id = UUID()
    let type: FeedbackType
    let title: String
    let message: String
    let suggestion: String?
    let timestamp: Date
    
    init(type: FeedbackType, title: String, message: String, suggestion: String? = nil) {
        self.type = type
        self.title = title
        self.message = message
        self.suggestion = suggestion
        self.timestamp = Date()
    }
}

// MARK: - Interactive Feedback Manager

class InteractiveFeedbackManager: ObservableObject {
    @Published var currentFeedback: FeedbackMessage?
    @Published var feedbackHistory: [FeedbackMessage] = []
    @Published var isValidationInProgress = false
    
    private let accessibilityValidator = AccessibilityValidator()
    private var feedbackTimer: Timer?
    
    // MARK: - Real-time Validation
    
    func validateColorCombination(foreground: String, background: String, elementType: String = "text") {
        isValidationInProgress = true
        
        // Cancel previous timer
        feedbackTimer?.invalidate()
        
        // Debounce validation to avoid excessive processing
        feedbackTimer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: false) { _ in
            self.performValidation(foreground: foreground, background: background, elementType: elementType)
        }
    }
    
    private func performValidation(foreground: String, background: String, elementType: String) {
        guard let contrastRatio = ColorUtilities.calculateContrastRatio(color1: foreground, color2: background) else {
            showFeedback(
                type: .error,
                title: "Invalid Color Format",
                message: "Unable to parse one or both colors. Please use valid hex, RGB, or named colors.",
                suggestion: "Try using hex format like #FF0000 or named colors like 'red'"
            )
            isValidationInProgress = false
            return
        }
        
        let requiredRatio = elementType.contains("large") ? 3.0 : 4.5
        let passed = contrastRatio >= requiredRatio
        
        if passed {
            showFeedback(
                type: .success,
                title: "Excellent Contrast!",
                message: "This color combination meets WCAG AA standards with a contrast ratio of \(String(format: "%.2f", contrastRatio)):1",
                suggestion: "This combination is accessible for most users"
            )
        } else {
            let severity = contrastRatio < 2.0 ? FeedbackType.error : FeedbackType.warning
            let title = severity == .error ? "Critical Contrast Issue" : "Low Contrast Warning"
            
            showFeedback(
                type: severity,
                title: title,
                message: "This combination has insufficient contrast (\(String(format: "%.2f", contrastRatio)):1). WCAG AA requires \(String(format: "%.1f", requiredRatio)):1 for \(elementType).",
                suggestion: generateContrastSuggestion(foreground: foreground, background: background, currentRatio: contrastRatio, requiredRatio: requiredRatio)
            )
        }
        
        isValidationInProgress = false
    }
    
    private func generateContrastSuggestion(foreground: String, background: String, currentRatio: Double, requiredRatio: Double) -> String {
        let ratio = currentRatio
        let target = requiredRatio
        
        if ratio < 2.0 {
            return "Consider using a much darker or lighter color. Try black/white or high-contrast alternatives."
        } else if ratio < 3.0 {
            return "Try adjusting the brightness or using a more contrasting color variant."
        } else {
            return "A small adjustment to either color should achieve the required contrast ratio."
        }
    }
    
    // MARK: - Feedback Display
    
    private func showFeedback(type: FeedbackType, title: String, message: String, suggestion: String?) {
        let feedback = FeedbackMessage(type: type, title: title, message: message, suggestion: suggestion)
        
        DispatchQueue.main.async {
            self.currentFeedback = feedback
            self.feedbackHistory.append(feedback)
            
            // Auto-dismiss success messages after 3 seconds
            if type == .success {
                DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
                    if self.currentFeedback?.id == feedback.id {
                        self.currentFeedback = nil
                    }
                }
            }
        }
    }
    
    func dismissCurrentFeedback() {
        currentFeedback = nil
    }
    
    func clearHistory() {
        feedbackHistory.removeAll()
    }
}

// MARK: - Interactive Feedback View

struct InteractiveFeedbackView: View {
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        VStack(spacing: 16) {
            // Current feedback display
            if let feedback = feedbackManager.currentFeedback {
                FeedbackCard(feedback: feedback) {
                    feedbackManager.dismissCurrentFeedback()
                }
            }
            
            // Feedback history
            if !feedbackManager.feedbackHistory.isEmpty {
                FeedbackHistoryView(feedbackManager: feedbackManager)
            }
        }
    }
}

// MARK: - Feedback Card

struct FeedbackCard: View {
    let feedback: FeedbackMessage
    let onDismiss: () -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: feedback.type.icon)
                    .foregroundColor(feedback.type.color)
                    .font(.title2)
                
                Text(feedback.title)
                    .font(.headline)
                    .foregroundColor(.primary)
                
                Spacer()
                
                Button(action: onDismiss) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.secondary)
                        .font(.title3)
                }
            }
            
            Text(feedback.message)
                .font(.body)
                .foregroundColor(.primary)
            
            if let suggestion = feedback.suggestion {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Suggestion:")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(.secondary)
                    
                    Text(suggestion)
                        .font(.subheadline)
                        .foregroundColor(.primary)
                        .padding(.leading, 8)
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(feedback.type.color.opacity(0.3), lineWidth: 1)
        )
    }
}

// MARK: - Feedback History View

struct FeedbackHistoryView: View {
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Feedback History")
                    .font(.headline)
                    .foregroundColor(.primary)
                
                Spacer()
                
                Button("Clear") {
                    feedbackManager.clearHistory()
                }
                .font(.subheadline)
                .foregroundColor(.blue)
            }
            
            LazyVStack(spacing: 8) {
                ForEach(feedbackManager.feedbackHistory.suffix(5)) { feedback in
                    FeedbackHistoryItem(feedback: feedback)
                }
            }
        }
    }
}

// MARK: - Feedback History Item

struct FeedbackHistoryItem: View {
    let feedback: FeedbackMessage
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: feedback.type.icon)
                .foregroundColor(feedback.type.color)
                .font(.caption)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(feedback.title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.primary)
                
                Text(feedback.message)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }
            
            Spacer()
            
            Text(feedback.timestamp, style: .time)
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}

// MARK: - Interactive Color Picker

struct InteractiveColorPicker: View {
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    @Binding var selectedColor: String
    let title: String
    let description: String
    let testBackground: String
    
    @State private var showingColorPicker = false
    @State private var tempColor: String = ""
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.headline)
                        .foregroundColor(.primary)
                    
                    Text(description)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                // Color preview with contrast test
                VStack(spacing: 4) {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color(hex: selectedColor) ?? .gray)
                        .frame(width: 40, height: 40)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.primary.opacity(0.2), lineWidth: 1)
                        )
                    
                    if feedbackManager.isValidationInProgress {
                        ProgressView()
                            .scaleEffect(0.7)
                    }
                }
            }
            
            // Contrast preview
            ContrastPreviewCard(
                foreground: selectedColor,
                background: testBackground,
                title: title
            )
            
            // Color picker button
            Button(action: {
                tempColor = selectedColor
                showingColorPicker = true
            }) {
                HStack {
                    Image(systemName: "eyedropper")
                    Text("Choose Color")
                }
                .font(.subheadline)
                .foregroundColor(.blue)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(Color.blue.opacity(0.1))
                .cornerRadius(8)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
        .onChange(of: selectedColor) { newColor in
            feedbackManager.validateColorCombination(
                foreground: newColor,
                background: testBackground,
                elementType: title.lowercased()
            )
        }
        .sheet(isPresented: $showingColorPicker) {
            ColorPickerSheet(
                selectedColor: $tempColor,
                onConfirm: {
                    selectedColor = tempColor
                    showingColorPicker = false
                },
                onCancel: {
                    showingColorPicker = false
                }
            )
        }
    }
}

// MARK: - Contrast Preview Card

struct ContrastPreviewCard: View {
    let foreground: String
    let background: String
    let title: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Preview")
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.secondary)
            
            HStack {
                RoundedRectangle(cornerRadius: 6)
                    .fill(Color(hex: background) ?? .gray)
                    .frame(height: 40)
                    .overlay(
                        Text("Sample \(title)")
                            .font(.subheadline)
                            .foregroundColor(Color(hex: foreground) ?? .primary)
                    )
                
                Spacer()
                
                if let ratio = ColorUtilities.calculateContrastRatio(color1: foreground, color2: background) {
                    VStack(alignment: .trailing, spacing: 2) {
                        Text("\(String(format: "%.2f", ratio)):1")
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(ratio >= 4.5 ? .green : ratio >= 3.0 ? .orange : .red)
                        
                        Text("Contrast")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }
            }
        }
    }
}

// MARK: - Color Picker Sheet

struct ColorPickerSheet: View {
    @Binding var selectedColor: String
    let onConfirm: () -> Void
    let onCancel: () -> Void
    
    @State private var colorInput = ""
    @State private var showingPresetColors = false
    
    private let presetColors = [
        "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
        "#FFFF00", "#FF00FF", "#00FFFF", "#808080", "#C0C0C0",
        "#800000", "#808000", "#008000", "#800080", "#008080",
        "#000080", "#FFA500", "#FFC0CB", "#A52A2A", "#FFD700"
    ]
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // Color preview
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(hex: selectedColor) ?? .gray)
                    .frame(height: 100)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.primary.opacity(0.2), lineWidth: 1)
                    )
                
                // Color input
                VStack(alignment: .leading, spacing: 8) {
                    Text("Color Value")
                        .font(.headline)
                    
                    TextField("Enter hex, RGB, or named color", text: $colorInput)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .onChange(of: colorInput) { newValue in
                            selectedColor = newValue
                        }
                        .onAppear {
                            colorInput = selectedColor
                        }
                }
                
                // Preset colors
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("Preset Colors")
                            .font(.headline)
                        
                        Spacer()
                        
                        Button("Show/Hide") {
                            showingPresetColors.toggle()
                        }
                        .font(.subheadline)
                        .foregroundColor(.blue)
                    }
                    
                    if showingPresetColors {
                        LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 5), spacing: 8) {
                            ForEach(presetColors, id: \.self) { color in
                                Button(action: {
                                    selectedColor = color
                                    colorInput = color
                                }) {
                                    RoundedRectangle(cornerRadius: 6)
                                        .fill(Color(hex: color) ?? .gray)
                                        .frame(height: 30)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 6)
                                                .stroke(selectedColor == color ? Color.blue : Color.clear, lineWidth: 2)
                                        )
                                }
                            }
                        }
                    }
                }
                
                Spacer()
            }
            .padding()
            .navigationTitle("Choose Color")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel", action: onCancel)
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Confirm", action: onConfirm)
                        .fontWeight(.semibold)
                }
            }
        }
    }
}

// MARK: - Color Extension

extension Color {
    init?(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            return nil
        }
        
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Preview

struct InteractiveThemeFeedback_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            InteractiveFeedbackView(feedbackManager: InteractiveFeedbackManager())
            
            InteractiveColorPicker(
                feedbackManager: InteractiveFeedbackManager(),
                selectedColor: .constant("#FF0000"),
                title: "Primary Text",
                description: "Main text color",
                testBackground: "#FFFFFF"
            )
        }
        .padding()
    }
} 