import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState, useEffect } from "react";
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBook, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { faUser, faHome, faList, faStar, faClock, faBarChart, faArrowLeft, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions
} from "react-native";

import type { Child } from "../../data/Enfants/CHILDREN_DATA";

import { COLORS } from "../../constants/theme";
import KidsStyles from "../../styles/KidsStyles";
import HistoriqueActivites from "./Historique/home";
import { useTheme } from "../../theme/ThemeProvider";
import PerformanceComponent from "./Performance/home";
import { CHILDREN_DATA, enhanceActivity } from "../../data/Enfants/CHILDREN_DATA";

// Progress color function
function getProgressColor(progress: number) {
  const colorMap = [
    { threshold: 30, color: '#FC4E00', startColor: '#FF6B35', endColor: '#FF8E4A' },
    { threshold: 50, color: '#EBB016', startColor: '#FFD700', endColor: '#FFC107' },
    { threshold: 70, color: '#F3BB00', startColor: '#FFC107', endColor: '#FFD54F' },
    { threshold: 100, color: '#24D26D', startColor: '#2ECC71', endColor: '#27AE60' }
  ];

  const progressConfig = colorMap.find(config => progress <= config.threshold) || colorMap[colorMap.length - 1];
  return progressConfig;
}

// Define interface for CustomTabBar props
interface CustomTabBarProps {
  activeTab: number;
  onTabPress: (index: number) => void;
}

// Composant personnalisé pour la barre de tabs
const CustomTabBar: React.FC<CustomTabBarProps> = ({ activeTab, onTabPress }) => {
  const { dark } = useTheme();
  
  return (
    <View style={{
      flexDirection: 'row',
      height: 60,
      backgroundColor: dark ? COLORS.black : COLORS.white,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderTopWidth: 0.5,
      borderTopColor: dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      zIndex: 999, // Ajoutez un zIndex élevé
    }}>
      {/* Bouton pour l'onglet "Aperçu" */}
      <TouchableOpacity 
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        onPress={() => onTabPress(0)}
      >
        <FontAwesomeIcon
          icon={faHome}
          size={20}
          color={activeTab === 0 ? COLORS.primary : (dark ? COLORS.secondaryWhite : COLORS.greyscale900)}
        />
        <Text style={{
          color: activeTab === 0 ? COLORS.primary : (dark ? COLORS.secondaryWhite : COLORS.greyscale900),
          fontSize: 12,
          fontFamily: "bold",
        }}>
          Aperçu
        </Text>
        {activeTab === 0 && (
          <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: COLORS.primary, marginTop: 2 }} />
        )}
      </TouchableOpacity>
      
      {/* Bouton pour l'onglet "Activités" */}
      <TouchableOpacity 
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        onPress={() => onTabPress(1)}
      >
        <FontAwesomeIcon
          icon={faList}
          size={20}
          color={activeTab === 1 ? COLORS.primary : (dark ? COLORS.secondaryWhite : COLORS.greyscale900)}
        />
        <Text style={{
          color: activeTab === 1 ? COLORS.primary : (dark ? COLORS.secondaryWhite : COLORS.greyscale900),
          fontSize: 12,
          fontFamily: "bold",
        }}>
          Activités
        </Text>
        {activeTab === 1 && (
          <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: COLORS.primary, marginTop: 2 }} />
        )}
      </TouchableOpacity>
      
      {/* Bouton pour l'onglet "Suivi" */}
      <TouchableOpacity 
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        onPress={() => onTabPress(2)}
      >
        <FontAwesomeIcon
          icon={faBarChart}
          size={20}
          color={activeTab === 2 ? COLORS.primary : (dark ? COLORS.secondaryWhite : COLORS.greyscale900)}
        />
        <Text style={{
          color: activeTab === 2 ? COLORS.primary : (dark ? COLORS.secondaryWhite : COLORS.greyscale900),
          fontSize: 12,
          fontFamily: "bold",
        }}>
          Suivi
        </Text>
        {activeTab === 2 && (
          <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: COLORS.primary, marginTop: 2 }} />
        )}
      </TouchableOpacity>
    </View>
  );
};

interface OverviewProps {
  child: Child;
  scrollViewRef: React.RefObject<ScrollView>;
}

