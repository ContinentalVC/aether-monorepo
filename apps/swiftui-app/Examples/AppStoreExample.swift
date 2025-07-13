//
//  AppStoreExample.swift
//  Aether SwiftUI App
//
//  Example SwiftUI view demonstrating the Redux-like state management
//  using the AppStore and reducer pattern.
//

import SwiftUI

/// Example SwiftUI view that demonstrates the Redux-like state management
/// 
/// This view shows how to:
/// - Use the AppStore with @StateObject
/// - Dispatch actions to update state
/// - Observe state changes in SwiftUI views
/// - Handle complex state updates immutably
struct AppStoreExample: View {
    @StateObject private var store = AppStore()
    @State private var newUserName = ""
    @State private var scoreIncrement = 10
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Profile Section
                    profileSection
                    
                    // Settings Section
                    settingsSection
                    
                    // Actions Section
                    actionsSection
                    
                    // State Debug Section
                    stateDebugSection
                }
                .padding()
            }
            .navigationTitle("Redux-like State Management")
            .navigationBarTitleDisplayMode(.large)
            .background(Color(.systemGroupedBackground))
        }
    }
    
    /// Profile information section
    private var profileSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("User Profile")
                .font(.title2)
                .fontWeight(.bold)
            
            VStack(spacing: 12) {
                HStack {
                    Text("Name:")
                        .fontWeight(.medium)
                    Spacer()
                    Text(store.state.profile.name.isEmpty ? "Not set" : store.state.profile.name)
                        .foregroundColor(.secondary)
                }
                
                HStack {
                    Text("Score:")
                        .fontWeight(.medium)
                    Spacer()
                    Text("\(store.state.profile.score)")
                        .foregroundColor(.blue)
                        .fontWeight(.semibold)
                }
            }
            .padding()
            .background(Color(.systemBackground))
            .cornerRadius(12)
        }
    }
    
    /// Settings section
    private var settingsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Settings")
                .font(.title2)
                .fontWeight(.bold)
            
            VStack(spacing: 12) {
                HStack {
                    Text("Dark Mode")
                    Spacer()
                    Toggle("", isOn: Binding(
                        get: { store.state.settings.isDarkMode },
                        set: { _ in store.dispatch(.toggleDarkMode) }
                    ))
                }
                
                HStack {
                    Text("Notifications")
                    Spacer()
                    Toggle("", isOn: Binding(
                        get: { store.state.settings.notificationsEnabled },
                        set: { _ in store.dispatch(.toggleNotifications) }
                    ))
                }
                
                HStack {
                    Text("Auto Save")
                    Spacer()
                    Toggle("", isOn: Binding(
                        get: { store.state.settings.autoSave },
                        set: { _ in store.dispatch(.toggleAutoSave) }
                    ))
                }
            }
            .padding()
            .background(Color(.systemBackground))
            .cornerRadius(12)
        }
    }
    
    /// Actions section with interactive controls
    private var actionsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Actions")
                .font(.title2)
                .fontWeight(.bold)
            
            VStack(spacing: 12) {
                // Update Name
                VStack(alignment: .leading, spacing: 8) {
                    Text("Update User Name")
                        .font(.headline)
                    
                    HStack {
                        TextField("Enter new name", text: $newUserName)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                        
                        Button("Update") {
                            if !newUserName.isEmpty {
                                store.dispatch(.updateUserName(newUserName))
                                newUserName = ""
                            }
                        }
                        .buttonStyle(.borderedProminent)
                        .disabled(newUserName.isEmpty)
                    }
                }
                
                // Increment Score
                VStack(alignment: .leading, spacing: 8) {
                    Text("Increment Score")
                        .font(.headline)
                    
                    HStack {
                        Stepper("Amount: \(scoreIncrement)", value: $scoreIncrement, in: 1...100)
                        
                        Button("Add \(scoreIncrement)") {
                            store.dispatch(.incrementScore(scoreIncrement))
                        }
                        .buttonStyle(.borderedProminent)
                    }
                }
                
                // Quick Actions
                VStack(alignment: .leading, spacing: 8) {
                    Text("Quick Actions")
                        .font(.headline)
                    
                    HStack {
                        Button("Reset Score") {
                            store.dispatch(.resetScore)
                        }
                        .buttonStyle(.bordered)
                        
                        Button("Reset Profile") {
                            store.dispatch(.resetProfile)
                        }
                        .buttonStyle(.bordered)
                        
                        Button("Reset All") {
                            store.dispatch(.resetAll)
                        }
                        .buttonStyle(.bordered)
                        .foregroundColor(.red)
                    }
                }
                
                // Batch Actions
                VStack(alignment: .leading, spacing: 8) {
                    Text("Batch Actions")
                        .font(.headline)
                    
                    Button("Setup Demo User") {
                        store.dispatch([
                            .updateUserName("Demo User"),
                            .incrementScore(100),
                            .toggleDarkMode
                        ])
                    }
                    .buttonStyle(.borderedProminent)
                    .frame(maxWidth: .infinity)
                }
            }
            .padding()
            .background(Color(.systemBackground))
            .cornerRadius(12)
        }
    }
    
    /// State debug section showing current state
    private var stateDebugSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Current State")
                .font(.title2)
                .fontWeight(.bold)
            
            VStack(alignment: .leading, spacing: 8) {
                Text("AppState:")
                    .font(.headline)
                
                Text(store.state.description)
                    .font(.system(.caption, design: .monospaced))
                    .foregroundColor(.secondary)
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(8)
            }
            .padding()
            .background(Color(.systemBackground))
            .cornerRadius(12)
        }
    }
}

