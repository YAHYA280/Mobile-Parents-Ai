import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "@/components/ui/Button";
import { COLOORS, SPACING } from "@/constants/theme";

export type SubscriptionStatus = "active" | "suspended" | "expired";

interface SubscriptionActionsProps {
  status: SubscriptionStatus;
  planColor: string;
  onModify: () => void;
  onSuspend?: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

const SubscriptionActions: React.FC<SubscriptionActionsProps> = ({
  status,
  planColor,
  onModify,
  onSuspend,
  onCancel,
  loading = false,
}) => {
  const isExpired = status === "expired";
  const isSuspended = status === "suspended";

  return (
    <View style={styles.container}>
      <Button
        label={isExpired ? "Réabonner" : "Modifier"}
        onPress={onModify}
        leftIcon={isExpired ? "refresh" : "create-outline"}
        variant="primary"
        style={{ backgroundColor: planColor }}
        loading={loading}
      />

      {!isExpired && onSuspend && onCancel && (
        <View style={styles.secondaryButtonsContainer}>
          <Button
            label={isSuspended ? "Réactiver" : "Suspendre"}
            onPress={onSuspend}
            leftIcon={isSuspended ? "play" : "pause"}
            variant="secondary"
            style={styles.secondaryButton}
            textStyle={{
              color: isSuspended
                ? COLOORS.status.active.main
                : COLOORS.status.suspended.main,
            }}
          />

          <Button
            label="Annuler"
            onPress={onCancel}
            leftIcon="close-circle-outline"
            variant="outline"
            style={styles.dangerButton}
            textStyle={{ color: COLOORS.status.expired.main }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  secondaryButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  secondaryButton: {
    flex: 1,
  },
  dangerButton: {
    flex: 1,
    borderColor: COLOORS.status.expired.main,
  },
});

export default SubscriptionActions;
