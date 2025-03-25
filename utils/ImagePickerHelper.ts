import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

export const launchImagePicker = async (): Promise<string | undefined> => {
  await checkMediaPermissions();

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
  // Explicitly return undefined if the user cancels
  return undefined;
};

const checkMediaPermissions = async (): Promise<void> => {
  if (Platform.OS !== "web") {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      // Throw an Error instead of rejecting with a string
      throw new Error("We need permission to access your photos");
    }
  }
};