// MARK: - Preview

struct AppStoreExample_Previews: PreviewProvider {
    static var previews: some View {
        AppStoreExample()
    }
}

// MARK: - Additional Example Views

/// Example view showing how to use the store in a child view
struct ProfileView: View {
    @ObservedObject var store: AppStore
    
    var body: some View {
        VStack(spacing: 16) {
            Text("Profile View")
                .font(.title)
                .fontWeight(.bold)
            
            VStack(spacing: 12) {
                Text("Name: \(store.state.profile.name)")
                Text("Score: \(store.state.profile.score)")
                
                Button("Increment Score") {
                    store.dispatch(.incrementScore(10))
                }
                .buttonStyle(.borderedProminent)
            }
            .padding()
            .background(Color(.systemBackground))
            .cornerRadius(12)
        }
        .padding()
    }
}

/// Example view showing settings management
struct SettingsView: View {
    @ObservedObject var store: AppStore
    
    var body: some View {
        VStack(spacing: 16) {
            Text("Settings View")
                .font(.title)
                .fontWeight(.bold)
            
            VStack(spacing: 12) {
                HStack {
                    Text("Dark Mode")
                    Spacer()
                    Toggle("", isOn: Binding(
                        get: { store.state.settings.isDarkMode },
                        set: { _ in store.dispatch(.toggleDarkMode) }
                    ))
                }
                
                HStack {
                    Text("Notifications")
                    Spacer()
                    Toggle("", isOn: Binding(
                        get: { store.state.settings.notificationsEnabled },
                        set: { _ in store.dispatch(.toggleNotifications) }
                    ))
                }
                
                HStack {
                    Text("Auto Save")
                    Spacer()
                    Toggle("", isOn: Binding(
                        get: { store.state.settings.autoSave },
                        set: { _ in store.dispatch(.toggleAutoSave) }
                    ))
                }
            }
            .padding()
            .background(Color(.systemBackground))
            .cornerRadius(12)
        }
        .padding()
    }
}

// MARK: - Environment Key for AppStore

/// Environment key for injecting the AppStore into the view hierarchy
struct AppStoreKey: EnvironmentKey {
    static let defaultValue: AppStore = AppStore()
}

extension EnvironmentValues {
    var appStore: AppStore {
        get { self[AppStoreKey.self] }
        set { self[AppStoreKey.self] = newValue }
    }
}

// MARK: - View Modifier for AppStore

/// View modifier for injecting the AppStore into the environment
struct AppStoreModifier: ViewModifier {
    let store: AppStore
    
    func body(content: Content) -> some View {
        content.environment(\.appStore, store)
    }
}

extension View {
    func appStore(_ store: AppStore) -> some View {
        modifier(AppStoreModifier(store: store))
    }
} 