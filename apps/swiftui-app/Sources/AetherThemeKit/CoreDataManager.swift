//
//  CoreDataManager.swift
//  Aether SwiftUI App
//
//  Core Data manager for persisting ChartData entities.
//  Handles saving, fetching, and deleting chart data with proper error handling.
//

import CoreData
import SwiftUI

/// Core Data manager for handling ChartData persistence
class CoreDataManager: ObservableObject {
    
    /// Shared instance for singleton access
    static let shared = CoreDataManager()
    
    /// Persistent container for Core Data stack
    private let persistentContainer: NSPersistentContainer
    
    /// Main managed object context
    var viewContext: NSManagedObjectContext {
        return persistentContainer.viewContext
    }
    
    /// Background context for heavy operations
    var backgroundContext: NSManagedObjectContext {
        return persistentContainer.newBackgroundContext()
    }
    
    /// Initialize the Core Data manager
    private init() {
        persistentContainer = NSPersistentContainer(name: "ChartData")
        
        persistentContainer.loadPersistentStores { _, error in
            if let error = error {
                fatalError("Failed to load Core Data stack: \(error)")
            }
        }
        
        // Configure automatic merging of changes
        persistentContainer.viewContext.automaticallyMergesChangesFromParent = true
        persistentContainer.viewContext.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy
    }
    
    // MARK: - Save Context
    
