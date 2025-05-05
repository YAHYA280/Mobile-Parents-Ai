import { COLORS } from "@/constants";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import styles from "@/styles/AbonnementActuelStyle";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useNavigation } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import type { Abonnement } from './services/mocksApi/abonnementApiMock';

import { getCurrentUser, getAbonnementActiveByUser } from './services/mocksApi/abonnementApiMock';

type Nav = {
  navigate: (value: string) => void;
};

type AlertConfig = {
  visible: boolean;
  title: string;
  message: string;
  buttons: Array<{
    text: string;
    style?: "default" | "cancel" | "destructive";
    onPress?: () => void;
  }>;
};

const LOGO_COLORS = {
  lighter: "#f9a99a",
  light: "#f28374",
  main: "#fe7862",
  dark: "#d75f4d",
  darker: "#b34e3a",
  contrastText: "#FFFFFF",
};

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  const day = date.getDate();
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
};

const getPlanColor = (abonnement: Abonnement | null): string => {
  if (!abonnement) return LOGO_COLORS.main;
  
  switch(abonnement.catalogue.id) {
    case "1": return LOGO_COLORS.light;
    case "2": return LOGO_COLORS.main;
    case "3": return LOGO_COLORS.dark;
    default: return LOGO_COLORS.main;
  }
};

const getPlanEmoji = (abonnement: Abonnement | null): string => {
  if (!abonnement) return "📚";
  
  switch(abonnement.catalogue.planName) {
    case "Basique": return "🎓";
    case "Plus": return "🏆";
    case "Avancé": return "🚀";
    default: return "📚";
  }
};

