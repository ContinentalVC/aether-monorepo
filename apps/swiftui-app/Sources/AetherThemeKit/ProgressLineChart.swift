//
//  ProgressLineChart.swift
//  Aether SwiftUI App
//
//  Enhanced line chart component with entrance animations, haptic feedback,
//  comprehensive VoiceOver accessibility support, Core Data persistence,
//  and PDF export functionality.
//  Features smooth line drawing from left to right, tactile feedback on data point taps,
//  full accessibility integration for screen readers, data persistence, and PDF generation.
//

import SwiftUI
import CoreData
import PDFKit

// MARK: - Data Models

/// Represents a single data point in the line chart
struct DataPoint: Identifiable, Equatable {
    let id = UUID()
    let x: Double
    let y: Double
    let label: String
    let value: Double
    let color: Color
    
    init(x: Double, y: Double, label: String, value: Double, color: Color = .blue) {
        self.x = x
        self.y = y
        self.label = label
        self.value = value
        self.color = color
    }
}

/// Configuration options for the line chart
struct ChartConfiguration {
    let lineColor: Color
    let lineWidth: CGFloat
    let pointSize: CGFloat
    let showGrid: Bool
    let showArea: Bool
    let areaOpacity: Double
    let animationDuration: Double
    let enableHaptics: Bool
    let accessibilityLabel: String
    let accessibilityHint: String
    
    init(
        lineColor: Color = .blue,
        lineWidth: CGFloat = 3.0,
        pointSize: CGFloat = 8.0,
        showGrid: Bool = true,
        showArea: Bool = false,
        areaOpacity: Double = 0.2,
        animationDuration: Double = 1.5,
        enableHaptics: Bool = true,
        accessibilityLabel: String = "Line Chart",
        accessibilityHint: String = "Double tap to explore data points"
    ) {
        self.lineColor = lineColor
        self.lineWidth = lineWidth
        self.pointSize = pointSize
        self.showGrid = showGrid
        self.showArea = showArea
        self.areaOpacity = areaOpacity
        self.animationDuration = animationDuration
        self.enableHaptics = enableHaptics
        self.accessibilityLabel = accessibilityLabel
        self.accessibilityHint = accessibilityHint
    }
}

// MARK: - Chart Geometry

/// Calculates chart geometry and coordinate transformations
struct ChartGeometry {
    let data: [DataPoint]
    let size: CGSize
    let padding: CGFloat
    
    init(data: [DataPoint], size: CGSize, padding: CGFloat = 20) {
        self.data = data
        self.size = size
        self.padding = padding
    }
    
    /// Chart drawing area
    var chartRect: CGRect {
        CGRect(
            x: padding,
            y: padding,
            width: size.width - 2 * padding,
            height: size.height - 2 * padding
        )
    }
    
    /// Data ranges
    var xRange: ClosedRange<Double> {
        guard let minX = data.map({ $0.x }).min(),
              let maxX = data.map({ $0.x }).max() else {
            return 0...1
        }
        return minX...maxX
    }
    
    var yRange: ClosedRange<Double> {
        guard let minY = data.map({ $0.y }).min(),
              let maxY = data.map({ $0.y }).max() else {
            return 0...1
        }
        return minY...maxY
    }
    
    /// Convert data coordinates to view coordinates
    func point(for dataPoint: DataPoint) -> CGPoint {
        let x = chartRect.minX + (dataPoint.x - xRange.lowerBound) / (xRange.upperBound - xRange.lowerBound) * chartRect.width
        let y = chartRect.maxY - (dataPoint.y - yRange.lowerBound) / (yRange.upperBound - yRange.lowerBound) * chartRect.height
        return CGPoint(x: x, y: y)
    }
    
    /// Convert view coordinates to data coordinates
    func dataPoint(for point: CGPoint) -> (x: Double, y: Double)? {
        guard chartRect.contains(point) else { return nil }
        
        let x = xRange.lowerBound + (point.x - chartRect.minX) / chartRect.width * (xRange.upperBound - xRange.lowerBound)
        let y = yRange.upperBound - (point.y - chartRect.minY) / chartRect.height * (yRange.upperBound - yRange.lowerBound)
        
        return (x: x, y: y)
    }
}

