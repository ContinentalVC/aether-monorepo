//
//  AetherSwiftUIApp.swift
//  Aether SwiftUI App
//
//  Main app entry point with Core Data integration and theme management.
//  Provides CoreDataManager and ThemeManager to the app environment.
//

import SwiftUI
import CoreData

@main
struct AetherSwiftUIApp: App {
    @StateObject private var coreDataManager = CoreDataManager.shared
    @StateObject private var themeManager = ThemeManager()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(coreDataManager)
                .environmentObject(themeManager)
                .preferredColorScheme(themeManager.isDarkMode ? .dark : .light)
        }
    }
} 