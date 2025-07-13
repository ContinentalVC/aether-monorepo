# ProgressLineChart

A comprehensive SwiftUI line chart component with entrance animations, haptic feedback, VoiceOver accessibility support, Core Data persistence, and PDF export functionality.

## Features

### Core Features
- **Smooth Entrance Animation**: Line draws from left to right on view appearance
- **Interactive Data Points**: Tap data points to select them with visual feedback
- **Haptic Feedback**: Light impact feedback on data point interactions
- **Comprehensive Accessibility**: Full VoiceOver support with detailed labels and hints
- **Core Data Persistence**: Save, load, and manage chart data with persistent storage
- **PDF Export**: Generate and share PDF documents of chart data

### Visual Customization
- Customizable line colors, widths, and point sizes
- Optional grid lines and area fill
- Configurable animation duration
- Multiple theme support (Default, Purple, Green)

### Data Management
- Add, edit, and delete data points
- Save data to Core Data for persistence
- Load data from Core Data on app launch
- Data statistics and summary information
- Bulk data operations

### Accessibility Features
- Individual data point accessibility with clear labels
- Chart summary for screen readers
- Interactive data point selection
- Comprehensive VoiceOver integration
- Hidden decorative elements from accessibility

## Installation

### Requirements
- iOS 14.0+
- SwiftUI
- Core Data
- PDFKit

### Core Data Setup

1. **Add Core Data Model**: Ensure `ChartData.xcdatamodeld` is included in your project
2. **Import CoreDataManager**: Add the `CoreDataManager.swift` file to your project
3. **Initialize in App**: Add CoreDataManager to your app's environment

```swift
@main
struct YourApp: App {
    @StateObject private var coreDataManager = CoreDataManager.shared
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(coreDataManager)
        }
    }
}
```

## Usage

### Basic Implementation

```swift
struct ContentView: View {
    @State private var chartData: [DataPoint] = [
        DataPoint(x: 0, y: 10, label: "January", value: 10, color: .blue),
        DataPoint(x: 1, y: 25, label: "February", value: 25, color: .blue),
        DataPoint(x: 2, y: 15, label: "March", value: 15, color: .blue),
    ]
    
    var body: some View {
        ProgressLineChartContainer(
            data: chartData,
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
                accessibilityHint: "Double tap to explore data points"
            ),
            title: "Monthly Sales",
            subtitle: "Revenue tracking over time",
            showExportButton: true
        ) { dataPoint, index in
            print("Tapped \(dataPoint.label): \(dataPoint.value)")
        }
    }
}
```

### Core Data Integration

```swift
struct ChartView: View {
    @StateObject private var coreDataManager = CoreDataManager.shared
    @State private var chartData: [DataPoint] = []
    
    var body: some View {
        VStack {
            ProgressLineChartContainer(data: chartData)
            
            Button("Save to Core Data") {
                coreDataManager.saveDataPoints(chartData)
            }
            
            Button("Load from Core Data") {
                chartData = coreDataManager.fetchAllDataPoints()
            }
        }
        .onAppear {
            loadDataFromCoreData()
        }
    }
    
    private func loadDataFromCoreData() {
        chartData = coreDataManager.fetchAllDataPoints()
    }
}
```

### PDF Export

```swift
struct ChartWithExport: View {
    @State private var chartData: [DataPoint] = []
    
    var body: some View {
        ProgressLineChartContainer(
            data: chartData,
            title: "Sales Data",
            subtitle: "Quarterly performance",
            showExportButton: true
        )
    }
}
```

## API Reference

### DataPoint

```swift
struct DataPoint: Identifiable, Equatable {
    let id = UUID()
    let x: Double
    let y: Double
    let label: String
    let value: Double
    let color: Color
}
```

### ChartConfiguration

```swift
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
}
```

### CoreDataManager

#### Singleton Access
```swift
let coreDataManager = CoreDataManager.shared
```

#### Data Operations
```swift
// Save data
coreDataManager.saveDataPoint(dataPoint)
coreDataManager.saveDataPoints([dataPoint1, dataPoint2])

// Fetch data
let allData = coreDataManager.fetchAllDataPoints()
let filteredData = coreDataManager.fetchDataPoints(withLabel: "Sales")

// Delete data
coreDataManager.deleteDataPoint(withId: uuid)
coreDataManager.deleteAllDataPoints()
coreDataManager.deleteDataPointsOlderThan(date)

// Update data
coreDataManager.updateDataPoint(dataPoint)

// Utility methods
let exists = coreDataManager.dataPointExists(withId: uuid)
let count = coreDataManager.getDataPointCount()
```