    /// Save the main context
    func save() {
        let context = persistentContainer.viewContext
        
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                print("Error saving context: \(error)")
            }
        }
    }
    
    /// Save a specific context
    func save(context: NSManagedObjectContext) {
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                print("Error saving context: \(error)")
            }
        }
    }
    
    // MARK: - ChartData Operations
    
    /// Save a DataPoint to Core Data
    /// - Parameter dataPoint: The DataPoint to save
    func saveDataPoint(_ dataPoint: DataPoint) {
        let context = persistentContainer.viewContext
        
        let chartData = ChartData(context: context)
        chartData.id = dataPoint.id
        chartData.x = dataPoint.x
        chartData.y = dataPoint.y
        chartData.label = dataPoint.label
        chartData.value = dataPoint.value
        chartData.colorHex = dataPoint.color.toHex()
        chartData.createdAt = Date()
        
        save()
    }
    
    /// Save multiple DataPoints to Core Data
    /// - Parameter dataPoints: Array of DataPoints to save
    func saveDataPoints(_ dataPoints: [DataPoint]) {
        let context = persistentContainer.viewContext
        
        for dataPoint in dataPoints {
            let chartData = ChartData(context: context)
            chartData.id = dataPoint.id
            chartData.x = dataPoint.x
            chartData.y = dataPoint.y
            chartData.label = dataPoint.label
            chartData.value = dataPoint.value
            chartData.colorHex = dataPoint.color.toHex()
            chartData.createdAt = Date()
        }
        
        save()
    }
    
    /// Fetch all ChartData entities from Core Data
    /// - Returns: Array of DataPoints
    func fetchAllDataPoints() -> [DataPoint] {
        let request: NSFetchRequest<ChartData> = ChartData.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(keyPath: \ChartData.createdAt, ascending: true)]
        
        do {
            let chartDataEntities = try viewContext.fetch(request)
            return chartDataEntities.compactMap { entity in
                guard let id = entity.id,
                      let label = entity.label,
                      let colorHex = entity.colorHex,
                      let color = Color(hex: colorHex) else {
                    return nil
                }
                
                return DataPoint(
                    x: entity.x,
                    y: entity.y,
                    label: label,
                    value: entity.value,
                    color: color
                )
            }
        } catch {
            print("Error fetching data points: \(error)")
            return []
        }
    }
    
    /// Fetch DataPoints by label
    /// - Parameter label: The label to filter by
    /// - Returns: Array of DataPoints with matching label
    func fetchDataPoints(withLabel label: String) -> [DataPoint] {
        let request: NSFetchRequest<ChartData> = ChartData.fetchRequest()
        request.predicate = NSPredicate(format: "label == %@", label)
        request.sortDescriptors = [NSSortDescriptor(keyPath: \ChartData.createdAt, ascending: true)]
        
        do {
            let chartDataEntities = try viewContext.fetch(request)
            return chartDataEntities.compactMap { entity in
                guard let id = entity.id,
                      let label = entity.label,
                      let colorHex = entity.colorHex,
                      let color = Color(hex: colorHex) else {
                    return nil
                }
                
                return DataPoint(
                    x: entity.x,
                    y: entity.y,
                    label: label,
                    value: entity.value,
                    color: color
                )
            }
        } catch {
            print("Error fetching data points with label \(label): \(error)")
            return []
        }
    }
    
    /// Delete a specific DataPoint by ID
    /// - Parameter id: The UUID of the DataPoint to delete
    func deleteDataPoint(withId id: UUID) {
        let request: NSFetchRequest<ChartData> = ChartData.fetchRequest()
        request.predicate = NSPredicate(format: "id == %@", id as CVarArg)
        
        do {
            let chartDataEntities = try viewContext.fetch(request)
            for entity in chartDataEntities {
                viewContext.delete(entity)
            }
            save()
        } catch {
            print("Error deleting data point with id \(id): \(error)")
        }
    }
    
    /// Delete all ChartData entities
    func deleteAllDataPoints() {
        let request: NSFetchRequest<NSFetchRequestResult> = ChartData.fetchRequest()
        let deleteRequest = NSBatchDeleteRequest(fetchRequest: request)
        
        do {
            try viewContext.execute(deleteRequest)
            save()
        } catch {
            print("Error deleting all data points: \(error)")
        }
    }
    
    /// Delete DataPoints older than a specified date
    /// - Parameter date: The cutoff date
    func deleteDataPointsOlderThan(_ date: Date) {
        let request: NSFetchRequest<ChartData> = ChartData.fetchRequest()
        request.predicate = NSPredicate(format: "createdAt < %@", date as CVarArg)
        
        do {
            let chartDataEntities = try viewContext.fetch(request)
            for entity in chartDataEntities {
                viewContext.delete(entity)
            }
            save()
        } catch {
            print("Error deleting old data points: \(error)")
        }
    }
    
    /// Update an existing DataPoint
    /// - Parameter dataPoint: The updated DataPoint
    func updateDataPoint(_ dataPoint: DataPoint) {
        let request: NSFetchRequest<ChartData> = ChartData.fetchRequest()
        request.predicate = NSPredicate(format: "id == %@", dataPoint.id as CVarArg)
        
        do {
            let chartDataEntities = try viewContext.fetch(request)
            if let entity = chartDataEntities.first {
                entity.x = dataPoint.x
                entity.y = dataPoint.y
                entity.label = dataPoint.label
                entity.value = dataPoint.value
                entity.colorHex = dataPoint.color.toHex()
                save()
            }
        } catch {
            print("Error updating data point: \(error)")
        }
    }
    
    // MARK: - Utility Methods
    
    /// Check if a DataPoint exists in Core Data
    /// - Parameter id: The UUID of the DataPoint
    /// - Returns: True if the DataPoint exists
    func dataPointExists(withId id: UUID) -> Bool {
        let request: NSFetchRequest<ChartData> = ChartData.fetchRequest()
        request.predicate = NSPredicate(format: "id == %@", id as CVarArg)
        
        do {
            let count = try viewContext.count(for: request)
            return count > 0
        } catch {
            print("Error checking if data point exists: \(error)")
            return false
        }
    }
    
    /// Get the count of all DataPoints
    /// - Returns: The total count
    func getDataPointCount() -> Int {
        let request: NSFetchRequest<ChartData> = ChartData.fetchRequest()
        
        do {
            return try viewContext.count(for: request)
        } catch {
            print("Error getting data point count: \(error)")
            return 0
        }
    }
}

// MARK: - Color Extensions

extension Color {
    /// Convert Color to hex string
    func toHex() -> String {
        let uiColor = UIColor(self)
        var red: CGFloat = 0
        var green: CGFloat = 0
        var blue: CGFloat = 0
        var alpha: CGFloat = 0
        
        uiColor.getRed(&red, green: &green, blue: &blue, alpha: &alpha)
        
        let rgb = Int(red * 255) << 16 | Int(green * 255) << 8 | Int(blue * 255) << 0
        return String(format: "#%06x", rgb)
    }
    
    /// Initialize Color from hex string
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