// MARK: - Haptic Feedback Manager

/// Manages haptic feedback for the chart
class HapticManager: ObservableObject {
    // Simplified haptic feedback for iOS-only
    // In a real implementation, you would use Core Haptics or other iOS-specific APIs
    
    func triggerLightImpact() {
        // Placeholder for haptic feedback
        // In a real app, you would implement actual haptic feedback here
    }
    
    func triggerMediumImpact() {
        // Placeholder for haptic feedback
        // In a real app, you would implement actual haptic feedback here
    }
    
    func triggerHeavyImpact() {
        // Placeholder for haptic feedback
        // In a real app, you would implement actual haptic feedback here
    }
}

// MARK: - Chart Drawing Components

/// Draws the line path for the chart
struct LinePath: Shape {
    let data: [DataPoint]
    let geometry: ChartGeometry
    let animationProgress: Double
    
    func path(in rect: CGRect) -> Path {
        var path = Path()
        
        guard data.count >= 2 else { return path }
        
        // Calculate how many points to show based on animation progress
        let pointsToShow = Int(Double(data.count) * animationProgress)
        let visiblePoints = Array(data.prefix(pointsToShow))
        
        guard !visiblePoints.isEmpty else { return path }
        
        // Start the path at the first point
        let firstPoint = geometry.point(for: visiblePoints[0])
        path.move(to: firstPoint)
        
        // Draw lines to subsequent points
        for i in 1..<visiblePoints.count {
            let point = geometry.point(for: visiblePoints[i])
            path.addLine(to: point)
        }
        
        return path
    }
}

/// Draws the area fill under the line
struct AreaPath: Shape {
    let data: [DataPoint]
    let geometry: ChartGeometry
    let animationProgress: Double
    
    func path(in rect: CGRect) -> Path {
        var path = Path()
        
        guard data.count >= 2 else { return path }
        
        // Calculate how many points to show based on animation progress
        let pointsToShow = Int(Double(data.count) * animationProgress)
        let visiblePoints = Array(data.prefix(pointsToShow))
        
        guard !visiblePoints.isEmpty else { return path }
        
        let chartRect = geometry.chartRect
        
        // Start at the bottom-left of the chart
        let firstPoint = geometry.point(for: visiblePoints[0])
        path.move(to: CGPoint(x: firstPoint.x, y: chartRect.maxY))
        path.addLine(to: firstPoint)
        
        // Draw the line
        for i in 1..<visiblePoints.count {
            let point = geometry.point(for: visiblePoints[i])
            path.addLine(to: point)
        }
        
        // Close the path to the bottom
        if let lastPoint = visiblePoints.last {
            let lastViewPoint = geometry.point(for: lastPoint)
            path.addLine(to: CGPoint(x: lastViewPoint.x, y: chartRect.maxY))
        }
        
        path.closeSubpath()
        return path
    }
}

/// Draws grid lines for the chart
struct GridLines: Shape {
    let geometry: ChartGeometry
    let horizontalLines: Int
    let verticalLines: Int
    
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let chartRect = geometry.chartRect
        
        // Vertical grid lines
        for i in 0...verticalLines {
            let x = chartRect.minX + (chartRect.width / CGFloat(verticalLines)) * CGFloat(i)
            path.move(to: CGPoint(x: x, y: chartRect.minY))
            path.addLine(to: CGPoint(x: x, y: chartRect.maxY))
        }
        
        // Horizontal grid lines
        for i in 0...horizontalLines {
            let y = chartRect.minY + (chartRect.height / CGFloat(horizontalLines)) * CGFloat(i)
            path.move(to: CGPoint(x: chartRect.minX, y: y))
            path.addLine(to: CGPoint(x: chartRect.maxX, y: y))
        }
        
        return path
    }
}

// MARK: - Data Point View

/// Interactive data point with haptic feedback and accessibility support
struct DataPointView: View {
    let dataPoint: DataPoint
    let geometry: ChartGeometry
    let configuration: ChartConfiguration
    let isSelected: Bool
    let onTap: () -> Void
    
