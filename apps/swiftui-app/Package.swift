// swift-tools-version:5.7
import PackageDescription

let package = Package(
    name: "iOSOnlySwiftUI",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "iOSOnlySwiftUI",
            targets: ["iOSOnlySwiftUI"])
    ],
    dependencies: [],
    targets: [
        .target(
            name: "iOSOnlySwiftUI",
            dependencies: [],
            path: "Sources/iOSOnlySwiftUI"),
        .testTarget(
            name: "iOSOnlySwiftUITests",
            dependencies: ["iOSOnlySwiftUI"],
            path: "Tests/iOSOnlySwiftUITests")
    ]
) 