const Overview: React.FC<OverviewProps> = ({ child, scrollViewRef }) => {
  const { dark } = useTheme();
  const progressValue = parseFloat(child.progress.replace('%', ''));
  const progressConfig = getProgressColor(progressValue);
  const recentActivity = enhanceActivity(child.activitesRecentes[0]);

  const renderSubjectTag = (matiere: string, isStrong: boolean) => {
    const tagStyle = isStrong
      ? { backgroundColor: 'rgba(36, 210, 109, 0.1)', color: '#24D26D' }
      : { backgroundColor: 'rgba(252, 78, 0, 0.1)', color: '#FC4E00' };

    return (
      <View
        key={matiere}
        style={[
          KidsStyles.tag,
          {backgroundColor: tagStyle.backgroundColor, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10,
            paddingVertical: 5, borderRadius: 20}
        ]}
      >
        <FontAwesomeIcon
          icon={isStrong ? faCheck : faExclamationTriangle}
          color={tagStyle.color}
          size={16}
          style={{ marginRight: 5 }}
        />
        <Text style={[KidsStyles.tagText, { color: tagStyle.color }]}>{matiere}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20  }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 100
      }}
    >
      <LinearGradient
        colors={[progressConfig.startColor, progressConfig.endColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[{
          backgroundColor: progressConfig.color,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          shadowColor: progressConfig.color,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2
        }]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[KidsStyles.cardTitle, { color: COLORS.white }]}>Progression Globale</Text>
          <FontAwesomeIcon icon={faRocket} size={24} color={COLORS.white} />
        </View>
        <View style={KidsStyles.progressSection}>
          <Text style={[KidsStyles.progressText, { color: COLORS.white, fontSize: 24 }]}>
            {child.progress}
          </Text>
          <View style={KidsStyles.progressContainer}>
            <View
              style={[
                KidsStyles.progressBar,
                {
                  width: `${progressValue}%`,
                  backgroundColor: COLORS.white
                }
              ]}
            />
          </View>
        </View>
      </LinearGradient>

      <View style={[{
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        backgroundColor: dark ? COLORS.black : COLORS.white
      }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[KidsStyles.cardTitle, { color: dark ? COLORS.white : COLORS.black }]}>Domaines d&apos;Apprentissage</Text>
          <FontAwesomeIcon icon={faBook} size={24} color={COLORS.primary} />
        </View>

        <View style={KidsStyles.subjectSection}>
          <Text style={[KidsStyles.subheading, { color: '#24D26D', marginBottom: 10 }]}>
            Points Forts
          </Text>
          <View style={KidsStyles.tagContainer}>
            {child.matieresFortes.map(matiere => renderSubjectTag(matiere, true))}
          </View>
        </View>

        <View style={[KidsStyles.subjectSection, { marginTop: 15 }]}>
          <Text style={[KidsStyles.subheading, { color: '#FC4E00', marginBottom: 10 }]}>
            À Améliorer
          </Text>
          <View style={KidsStyles.tagContainer}>
            {child.matieresAmeliorer.map(matiere => renderSubjectTag(matiere.replace(/^\?/, '').trim(), false))}
          </View>
        </View>
      </View>

      <View style={[{
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        backgroundColor: dark ? COLORS.black : COLORS.white
      }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[KidsStyles.cardTitle, { color: dark ? COLORS.white : COLORS.black }]}>Dernière Activité</Text>
        </View>

        <View style={KidsStyles.activityItem}>
          <View style={KidsStyles.activityDate}>
            <Text style={[KidsStyles.dateText, { color: dark ? COLORS.secondaryWhite : COLORS.gray }]}>{recentActivity.date}</Text>
          </View>

          <View style={KidsStyles.activityDetails}>
            <Text style={[KidsStyles.activityTitle, { color: dark ? COLORS.white : COLORS.black }]}>{recentActivity.activite}</Text>
            <View style={KidsStyles.activityMeta}>
              <FontAwesomeIcon icon={faClock} size={14} color={COLORS.primary} />
              <Text style={[KidsStyles.metaText, { color: dark ? COLORS.secondaryWhite : COLORS.gray }]}>{recentActivity.duree}</Text>
              {recentActivity.score && (
                <>
                  <FontAwesomeIcon icon={faStar} size={14} color={COLORS.primary} style={{ marginLeft: 12 }} />
                  <Text style={[KidsStyles.metaText, { color: dark ? COLORS.secondaryWhite : COLORS.gray }]}>{recentActivity.score}</Text>
                </>
              )}
            </View>

            {recentActivity.commentaires && (
              <View style={KidsStyles.commentSection}>
                <Text style={[KidsStyles.commentText, { color: dark ? COLORS.secondaryWhite : COLORS.gray }]}>{recentActivity.commentaires}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const Home: React.FC = () => {
  const router = useRouter();
  const { dark, colors } = useTheme();
  const params = useLocalSearchParams();
  const layout = useWindowDimensions();

  // Références pour la fonctionnalité "jump to"
  const scrollViewRef = useRef<ScrollView>(null);
  const firstSectionRef = useRef<View>(null);
  const secondSectionRef = useRef<View>(null);
  const thirdSectionRef = useRef<View>(null);
  
  const childId = typeof params.childId === 'string' ? parseInt(params.childId, 10) : 0;
  const [child, setChild] = useState<Child | undefined>(undefined);

  // Utilisation d'un état pour gérer l'onglet actif
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const foundChild = CHILDREN_DATA.find(c => c.id === childId);
    setChild(foundChild);
  }, [childId]);

  const handleBack = () => {
    router.back();
  };

  // Fonction pour gérer les clics sur les tabs
  const handleTabPress = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  // Fonction pour rendre le contenu en fonction de l'onglet actif
  const renderContent = () => {
    if (!child) return null;
    
    switch (activeTab) {
      case 0:
        return <Overview child={child} scrollViewRef={scrollViewRef} />;
      case 1:
        // Pour l'onglet d'historique, on peut maintenant laisser la pagination être gérée naturellement
        return (
          <View style={{ flex: 1, position: 'relative' }}>
            <HistoriqueActivites isTabComponent childData={child} />
          </View>
        );
      case 2:
        return <PerformanceComponent isTabComponent childData={child} />;
      default:
        return null;
    }
  };

  if (!child) {
    return (
      <SafeAreaView style={[KidsStyles.safeArea, { backgroundColor: colors.background }]}>
        <View style={KidsStyles.container}>
          <Text style={{ color: dark ? COLORS.white : COLORS.dark1 }}>Enfant non trouvé</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[KidsStyles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[KidsStyles.container, { backgroundColor: colors.background }]}>
        {activeTab === 0 && (
          <View style={[
            KidsStyles.header,
            {
              position: 'relative',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              backgroundColor: colors.background,
              paddingBottom: 20,
              alignItems: 'center',
              justifyContent: 'center',
              height: 350
            }
          ]}>
            <TouchableOpacity
              onPress={handleBack}
              style={[
                KidsStyles.backButton,
                {
                  position: 'absolute',
                  left: 16,
                  top: 16
                }
              ]}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                size={24}
                color={dark ? COLORS.white : COLORS.black}
              />
            </TouchableOpacity>

            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              alignItems: 'center'
            }}>
              <View style={[
                KidsStyles.avatarContainer,
                {
                  width: 160,
                  height: 160,
                  borderRadius: 80,
                  borderWidth: 3,
                  borderColor: dark ? COLORS.dark1 : COLORS.white,
                  overflow: 'hidden',
                  position: 'absolute',
                  top: -60,
                  zIndex: 10,
                  elevation: 5,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                }
              ]}>
                <Image
                  source={CHILDREN_DATA[0].profileImage}
                  resizeMode="cover"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 60
                  }}
                />
              </View>

              <View style={{
                backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                width: '100%',
                paddingTop: 85,
                paddingBottom: 20,
                alignItems: 'center',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                shadowColor: COLORS.white,
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                  marginTop: 40
                }}>
                  <FontAwesomeIcon
                    icon={faUser}
                    size={20}
                    color={dark ? COLORS.secondaryWhite : COLORS.gray3}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={[
                    KidsStyles.childName,
                    {
                      color: dark ? COLORS.white : COLORS.black,
                      textAlign: 'center'
                    }
                  ]}>
                    {child.name}
                  </Text>
                </View>

                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <FontAwesomeIcon
                    icon={faGraduationCap}
                    size={20}
                    color={dark ? COLORS.secondaryWhite : COLORS.gray3}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={[
                    KidsStyles.childClass,
                    {
                      color: dark ? COLORS.secondaryWhite : COLORS.gray3,
                      textAlign: 'center'
                    }
                  ]}>
                    {child.classe} • {child.age} ans
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={{ flex: 1 }}>
          {/* Afficher le contenu en fonction de l'onglet actif */}
          {renderContent()}
          
          {/* Afficher la barre de tabs personnalisée */}
          <CustomTabBar 
            activeTab={activeTab} 
            onTabPress={handleTabPress}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;