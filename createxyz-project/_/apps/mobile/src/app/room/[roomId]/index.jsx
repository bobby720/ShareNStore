import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  HardDrive,
  ArrowLeft,
  Upload,
  Download,
  Trash2,
  FileImage,
  FileVideo,
  FileText,
  Music,
  Plus,
  Share,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

export default function RoomDashboard() {
  const [roomData, setRoomData] = useState(null);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const { roomId, password } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (roomId && password) {
      fetchRoomData();
      fetchFiles();
    }
  }, [roomId, password]);

  const fetchRoomData = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch room data");
      }

      const data = await response.json();
      setRoomData(data);
    } catch (error) {
      console.error("Error fetching room data:", error);
      Alert.alert("Error", "Failed to load room data");
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/files`, {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      Alert.alert("Error", "Failed to load files");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchRoomData(), fetchFiles()]);
    setRefreshing(false);
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return FileImage;
    if (fileType.startsWith("video/")) return FileVideo;
    if (fileType.startsWith("audio/")) return Music;
    return FileText;
  };

  const getFileIconColor = (fileType) => {
    if (fileType.startsWith("image/")) return "#10B981";
    if (fileType.startsWith("video/")) return "#8B5CF6";
    if (fileType.startsWith("audio/")) return "#F59E0B";
    return "#3B82F6";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatStorageUsed = (bytes) => {
    return formatFileSize(bytes);
  };

  const formatStorageLimit = (bytes) => {
    return formatFileSize(bytes);
  };

  const getStoragePercentage = () => {
    if (!roomData) return 0;
    return Math.min(
      (roomData.storage_used / roomData.storage_limit) * 100,
      100,
    );
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "video/*", "audio/*", "application/pdf", "text/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        Alert.alert("File Too Large", "Files must be smaller than 100MB");
        return;
      }

      // Check storage limit
      if (
        roomData &&
        roomData.storage_used + file.size > roomData.storage_limit
      ) {
        Alert.alert(
          "Storage Limit Exceeded",
          "This file would exceed your storage limit",
        );
        return;
      }

      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: file.mimeType,
        name: file.name,
      });

      const response = await fetch(`/api/rooms/${roomId}/files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${password}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      Alert.alert("Success", "File uploaded successfully");
      await Promise.all([fetchRoomData(), fetchFiles()]);
    } catch (error) {
      console.error("Error uploading file:", error);
      Alert.alert("Upload Failed", "Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDelete = async (fileId, fileName) => {
    Alert.alert(
      "Delete File",
      `Are you sure you want to delete "${fileName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `/api/rooms/${roomId}/files/${fileId}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${password}`,
                  },
                },
              );

              if (!response.ok) {
                throw new Error("Failed to delete file");
              }

              Alert.alert("Success", "File deleted successfully");
              await Promise.all([fetchRoomData(), fetchFiles()]);
            } catch (error) {
              console.error("Error deleting file:", error);
              Alert.alert(
                "Delete Failed",
                "Failed to delete file. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const navigateBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0A0A0A",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar style="light" />
        <Text style={{ color: "white", fontSize: 18 }}>Loading room...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <StatusBar style="light" />

      <LinearGradient
        colors={["#0A0A0A", "#1A1A2E", "#16213E"]}
        style={{ position: "absolute", width: "100%", height: "100%" }}
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

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
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
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
              ShareNStore
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#06B6D4"
          />
        }
      >
        <View style={{ paddingHorizontal: 24 }}>
          {/* Room Info */}
          {roomData && (
            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 20,
                padding: 20,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 4,
                  }}
                >
                  {roomData.room_name}
                </Text>
                <Text
                  style={{
                    color: "#06B6D4",
                    fontSize: 14,
                    fontFamily: "monospace",
                  }}
                >
                  {roomData.room_id}
                </Text>
              </View>

              {/* Storage Bar */}
              <View style={{ marginBottom: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: "#D1D5DB", fontSize: 14 }}>
                    Storage Usage
                  </Text>
                  <Text
                    style={{
                      color: "#06B6D4",
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    {formatStorageUsed(roomData.storage_used)} /{" "}
                    {formatStorageLimit(roomData.storage_limit)}
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    height: 8,
                    backgroundColor: "#374151",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <LinearGradient
                    colors={["#06B6D4", "#3B82F6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      height: "100%",
                      width: `${getStoragePercentage()}%`,
                      borderRadius: 4,
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: "#9CA3AF",
                    fontSize: 12,
                    marginTop: 4,
                    textAlign: "center",
                  }}
                >
                  {getStoragePercentage().toFixed(1)}% used
                </Text>
              </View>
            </View>
          )}

          {/* Upload Button */}
          <Pressable
            onPress={handleFileUpload}
            disabled={isUploading}
            style={({ pressed }) => ({
              marginBottom: 24,
              overflow: "hidden",
              borderRadius: 16,
              opacity: isUploading ? 0.5 : 1,
              transform: [{ scale: pressed && !isUploading ? 0.98 : 1 }],
            })}
          >
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 24,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <Upload size={20} color="white" />
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                {isUploading ? "Uploading..." : "Upload Files"}
              </Text>
            </LinearGradient>
          </Pressable>

          {/* Files Section */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 16,
              }}
            >
              Files ({files.length})
            </Text>

            {files.length === 0 ? (
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 16,
                  padding: 40,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <View
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: "rgba(107, 114, 128, 0.2)",
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Upload size={28} color="#6B7280" />
                </View>
                <Text
                  style={{
                    color: "#9CA3AF",
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  No files uploaded yet
                </Text>
                <Text
                  style={{
                    color: "#6B7280",
                    fontSize: 14,
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  Upload your first file to get started
                </Text>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {files.map((file) => {
                  const FileIcon = getFileIcon(file.file_type);
                  const iconColor = getFileIconColor(file.file_type);

                  return (
                    <View
                      key={file.id}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRadius: 16,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <View
                          style={{
                            width: 48,
                            height: 48,
                            backgroundColor: `${iconColor}20`,
                            borderRadius: 12,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FileIcon size={24} color={iconColor} />
                        </View>

                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              color: "white",
                              fontSize: 16,
                              fontWeight: "500",
                              marginBottom: 2,
                            }}
                          >
                            {file.file_name}
                          </Text>
                          <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
                            {formatFileSize(file.file_size)} •{" "}
                            {new Date(file.uploaded_at).toLocaleDateString()}
                          </Text>
                        </View>

                        <View style={{ flexDirection: "row", gap: 8 }}>
                          <Pressable
                            onPress={() => {
                              // Handle download - would typically open the file URL
                              Alert.alert(
                                "Download",
                                `Opening ${file.file_name}`,
                              );
                            }}
                            style={({ pressed }) => ({
                              padding: 8,
                              backgroundColor: "rgba(6, 182, 212, 0.2)",
                              borderRadius: 8,
                              transform: [{ scale: pressed ? 0.95 : 1 }],
                            })}
                          >
                            <Download size={16} color="#06B6D4" />
                          </Pressable>

                          <Pressable
                            onPress={() =>
                              handleFileDelete(file.id, file.file_name)
                            }
                            style={({ pressed }) => ({
                              padding: 8,
                              backgroundColor: "rgba(239, 68, 68, 0.2)",
                              borderRadius: 8,
                              transform: [{ scale: pressed ? 0.95 : 1 }],
                            })}
                          >
                            <Trash2 size={16} color="#EF4444" />
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