### PDFExporter

#### Generate PDF
```swift
// Generate PDF from chart view
let pdfData = PDFExporter.shared.generatePDF(
    from: chartView,
    title: "Chart Report",
    data: chartData,
    configuration: chartConfig
)

// Generate PDF from data only
let pdfData = PDFExporter.shared.generatePDFFromData(
    data: chartData,
    title: "Data Report",
    subtitle: "Generated on \(Date())",
    configuration: chartConfig
)
```

#### Save and Share
```swift
// Save to documents directory
if let url = PDFExporter.shared.savePDFToDocuments(
    pdfData: pdfData,
    filename: "chart_report.pdf"
) {
    print("PDF saved to: \(url)")
}

// Share PDF
let shareSheet = PDFExporter.shared.sharePDF(
    pdfData: pdfData,
    filename: "chart_report.pdf"
)
```

## Core Data Schema

### ChartData Entity
- `id: UUID` - Unique identifier
- `x: Double` - X coordinate value
- `y: Double` - Y coordinate value
- `label: String` - Data point label
- `value: Double` - Data point value
- `colorHex: String` - Color as hex string
- `createdAt: Date` - Creation timestamp

## PDF Export Features

### Generated PDF Content
- **Title and Subtitle**: Chart title and description
- **Data Table**: Complete data with labels, coordinates, values, and colors
- **Configuration Info**: Chart settings and parameters
- **Summary Statistics**: Total points, average, min/max values
- **Footer**: Generation timestamp and app information

### PDF Styling
- Professional layout with proper spacing
- Alternating row colors in data table
- Color-coded data points
- Clean typography and formatting
- US Letter size (612x792 points)

## Accessibility Support

### VoiceOver Integration
- **Chart Container**: Overall chart description with data summary
- **Data Points**: Individual accessibility for each point with labels and values
- **Interactive Elements**: Clear hints for data point selection
- **Export Button**: Descriptive label and hint for PDF generation

### Accessibility Labels
```swift
// Chart accessibility
accessibilityLabel: "Monthly Sales Chart with 6 data points. January: 10.0, February: 25.0..."
accessibilityHint: "Double tap to explore data points and interact with the chart"
accessibilityValue: "Selected: February with value 25.0"

// Data point accessibility
accessibilityLabel: "February, value 25.0"
accessibilityHint: "Double tap to select this data point"
accessibilityValue: "Selected"
```

## Example Implementation

See `ProgressLineChartExample.swift` for a complete implementation demonstrating:
- Data management with Core Data
- PDF export functionality
- Interactive controls
- Theme switching
- Statistics display
- Data point addition and editing

## Performance Considerations

### Core Data
- Uses background contexts for heavy operations
- Implements proper error handling
- Optimized fetch requests with sorting
- Batch delete operations for large datasets

### PDF Generation
- Efficient rendering with proper memory management
- Background processing for large datasets
- Optimized image rendering for chart views
- Proper cleanup of temporary files

### Animation and Haptics
- Smooth 60fps animations
- Efficient haptic feedback management
- Proper state management for interactions
- Memory-efficient data structures

## Troubleshooting

### Core Data Issues
1. **Model not found**: Ensure `ChartData.xcdatamodeld` is in your project
2. **Migration errors**: Handle Core Data model versioning
3. **Save failures**: Check for validation errors in data

### PDF Export Issues
1. **Memory issues**: Use background processing for large datasets
2. **File permissions**: Ensure proper app permissions
3. **Share sheet**: Handle activity view controller presentation

### Accessibility Issues
1. **VoiceOver not working**: Check accessibility labels and hints
2. **Focus issues**: Ensure proper accessibility traits
3. **Hidden elements**: Verify decorative elements are properly hidden

## Best Practices

### Data Management
- Save data incrementally to avoid large batch operations
- Implement proper error handling for Core Data operations
- Use background contexts for heavy operations
- Validate data before saving

### PDF Generation
- Generate PDFs in background to avoid UI blocking
- Implement proper error handling for file operations
- Clean up temporary files after sharing
- Use appropriate file naming conventions

### Accessibility
- Provide clear, descriptive labels for all interactive elements
- Test with VoiceOver to ensure proper navigation
- Include helpful hints for complex interactions
- Maintain logical focus order

### Performance
- Limit animation duration for large datasets
- Use efficient data structures
- Implement proper memory management
- Optimize Core Data fetch requests

## License

This component is part of the Aether SwiftUI App and follows the same licensing terms. 