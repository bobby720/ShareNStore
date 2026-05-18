import { useState } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  HardDrive,
  Plus,
  Search,
  Upload,
  Shield,
  Zap,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const features = [
    {
      icon: HardDrive,
      title: "Virtual Storage Bars",
      description: "Visualize your storage space as intuitive containers",
    },
    {
      icon: Shield,
      title: "Secure Access",
      description: "Password-protected rooms with admin controls",
    },
    {
      icon: Upload,
      title: "Smart File Management",
      description: "Upload images, videos, documents, and audio files",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <StatusBar style="light" />

      {/* Background Gradient */}
      <LinearGradient
        colors={["#0A0A0A", "#1A1A2E", "#16213E"]}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />

      {/* Animated background elements */}
      <View
        style={{
          position: "absolute",
          top: "25%",
          left: "25%",
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: "rgba(147, 51, 234, 0.1)",
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: "25%",
          right: "25%",
          width: 250,
          height: 250,
          borderRadius: 125,
          backgroundColor: "rgba(59, 130, 246, 0.1)",
        }}
      />
      <View
        style={{
          position: "absolute",
          top: "50%",
          right: "33%",
          width: 150,
          height: 150,
          borderRadius: 75,
          backgroundColor: "rgba(34, 197, 94, 0.1)",
        }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 20,
            paddingHorizontal: 24,
            paddingBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <LinearGradient
              colors={["#06B6D4", "#3B82F6"]}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HardDrive size={20} color="white" />
            </LinearGradient>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
              ShareNStore
            </Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={{ paddingHorizontal: 24, paddingTop: 40 }}>
          <View style={{ alignItems: "center", marginBottom: 60 }}>
            <Text
              style={{
                fontSize: 48,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                marginBottom: 16,
                lineHeight: 56,
              }}
            >
              ShareNStore
            </Text>
            <LinearGradient
              colors={["#06B6D4", "#3B82F6", "#8B5CF6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text
                style={{
                  fontSize: 48,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "transparent",
                  lineHeight: 56,
                }}
              >
                Rooms
              </Text>
            </LinearGradient>

            <Text
              style={{
                fontSize: 18,
                color: "#D1D5DB",
                textAlign: "center",
                marginTop: 24,
                marginBottom: 48,
                lineHeight: 28,
                paddingHorizontal: 20,
              }}
            >
              Create secure, password-protected storage spaces. Upload,
              organize, and access your files with futuristic simplicity.
            </Text>

            {/* CTA Buttons */}
            <View style={{ gap: 16, width: "100%" }}>
              <Pressable
                onPress={() => router.push("/create-room")}
                style={({ pressed }) => ({
                  overflow: "hidden",
                  borderRadius: 16,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <LinearGradient
                  colors={["#06B6D4", "#3B82F6"]}
                  style={{
                    paddingVertical: 18,
                    paddingHorizontal: 32,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 12,
                  }}
                >
                  <Plus size={20} color="white" />
                  <Text
                    style={{ color: "white", fontSize: 18, fontWeight: "600" }}
                  >
                    Create Room
                  </Text>
                </LinearGradient>
              </Pressable>

              <Pressable
                onPress={() => router.push("/access-room")}
                style={({ pressed }) => ({
                  paddingVertical: 18,
                  paddingHorizontal: 32,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 12,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <Search size={20} color="white" />
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "600" }}
                >
                  Access Room
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Features Grid */}
          <View style={{ gap: 20, marginBottom: 60 }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <View
                  key={index}
                  style={{
                    padding: 24,
                    borderRadius: 20,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderWidth: 1,
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      backgroundColor: "rgba(6, 182, 212, 0.2)",
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={28} color="#06B6D4" />
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: "white",
                      marginBottom: 8,
                    }}
                  >
                    {feature.title}
                  </Text>
                  <Text style={{ color: "#9CA3AF", lineHeight: 22 }}>
                    {feature.description}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Storage Visualization Demo */}
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "white",
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Visual Storage Management
            </Text>
            <View
              style={{
                width: "100%",
                padding: 24,
                borderRadius: 24,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <Text style={{ color: "white", fontWeight: "500" }}>
                  Room #VR-2024-X9K7
                </Text>
                <Text style={{ color: "#06B6D4", fontWeight: "500" }}>
                  2.4GB / 10GB
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  height: 20,
                  backgroundColor: "#374151",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <LinearGradient
                  colors={["#06B6D4", "#3B82F6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: "100%",
                    width: "24%",
                    borderRadius: 10,
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20,
                  gap: 8,
                }}
              >
                <Zap size={16} color="#06B6D4" />
                <Text style={{ color: "#D1D5DB", fontSize: 14 }}>
                  Real-time storage visualization
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