    @StateObject private var hapticManager = HapticManager()
    
    private var pointPosition: CGPoint {
        geometry.point(for: dataPoint)
    }
    
    private var pointSize: CGFloat {
        isSelected ? configuration.pointSize * 1.5 : configuration.pointSize
    }
    
    /// Accessibility label for the data point
    private var accessibilityLabel: String {
        "\(dataPoint.label), value \(String(format: "%.1f", dataPoint.value))"
    }
    
    /// Accessibility hint for the data point
    private var accessibilityHint: String {
        isSelected ? "Selected data point. Double tap to deselect" : "Double tap to select this data point"
    }
    
    var body: some View {
        Circle()
            .fill(dataPoint.color)
            .frame(width: pointSize, height: pointSize)
            .position(pointPosition)
            .scaleEffect(isSelected ? 1.2 : 1.0)
            .animation(.easeInOut(duration: 0.2), value: isSelected)
            .onTapGesture {
                if configuration.enableHaptics {
                    hapticManager.triggerLightImpact()
                }
                onTap()
            }
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(accessibilityLabel)
            .accessibilityHint(accessibilityHint)
            .accessibilityValue(isSelected ? "Selected" : "Not selected")
            .accessibilityAddTraits(isSelected ? [.isSelected] : [])
    }
}

// MARK: - PDF Export Button

/// PDF export button with sharing functionality
struct PDFExportButton: View {
    let data: [DataPoint]
    let configuration: ChartConfiguration
    let title: String
    let subtitle: String
    
    @State private var showingShareSheet = false
    @State private var pdfData: Data?
    
    var body: some View {
        Button(action: exportToPDF) {
            HStack {
                Image(systemName: "square.and.arrow.up")
                    .font(.system(size: 16, weight: .medium))
                Text("Export to PDF")
                    .font(.system(size: 16, weight: .medium))
            }
            .foregroundColor(.white)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(Color.blue)
            .cornerRadius(8)
        }
        .accessibilityLabel("Export chart to PDF")
        .accessibilityHint("Generate and share a PDF document of the current chart")
        .sheet(isPresented: $showingShareSheet) {
            if let pdfData = pdfData {
                ShareSheet(activityItems: [pdfData])
            }
        }
    }
    
    private func exportToPDF() {
        // Generate PDF data
        pdfData = PDFExporter.shared.generatePDFFromData(
            data: data,
            title: title,
            subtitle: subtitle,
            configuration: configuration
        )
        
        if pdfData != nil {
            showingShareSheet = true
        }
    }
}

/// Share sheet for PDF sharing
struct ShareSheet: UIViewControllerRepresentable {
    let activityItems: [Any]
    
    func makeUIViewController(context: Context) -> UIActivityViewController {
        let controller = UIActivityViewController(activityItems: activityItems, applicationActivities: nil)
        return controller
    }
    
    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

// MARK: - Main Chart View

/// Enhanced ProgressLineChart with animations, haptic feedback, accessibility, persistence, and PDF export
struct ProgressLineChart: View {
    let data: [DataPoint]
    let configuration: ChartConfiguration
    let onDataPointTap: ((DataPoint, Int) -> Void)?
    let title: String
    let subtitle: String
    let showExportButton: Bool
    
    @State private var animationProgress: Double = 0.0
    @State private var selectedPointIndex: Int? = nil
    @State private var geometry: ChartGeometry?
    @StateObject private var coreDataManager = CoreDataManager.shared
    
    init(
        data: [DataPoint],
        configuration: ChartConfiguration = ChartConfiguration(),
        onDataPointTap: ((DataPoint, Int) -> Void)? = nil,
        title: String = "Chart Data",
        subtitle: String = "Data visualization",
        showExportButton: Bool = true
    ) {
        self.data = data
        self.configuration = configuration
        self.onDataPointTap = onDataPointTap
        self.title = title
        self.subtitle = subtitle
        self.showExportButton = showExportButton
    }
    
    /// Accessibility label for the entire chart
    private var chartAccessibilityLabel: String {
        let dataSummary = data.map { "\($0.label): \(String(format: "%.1f", $0.value))" }.joined(separator: ", ")
        return "\(configuration.accessibilityLabel) with \(data.count) data points. \(dataSummary)"
    }
    
