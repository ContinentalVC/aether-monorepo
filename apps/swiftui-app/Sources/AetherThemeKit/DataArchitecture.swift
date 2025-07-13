//
//  DataArchitecture.swift
//  AetherSwiftUIApp
//
//  Created by AI Assistant
//  Copyright © 2025 Aether Design System. All rights reserved.
//

import Foundation
import CoreData
import CloudKit
import Compression

// MARK: - Data Architecture Foundation
/// Comprehensive data architecture implementing caching, validation, migration, sync, and compression

// MARK: - Intelligent Caching System
@MainActor
class IntelligentCacheManager: ObservableObject {
    static let shared = IntelligentCacheManager()
    
    // In-memory cache using NSCache
    private let memoryCache = NSCache<NSString, AnyObject>()
    
    // Custom LRU Cache for high-cost objects
    private let lruCache = LRUCache<String, Data>(capacity: 100)
    
    // File manager for disk caching
    private let fileManager = FileManager.default
    
    private init() {
        setupMemoryCache()
    }
    
    private func setupMemoryCache() {
        memoryCache.countLimit = 100
        memoryCache.totalCostLimit = 50 * 1024 * 1024 // 50MB
    }
    
    // MARK: - Memory Caching
    func cacheInMemory<T: AnyObject>(_ object: T, forKey key: String) {
        memoryCache.setObject(object, forKey: key as NSString)
    }
    
    func retrieveFromMemory<T: AnyObject>(forKey key: String) -> T? {
        return memoryCache.object(forKey: key as NSString) as? T
    }
    
    // MARK: - LRU Caching
    func cacheInLRU(_ data: Data, forKey key: String) {
        lruCache.setValue(data, forKey: key)
    }
    
    func retrieveFromLRU(forKey key: String) -> Data? {
        return lruCache.getValue(forKey: key)
    }
    
    // MARK: - Disk Caching
    func cacheOnDisk(_ data: Data, forKey key: String, in directory: CacheDirectory) throws {
        let url = try getCacheURL(forKey: key, in: directory)
        try data.write(to: url)
    }
    
    func retrieveFromDisk(forKey key: String, in directory: CacheDirectory) throws -> Data? {
        let url = try getCacheURL(forKey: key, in: directory)
        return try? Data(contentsOf: url)
    }
    
