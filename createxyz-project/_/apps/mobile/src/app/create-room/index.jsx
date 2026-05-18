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
  Key,
  Lock,
  Copy,
  CheckCircle,
  Plus,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";

export default function CreateRoomPage() {
  const [formData, setFormData] = useState({
    roomName: "",
    adminPassword: "",
    confirmPassword: "",
  });
  const [generatedRoomId, setGeneratedRoomId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const generateRoomId = () => {
    const prefix = "VR";
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${year}-${random}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.roomName.trim()) {
      newErrors.roomName = "Room name is required";
    }

    if (!formData.adminPassword) {
      newErrors.adminPassword = "Admin password is required";
    } else if (formData.adminPassword.length < 6) {
      newErrors.adminPassword = "Password must be at least 6 characters";
    }

    if (formData.adminPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateRoom = async () => {
    if (!validateForm()) return;

    setIsCreating(true);

    try {
      const roomId = generateRoomId();

      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          roomName: formData.roomName.trim(),
          adminPassword: formData.adminPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      setGeneratedRoomId(roomId);
      setIsCreated(true);
    } catch (error) {
      console.error("Error creating room:", error);
      setErrors({ general: "Failed to create room. Please try again." });
      Alert.alert("Error", "Failed to create room. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const copyRoomId = async () => {
    try {
      // For mobile, we'll use the Expo clipboard
      await navigator.clipboard.writeText(generatedRoomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      Alert.alert("Copied!", "Room ID copied to clipboard");
    } catch (error) {
      console.error("Failed to copy:", error);
      Alert.alert("Error", "Failed to copy Room ID");
    }
  };

  const navigateBack = () => {
    router.back();
  };

  const navigateToRoom = () => {
    router.push(
      `/room/${generatedRoomId}?password=${encodeURIComponent(formData.adminPassword)}`,
    );
  };

  if (isCreated) {
    return (
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
            backgroundColor: "rgba(34, 197, 94, 0.1)",
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
            backgroundColor: "rgba(6, 182, 212, 0.1)",
          }}
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 40,
            justifyContent: "center",
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 24, paddingTop: insets.top + 40 }}>
            <View style={{ alignItems: "center", marginBottom: 32 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: "rgba(34, 197, 94, 0.2)",
                  borderRadius: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                }}
              >
                <CheckCircle size={40} color="#22C55E" />
              </View>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                Room Created!
              </Text>
              <Text
                style={{ color: "#D1D5DB", textAlign: "center", fontSize: 16 }}
              >
                Your virtual storage room is ready to use
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
              <View style={{ alignItems: "center", marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "white",
                    marginBottom: 8,
                  }}
                >
                  Room Details
                </Text>
                <Text
                  style={{
                    color: "#9CA3AF",
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  Save these details securely
                </Text>
              </View>

              <View style={{ gap: 16 }}>
                <View>
                  <Text
                    style={{ color: "#D1D5DB", fontSize: 14, marginBottom: 8 }}
                  >
                    Room Name
                  </Text>
                  <View
                    style={{
                      padding: 16,
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "500" }}>
                      {formData.roomName}
                    </Text>
                  </View>
                </View>

                <View>
                  <Text
                    style={{ color: "#D1D5DB", fontSize: 14, marginBottom: 8 }}
                  >
                    Room ID
                  </Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <View
                      style={{
                        flex: 1,
                        padding: 16,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <Text
                        style={{
                          color: "#06B6D4",
                          fontWeight: "600",
                          fontFamily: "monospace",
                        }}
                      >
                        {generatedRoomId}
                      </Text>
                    </View>
                    <Pressable
                      onPress={copyRoomId}
                      style={({ pressed }) => ({
                        padding: 16,
                        backgroundColor: "rgba(6, 182, 212, 0.2)",
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "rgba(6, 182, 212, 0.3)",
                        transform: [{ scale: pressed ? 0.95 : 1 }],
                      })}
                    >
                      {copied ? (
                        <CheckCircle size={20} color="#06B6D4" />
                      ) : (
                        <Copy size={20} color="#06B6D4" />
                      )}
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ gap: 16 }}>
              <Pressable
                onPress={navigateToRoom}
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
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 18, fontWeight: "600" }}
                  >
                    Enter Room
                  </Text>
                </LinearGradient>
              </Pressable>

              <Pressable
                onPress={navigateBack}
                style={({ pressed }) => ({
                  paddingVertical: 18,
                  paddingHorizontal: 32,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  alignItems: "center",
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "600" }}
                >
                  Create Another
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

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
                <Plus size={28} color="#06B6D4" />
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
                Create Storage Room
              </Text>
              <Text
                style={{ fontSize: 16, color: "#D1D5DB", textAlign: "center" }}
              >
                Set up your secure virtual storage space
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 24,
                padding: 24,
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
                    Room Name
                  </Text>
                  <TextInput
                    value={formData.roomName}
                    onChangeText={(text) =>
                      setFormData({ ...formData, roomName: text })
                    }
                    placeholder="e.g., My Project Files"
                    placeholderTextColor="#9CA3AF"
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={{
                      padding: 16,
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: errors.roomName
                        ? "rgba(239, 68, 68, 0.5)"
                        : "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      fontSize: 16,
                    }}
                  />
                  {errors.roomName && (
                    <Text
                      style={{ color: "#F87171", fontSize: 12, marginTop: 8 }}
                    >
                      {errors.roomName}
                    </Text>
                  )}
                </View>

                <View>
                  <Text
                    style={{ color: "#D1D5DB", fontSize: 14, marginBottom: 12 }}
                  >
                    Admin Password
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
                      value={formData.adminPassword}
                      onChangeText={(text) =>
                        setFormData({ ...formData, adminPassword: text })
                      }
                      placeholder="Enter secure password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      style={{
                        paddingLeft: 48,
                        paddingRight: 16,
                        paddingVertical: 16,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: errors.adminPassword
                          ? "rgba(239, 68, 68, 0.5)"
                          : "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontSize: 16,
                      }}
                    />
                  </View>
                  {errors.adminPassword && (
                    <Text
                      style={{ color: "#F87171", fontSize: 12, marginTop: 8 }}
                    >
                      {errors.adminPassword}
                    </Text>
                  )}
                </View>

                <View>
                  <Text
                    style={{ color: "#D1D5DB", fontSize: 14, marginBottom: 12 }}
                  >
                    Confirm Password
                  </Text>
                  <View style={{ position: "relative" }}>
                    <Key
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
                      value={formData.confirmPassword}
                      onChangeText={(text) =>
                        setFormData({ ...formData, confirmPassword: text })
                      }
                      placeholder="Confirm your password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      style={{
                        paddingLeft: 48,
                        paddingRight: 16,
                        paddingVertical: 16,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: errors.confirmPassword
                          ? "rgba(239, 68, 68, 0.5)"
                          : "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontSize: 16,
                      }}
                    />
                  </View>
                  {errors.confirmPassword && (
                    <Text
                      style={{ color: "#F87171", fontSize: 12, marginTop: 8 }}
                    >
                      {errors.confirmPassword}
                    </Text>
                  )}
                </View>
              </View>

              <Pressable
                onPress={handleCreateRoom}
                disabled={isCreating}
                style={({ pressed }) => ({
                  marginTop: 32,
                  overflow: "hidden",
                  borderRadius: 16,
                  opacity: isCreating ? 0.5 : 1,
                  transform: [{ scale: pressed && !isCreating ? 0.98 : 1 }],
                })}
              >
                <LinearGradient
                  colors={["#06B6D4", "#3B82F6"]}
                  style={{
                    paddingVertical: 18,
                    paddingHorizontal: 32,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 18, fontWeight: "600" }}
                  >
                    {isCreating ? "Creating Room..." : "Create Room"}
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
