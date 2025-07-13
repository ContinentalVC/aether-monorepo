//
//  ProgressLineChartExample.swift
//  Aether SwiftUI App
//
//  Example view demonstrating ProgressLineChart with Core Data persistence
//  and PDF export functionality. Shows data management, saving to Core Data,
//  loading from Core Data, and PDF generation with sharing.
//

import SwiftUI
import CoreData

/// Example view demonstrating ProgressLineChart with Core Data persistence and PDF export
struct ProgressLineChartExample: View {
    @StateObject private var coreDataManager = CoreDataManager.shared
    @State private var chartData: [DataPoint] = []
    @State private var showingAddDataSheet = false
    @State private var showingDataManagement = false
    @State private var selectedTheme = "Default"
    @State private var enableHaptics = true
    @State private var showGrid = true
    @State private var showArea = false
    @State private var animationDuration: Double = 1.5
    
    // Sample data for demonstration
    private let sampleDataSets = [
        "Monthly Sales": [
            DataPoint(x: 0, y: 10, label: "January", value: 10, color: .blue),
            DataPoint(x: 1, y: 25, label: "February", value: 25, color: .blue),
            DataPoint(x: 2, y: 15, label: "March", value: 15, color: .blue),
            DataPoint(x: 3, y: 40, label: "April", value: 40, color: .blue),
            DataPoint(x: 4, y: 30, label: "May", value: 30, color: .blue),
            DataPoint(x: 5, y: 55, label: "June", value: 55, color: .blue),
        ],
        "Revenue Trend": [
            DataPoint(x: 0, y: 100, label: "Q1", value: 100, color: .purple),
            DataPoint(x: 1, y: 150, label: "Q2", value: 150, color: .purple),
            DataPoint(x: 2, y: 120, label: "Q3", value: 120, color: .purple),
            DataPoint(x: 3, y: 200, label: "Q4", value: 200, color: .purple),
        ],
        "User Growth": [
            DataPoint(x: 0, y: 50, label: "Week 1", value: 50, color: .green),
            DataPoint(x: 1, y: 75, label: "Week 2", value: 75, color: .green),
            DataPoint(x: 2, y: 90, label: "Week 3", value: 90, color: .green),
            DataPoint(x: 3, y: 120, label: "Week 4", value: 120, color: .green),
            DataPoint(x: 4, y: 140, label: "Week 5", value: 140, color: .green),
        ]
    ]
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Chart display
                    AetherGlassCard {
                        VStack(alignment: .leading, spacing: 16) {
                            HStack {
                                Text("Progress Line Chart")
                                    .font(.title2)
                                    .fontWeight(.bold)
                                    .foregroundColor(.primary)
                                
                                Spacer()
                                
                                Button(action: { showingAddDataSheet = true }) {
                                    Image(systemName: "plus.circle.fill")
                                        .font(.title2)
                                        .foregroundColor(.blue)
                                }
                                .accessibilityLabel("Add new data point")
                            }
                            
                            if chartData.isEmpty {
                                VStack(spacing: 12) {
                                    Image(systemName: "chart.line.uptrend.xyaxis")
                                        .font(.system(size: 48))
                                        .foregroundColor(.secondary)
                                    
                                    Text("No Data Available")
                                        .font(.headline)
                                        .foregroundColor(.secondary)
                                    
                                    Text("Tap the + button to add data points or load sample data")
                                        .font(.subheadline)
                                        .foregroundColor(.secondary)
                                        .multilineTextAlignment(.center)
                                    
                                    Button("Load Sample Data") {
                                        loadSampleData()
                                    }
                                    .buttonStyle(.borderedProminent)
                                }
                                .frame(height: 200)
                            } else {
                                ProgressLineChartContainer(
                                    data: chartData,
                                    configuration: ChartConfiguration(
                                        lineColor: selectedTheme == "Purple" ? .purple : 
                                                  selectedTheme == "Green" ? .green : .blue,
                                        lineWidth: 3.0,
                                        pointSize: 8.0,
                                        showGrid: showGrid,
                                        showArea: showArea,
                                        areaOpacity: 0.2,
                                        animationDuration: animationDuration,
                                        enableHaptics: enableHaptics,
                                        accessibilityLabel: "Interactive Line Chart",
                                        accessibilityHint: "Double tap to explore data points and interact with the chart"
                                    ),
                                    title: "Chart Data",
                                    subtitle: "Interactive visualization with persistence",
                                    showExportButton: true
                                ) { dataPoint, index in
                                    handleDataPointTap(dataPoint: dataPoint, index: index)
                                }
                            }
                        }
                    }
                    