const AbonnementActuel: React.FC = () => {
  const { navigate } = useNavigation<Nav>();
  const navigation = useNavigation();
  const router = useRouter();
  const { colors, dark } = useTheme();
  
  const [abonnement, setAbonnement] = useState<Abonnement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: "",
    message: "",
    buttons: []
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const userData = await getCurrentUser();
      
      const subscriptionData = await getAbonnementActiveByUser(userData.id);
      setAbonnement(subscriptionData);
      
      setError(null);
    } catch (err) {
      setError("Échec du chargement des détails de l'abonnement. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const planColor = useMemo(() => getPlanColor(abonnement), [abonnement]);
  const planEmoji = useMemo(() => getPlanEmoji(abonnement), [abonnement]);
  const isSuspended = useMemo(() => abonnement?.status === 'suspended', [abonnement]);
  const isExpired = useMemo(() => abonnement?.status === 'expired', [abonnement]);

  const getPrice = useCallback(() => {
    if (!abonnement) return 0;
    
    switch(abonnement.duration) {
      case "monthly": return abonnement.catalogue.monthlyPrice;
      case "six_months": return abonnement.catalogue.sixMonthPrice;
      case "yearly": return abonnement.catalogue.yearlyPrice;
      default: return abonnement.catalogue.monthlyPrice;
    }
  }, [abonnement]);
  
  const getPricingPeriod = useCallback(() => {
    if (!abonnement) return "";
    
    switch(abonnement.duration) {
      case "monthly": return "/ mois";
      case "six_months": return "/ 6 mois";
      case "yearly": return "/ an";
      default: return "";
    }
  }, [abonnement]);

  const navigateToHome = useCallback(() => {
    router.push("/" as any);
  }, [router]);

  const navigateToNotifications = useCallback(() => {
    router.push("/notifications" as any);
  }, [router]);

  const showAlert = useCallback((config: AlertConfig) => {
    setAlertConfig({
      ...config,
      visible: true
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig({
      ...alertConfig,
      visible: false
    });
  }, [alertConfig]);

  const handleModify = useCallback(() => {
    if (isExpired) {
      showAlert({
        title: "Abonnement expiré",
        message: "Votre abonnement a expiré. Veuillez souscrire à un nouveau plan.",
        buttons: [{ text: "OK", onPress: hideAlert }],
        visible: false
      });
      return;
    }
    navigate("abonnementcatalogue");
  }, [isExpired, navigate, showAlert, hideAlert]);

  const handleCancel = useCallback(() => {
    if (isExpired) {
      showAlert({
        title: "Abonnement déjà expiré",
        message: "Cet abonnement est déjà expiré et ne peut pas être annulé.",
        buttons: [{ text: "OK", onPress: hideAlert }],
        visible: false
      });
      return;
    }
    
    showAlert({
      title: "Annuler l'abonnement",
      message: "Êtes-vous sûr de vouloir annuler votre abonnement? Votre abonnement sera actif jusqu'à la fin de la période payée.",
      buttons: [
        { text: "Non" , onPress: hideAlert },
        {
          text: "Oui, annuler",
          style: "destructive",
          onPress: () => {
            hideAlert();
          }
        }
      ],
      visible: false
    });
  }, [isExpired, hideAlert, showAlert]);

  const handleSuspend = useCallback(() => {
    if (isExpired) {
      showAlert({
        title: "Abonnement expiré",
        message: "Cet abonnement est déjà expiré et ne peut pas être suspendu.",
        buttons: [{ text: "OK", onPress: hideAlert }],
        visible: false
      });
      return;
    }
    
    if (isSuspended) {
      showAlert({
        title: "Réactiver l'abonnement",
        message: "Voulez-vous réactiver votre abonnement?",
        buttons: [
          { text: "Annuler", style: "cancel", onPress: hideAlert },
          {
            text: "Réactiver",
            onPress: () => {
              hideAlert();
            }
          }
        ],
        visible: false
      });
      return;
    }
    
    showAlert({
      title: "Suspendre l'abonnement",
      message: "Voulez-vous suspendre temporairement votre abonnement? Vous pourrez le réactiver à tout moment.",
      buttons: [
        { text: "Annuler" , onPress: hideAlert },
        {
          text: "Suspendre",
          onPress: () => {
            hideAlert();
          }
        }
      ],
      visible: false
    });
  }, [isExpired, isSuspended, hideAlert, showAlert]);

  const renderFeatureItem = useCallback((feature: string, index: number) => (
    <View key={index} style={styles.featureRow}>
      <View style={[styles.checkCircle, { backgroundColor: planColor }]}>
        <Text style={styles.checkmarkText}>✓</Text>
      </View>
      <Text style={[
        styles.featureText,
        { color: dark ? COLORS.white : COLORS.black }
      ]}>
        {feature}
      </Text>
    </View>
  ), [planColor, dark]);

  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      <View style={headerStyles.headerLeft}>
        <TouchableOpacity style={headerStyles.backButton} onPress={() => navigation.goBack()}>
          <Feather
            name="arrow-left"
            size={24}
            color={dark ? COLORS.white : COLORS.black}
          />
        </TouchableOpacity>
        <Text style={[
          headerStyles.headerTitle,
          { color: dark ? COLORS.white : COLORS.black }
        ]}>
          Abonnement Actuel
        </Text>
      </View>
      <View style={styles.viewRight}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={navigateToNotifications}
        />
      </View>
    </View>
  ), [dark, navigateToNotifications, navigation]);

  const renderTitleSection = useCallback(() => (
    <View style={styles.titleSection}>
      <Text style={[
        styles.headingSubtitle,
        { color: dark ? COLORS.white : COLORS.gray3 }
      ]}>
        Détails de votre plan actuel
      </Text>
    </View>
  ), [dark]);
  
  const renderNoSubscription = useCallback(() => (
    <View style={styles.noSubscriptionContainer}>
      <Text style={[
        styles.noSubscriptionTitle,
        { color: dark ? COLORS.white : COLORS.black }
      ]}>
        Aucun abonnement actif
      </Text>
      <Text style={[
        styles.noSubscriptionText,
        { color: dark ? COLORS.gray2 : COLORS.gray3 }
      ]}>
        Vous n&apos;avez actuellement aucun abonnement actif. Choisissez un plan pour commencer à profiter de nos services.
      </Text>
      <TouchableOpacity
        style={[styles.choosePlanButton, { backgroundColor: LOGO_COLORS.main }]}
        onPress={navigateToHome}
      >
        <Text style={styles.choosePlanButtonText}>Choisir un plan</Text>
      </TouchableOpacity>
    </View>
  ), [navigateToHome, dark]);

  const renderSubscriptionDetails = useCallback(() => {
    if (!abonnement) return null;
    
    return (
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={[planColor, lightenColor(planColor, 10)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardHeader}
          >
            <View style={styles.planTitleContainer}>
              <View style={[styles.iconContainer, { backgroundColor: `${lightenColor(planColor, 30)}80` }]}>
                <Text style={styles.planIcon}>{planEmoji}</Text>
              </View>
              <Text style={styles.planName}>{abonnement.catalogue.planName}</Text>
            </View>
            
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { 
                backgroundColor: abonnement.status === 'active' ? '#10B981' : 
                                abonnement.status === 'suspended' ? '#F59E0B' : '#EF4444' 
              }]}>
                <Text style={styles.statusText}>
                  {abonnement.status === 'active' ? 'Actif' : 
                  abonnement.status === 'suspended' ? 'Suspendu' : 'Expiré'}
                </Text>
              </View>
            </View>
          </LinearGradient>
          
          <View style={[
            styles.cardBody,
            { backgroundColor: dark ? COLORS.dark2 || '#1E1E1E' : COLORS.white }
          ]}>
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Text style={[
                  styles.detailLabel,
                  { color: dark ? COLORS.white : COLORS.gray3 }
                ]}>
                  Date de début:
                </Text>
                <Text style={[
                  styles.detailValue,
                  { color: dark ? COLORS.white : COLORS.black }
                ]}>
                  {formatDate(abonnement.start_date)}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={[
                  styles.detailLabel,
                  { color: dark ? COLORS.white : COLORS.gray3 }
                ]}>
                  Date de fin:
                </Text>
                <Text style={[
                  styles.detailValue,
                  { color: dark ? COLORS.white : COLORS.black }
                ]}>
                  {formatDate(abonnement.end_date)}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={[
                  styles.detailLabel,
                  { color: dark ? COLORS.white : COLORS.gray3 }
                ]}>
                  Prix:
                </Text>
                <Text style={[
                  styles.detailValue,
                  { color: dark ? COLORS.white : COLORS.black }
                ]}>
                  ${getPrice()} {getPricingPeriod()}
                </Text>
              </View>

              <View style={[
                styles.divider,
                { backgroundColor: dark ? COLORS.gray2 : COLORS.gray }
              ]} />

              <Text style={[
                styles.featuresTitle,
                { color: dark ? COLORS.white : COLORS.black }
              ]}>
                Fonctionnalités incluses:
              </Text>
              
              <View style={styles.featuresContainer}>
                {abonnement.catalogue.features.map((feature, index) => 
                  renderFeatureItem(feature, index)
                )}
              </View>
            </View>
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.modifyButton, { backgroundColor: planColor }]} 
                onPress={handleModify}
              >
                <Text style={styles.buttonText}>
                  {isExpired ? 'Réabonner' : 'Modifier'}
                </Text>
              </TouchableOpacity>
              
              {!isExpired ? (
                <View style={styles.buttonRow}>
                  <View style={styles.secondaryButtonsContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.actionButton, 
                        styles.secondaryButton,
                        { backgroundColor: dark ? COLORS.dark3 || '#2A2A2A' : COLORS.gray }
                      ]} 
                      onPress={handleSuspend}
                    >
                      <Text style={[
                        styles.buttonText, 
                        { color: dark ? COLORS.white : COLORS.white }
                      ]}>
                        {isSuspended ? 'Réactiver' : 'Suspendre'}
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.actionButton, 
                        styles.dangerButton,
                        { backgroundColor: dark ? '#2A1215' : '#FCEEF0' }
                      ]} 
                      onPress={handleCancel}
                    >
                      <Text style={[styles.buttonText, { color: '#E11D48' }]}>Annuler</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ):(
                <>
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }, [
    abonnement, 
    planColor, 
    planEmoji, 
    getPrice, 
    getPricingPeriod, 
    isExpired, 
    isSuspended, 
    handleModify, 
    handleSuspend, 
    handleCancel,
    renderFeatureItem,
    dark
  ]);

  const renderCustomAlert = useCallback(() => {
    if (!alertConfig.visible) return null;
    
    return (
      <Modal visible={alertConfig.visible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={[
            styles.alertContainer,
            { backgroundColor: dark ? COLORS.dark2 || '#1E1E1E' : COLORS.white }
          ]}>
            <Text style={[
              styles.alertTitle,
              { color: dark ? COLORS.white : COLORS.black }
            ]}>
              {alertConfig.title}
            </Text>
            <Text style={[
              styles.alertMessage,
              { color: dark ? COLORS.white : COLORS.black }
            ]}>
              {alertConfig.message}
            </Text>
            
            <View style={styles.alertButtonsContainer}>
              {alertConfig.buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.alertButton,
                    button.style === "destructive" 
                      ? styles.alertDestructiveButton 
                      : button.style === "cancel" 
                        ? [styles.alertCancelButton, { backgroundColor: dark ? COLORS.dark3 || '#2A2A2A' : COLORS.gray }]
                        : styles.alertDefaultButton,
                    index > 0 && { marginLeft: 8 }
                  ]}
                  onPress={button.onPress}
                >
                  <Text style={[
                    styles.alertButtonText,
                    button.style === "destructive" 
                      ? { color: '#E11D48' } 
                      : button.style === "cancel" 
                        ? { color: dark ? COLORS.white : COLORS.gray3 }
                        : { color: COLORS.white }
                  ]}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    );
  }, [alertConfig, dark]);

  const renderLoadingState = useCallback(() => (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={LOGO_COLORS.main} />
        <Text style={[
          styles.loadingText,
          { color: dark ? COLORS.white : COLORS.gray3 }
        ]}>
          Chargement de l&apos;abonnement...
        </Text>
      </View>
    </SafeAreaView>
  ), [colors.background, dark]);

  const renderErrorState = useCallback(() => (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[
          styles.errorText,
          { color: dark ? '#EF4444' : '#E53935' }
        ]}>
          {error}
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: LOGO_COLORS.main }]} 
          onPress={fetchData}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  ), [colors.background, error, fetchData, dark]);

  if (loading) {
    return renderLoadingState();
  }

  if (error) {
    return renderErrorState();
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        {renderTitleSection()}
        {!abonnement ? renderNoSubscription() : renderSubscriptionDetails()}
      </View>
      {renderCustomAlert()}
    </SafeAreaView>
  );
};

// Additional styles for the header
const headerStyles = StyleSheet.create({
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.black,
  }
});

export default AbonnementActuel;