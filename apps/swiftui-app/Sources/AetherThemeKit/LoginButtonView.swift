//
//  LoginButtonView.swift
//  Aether SwiftUI App
//
//  A SwiftUI view that implements an interactive login button with
//  smooth animations and state management.
//

import SwiftUI

/// SwiftUI view that implements an interactive login button with animations
///
/// This view creates a login button that:
/// - Uses SwiftUI animations for visual feedback
/// - Transitions through different states (Idle, Loading, Success, Error)
/// - Simulates network requests with proper state management
/// - Provides smooth animations and user feedback
///
/// Usage:
/// ```swift
/// LoginButtonView(
///     username: $username,
///     password: $password,
///     onLoginSuccess: { user in
///         // Handle successful login
///     },
///     onLoginError: { error in
///         // Handle login error
///     }
/// )
/// ```
struct LoginButtonView: View {
    
    /// Username input binding
    @Binding var username: String
    
    /// Password input binding
    @Binding var password: String
    
    /// Callback for successful login
    let onLoginSuccess: (User) -> Void
    
    /// Callback for login error
    let onLoginError: (LoginError) -> Void
    
    /// Current button state
    @State private var buttonState: ButtonState = .idle
    
    /// Network request simulation timer
    @State private var requestTimer: Timer?
    
    /// Button state enumeration
    private enum ButtonState {
        case idle
        case loading
        case success
        case error
    }
    
    /// User model for successful login
    struct User {
        let id: String
        let username: String
        let email: String
    }
    
    /// Login error enumeration
    enum LoginError: Error, LocalizedError {
        case invalidCredentials
        case networkError
        case serverError
        
        var errorDescription: String? {
            switch self {
            case .invalidCredentials:
                return "Invalid username or password"
            case .networkError:
                return "Network connection error"
            case .serverError:
                return "Server error occurred"
            }
        }
    }
    
    /// Initialize the login button view
    /// - Parameters:
    ///   - username: Binding to username input
    ///   - password: Binding to password input
    ///   - onLoginSuccess: Callback for successful login
    ///   - onLoginError: Callback for login error
    init(
        username: Binding<String>,
        password: Binding<String>,
        onLoginSuccess: @escaping (User) -> Void,
        onLoginError: @escaping (LoginError) -> Void
    ) {
        self._username = username
        self._password = password
        self.onLoginSuccess = onLoginSuccess
        self.onLoginError = onLoginError
    }
    