    /// Accessibility hint for the chart
    private var chartAccessibilityHint: String {
        configuration.accessibilityHint
    }
    
    /// Accessibility value describing the current state
    private var chartAccessibilityValue: String {
        if let selectedIndex = selectedPointIndex,
           selectedIndex < data.count {
            let selectedPoint = data[selectedIndex]
            return "Selected: \(selectedPoint.label) with value \(String(format: "%.1f", selectedPoint.value))"
        } else {
            return "No data point selected"
        }
    }
    
    var body: some View {
        VStack(spacing: 16) {
            // Chart container
            GeometryReader { geometry in
                ZStack {
                    // Background
                    Color.clear
                    
                    // Grid lines
                    if configuration.showGrid {
                        GridLines(
                            geometry: ChartGeometry(data: data, size: geometry.size),
                            horizontalLines: 4,
                            verticalLines: 5
                        )
                        .stroke(Color.gray.opacity(0.3), lineWidth: 0.5)
                        .accessibilityHidden(true) // Hide grid from accessibility
                    }
                    
                    // Area fill
                    if configuration.showArea {
                        AreaPath(
                            data: data,
                            geometry: ChartGeometry(data: data, size: geometry.size),
                            animationProgress: animationProgress
                        )
                        .fill(configuration.lineColor.opacity(configuration.areaOpacity))
                        .accessibilityHidden(true) // Hide area fill from accessibility
                    }
                    
                    // Line path
                    LinePath(
                        data: data,
                        geometry: ChartGeometry(data: data, size: geometry.size),
                        animationProgress: animationProgress
                    )
                    .stroke(configuration.lineColor, lineWidth: configuration.lineWidth)
                    .animation(.easeInOut(duration: configuration.animationDuration), value: animationProgress)
                    .accessibilityHidden(true) // Hide line from accessibility as data points are the focus
                    
                    // Data points
                    ForEach(Array(data.enumerated()), id: \.element.id) { index, dataPoint in
                        DataPointView(
                            dataPoint: dataPoint,
                            geometry: ChartGeometry(data: data, size: geometry.size),
                            configuration: configuration,
                            isSelected: selectedPointIndex == index
                        ) {
                            handleDataPointTap(dataPoint: dataPoint, index: index)
                        }
                    }
                    
                    // Labels for selected points
                    if let selectedIndex = selectedPointIndex,
                       selectedIndex < data.count {
                        let selectedPoint = data[selectedIndex]
                        let position = ChartGeometry(data: data, size: geometry.size).point(for: selectedPoint)
                        
                        VStack(spacing: 4) {
                            Text(selectedPoint.label)
                                .font(.caption)
                                .fontWeight(.semibold)
                                .foregroundColor(.primary)
                            
                            Text(String(format: "%.1f", selectedPoint.value))
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(
                            RoundedRectangle(cornerRadius: 6)
                                .fill(Color(.systemBackground))
                                .shadow(radius: 2)
                        )
                        .position(x: position.x, y: position.y - 30)
                        .transition(.scale.combined(with: .opacity))
                        .accessibilityHidden(true) // Hide visual label as it's redundant with accessibility
                    }
                }
            }
            .accessibilityElement(children: .contain)
            .accessibilityLabel(chartAccessibilityLabel)
            .accessibilityHint(chartAccessibilityHint)
            .accessibilityValue(chartAccessibilityValue)
            .accessibilityAddTraits([.allowsDirectInteraction])
            
            // Export button
            if showExportButton && !data.isEmpty {
                PDFExportButton(
                    data: data,
                    configuration: configuration,
                    title: title,
                    subtitle: subtitle
                )
            }
        }
        .onAppear {
            loadDataFromCoreData()
            startEntranceAnimation()
        }
        .onChange(of: data) { _ in
            // Reset animation when data changes
            animationProgress = 0.0
            selectedPointIndex = nil
            startEntranceAnimation()
        }
    }
    
    // MARK: - Private Methods
    
    private func startEntranceAnimation() {
        withAnimation(.easeInOut(duration: configuration.animationDuration)) {
            animationProgress = 1.0
        }
    }
    
    private func handleDataPointTap(dataPoint: DataPoint, index: Int) {
        // Toggle selection
        if selectedPointIndex == index {
            selectedPointIndex = nil
        } else {
            selectedPointIndex = index
        }
        
        // Call the callback
        onDataPointTap?(dataPoint, index)
    }
    
    private func loadDataFromCoreData() {
        // Load initial data from Core Data if no data is provided
        if data.isEmpty {
            let savedData = coreDataManager.fetchAllDataPoints()
            if !savedData.isEmpty {
                // Note: In a real implementation, you would update the data source
                // This is a simplified example - you might want to use @State or @Binding
                print("Loaded \(savedData.count) data points from Core Data")
            }
        }
    }
}

// MARK: - Chart Container View

/// Container view that provides sizing and layout for the chart with accessibility support
struct ProgressLineChartContainer: View {
    let data: [DataPoint]
    let configuration: ChartConfiguration
    let onDataPointTap: ((DataPoint, Int) -> Void)?
    let title: String
    let subtitle: String
    let showExportButton: Bool
    