                    // Controls section
                    AetherGlassCard {
                        VStack(alignment: .leading, spacing: 16) {
                            Text("Chart Controls")
                                .font(.headline)
                                .fontWeight(.semibold)
                            
                            // Theme selection
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Theme")
                                    .font(.subheadline)
                                    .fontWeight(.medium)
                                
                                Picker("Theme", selection: $selectedTheme) {
                                    Text("Default").tag("Default")
                                    Text("Purple").tag("Purple")
                                    Text("Green").tag("Green")
                                }
                                .pickerStyle(SegmentedPickerStyle())
                            }
                            
                            // Animation controls
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Animation Duration: \(String(format: "%.1f", animationDuration))s")
                                    .font(.subheadline)
                                    .fontWeight(.medium)
                                
                                Slider(value: $animationDuration, in: 0.5...3.0, step: 0.1)
                                    .accentColor(.blue)
                            }
                            
                            // Toggle controls
                            VStack(spacing: 12) {
                                Toggle("Enable Haptics", isOn: $enableHaptics)
                                    .toggleStyle(SwitchToggleStyle(tint: .blue))
                                
                                Toggle("Show Grid", isOn: $showGrid)
                                    .toggleStyle(SwitchToggleStyle(tint: .blue))
                                
                                Toggle("Show Area Fill", isOn: $showArea)
                                    .toggleStyle(SwitchToggleStyle(tint: .blue))
                            }
                        }
                    }
                    
                    // Data management section
                    AetherGlassCard {
                        VStack(alignment: .leading, spacing: 16) {
                            Text("Data Management")
                                .font(.headline)
                                .fontWeight(.semibold)
                            
                            VStack(spacing: 12) {
                                Button(action: saveCurrentDataToCoreData) {
                                    HStack {
                                        Image(systemName: "square.and.arrow.down")
                                        Text("Save to Core Data")
                                    }
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(Color.blue)
                                    .foregroundColor(.white)
                                    .cornerRadius(8)
                                }
                                .disabled(chartData.isEmpty)
                                
                                Button(action: loadDataFromCoreData) {
                                    HStack {
                                        Image(systemName: "square.and.arrow.up")
                                        Text("Load from Core Data")
                                    }
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(Color.green)
                                    .foregroundColor(.white)
                                    .cornerRadius(8)
                                }
                                
                                Button(action: { showingDataManagement = true }) {
                                    HStack {
                                        Image(systemName: "list.bullet")
                                        Text("Manage Saved Data")
                                    }
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(Color.orange)
                                    .foregroundColor(.white)
                                    .cornerRadius(8)
                                }
                                
                                Button(action: clearAllData) {
                                    HStack {
                                        Image(systemName: "trash")
                                        Text("Clear All Data")
                                    }
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(Color.red)
                                    .foregroundColor(.white)
                                    .cornerRadius(8)
                                }
                            }
                        }
                    }
                    
                    // Statistics section
                    if !chartData.isEmpty {
                        AetherGlassCard {
                            VStack(alignment: .leading, spacing: 16) {
                                Text("Data Statistics")
                                    .font(.headline)
                                    .fontWeight(.semibold)
                                
                                LazyVGrid(columns: [
                                    GridItem(.flexible()),
                                    GridItem(.flexible())
                                ], spacing: 12) {
                                    StatCard(title: "Total Points", value: "\(chartData.count)")
                                    StatCard(title: "Total Value", value: String(format: "%.1f", chartData.reduce(0) { $0 + $1.value }))
                                    StatCard(title: "Average", value: String(format: "%.1f", chartData.reduce(0) { $0 + $1.value } / Double(chartData.count)))
                                    StatCard(title: "Max Value", value: String(format: "%.1f", chartData.map { $0.value }.max() ?? 0))
                                }
                            }
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("Line Chart Demo")
            .navigationBarTitleDisplayMode(.large)
            .sheet(isPresented: $showingAddDataSheet) {
                AddDataPointSheet { newDataPoint in
                    addDataPoint(newDataPoint)
                }
            }
            .sheet(isPresented: $showingDataManagement) {
                DataManagementView()
            }
            .onAppear {
                loadDataFromCoreData()
            }
        }
    }
    
    // MARK: - Private Methods
    
    private func handleDataPointTap(dataPoint: DataPoint, index: Int) {
        print("Tapped data point: \(dataPoint.label) with value \(dataPoint.value)")
    }
    
    private func addDataPoint(_ dataPoint: DataPoint) {
        chartData.append(dataPoint)
        saveCurrentDataToCoreData()
    }
    
    private func loadSampleData() {
        chartData = sampleDataSets["Monthly Sales"] ?? []
    }
    
    private func saveCurrentDataToCoreData() {
        // Clear existing data
        coreDataManager.deleteAllDataPoints()
        
        // Save current data
        coreDataManager.saveDataPoints(chartData)
        
        print("Saved \(chartData.count) data points to Core Data")
    }
    
    private func loadDataFromCoreData() {
        let savedData = coreDataManager.fetchAllDataPoints()
        if !savedData.isEmpty {
            chartData = savedData
            print("Loaded \(savedData.count) data points from Core Data")
        }
    }
    
    private func clearAllData() {
        chartData.removeAll()
        coreDataManager.deleteAllDataPoints()
    }
}

