import type {
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';

import { useTheme } from "@/theme/ThemeProvider";
import { icons, SIZES, COLORS, images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { 
  Text, 
  View, 
  Image, 
  Alert, 
  ScrollView, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import type { CataloguePlan } from '../app/services/mocksApi/abonnementApiMock';

import { 
  getCatalogues, 
  updateUserSubscription,
  getAbonnementActiveByUser 
} from '../app/services/mocksApi/abonnementApiMock';

const LOGO_COLORS = {
  lighter: "#f9a99a",
  light: "#f28374",
  main: "#fe7862",
  dark: "#d75f4d",
  darker: "#b34e3a",
  contrastText: "#FFFFFF",
};

const RIBBON_COLOR = "#E53935";

type PlanDetailsRouteParams = {
  planId: string;
  pricing: string;
  features: string;
};

type CurrentSubscription = {
  status: string;
  duration: string;
  planId: string;
} | null;

type PricingOption = {
  duration: string;
  price: number;
  features: string[];
  discountPercentage?: number;
  apiDuration: string;
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = 480;
const HEADER_HEIGHT = 80;
const BODY_HEIGHT = CARD_HEIGHT - HEADER_HEIGHT;

const lightenColor = (hex: string, percent: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const lightenAmount = Math.floor(255 * (percent / 100));
  
  const rNew = Math.min(r + lightenAmount, 255);
  const gNew = Math.min(g + lightenAmount, 255);
  const bNew = Math.min(b + lightenAmount, 255);
  
  return `#${rNew.toString(16).padStart(2, '0')}${gNew.toString(16).padStart(2, '0')}${bNew.toString(16).padStart(2, '0')}`;
};

const getPlanEmoji = (planId: string): string => {
  switch(planId) {
    case "1": return "🎓";
    case "2": return "🏆";
    case "3": return "🚀";
    default: return "📚";
  }
};

const getPlanColor = (planId: string): string => {
  switch(planId) {
    case "1": return LOGO_COLORS.light;
    case "2": return LOGO_COLORS.main;
    case "3": return LOGO_COLORS.dark;
    default: return LOGO_COLORS.main;
  }
};

const formatDuration = (duration: string): string => {
  if (duration.toLowerCase().includes('mois')) {
    if (duration.includes('6')) {
      return '6 MOIS';
    }
    return 'MOIS';
  }
  if (duration.toLowerCase().includes('annuel')) {
    return 'AN';
  }
  return duration.substring(0, 3);
};

const PlanDetails: React.FC = () => {
  const params = useLocalSearchParams<PlanDetailsRouteParams>();
  const { planId } = params;
  const router = useRouter();
  const { colors, dark } = useTheme();
  const [activeDot, setActiveDot] = useState(0);
  
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription>(null);
  const [selectedCatalogue, setSelectedCatalogue] = useState<CataloguePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const cataloguesData = await getCatalogues();
      const catalogue = cataloguesData.find((item: { id: string; }) => item.id === planId);
      
      if (!catalogue) {
        setError("Plan not found");
        return;
      }
      
      setSelectedCatalogue(catalogue);
      
      const abonnement = await getAbonnementActiveByUser(1);
      
      if (abonnement) {
        setCurrentSubscription({
          status: abonnement.status,
          duration: abonnement.duration,
          planId: abonnement.catalogue.id
        });
      } else {
        setCurrentSubscription(null);
      }
      
      setError(null);
    } catch (err) {
      setError("Échec du chargement des détails du plan. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubscriptionUpdate = useCallback(async (plan: PricingOption) => {
    if (!selectedCatalogue) return;
    
    try {
      setUpdating(true);
      
      const updatedSubscription = await updateUserSubscription(
        1,
        selectedCatalogue.id,
        plan.apiDuration
      );
      
      setCurrentSubscription({
        status: updatedSubscription.status,
        duration: updatedSubscription.duration,
        planId: updatedSubscription.catalogue.id
      });
      
      Alert.alert(
        "Abonnement mis à jour",
        `Votre abonnement ${selectedCatalogue.planName} a été ${currentSubscription ? "mis à jour" : "démarré"} avec succès.`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (err) {
      Alert.alert(
        "Error",
        "Échec de la mise à jour de l'abonnement. Veuillez réessayer plus tard.",
        [{ text: "OK" }]
      );
    } finally {
      setUpdating(false);
    }
  }, [currentSubscription, router, selectedCatalogue]);

  const getButtonState = useCallback((plan: PricingOption) => {
    if (!currentSubscription || currentSubscription.status === "expired") {
      return {
        disabled: false,
        text: "Commencer",
        style: {}
      };
    }
    
    if (currentSubscription.planId === selectedCatalogue?.id && 
        currentSubscription.duration === plan.apiDuration) {
      return {
        disabled: true,
        text: "Plan Actuel",
        style: { opacity: 0.5 }
      };
    }
    
    if (currentSubscription.planId === selectedCatalogue?.id) {
      return {
        disabled: false,
        text: "Changer Durée", 
        style: {}
      };
    }
    
    const isUpgrade = parseInt(selectedCatalogue?.id || "0", 10) > parseInt(currentSubscription.planId, 10);
    
    if (isUpgrade) {
      return {
        disabled: false,
        text: "Upgrader",
        style: {}
      };
    } 
    
    return {
      disabled: false, 
      text: "Downgrader",
      style: {}
    };
  }, [currentSubscription, selectedCatalogue]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / CARD_WIDTH);
    setActiveDot(index);
  }, []);

  const navigateToNotifications = useCallback(() => {
    router.push("/notifications" as any);
  }, [router]);

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      <View style={styles.viewLeft}>
        <Image source={images.user7} resizeMode="contain" style={styles.parentIcon} />
        <View style={styles.viewNameContainer}>
          <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
            Andrew Ainsley
          </Text>
        </View>
      </View>
      <View style={styles.viewRight}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={navigateToNotifications}
        >
          <Image
            source={icons.notificationBell2}
            resizeMode="contain"
            style={[styles.bellIcon, { tintColor: dark ? COLORS.white : COLORS.greyscale900 }]}
          />
        </TouchableOpacity>
      </View>
    </View>
  ), [dark, navigateToNotifications]);

  const renderCheckmark = useCallback((planColor: string) => (
    <View style={[styles.checkmarkCircle, { backgroundColor: planColor }]}>
      <Text style={styles.checkmarkText}>✓</Text>
    </View>
  ), []);

  const renderHighlightedSubtitle = useCallback(() => (
    <Text style={styles.headingSubtitle}>
      {"Commencez avec "}
      <Text style={[styles.highlightedText, { color: LOGO_COLORS.main }]}>
        14 jours d&apos;essai gratuit
      </Text>
      . Changez de plan à tout moment.
    </Text>
  ), []);

  const renderPaginationDots = useCallback((totalDots: number, activeDotIndex: number, planColor: string) => (
    <View style={styles.paginationContainer}>
      {Array(totalDots).fill(0).map((_, index) => (
        <View 
          key={index} 
          style={[
            styles.paginationDot, 
            activeDotIndex === index ? [styles.paginationDotActive, { backgroundColor: planColor }] : {}
          ]} 
        />
      ))}
    </View>
  ), []);

  const renderActionButton = useCallback((plan: PricingOption, planColor: string) => {
    const buttonState = getButtonState(plan);
    
    return (
      <TouchableOpacity 
        style={[
          styles.getStartedButton, 
          { backgroundColor: planColor },
          buttonState.style,
          updating && { opacity: 0.7 }
        ]} 
        disabled={buttonState.disabled || updating}
        onPress={() => handleSubscriptionUpdate(plan)}
      >
        {updating ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={[
            styles.getStartedText,
            buttonState.disabled ? { color: '#FFFFFF80' } : {}
          ]}>
            {buttonState.text}
          </Text>
        )}
      </TouchableOpacity>
    );
  }, [getButtonState, handleSubscriptionUpdate, updating]);

  const renderFeatureItem = useCallback((feature: string, index: number, planColor: string) => (
    <View key={index} style={styles.featureRow}>
      {renderCheckmark(planColor)}
      <Text style={styles.featureText}>{feature}</Text>
    </View>
  ), [renderCheckmark]);

  const renderPricingCard = useCallback((plan: PricingOption, index: number, planColor: string, planEmoji: string) => (
    <View key={index} style={styles.cardOuterContainer}>
      <View style={styles.awardIconContainer}>
        <View style={[styles.awardIconCircle, { backgroundColor: lightenColor(planColor, 10) }]}>
          <Text style={styles.emojiIcon}>{planEmoji}</Text>
        </View>
      </View>
      
      {plan.discountPercentage ? (
        <View style={styles.ribbonContainer}>
          <View style={[styles.ribbon, { backgroundColor: RIBBON_COLOR }]}>
            <Text style={styles.ribbonText}>
              {plan.discountPercentage}% OFF
            </Text>
          </View>
        </View>
      ):(
        <>
        </>
      )}
      
      <View style={styles.planContainer}>
        <View style={[styles.planHeaderSection, { backgroundColor: planColor, height: HEADER_HEIGHT }]}>
          <View style={styles.planHeaderContent}>
            <Text style={styles.planTypeLabel}>{selectedCatalogue?.planName}</Text>
            <View style={styles.planPriceContainer}>
              <Text style={styles.planPrice}>${plan.price}</Text>
              <Text style={styles.planPeriod}>/ {formatDuration(plan.duration)}</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.planBodySection, { height: BODY_HEIGHT }]}>
          <ScrollView style={styles.featuresScrollView} showsVerticalScrollIndicator={false}>
            {plan.features.map((feature, i) => renderFeatureItem(feature, i, planColor))}
            <View style={{ height: 70 }} />
          </ScrollView>
          
          <View style={styles.buttonPositioner}>
            {renderActionButton(plan, planColor)}
          </View>
        </View>
      </View>
    </View>
  ), [renderActionButton, renderFeatureItem, selectedCatalogue]);

  const renderLoadingState = useCallback(() => (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={LOGO_COLORS.main} />
        <Text style={styles.loadingText}>Chargement du plan...</Text>
      </View>
    </SafeAreaView>
  ), [colors.background]);

  const renderErrorState = useCallback(() => (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>{error || "Plan not found"}</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  ), [colors.background, error, handleBackPress]);

  const pricingOptions = useMemo<PricingOption[]>(() => {
    if (!selectedCatalogue) return [];
    return [
      {
        duration: "Mensuel",
        price: selectedCatalogue.monthlyPrice,
        features: selectedCatalogue.features,
        apiDuration: "monthly"
      },
      {
        duration: "6 Mois",
        price: selectedCatalogue.sixMonthPrice,
        features: selectedCatalogue.features,
        discountPercentage: 15,
        apiDuration: "six_months"
      },
      {
        duration: "Annuel",
        price: selectedCatalogue.yearlyPrice,
        features: selectedCatalogue.features,
        discountPercentage: 25,
        apiDuration: "yearly"
      }
    ];
  }, [selectedCatalogue]);

  if (loading) {
    return renderLoadingState();
  }

  if (error || !selectedCatalogue) {
    return renderErrorState();
  }

  const planColor = getPlanColor(selectedCatalogue.id);
  const planEmoji = getPlanEmoji(selectedCatalogue.id);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}

        <View style={styles.headingContainer}>
          <Text style={[styles.headingTitle, { color: LOGO_COLORS.darker }]}>CHOISISSEZ VOTRE PLAN</Text>
          {renderHighlightedSubtitle()}
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {pricingOptions.map((plan, index) => 
            renderPricingCard(plan, index, planColor, planEmoji)
          )}
        </ScrollView>

        {renderPaginationDots(pricingOptions.length, activeDot, planColor)}
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
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.padding3,
  },
  viewLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  parentIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  viewNameContainer: {
    marginLeft: SIZES.padding3 - 2,
  },
  title: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    letterSpacing: 0.5,
  },
  viewRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: SIZES.base,
  },
  bellIcon: {
    height: 26,
    width: 26,
    tintColor: COLORS.black,
    marginRight: SIZES.base,
  },
  headingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  headingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  headingSubtitle: {
    fontSize: 15,
    color: COLORS.gray3,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  highlightedText: {
    fontWeight: 'bold',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  cardOuterContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: 8,
    alignItems: 'center',
    position: 'relative',
  },
  awardIconContainer: {
    position: 'absolute',
    top: -15,
    zIndex: 10,
  },
  awardIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  emojiIcon: {
    fontSize: 20,
  },
  ribbonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    height: 100,
    width: 100,
    zIndex: 10,
  },
  ribbon: {
    position: 'absolute',
    left: -40,
    top: 20,
    backgroundColor: '#E53935',
    transform: [{ rotate: '-45deg' }],
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ribbonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  planContainer: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 7,
  },
  planHeaderSection: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  planPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planBodySection: {
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  featuresScrollView: {
    padding: 20,
  },
  planTypeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planPrice: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  planPeriod: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#FFFFFF',
    marginLeft: 2,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmarkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  buttonPositioner: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 2,
  },
  getStartedButton: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    transform: [{scale: 1.1}],
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: '#E53935',
  },
  backButton: {
    backgroundColor: LOGO_COLORS.main,
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray3,
  },
});

export default PlanDetails;