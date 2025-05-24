import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import ProgressBar from "@/components/ProgressBar";

import Input from "../components/Input";
import Header from "../components/Header";
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";
import { SIZES, icons, COLORS } from "../constants";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";

const initialState = {
  inputValues: {
    fullName: "",
    cin: "",
    phoneNumber: "",
  },
  inputValidities: {
    fullName: false,
    cin: false,
    phoneNumber: false,
  },
  formIsValid: false,
};

type Nav = {
  navigate: (value: string) => void;
};

// Render countries codes modal
const RenderAreasCodesModal = ({
  modalVisible,
  setModalVisible,
  areas,
  setSelectedArea,
}: any) => {
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{ padding: 10, flexDirection: "row" }}
      onPress={() => {
        setSelectedArea(item);
        setModalVisible(false);
      }}
    >
      <Image
        source={{ uri: item.flag }}
        contentFit="contain"
        style={{ height: 30, width: 30, marginRight: 10 }}
      />
      <Text style={{ fontSize: 16, color: "#000" }}>{item.item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal animationType="slide" transparent visible={modalVisible}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{
              height: SIZES.height,
              width: SIZES.width,
              backgroundColor: COLORS.primary,
              borderRadius: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeBtn}
            >
              <Ionicons name="close-outline" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <FlatList
              data={areas}
              renderItem={renderItem}
              keyExtractor={(item) => item.code}
              style={{ padding: 20, marginBottom: 20 }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const RegistrationStep1 = () => {
  const { navigate } = useNavigation<Nav>();
  const [error] = useState();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme();

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error);
    }
  }, [error]);

  // Fetch country codes from restcountries API
  useEffect(() => {
    fetch("https://restcountries.com/v2/all")
      .then((response) => response.json())
      .then((data) => {
        const areaData = data.map((item: any) => ({
          code: item.alpha2Code,
          item: item.name,
          callingCode: `+${item.callingCodes[0]}`,
          flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`,
        }));

        setAreas(areaData);
        if (areaData.length > 0) {
          const defaultData = areaData.filter((a: any) => a.code === "FR");

          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0]);
          }
        }
      });
  }, []);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Inscription" />
        <ProgressBar currentStep={0} steps={["1", "2", "3", "4", "5"]} />
        <Text style={styles.stepTitle}>
          Saisie des Informations Personnelles
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Input
              id="fullName"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities.fullName}
              placeholder="Nom prénom"
              placeholderTextColor={COLORS.gray}
              value={formState.inputValues.fullName}
            />

            <Input
              id="cin"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities.cin}
              placeholder="CIN (Carte d'Identité Nationale)"
              placeholderTextColor={COLORS.gray}
              value={formState.inputValues.cin}
            />

            {/* Country Selection */}
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: COLORS.greyscale500,
                  borderColor: COLORS.greyscale500,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.countryContainer}
                onPress={() => setModalVisible(true)}
              >
                {selectedArea && (
                  <View style={styles.selectedCountry}>
                    <Image
                      source={{ uri: selectedArea?.flag }}
                      contentFit="contain"
                      style={styles.flagIcon}
                    />
                    <Text
                      style={{
                        color: "#111",
                        marginLeft: 10,
                      }}
                    >
                      {selectedArea?.item}
                    </Text>
                  </View>
                )}
                <View style={{ justifyContent: "center" }}>
                  <Image
                    source={icons.down}
                    contentFit="contain"
                    style={styles.downIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* Phone Number */}
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: COLORS.greyscale500,
                  borderColor: COLORS.greyscale500,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.selectFlagContainer}
                onPress={() => setModalVisible(true)}
              >
                <View style={{ justifyContent: "center", marginLeft: 5 }}>
                  <Image
                    source={{ uri: selectedArea?.flag }}
                    contentFit="contain"
                    style={styles.flagIcon}
                  />
                </View>
                <View style={{ justifyContent: "center", marginLeft: 5 }}>
                  <Text
                    style={{
                      color: "#111",
                      fontSize: 12,
                    }}
                  >
                    {selectedArea?.callingCode}
                  </Text>
                </View>
              </TouchableOpacity>
              {/* Phone Number Text Input */}
              <TextInput
                style={styles.input}
                placeholder="Téléphone"
                placeholderTextColor={COLORS.gray}
                selectionColor="#111"
                keyboardType="numeric"
                value={formState.inputValues.phoneNumber}
                onChangeText={(text) =>
                  inputChangedHandler("phoneNumber", text)
                }
              />
            </View>

            {/* Address Information Section */}
            <Input
              id="city"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities.city}
              placeholder="Ville"
              placeholderTextColor={COLORS.gray}
              value={formState.inputValues.city}
            />

            <Input
              id="address"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities.address}
              placeholder="Adresse complète"
              placeholderTextColor={COLORS.gray}
              value={formState.inputValues.address}
              multiline
              numberOfLines={2}
            />
            <View style={{ height: 100 }} />
          </View>
        </ScrollView>
      </View>
      <RenderAreasCodesModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        areas={areas}
        setSelectedArea={setSelectedArea}
      />
      <View style={styles.bottomContainer}>
        <Button
          title="Suivant"
          filled
          style={styles.nextButton}
          onPress={() => navigate("registrationStep2")}
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
  inputContainer: {
    flexDirection: "row",
    borderColor: COLORS.greyscale500,
    borderWidth: 0.4,
    borderRadius: 12,
    height: 52,
    width: SIZES.width - 32,
    alignItems: "center",
    marginVertical: 12,
    backgroundColor: COLORS.greyscale500,
  },
  countryContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  selectedCountry: {
    flexDirection: "row",
    alignItems: "center",
  },
  downIcon: {
    width: 12,
    height: 12,
    tintColor: "#111",
  },
  selectFlagContainer: {
    width: 90,
    height: 50,
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  flagIcon: {
    width: 24,
    height: 24,
  },
  input: {
    flex: 1,
    marginVertical: 10,
    height: 40,
    fontSize: 14,
    color: "#111",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 32,
    right: 16,
    left: 16,
    width: SIZES.width - 32,
    alignItems: "center",
  },
  nextButton: {
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    position: "absolute",
    right: 16,
    top: 32,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
});

export default RegistrationStep1;