    var body: some View {
        VStack(spacing: 20) {
            // Login form
            VStack(spacing: 16) {
                // Username field
                VStack(alignment: .leading, spacing: 8) {
                    Text("Username")
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundColor(.primary)
                    
                    TextField("Enter your username", text: $username)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                        .disabled(buttonState == .loading)
                }
                
                // Password field
                VStack(alignment: .leading, spacing: 8) {
                    Text("Password")
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundColor(.primary)
                    
                    SecureField("Enter your password", text: $password)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .disabled(buttonState == .loading)
                }
            }
            .padding(.horizontal)
            
            // Login button with animations
            Button(action: handleLoginTap) {
                HStack(spacing: 8) {
                    if buttonState == .loading {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            .scaleEffect(0.8)
                    } else {
                        Image(systemName: buttonIcon)
                            .font(.system(size: 16, weight: .medium))
                    }
                    
                    Text(buttonText)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                }
                .frame(maxWidth: .infinity)
                .frame(height: 56)
                .background(buttonBackgroundColor)
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(buttonBorderColor, lineWidth: 1)
                )
            }
            .disabled(buttonState == .loading || !isFormValid)
            .scaleEffect(buttonState == .loading ? 0.98 : 1.0)
            .animation(.easeInOut(duration: 0.2), value: buttonState)
            
            // Status message
            if let statusMessage = statusMessage {
                Text(statusMessage)
                    .font(.caption)
                    .foregroundColor(statusColor)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                    .transition(.opacity.combined(with: .scale))
            }
        }
        .padding(.vertical)
        .onDisappear {
            cleanupTimer()
        }
    }
    
    /// Button text based on current state
    private var buttonText: String {
        switch buttonState {
        case .idle:
            return "Sign In"
        case .loading:
            return "Signing In..."
        case .success:
            return "Success!"
        case .error:
            return "Try Again"
        }
    }
    
    /// Button icon based on current state
    private var buttonIcon: String {
        switch buttonState {
        case .idle:
            return "person.fill"
        case .loading:
            return ""
        case .success:
            return "checkmark.circle.fill"
        case .error:
            return "exclamationmark.triangle.fill"
        }
    }
    
    /// Button background color based on current state
    private var buttonBackgroundColor: Color {
        switch buttonState {
        case .idle:
            return .blue
        case .loading:
            return .blue.opacity(0.7)
        case .success:
            return .green
        case .error:
            return .red
        }
    }
    
    /// Button border color based on current state
    private var buttonBorderColor: Color {
        switch buttonState {
        case .idle:
            return .clear
        case .loading:
            return .clear
        case .success:
            return .green.opacity(0.3)
        case .error:
            return .red.opacity(0.3)
        }
    }
    
    /// Status message based on current state
    private var statusMessage: String? {
        switch buttonState {
        case .idle:
            return nil
        case .loading:
            return "Authenticating..."
        case .success:
            return "Login successful!"
        case .error:
            return "Login failed. Please try again."
        }
    }
    
    /// Status color based on current state
    private var statusColor: Color {
        switch buttonState {
        case .idle:
            return .primary
        case .loading:
            return .blue
        case .success:
            return .green
        case .error:
            return .red
        }
    }
    
    /// Check if form is valid
    private var isFormValid: Bool {
        !username.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
        !password.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }
    
    /// Handle login button tap
    private func handleLoginTap() {
        guard isFormValid else { return }
        
        // Start loading state
        withAnimation(.easeInOut(duration: 0.3)) {
            buttonState = .loading
        }
        
        // Simulate network request
        simulateLoginRequest()
    }
    
    /// Simulate login network request
    private func simulateLoginRequest() {
        // Cancel any existing timer
        cleanupTimer()
        
        // Simulate network delay
        requestTimer = Timer.scheduledTimer(withTimeInterval: 2.0, repeats: false) { _ in
            DispatchQueue.main.async {
                self.handleLoginResponse()
            }
        }
    }
    
    /// Handle login response
    private func handleLoginResponse() {
        // Simulate random success/failure for demo purposes
        let isSuccess = Bool.random()
        
        withAnimation(.easeInOut(duration: 0.3)) {
            if isSuccess {
                buttonState = .success
                
                // Create mock user
                let user = User(
                    id: UUID().uuidString,
                    username: username,
                    email: "\(username)@example.com"
                )
                
                // Call success callback after delay
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                    self.onLoginSuccess(user)
                    self.resetToIdle()
                }
            } else {
                buttonState = .error
                
                // Call error callback
                let error: LoginError = [.invalidCredentials, .networkError, .serverError].randomElement()!
                self.onLoginError(error)
                
                // Reset to idle after delay
                DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                    self.resetToIdle()
                }
            }
        }
    }
    
    /// Reset button to idle state
    private func resetToIdle() {
        withAnimation(.easeInOut(duration: 0.3)) {
            buttonState = .idle
        }
    }
    
    /// Clean up timer
    private func cleanupTimer() {
        requestTimer?.invalidate()
        requestTimer = nil
    }
}

// MARK: - Preview
#Preview {
    LoginButtonView(
        username: .constant("testuser"),
        password: .constant("password123"),
        onLoginSuccess: { user in
            print("Login successful for user: \(user.username)")
        },
        onLoginError: { error in
            print("Login error: \(error.localizedDescription)")
        }
    )
    .padding()
} 