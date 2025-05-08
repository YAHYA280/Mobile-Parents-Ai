import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { getAbonnementActiveByUser } from "@/app/services/mocksApi/abonnementApiMock";

import CatalogueCard from "./CatalogueCard";
import { SPACING } from "@/constants/theme";
import type { CataloguePlan } from "@/app/services/mocksApi/abonnementApiMock";

/* ------------------------------------------------------------------ */
/* Navigation types                                                   */
/* ------------------------------------------------------------------ */

type RootStackParamList = {
  planDetails: {
    planId: string;
    pricing: string;
    features: string[];
  };
};

type NavProp = StackNavigationProp<RootStackParamList, "planDetails">;

/* ------------------------------------------------------------------ */
/* Component props                                                    */
/* ------------------------------------------------------------------ */

interface CatalogueListProps {
  data: CataloguePlan[];
  limit?: number;
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

const CatalogueList: React.FC<CatalogueListProps> = ({ data, limit }) => {
  const navigation = useNavigation<NavProp>();
  const displayedData = limit ? data.slice(0, limit) : data;
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);

  // Fetch user's current subscription to highlight the active plan
  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const subscription = await getAbonnementActiveByUser(1); // Use your user ID here
        if (subscription && subscription.catalogue) {
          setCurrentPlanId(subscription.catalogue.id);
        }
      } catch (error) {
        console.error("Failed to fetch current plan:", error);
      }
    };

    fetchCurrentPlan();
  }, []);

  const handlePlanSelect = useCallback(
    (plan: CataloguePlan) => {
      navigation.navigate("planDetails", {
        planId: plan.id,
        pricing: JSON.stringify({
          monthlyPrice: plan.monthlyPrice,
          sixMonthPrice: plan.sixMonthPrice,
          yearlyPrice: plan.yearlyPrice,
        }),
        features: plan.features,
      });
    },
    [navigation]
  );

  return (
    <FlatList
      data={displayedData}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item, index }) => (
        <CatalogueCard
          plan={item}
          index={index}
          isCurrentPlan={item.id === currentPlanId}
          onSelect={() => handlePlanSelect(item)}
        />
      )}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Styles                                                             */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
});

export default CatalogueList;
