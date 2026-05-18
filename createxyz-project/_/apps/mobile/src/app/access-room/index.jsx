import { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Animated,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  HardDrive,
  ArrowLeft,
  Lock,
  Search,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";

export default function AccessRoomPage() {
  const [formData, setFormData] = useState({
    roomId: "",
    password: "",
  });
  const [isAccessing, setIsAccessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const focusedPadding = 12;
  const paddingAnimation = useRef(
    new Animated.Value(insets.bottom + focusedPadding),
  ).current;

  const animateTo = (value) => {
    Animated.timing(paddingAnimation, {
      toValue: value,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleInputFocus = () => {
    if (Platform.OS === "web") {
      return;
    }
    animateTo(focusedPadding);
  };

  const handleInputBlur = () => {
    if (Platform.OS === "web") {
      return;
    }
    animateTo(insets.bottom + focusedPadding);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.roomId.trim()) {
      newErrors.roomId = "Room ID is required";
    } else if (!/^VR-\d{4}-[A-Z0-9]{6}$/.test(formData.roomId.trim())) {
      newErrors.roomId = "Invalid Room ID format (e.g., VR-2024-ABC123)";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAccessRoom = async () => {
    if (!validateForm()) return;

    setIsAccessing(true);

    try {
      const response = await fetch("/api/rooms/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: formData.roomId.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to access room");
      }

      // Navigate to room with password in URL for admin access
      router.push(
        `/room/${formData.roomId.trim()}?password=${encodeURIComponent(formData.password)}`,
      );
    } catch (error) {
      console.error("Error accessing room:", error);
      setErrors({ general: error.message });
      Alert.alert("Access Denied", error.message);
    } finally {
      setIsAccessing(false);
    }
  };

  const navigateBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
      <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
        <StatusBar style="light" />

        <LinearGradient
          colors={["#0A0A0A", "#1A1A2E", "#16213E"]}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />

        {/* Animated background */}
        <View
          style={{
            position: "absolute",
            top: "25%",
            left: "25%",
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: "rgba(59, 130, 246, 0.1)",
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
            backgroundColor: "rgba(147, 51, 234, 0.1)",
          }}
        />

        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 20,
            paddingHorizontal: 24,
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              onPress={navigateBack}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              })}
            >
              <ArrowLeft size={20} color="white" />
              <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
                Back
              </Text>
            </Pressable>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <LinearGradient
                colors={["#06B6D4", "#3B82F6"]}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HardDrive size={16} color="white" />
              </LinearGradient>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
              >
                ShareNStore
              </Text>
            </View>
          </View>
        </View>

        <Animated.ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: paddingAnimation }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 24 }}>
            <View style={{ alignItems: "center", marginBottom: 40 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: "rgba(6, 182, 212, 0.2)",
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                }}
              >
                <Search size={28} color="#06B6D4" />
              </View>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 12,
                  textAlign: "center",
                }}
              >
                Access Storage Room
              </Text>
              <Text
                style={{ fontSize: 16, color: "#D1D5DB", textAlign: "center" }}
              >
                Enter your Room ID and password to access your files
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 24,
                padding: 24,
                marginBottom: 32,
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              {errors.general && (
                <View
                  style={{
                    marginBottom: 24,
                    padding: 16,
                    backgroundColor: "rgba(239, 68, 68, 0.2)",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "rgba(239, 68, 68, 0.3)",
                  }}
                >
                  <Text style={{ color: "#F87171", fontSize: 14 }}>
                    {errors.general}
                  </Text>
                </View>
              )}

              <View style={{ gap: 20 }}>
                <View>
                  <Text
                    style={{ color: "#D1D5DB", fontSize: 14, marginBottom: 12 }}
                  >
                    Room ID
                  </Text>
                  <TextInput
                    value={formData.roomId}
                    onChangeText={(text) =>
                      setFormData({ ...formData, roomId: text.toUpperCase() })
                    }
                    placeholder="VR-2024-ABC123"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="characters"
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={{
                      padding: 16,
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: errors.roomId
                        ? "rgba(239, 68, 68, 0.5)"
                        : "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      fontSize: 16,
                      fontFamily: "monospace",
                    }}
                  />
                  {errors.roomId && (
                    <Text
                      style={{ color: "#F87171", fontSize: 12, marginTop: 8 }}
                    >
                      {errors.roomId}
                    </Text>
                  )}
                  <Text
                    style={{ color: "#9CA3AF", fontSize: 12, marginTop: 8 }}
                  >
                    Format: VR-YEAR-XXXXXX (e.g., VR-2024-ABC123)
                  </Text>
                </View>

                <View>
                  <Text
                    style={{ color: "#D1D5DB", fontSize: 14, marginBottom: 12 }}
                  >
                    Password
                  </Text>
                  <View style={{ position: "relative" }}>
                    <Lock
                      size={16}
                      color="#9CA3AF"
                      style={{
                        position: "absolute",
                        left: 16,
                        top: 18,
                        zIndex: 1,
                      }}
                    />
                    <TextInput
                      value={formData.password}
                      onChangeText={(text) =>
                        setFormData({ ...formData, password: text })
                      }
                      placeholder="Enter room password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={!showPassword}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      style={{
                        paddingLeft: 48,
                        paddingRight: 48,
                        paddingVertical: 16,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: errors.password
                          ? "rgba(239, 68, 68, 0.5)"
                          : "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontSize: 16,
                      }}
                    />
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: 16,
                        top: 18,
                        zIndex: 1,
                      }}
                    >
                      {showPassword ? (
                        <EyeOff size={16} color="#9CA3AF" />
                      ) : (
                        <Eye size={16} color="#9CA3AF" />
                      )}
                    </Pressable>
                  </View>
                  {errors.password && (
                    <Text
                      style={{ color: "#F87171", fontSize: 12, marginTop: 8 }}
                    >
                      {errors.password}
                    </Text>
                  )}
                </View>
              </View>

              <Pressable
                onPress={handleAccessRoom}
                disabled={isAccessing}
                style={({ pressed }) => ({
                  marginTop: 32,
                  overflow: "hidden",
                  borderRadius: 16,
                  opacity: isAccessing ? 0.5 : 1,
                  transform: [{ scale: pressed && !isAccessing ? 0.98 : 1 }],
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
                  <Search size={20} color="white" />
                  <Text
                    style={{ color: "white", fontSize: 18, fontWeight: "600" }}
                  >
                    {isAccessing ? "Accessing..." : "Access Room"}
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>

            {/* Security Notice */}
            <View
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(59, 130, 246, 0.2)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <Shield size={20} color="#3B82F6" />
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                >
                  Security Tips
                </Text>
              </View>
              <View style={{ gap: 8 }}>
                <Text
                  style={{ color: "#D1D5DB", fontSize: 14, lineHeight: 20 }}
                >
                  • Double-check the Room ID format before entering
                </Text>
                <Text
                  style={{ color: "#D1D5DB", fontSize: 14, lineHeight: 20 }}
                >
                  • Only enter passwords on trusted devices
                </Text>
                <Text
                  style={{ color: "#D1D5DB", fontSize: 14, lineHeight: 20 }}
                >
                  • Contact the room admin if you forget the password
                </Text>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
