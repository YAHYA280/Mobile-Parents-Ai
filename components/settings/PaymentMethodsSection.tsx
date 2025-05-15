import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import { COLORS } from "../../constants";
import { useTheme } from "../../theme/ThemeProvider";
import { PaymentMethod } from "../../types/security";

interface PaymentMethodsSectionProps {
  dark: boolean;
  isOpen: boolean;
  paymentMethods?: PaymentMethod[];
}

const PaymentMethodsSection: React.FC<PaymentMethodsSectionProps> = ({
  dark,
  isOpen,
  paymentMethods = [],
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const paymentBottomSheetRef = useRef<any>(null);

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "visa":
        return "card";
      case "mastercard":
        return "card";
      case "amex":
        return "card";
      case "paypal":
        return "logo-paypal";
      default:
        return "card";
    }
  };

  const getPaymentColor = (type: string) => {
    switch (type) {
      case "visa":
        return "#1A1F71";
      case "mastercard":
        return "#EB001B";
      case "amex":
        return "#006FCF";
      case "paypal":
        return "#003087";
      default:
        return COLORS.primary;
    }
  };

  const handlePaymentMethodPress = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    paymentBottomSheetRef.current?.open();
  };

  const handleRemovePaymentMethod = (paymentMethodId: string) => {
    // payment method removal logic
    console.log(`Remove payment method with ID: ${paymentMethodId}`);
    paymentBottomSheetRef.current?.close();
  };

  if (!isOpen) return null;

  return (
    <View style={styles.sectionContent}>
      {paymentMethods.map((paymentMethod) => (
        <TouchableOpacity
          key={paymentMethod.id}
          style={[
            styles.paymentMethodItem,
            { backgroundColor: dark ? COLORS.dark3 : "#F8F9FA" },
          ]}
          onPress={() => handlePaymentMethodPress(paymentMethod)}
          activeOpacity={0.7}
        >
          <View style={styles.paymentMethodLeft}>
            <View
              style={[
                styles.paymentIconContainer,
                {
                  backgroundColor: `${getPaymentColor(paymentMethod.cardType)}20`,
                },
              ]}
            >
              <Ionicons
                name={getPaymentIcon(paymentMethod.cardType) as any}
                size={20}
                color={getPaymentColor(paymentMethod.cardType)}
              />
            </View>
            <View style={styles.paymentInfo}>
              <Text
                style={[
                  styles.paymentCardNumber,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {paymentMethod.cardNumber}
              </Text>
              {paymentMethod.expiryDate !== "N/A" && (
                <Text
                  style={[
                    styles.paymentExpiry,
                    { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                  ]}
                >
                  Expire: {paymentMethod.expiryDate}
                </Text>
              )}
            </View>
          </View>

          <View
            style={[
              styles.paymentStatus,
              {
                backgroundColor: paymentMethod.isActive
                  ? "#4CAF5020"
                  : dark
                    ? COLORS.dark2
                    : "#EEEEEE",
              },
            ]}
          >
            <Text
              style={[
                styles.paymentStatusText,
                {
                  color: paymentMethod.isActive
                    ? "#4CAF50"
                    : dark
                      ? COLORS.greyscale500
                      : COLORS.greyscale600,
                },
              ]}
            >
              {paymentMethod.isActive ? "Actif" : "Inactif"}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Payment Method Bottom Sheet */}
      <RBSheet
        ref={paymentBottomSheetRef}
        closeOnPressMask
        height={380}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: dark ? COLORS.greyscale500 : COLORS.grayscale400,
            width: 40,
            height: 5,
          },
          container: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: dark ? COLORS.dark1 : COLORS.white,
            padding: 16,
          },
        }}
      >
        {selectedPaymentMethod ? (
          <View style={styles.paymentSheet}>
            <View style={styles.paymentSheetHeader}>
              <View
                style={[
                  styles.paymentIconLarge,
                  {
                    backgroundColor: `${getPaymentColor(selectedPaymentMethod.cardType)}20`,
                  },
                ]}
              >
                <Ionicons
                  name={getPaymentIcon(selectedPaymentMethod.cardType) as any}
                  size={28}
                  color={getPaymentColor(selectedPaymentMethod.cardType)}
                />
              </View>

              <Text
                style={[
                  styles.paymentSheetTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {selectedPaymentMethod.cardNumber}
              </Text>

              <Text
                style={[
                  styles.paymentSheetSubtitle,
                  { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                ]}
              >
                Dernière utilisation: {selectedPaymentMethod.lastUsed}
              </Text>
            </View>

            <View style={styles.paymentDetailsList}>
              <View style={styles.paymentDetailItem}>
                <Text
                  style={[
                    styles.paymentDetailLabel,
                    { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                  ]}
                >
                  Date d'expiration
                </Text>
                <Text
                  style={[
                    styles.paymentDetailValue,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  {selectedPaymentMethod.expiryDate}
                </Text>
              </View>

              <View style={styles.paymentDetailItem}>
                <Text
                  style={[
                    styles.paymentDetailLabel,
                    { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                  ]}
                >
                  Statut
                </Text>
                <View style={styles.paymentStatusToggle}>
                  <Text
                    style={[
                      styles.paymentStatusLabel,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    {selectedPaymentMethod.isActive ? "Actif" : "Inactif"}
                  </Text>
                  <Switch
                    value={selectedPaymentMethod.isActive}
                    onValueChange={(value) =>
                      console.log(`Payment method status changed to: ${value}`)
                    }
                    trackColor={{
                      false: dark ? COLORS.dark3 : "#EEEEEE",
                      true: COLORS.primary,
                    }}
                    thumbColor={COLORS.white}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.removeButton,
                { backgroundColor: dark ? COLORS.dark3 : "#FFE5E5" },
              ]}
              onPress={() =>
                handleRemovePaymentMethod(selectedPaymentMethod.id)
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="trash"
                size={18}
                color="#F44336"
                style={styles.removeIcon}
              />
              <Text style={styles.removeButtonText}>
                Supprimer cette méthode de paiement
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContent: {
    marginTop: -16,
    marginBottom: 16,
    paddingBottom: 8,
  },
  paymentMethodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  paymentMethodLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
    paddingRight: 8,
  },
  paymentCardNumber: {
    fontSize: 15,
    fontFamily: "medium",
    marginBottom: 4,
  },
  paymentExpiry: {
    fontSize: 13,
    fontFamily: "regular",
  },
  paymentStatus: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
    alignSelf: "center",
    minWidth: 60,
    alignItems: "center",
  },
  paymentStatusText: {
    fontSize: 12,
    fontFamily: "medium",
    textAlign: "center",
  },
  paymentSheet: {
    flex: 1,
  },
  paymentSheetHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  paymentIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  paymentSheetTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 4,
  },
  paymentSheetSubtitle: {
    fontSize: 14,
    fontFamily: "regular",
  },
  paymentDetailsList: {
    marginBottom: 24,
  },
  paymentDetailItem: {
    marginBottom: 16,
  },
  paymentDetailLabel: {
    fontSize: 14,
    fontFamily: "regular",
    marginBottom: 8,
  },
  paymentDetailValue: {
    fontSize: 16,
    fontFamily: "medium",
  },
  paymentStatusToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentStatusLabel: {
    fontSize: 16,
    fontFamily: "medium",
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  removeIcon: {
    marginRight: 8,
  },
  removeButtonText: {
    color: "#F44336",
    fontSize: 16,
    fontFamily: "medium",
  },
});

export default PaymentMethodsSection;
