//
//  LoginExampleView.swift
//  Aether SwiftUI App
//
//  Example view demonstrating the LoginButtonView usage
//

import SwiftUI

/// Example view demonstrating the LoginButtonView usage
///
/// This view shows how to integrate the LoginButtonView into a complete
/// login screen with proper state management and user feedback.
struct LoginExampleView: View {
    @State private var username = ""
    @State private var password = ""
    @State private var isLoggedIn = false
    @State private var currentUser: LoginButtonView.User?
    @State private var errorMessage: String?
    @State private var showSuccessAlert = false
    
    var body: some View {
        NavigationView {
            ZStack {
                // Background gradient
                LinearGradient(
                    gradient: Gradient(colors: [
                        Color.blue.opacity(0.1),
                        Color.purple.opacity(0.1)
                    ]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 30) {
                        // Header
                        VStack(spacing: 16) {
                            Image(systemName: "person.circle.fill")
                                .font(.system(size: 80))
                                .foregroundColor(.blue)
                            
                            Text("Welcome to Aether")
                                .font(.largeTitle)
                                .fontWeight(.bold)
                            
                            Text("Sign in to continue your journey")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                        }
                        .padding(.top, 40)
                        
                        if isLoggedIn, let user = currentUser {
                            // Success view
                            VStack(spacing: 24) {
                                Image(systemName: "checkmark.circle.fill")
                                    .font(.system(size: 80))
                                    .foregroundColor(.green)
                                    .scaleEffect(showSuccessAlert ? 1.1 : 1.0)
                                    .animation(.spring(response: 0.5, dampingFraction: 0.6), value: showSuccessAlert)
                                
                                VStack(spacing: 8) {
                                    Text("Welcome back!")
                                        .font(.title2)
                                        .fontWeight(.semibold)
                                    
                                    Text(user.username)
                                        .font(.title3)
                                        .fontWeight(.medium)
                                        .foregroundColor(.blue)
                                }
                                
                                VStack(spacing: 12) {
                                    Text("You have successfully logged in to Aether.")
                                        .font(.body)
                                        .foregroundColor(.secondary)
                                        .multilineTextAlignment(.center)
                                    
                                    Text("User ID: \(user.id)")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                        .fontWeight(.monospaced)
                                }
                                
                                Button("Sign Out") {
                                    logout()
                                }
                                .buttonStyle(.borderedProminent)
                                .controlSize(.large)
                            }
                            .padding(.horizontal, 32)
                            .onAppear {
                                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                                    showSuccessAlert = true
                                }
                            }
                        } else {
                            // Login form
                            VStack(spacing: 24) {
                                // Login form fields
                                VStack(spacing: 20) {
                                    // Username field
                                    VStack(alignment: .leading, spacing: 8) {
                                        Label("Username", systemImage: "person.fill")
                                            .font(.subheadline)
                                            .fontWeight(.medium)
                                            .foregroundColor(.primary)
                                        
                                        TextField("Enter your username", text: $username)
                                            .textFieldStyle(RoundedBorderTextFieldStyle())
                                            .autocapitalization(.none)
                                            .disableAutocorrection(true)
                                            .overlay(
                                                RoundedRectangle(cornerRadius: 8)
                                                    .stroke(Color.blue.opacity(0.3), lineWidth: 1)
                                            )
                                    }
                                    
                                    // Password field
                                    VStack(alignment: .leading, spacing: 8) {
                                        Label("Password", systemImage: "lock.fill")
                                            .font(.subheadline)
                                            .fontWeight(.medium)
                                            .foregroundColor(.primary)
                                        
                                        SecureField("Enter your password", text: $password)
                                            .textFieldStyle(RoundedBorderTextFieldStyle())
                                            .overlay(
                                                RoundedRectangle(cornerRadius: 8)
                                                    .stroke(Color.blue.opacity(0.3), lineWidth: 1)
                                            )
                                    }
                                }
                                .padding(.horizontal, 32)
                                
                                // Login button
                                LoginButtonView(
                                    username: $username,
                                    password: $password,
                                    onLoginSuccess: { user in
                                        currentUser = user
                                        isLoggedIn = true
                                        errorMessage = nil
                                    },
                                    onLoginError: { error in
                                        errorMessage = error.localizedDescription
                                    }
                                )
                                
                                // Error message
                                if let errorMessage = errorMessage {
                                    HStack {
                                        Image(systemName: "exclamationmark.triangle.fill")
                                            .foregroundColor(.red)
                                        Text(errorMessage)
                                            .font(.caption)
                                            .foregroundColor(.red)
                                    }
                                    .padding(.horizontal, 32)
                                    .transition(.opacity.combined(with: .scale))
                                }
                                
                                // Demo instructions
                                VStack(spacing: 12) {
                                    Text("Demo Instructions")
                                        .font(.headline)
                                        .fontWeight(.semibold)
                                    
                                    VStack(alignment: .leading, spacing: 6) {
                                        Text("• Fill in any username and password")
                                        Text("• Tap the login button to see the animation")
                                        Text("• The system will randomly succeed or fail")
                                        Text("• Watch the Rive animation transitions")
                                    }
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                }
                                .padding(.horizontal, 32)
                                .padding(.vertical, 16)
                                .background(
                                    RoundedRectangle(cornerRadius: 12)
                                        .fill(Color(.systemGray6))
                                )
                                .padding(.horizontal, 32)
                            }
                        }
                        
                        Spacer(minLength: 40)
                    }
                }
            }
            .navigationTitle("Aether Login")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarHidden(true)
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
    
    /// Handle logout action
    private func logout() {
        withAnimation(.easeInOut(duration: 0.3)) {
            isLoggedIn = false
            currentUser = nil
            username = ""
            password = ""
            errorMessage = nil
            showSuccessAlert = false
        }
    }
}

// MARK: - Preview
struct LoginExampleView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            // Light mode
            LoginExampleView()
                .previewDisplayName("Light Mode")
            
            // Dark mode
            LoginExampleView()
                .preferredColorScheme(.dark)
                .previewDisplayName("Dark Mode")
        }
    }
} 