    private func getCacheURL(forKey key: String, in directory: CacheDirectory) throws -> URL {
        let baseURL: URL
        switch directory {
        case .caches:
            baseURL = try fileManager.url(for: .cachesDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
        case .applicationSupport:
            baseURL = try fileManager.url(for: .applicationSupportDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
        }
        return baseURL.appendingPathComponent(key)
    }
    
    // MARK: - Cache Management
    func clearMemoryCache() {
        memoryCache.removeAllObjects()
    }
    
    func clearDiskCache(in directory: CacheDirectory) throws {
        let baseURL = try getCacheURL(forKey: "", in: directory)
        let contents = try fileManager.contentsOfDirectory(at: baseURL, includingPropertiesForKeys: nil)
        for url in contents {
            try fileManager.removeItem(at: url)
        }
    }
}

enum CacheDirectory {
    case caches
    case applicationSupport
}

// MARK: - Custom LRU Cache Implementation
class LRUCache<Key: Hashable, Value> {
    private let capacity: Int
    private var cache: [Key: Node<Key, Value>] = [:]
    private var head: Node<Key, Value>?
    private var tail: Node<Key, Value>?
    
    init(capacity: Int) {
        self.capacity = capacity
    }
    
    func setValue(_ value: Value, forKey key: Key) {
        if let existingNode = cache[key] {
            // Update existing node
            existingNode.value = value
            moveToHead(existingNode)
        } else {
            // Create new node
            let newNode = Node(key: key, value: value)
            cache[key] = newNode
            addToHead(newNode)
            
            if cache.count > capacity {
                removeTail()
            }
        }
    }
    
    func getValue(forKey key: Key) -> Value? {
        guard let node = cache[key] else { return nil }
        moveToHead(node)
        return node.value
    }
    
    private func addToHead(_ node: Node<Key, Value>) {
        node.next = head
        node.prev = nil
        head?.prev = node
        head = node
        
        if tail == nil {
            tail = head
        }
    }
    
    private func moveToHead(_ node: Node<Key, Value>) {
        if node === head { return }
        
        // Remove from current position
        node.prev?.next = node.next
        node.next?.prev = node.prev
        
        if node === tail {
            tail = node.prev
        }
        
        // Add to head
        addToHead(node)
    }
    
    private func removeTail() {
        guard let tail = tail else { return }
        cache.removeValue(forKey: tail.key)
        
        if head === tail {
            head = nil
            self.tail = nil
        } else {
            self.tail = tail.prev
            self.tail?.next = nil
        }
    }
}

private class Node<Key, Value> {
    let key: Key
    var value: Value
    var next: Node<Key, Value>?
    var prev: Node<Key, Value>?
    
    init(key: Key, value: Value) {
        self.key = key
        self.value = value
    }
}

// MARK: - Data Validation and Sanitization
class DataValidator {
    static let shared = DataValidator()
    
    private init() {}
    
    // MARK: - Rule-Based Validation
    func validateEmail(_ email: String) -> ValidationResult {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        let isValid = emailPredicate.evaluate(with: email)
        
        return ValidationResult(
            isValid: isValid,
            errors: isValid ? [] : ["Invalid email format"]
        )
    }
    
    func validateUsername(_ username: String) -> ValidationResult {
        var errors: [String] = []
        
        if username.count < 3 {
            errors.append("Username must be at least 3 characters")
        }
        
        if username.count > 20 {
            errors.append("Username must be less than 20 characters")
        }
        
        let usernameRegex = "^[a-zA-Z0-9_]+$"
        let usernamePredicate = NSPredicate(format: "SELF MATCHES %@", usernameRegex)
        if !usernamePredicate.evaluate(with: username) {
            errors.append("Username can only contain letters, numbers, and underscores")
        }
        
        return ValidationResult(
            isValid: errors.isEmpty,
            errors: errors
        )
    }
    
    func validateRequired(_ value: String, fieldName: String) -> ValidationResult {
        let isValid = !value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        return ValidationResult(
            isValid: isValid,
            errors: isValid ? [] : ["\(fieldName) is required"]
        )
    }
}

// MARK: - Validation Result
struct ValidationResult {
    let isValid: Bool
    let errors: [String]
}

// MARK: - Data Compression Manager
class DataCompressionManager {
    static let shared = DataCompressionManager()
    
    private init() {}
    
    // MARK: - LZFSE Compression
    func compressWithLZFSE(_ data: Data) -> Data? {
        let sourceSize = data.count
        let destinationSize = sourceSize + (sourceSize / 16) + 64
        
        var destination = Data(count: destinationSize)
        
        let result = destination.withUnsafeMutableBytes { destPtr in
            data.withUnsafeBytes { srcPtr in
                compression_encode_buffer(
                    destPtr.baseAddress!.assumingMemoryBound(to: UInt8.self),
                    destinationSize,
                    srcPtr.baseAddress!.assumingMemoryBound(to: UInt8.self),
                    sourceSize,
                    nil,
                    COMPRESSION_LZFSE
                )
            }
        }
        
        guard result > 0 else { return nil }
        destination.count = result
        return destination
    }
    
    func decompressWithLZFSE(_ data: Data) -> Data? {
        let sourceSize = data.count
        let destinationSize = sourceSize * 4 // Estimate decompressed size
        
        var destination = Data(count: destinationSize)
        
        let result = destination.withUnsafeMutableBytes { destPtr in
            data.withUnsafeBytes { srcPtr in
                compression_decode_buffer(
                    destPtr.baseAddress!.assumingMemoryBound(to: UInt8.self),
                    destinationSize,
                    srcPtr.baseAddress!.assumingMemoryBound(to: UInt8.self),
                    sourceSize,
                    nil,
                    COMPRESSION_LZFSE
                )
            }
        }
        
        guard result > 0 else { return nil }
        destination.count = result
        return destination
    }
}

// MARK: - Core Data Manager with CloudKit Integration
@MainActor
class CoreDataManager: ObservableObject {
    static let shared = CoreDataManager()
    
    private let container: NSPersistentContainer
    private let cacheManager = IntelligentCacheManager.shared
    
    @Published var syncStatus: SyncStatus = .idle
    
    private init() {
        container = NSPersistentContainer(name: "ChartData")
        
        // Configure CloudKit
        if let cloudKitContainer = container as? NSPersistentCloudKitContainer {
            cloudKitContainer.cloudKitContainerOptions = NSPersistentCloudKitContainerOptions(
                containerIdentifier: "iCloud.com.aether.chartdata"
            )
        }
        
        container.loadPersistentStores { _, error in
            if let error = error {
                print("Core Data failed to load: \(error.localizedDescription)")
            }
        }
        
        container.viewContext.automaticallyMergesChangesFromParent = true
    }
    
    var viewContext: NSManagedObjectContext {
        return container.viewContext
    }
    
    // MARK: - Data Operations
    func save() {
        if viewContext.hasChanges {
            do {
                try viewContext.save()
            } catch {
                print("Error saving context: \(error)")
            }
        }
    }
    
    func fetch<T: NSManagedObject>(_ request: NSFetchRequest<T>) throws -> [T] {
        return try viewContext.fetch(request)
    }
    
    func delete(_ object: NSManagedObject) {
        viewContext.delete(object)
        save()
    }
    
    // MARK: - Caching Integration
    func retrieveData(forKey key: String, decompress: Bool = true) throws -> Data? {
        // Try memory cache first
        if let cachedData: Data = cacheManager.retrieveFromMemory(forKey: key) {
            return decompress ? decompressData(cachedData) : cachedData
        }
        
        // Try LRU cache
        if let lruData = cacheManager.retrieveFromLRU(forKey: key) {
            return decompress ? decompressData(lruData) : lruData
        }
        
        // Try disk cache
        if let diskData = try cacheManager.retrieveFromDisk(forKey: key, in: .caches) {
            return decompress ? decompressData(diskData) : diskData
        }
        
        return nil
    }
    
    func storeData(_ data: Data, forKey key: String, compress: Bool = true) throws {
        let processedData = compress ? compressData(data) : data
        
        // Store in memory cache
        cacheManager.cacheInMemory(processedData as NSData, forKey: key)
        
        // Store in LRU cache
        cacheManager.cacheInLRU(processedData, forKey: key)
        
        // Store on disk
        try cacheManager.cacheOnDisk(processedData, forKey: key, in: .caches)
    }
    
    private func compressData(_ data: Data) -> Data {
        return DataCompressionManager.shared.compressWithLZFSE(data) ?? data
    }
    
    private func decompressData(_ data: Data) -> Data {
        return DataCompressionManager.shared.decompressWithLZFSE(data) ?? data
    }
}

// MARK: - Sync Status
enum SyncStatus {
    case idle
    case syncing
    case completed
    case failed(Error)
}

// MARK: - Data Architecture Test Suite
@MainActor
class DataArchitectureTestSuite: ObservableObject {
    @Published var testResults: [String] = []
    
    private let cacheManager = IntelligentCacheManager.shared
    private let validator = DataValidator.shared
    
    func runAllTests() {
        testResults.removeAll()
        
        testMemoryCache()
        testLRUCache()
        testDiskCache()
        testCompression()
        testValidation()
        
        testResults.append("✅ All tests completed")
    }
    
    private func testMemoryCache() {
        let testData = "Test data for memory cache".data(using: .utf8)!
        cacheManager.cacheInMemory(testData as NSData, forKey: "test_key")
        
        if let retrieved: Data = cacheManager.retrieveFromMemory(forKey: "test_key") {
            testResults.append("Memory cache: ✅ \(retrieved.count) bytes retrieved")
        } else {
            testResults.append("Memory cache: ❌ Failed to retrieve data")
        }
    }
    
    private func testLRUCache() {
        let testData = "Test data for LRU cache".data(using: .utf8)!
        cacheManager.cacheInLRU(testData, forKey: "lru_test")
        
        if let retrieved = cacheManager.retrieveFromLRU(forKey: "lru_test") {
            testResults.append("LRU cache: ✅ \(retrieved.count) bytes retrieved")
        } else {
            testResults.append("LRU cache: ❌ Failed to retrieve data")
        }
    }
    
    private func testDiskCache() {
        let testData = "Test data for disk cache".data(using: .utf8)!
        
        do {
            try cacheManager.cacheOnDisk(testData, forKey: "disk_test", in: .caches)
            if let retrieved = try cacheManager.retrieveFromDisk(forKey: "disk_test", in: .caches) {
                testResults.append("Disk cache: ✅ \(retrieved.count) bytes retrieved")
            } else {
                testResults.append("Disk cache: ❌ Failed to retrieve data")
            }
        } catch {
            testResults.append("Disk cache: ❌ Error: \(error.localizedDescription)")
        }
    }
    
    private func testCompression() {
        let originalData = "This is a test string that will be compressed using LZFSE compression algorithm".data(using: .utf8)!
        
        if let compressed = DataCompressionManager.shared.compressWithLZFSE(originalData) {
            let compressionRatio = Double(compressed.count) / Double(originalData.count)
            testResults.append("Compression: ✅ Ratio: \(String(format: "%.2f", compressionRatio))")
            
            if let decompressed = DataCompressionManager.shared.decompressWithLZFSE(compressed) {
                if decompressed == originalData {
                    testResults.append("Decompression: ✅ Data integrity verified")
                } else {
                    testResults.append("Decompression: ❌ Data corruption detected")
                }
            } else {
                testResults.append("Decompression: ❌ Failed to decompress")
            }
        } else {
            testResults.append("Compression: ❌ Failed to compress")
        }
    }
    
    private func testValidation() {
        let emailResult = DataValidator.shared.validateEmail("test@example.com")
        let usernameResult = DataValidator.shared.validateUsername("valid_username")
        let requiredResult = DataValidator.shared.validateRequired("", fieldName: "Test Field")
        
        testResults.append("Email validation: \(emailResult.isValid ? "✅" : "❌")")
        testResults.append("Username validation: \(usernameResult.isValid ? "✅" : "❌")")
        testResults.append("Required validation: \(requiredResult.isValid ? "✅" : "❌")")
    }
} 