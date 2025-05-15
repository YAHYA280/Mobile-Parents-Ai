import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useReducer } from "react";
import { reducer } from "../../utils/reducers/formReducers";
import { validateInput } from "../../utils/actions/formActions";
import { COLORS } from "../../constants";
import Input from "../../components/Input";

type Nav = {
  navigate: (value: string) => void;
};

interface ChangePasswordSectionProps {
  dark: boolean;
  isOpen: boolean;
}

const ChangePasswordSection: React.FC<ChangePasswordSectionProps> = ({
  dark,
  isOpen,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { navigate } = useNavigation<Nav>();

  const initialState = {
    inputValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    inputValidities: {
      password: undefined,
      newPassword: undefined,
      confirmNewPassword: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    []
  );

  const renderModal = () => {
    return (
      <Modal animationType="slide" transparent visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                },
              ]}
            >
              <View style={styles.successIconContainer}>
                <LinearGradient
                  colors={[COLORS.primary, "#3CAE5C"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.successIconGradient}
                >
                  <Ionicons name="checkmark" size={40} color="#FFFFFF" />
                </LinearGradient>
              </View>

              <Text style={styles.modalTitle}>
                Mot de passe modifié avec succès!
              </Text>

              <Text
                style={[
                  styles.modalDescription,
                  { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                ]}
              >
                Lors de la prochaine connexion, veuillez utiliser le nouveau mot
                de passe.
              </Text>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                  setModalVisible(false);
                  navigate("(tabs)");
                }}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[COLORS.primary, "#ff7043"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.continueGradient}
                >
                  <Text style={styles.continueText}>Continuer</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#FFFFFF"
                    style={styles.continueIcon}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  if (!isOpen) return null;

  return (
    <View style={styles.sectionContent}>
      <View
        style={[
          styles.formContainer,
          { backgroundColor: dark ? COLORS.dark2 : "#FFFFFF" },
        ]}
      >
        <Text
          style={[
            styles.formInstructions,
            { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
          ]}
        >
          Vous pouvez modifier votre mot de passe ici. Assurez-vous qu'il
          contient au moins 8 caractères.
        </Text>

        <View style={styles.formInputs}>
          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.password}
            autoCapitalize="none"
            id="password"
            placeholder="Ancien mot de passe"
            placeholderTextColor={
              dark ? COLORS.greyscale500 : COLORS.grayscale400
            }
            icon={require("../../assets/icons/padlock.png")}
            secureTextEntry
            value={formState.inputValues.password}
          />

          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.newPassword}
            autoCapitalize="none"
            id="newPassword"
            placeholder="Nouveau mot de passe"
            placeholderTextColor={
              dark ? COLORS.greyscale500 : COLORS.grayscale400
            }
            icon={require("../../assets/icons/padlock.png")}
            secureTextEntry
            value={formState.inputValues.newPassword}
          />

          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.confirmNewPassword}
            autoCapitalize="none"
            id="confirmNewPassword"
            placeholder="Confirmer nouveau mot de passe"
            placeholderTextColor={
              dark ? COLORS.greyscale500 : COLORS.grayscale400
            }
            icon={require("../../assets/icons/padlock.png")}
            secureTextEntry
            value={formState.inputValues.confirmNewPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[COLORS.primary, "#ff7043"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveGradient}
          >
            <Text style={styles.saveText}>Enregistrer</Text>
            <Ionicons
              name="save-outline"
              size={18}
              color="#FFFFFF"
              style={styles.saveIcon}
            />
          </LinearGradient>
        </TouchableOpacity>

        {renderModal()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContent: {
    marginTop: -16,
    marginBottom: 16,
    paddingBottom: 8,
  },
  formContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  formInstructions: {
    fontSize: 14,
    fontFamily: "regular",
    marginBottom: 16,
    lineHeight: 20,
  },
  formInputs: {
    marginBottom: 16,
  },
  saveButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
    marginRight: 8,
  },
  saveIcon: {
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  successIconContainer: {
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  successIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    fontFamily: "regular",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  continueButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "semibold",
  },
  continueIcon: {
    marginLeft: 8,
  },
});

export default ChangePasswordSection;
