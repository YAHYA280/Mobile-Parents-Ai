import React, { useState } from "react";
import { useNavigation } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import ProgressBar from "@/components/ProgressBar";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import Header from "../components/Header";
import Button from "../components/Button";
import { SIZES, COLORS } from "../constants";
import { useTheme } from "../theme/ThemeProvider";

type Nav = {
  navigate: (value: string) => void;
};

type DocumentType = {
  uri: string;
  name: string;
  type: string;
  size: number;
};

const RegistrationStep4 = () => {
  const { navigate } = useNavigation<Nav>();
  const { colors, dark } = useTheme();

  const [frontDocument, setFrontDocument] = useState<DocumentType | null>(null);
  const [backDocument, setBackDocument] = useState<DocumentType | null>(null);
  const [autreDocument, setAutreDocument] = useState<DocumentType | null>(null);

  // Function to pick a document from the device
  const pickDocument = async (side: "front" | "back" | "additional") => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const document = result.assets[0];

      // Validate file size (5MB max)
      if (document.size && document.size > 5 * 1024 * 1024) {
        Alert.alert(
          "Fichier trop volumineux",
          "Veuillez choisir un fichier de moins de 5Mo."
        );
        return;
      }

      // Validate file type
      const fileType =
        document.mimeType || document.uri.split(".").pop()?.toLowerCase();
      if (
        fileType !== "jpg" &&
        fileType !== "jpeg" &&
        fileType !== "png" &&
        fileType !== "pdf"
      ) {
        Alert.alert(
          "Format de fichier non supporté",
          "Veuillez sélectionner un fichier au format JPG, PNG ou PDF."
        );
        return;
      }

      if (side === "front") {
        setFrontDocument({
          uri: document.uri,
          name: document.name || "document_recto.jpg",
          type: document.mimeType || "image/jpeg",
          size: document.size || 0,
        });
      } else if (side === "back") {
        setBackDocument({
          uri: document.uri,
          name: document.name || "document_verso.jpg",
          type: document.mimeType || "image/jpeg",
          size: document.size || 0,
        });
      } else {
        setAutreDocument({
          uri: document.uri,
          name: document.name || "document_autre.jpg",
          type: document.mimeType || "image/jpeg",
          size: document.size || 0,
        });
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la sélection du document."
      );
    }
  };

  // Function to remove a document
  const removeDocument = (side: "front" | "back" | "additional") => {
    if (side === "front") {
      setFrontDocument(null);
    } else if (side === "back") {
      setBackDocument(null);
    } else {
      setAutreDocument(null);
    }
  };

  // Display file icon based on file type
  const getFileIcon = (document: DocumentType) => {
    const fileType =
      document.type || document.uri.split(".").pop()?.toLowerCase();

    if (fileType?.includes("pdf")) {
      return (
        <MaterialIcons name="picture-as-pdf" size={36} color={COLORS.primary} />
      );
    }
    return <MaterialIcons name="image" size={36} color={COLORS.primary} />;
  };

  // Render document upload area
  const renderDocumentUploadArea = (
    side: "front" | "back" | "additional",
    document: DocumentType | null
  ) => {
    const titles: Record<string, string> = {
      front: "Recto de la carte d'identité",
      back: "Verso de la carte d'identité",
      additional: "Carte de séjour, permis ou passeport",
    };

    return (
      <View style={styles.uploadSection}>
        <Text style={styles.uploadTitle}>{titles[side]}</Text>

        {!document ? (
          <TouchableOpacity
            style={styles.uploadArea}
            onPress={() => pickDocument(side)}
          >
            <MaterialIcons
              name="file-upload"
              size={48}
              color={COLORS.greyscale400}
            />
            <Text style={styles.uploadText}>
              Cliquez ou glissez-déposez ici
            </Text>
            <Text style={styles.uploadFormats}>
              Formats acceptés : JPG, PNG, PDF
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.documentPreview}>
            {document.type.includes("image") ? (
              <Image
                source={{ uri: document.uri }}
                style={styles.documentImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.pdfPreview}>
                {getFileIcon(document)}
                <Text style={styles.documentName} numberOfLines={1}>
                  {document.name}
                </Text>
              </View>
            )}

            <View style={styles.documentActions}>
              <Text style={styles.documentSize}>
                {(document.size / (1024 * 1024)).toFixed(2)} Mo
              </Text>
              <TouchableOpacity onPress={() => removeDocument(side)}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Inscription" />
        <ProgressBar currentStep={3} steps={["1", "2", "3", "4", "5"]} />
        <Text style={styles.stepTitle}>Téléchargement des Documents</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.instructions}>
            Veuillez télécharger une copie recto/verso de votre Carte
            d&apos;Identité.
          </Text>

          {renderDocumentUploadArea("front", frontDocument)}
          {renderDocumentUploadArea("back", backDocument)}
          {renderDocumentUploadArea("additional", autreDocument)}

          <View style={styles.securityNote}>
            <MaterialIcons name="security" size={20} color={COLORS.primary} />
            <Text style={styles.securityText}>
              Vos documents sont sécurisés et chiffrés. Ils ne seront utilisés
              que pour vérifier votre identité et ne seront pas partagés avec
              des tiers.
            </Text>
          </View>

          {/* Add some space at the bottom */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      <View style={styles.bottomContainer}>
        <Button
          title="Précédent"
          style={styles.prevButton}
          textColor={dark ? COLORS.white : COLORS.primary}
          onPress={() => navigate("registrationStep3")}
        />
        <Button
          title="Suivant"
          filled
          style={styles.nextButton}
          onPress={() => navigate("registrationStep5")}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111",
    textAlign: "center",
  },
  instructions: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    color: "#555",
    textAlign: "center",
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  uploadArea: {
    height: 160,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.greyscale300,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.greyscale100,
  },
  uploadText: {
    fontSize: 14,
    color: COLORS.greyscale400,
    marginTop: 8,
  },
  uploadFormats: {
    fontSize: 12,
    color: COLORS.greyscale400,
    marginTop: 4,
  },
  documentPreview: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.greyscale300,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  documentImage: {
    width: "100%",
    height: 160,
    borderRadius: 4,
    backgroundColor: COLORS.greyscale100,
  },
  pdfPreview: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.greyscale100,
    borderRadius: 4,
  },
  documentName: {
    fontSize: 12,
    color: "#333",
    marginTop: 8,
    maxWidth: "90%",
  },
  documentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  documentSize: {
    fontSize: 12,
    color: COLORS.greyscale500,
  },
  securityNote: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  securityText: {
    fontSize: 12,
    color: "#555",
    marginLeft: 8,
    flex: 1,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 32,
    right: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    alignItems: "center",
  },
  prevButton: {
    width: (SIZES.width - 32) / 2 - 8,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  nextButton: {
    width: (SIZES.width - 32) / 2 - 8,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});

export default RegistrationStep4;