// MARK: - Supporting Views

/// Card displaying a single statistic
struct StatCard: View {
    let title: String
    let value: String
    
    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(.primary)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}

/// Sheet for adding new data points
struct AddDataPointSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var label = ""
    @State private var xValue = ""
    @State private var yValue = ""
    @State private var value = ""
    @State private var selectedColor = Color.blue
    
    let onAdd: (DataPoint) -> Void
    
    private let colors: [Color] = [.blue, .purple, .green, .orange, .red, .pink]
    
    var body: some View {
        NavigationView {
            Form {
                Section("Data Point Information") {
                    TextField("Label", text: $label)
                    TextField("X Value", text: $xValue)
                        .keyboardType(.decimalPad)
                    TextField("Y Value", text: $yValue)
                        .keyboardType(.decimalPad)
                    TextField("Value", text: $value)
                        .keyboardType(.decimalPad)
                }
                
                Section("Color") {
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 6), spacing: 8) {
                        ForEach(colors, id: \.self) { color in
                            Circle()
                                .fill(color)
                                .frame(width: 30, height: 30)
                                .overlay(
                                    Circle()
                                        .stroke(selectedColor == color ? Color.blue : Color.clear, lineWidth: 3)
                                )
                                .onTapGesture {
                                    selectedColor = color
                                }
                        }
                    }
                }
            }
            .navigationTitle("Add Data Point")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Add") {
                        addDataPoint()
                    }
                    .disabled(label.isEmpty || xValue.isEmpty || yValue.isEmpty || value.isEmpty)
                }
            }
        }
    }
    
    private func addDataPoint() {
        guard let x = Double(xValue),
              let y = Double(yValue),
              let val = Double(value) else {
            return
        }
        
        let dataPoint = DataPoint(
            x: x,
            y: y,
            label: label,
            value: val,
            color: selectedColor
        )
        
        onAdd(dataPoint)
        dismiss()
    }
}

/// View for managing saved data in Core Data
struct DataManagementView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var coreDataManager = CoreDataManager.shared
    @State private var savedData: [DataPoint] = []
    
    var body: some View {
        NavigationView {
            List {
                Section {
                    HStack {
                        Text("Total Saved Points")
                        Spacer()
                        Text("\(coreDataManager.getDataPointCount())")
                            .fontWeight(.semibold)
                    }
                }
                
                Section("Saved Data Points") {
                    if savedData.isEmpty {
                        Text("No saved data points")
                            .foregroundColor(.secondary)
                            .italic()
                    } else {
                        ForEach(savedData, id: \.id) { dataPoint in
                            VStack(alignment: .leading, spacing: 4) {
                                HStack {
                                    Text(dataPoint.label)
                                        .fontWeight(.medium)
                                    
                                    Spacer()
                                    
                                    Circle()
                                        .fill(dataPoint.color)
                                        .frame(width: 12, height: 12)
                                }
                                
                                HStack {
                                    Text("X: \(String(format: "%.1f", dataPoint.x))")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                    
                                    Text("Y: \(String(format: "%.1f", dataPoint.y))")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                    
                                    Text("Value: \(String(format: "%.1f", dataPoint.value))")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                            }
                            .swipeActions {
                                Button("Delete", role: .destructive) {
                                    coreDataManager.deleteDataPoint(withId: dataPoint.id)
                                    loadSavedData()
                                }
                            }
                        }
                    }
                }
            }
            .navigationTitle("Data Management")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
        .onAppear {
            loadSavedData()
        }
    }
    
    private func loadSavedData() {
        savedData = coreDataManager.fetchAllDataPoints()
    }
}

// MARK: - Preview

struct ProgressLineChartExample_Previews: PreviewProvider {
    static var previews: some View {
        ProgressLineChartExample()
    }
} 