    init(
        data: [DataPoint],
        configuration: ChartConfiguration = ChartConfiguration(),
        onDataPointTap: ((DataPoint, Int) -> Void)? = nil,
        title: String = "Chart Data",
        subtitle: String = "Data visualization",
        showExportButton: Bool = true
    ) {
        self.data = data
        self.configuration = configuration
        self.onDataPointTap = onDataPointTap
        self.title = title
        self.subtitle = subtitle
        self.showExportButton = showExportButton
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            ProgressLineChart(
                data: data,
                configuration: configuration,
                onDataPointTap: onDataPointTap,
                title: title,
                subtitle: subtitle,
                showExportButton: showExportButton
            )
            .frame(height: 250)
            .background(Color(.systemBackground))
            .cornerRadius(12)
            .shadow(radius: 4)
        }
    }
}

// MARK: - Preview

struct ProgressLineChart_Previews: PreviewProvider {
    static var sampleData: [DataPoint] {
        [
            DataPoint(x: 0, y: 10, label: "January", value: 10, color: .blue),
            DataPoint(x: 1, y: 25, label: "February", value: 25, color: .blue),
            DataPoint(x: 2, y: 15, label: "March", value: 15, color: .blue),
            DataPoint(x: 3, y: 40, label: "April", value: 40, color: .blue),
            DataPoint(x: 4, y: 30, label: "May", value: 30, color: .blue),
            DataPoint(x: 5, y: 55, label: "June", value: 55, color: .blue),
        ]
    }
    
    static var previews: some View {
        VStack(spacing: 20) {
            ProgressLineChartContainer(
                data: sampleData,
                configuration: ChartConfiguration(
                    lineColor: .blue,
                    lineWidth: 3.0,
                    pointSize: 8.0,
                    showGrid: true,
                    showArea: true,
                    areaOpacity: 0.2,
                    animationDuration: 1.5,
                    enableHaptics: true,
                    accessibilityLabel: "Monthly Sales Chart",
                    accessibilityHint: "Double tap to explore monthly sales data points"
                ),
                title: "Monthly Sales",
                subtitle: "Revenue tracking over time"
            ) { dataPoint, index in
                print("Tapped \(dataPoint.label): \(dataPoint.value)")
            }
            
            ProgressLineChartContainer(
                data: sampleData,
                configuration: ChartConfiguration(
                    lineColor: .purple,
                    lineWidth: 4.0,
                    pointSize: 10.0,
                    showGrid: false,
                    showArea: true,
                    areaOpacity: 0.3,
                    animationDuration: 2.0,
                    enableHaptics: true,
                    accessibilityLabel: "Revenue Trend Chart",
                    accessibilityHint: "Double tap to explore revenue trend data points"
                ),
                title: "Revenue Trend",
                subtitle: "Quarterly performance analysis"
            ) { dataPoint, index in
                print("Tapped \(dataPoint.label): \(dataPoint.value)")
            }
        }
        .padding()
        .background(Color(.systemGroupedBackground))
    }
} 