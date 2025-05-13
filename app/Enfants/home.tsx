import React, { useState, useEffect, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faHome,
  faList,
  faChartBar,
  faGraduationCap,
  faUser,
  faStar,
  faCheck,
  faExclamationTriangle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

import { COLORS } from "../../constants/theme";
import HistoriqueActivites from "./Historique/home";
import PerformanceComponent from "./Performance/home";
import {
  CHILDREN_DATA,
  enhanceActivity,
} from "../../data/Enfants/CHILDREN_DATA";
import type { Child } from "../../data/Enfants/CHILDREN_DATA";

// Constants
const { width } = Dimensions.get("window");

// Progress color function
function getProgressColor(progress: number): string {
  if (progress < 30) return "#FC4E00";
  if (progress <= 50) return "#EBB016";
  if (progress <= 70) return "#F3BB00";
  return "#24D26D";
}

// Custom Tab Bar Component
interface CustomTabBarProps {
  activeTab: number;
  onTabPress: (tabIndex: number) => void;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  activeTab,
  onTabPress,
}) => (
  <View
    style={{
      flexDirection: "row",
      height: 60,
      backgroundColor: "white",
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      borderTopWidth: 0.5,
      borderTopColor: "rgba(0, 0, 0, 0.1)",
      elevation: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      zIndex: 999,
    }}
  >
    {/* Aperçu Tab */}
    <TouchableOpacity
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      onPress={() => onTabPress(0)}
    >
      <FontAwesomeIcon
        icon={faHome}
        size={20}
        color={activeTab === 0 ? COLORS.primary : COLORS.greyscale900}
      />
      <Text
        style={{
          color: activeTab === 0 ? COLORS.primary : COLORS.greyscale900,
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        }}
      >
        Aperçu
      </Text>
      {activeTab === 0 && (
        <View
          style={{
            width: 5,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: COLORS.primary,
            marginTop: 2,
          }}
        />
      )}
    </TouchableOpacity>

    {/* Activités Tab */}
    <TouchableOpacity
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      onPress={() => onTabPress(1)}
    >
      <FontAwesomeIcon
        icon={faList}
        size={20}
        color={activeTab === 1 ? COLORS.primary : COLORS.greyscale900}
      />
      <Text
        style={{
          color: activeTab === 1 ? COLORS.primary : COLORS.greyscale900,
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        }}
      >
        Activités
      </Text>
      {activeTab === 1 && (
        <View
          style={{
            width: 5,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: COLORS.primary,
            marginTop: 2,
          }}
        />
      )}
    </TouchableOpacity>

    {/* Suivi Tab */}
    <TouchableOpacity
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      onPress={() => onTabPress(2)}
    >
      <FontAwesomeIcon
        icon={faChartBar}
        size={20}
        color={activeTab === 2 ? COLORS.primary : COLORS.greyscale900}
      />
      <Text
        style={{
          color: activeTab === 2 ? COLORS.primary : COLORS.greyscale900,
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        }}
      >
        Suivi
      </Text>
      {activeTab === 2 && (
        <View
          style={{
            width: 5,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: COLORS.primary,
            marginTop: 2,
          }}
        />
      )}
    </TouchableOpacity>
  </View>
);

// Overview Component
interface OverviewProps {
  child: Child;
  scrollViewRef: React.RefObject<ScrollView | null>;
}

const Overview: React.FC<OverviewProps> = ({ child, scrollViewRef }) => {
  const progressValue = parseFloat(child.progress.replace("%", ""));
  const progressConfig = getProgressColor(progressValue);
  const recentActivity = enhanceActivity(child.activitesRecentes[0]);

  // Helper function to render subject tags
  const renderSubjectTag = (matiere: string, isStrong: boolean) => {
    const tagColor = isStrong ? "#24D26D" : "#FC4E00";
    const tagBgColor = isStrong
      ? "rgba(36, 210, 109, 0.1)"
      : "rgba(252, 78, 0, 0.1)";

    return (
      <View
        key={matiere}
        style={{
          backgroundColor: tagBgColor,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 20,
          marginRight: 8,
          marginBottom: 8,
        }}
      >
        <FontAwesomeIcon
          icon={isStrong ? faCheck : faExclamationTriangle}
          color={tagColor}
          size={16}
          style={{ marginRight: 5 }}
        />
        <Text style={{ color: tagColor, fontWeight: "600" }}>{matiere}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Progress Card */}
      <LinearGradient
        colors={["#FF8E69", "#FF7862"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          shadowColor: "#FF8E69",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FFFFFF" }}>
            Progression Globale
          </Text>
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              width: 36,
              height: 36,
              borderRadius: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon icon={faStar} size={18} color="#FFFFFF" />
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#FFFFFF",
              marginBottom: 8,
            }}
          >
            {child.progress}
          </Text>
          <View
            style={{
              height: 12,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${progressValue}%`,
                height: "100%",
                backgroundColor: "#FFFFFF",
                borderRadius: 6,
              }}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Strengths and Weaknesses Card */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333333" }}>
            Domaines d'Apprentissage
          </Text>
          <View
            style={{
              backgroundColor: "rgba(255, 142, 105, 0.1)",
              width: 36,
              height: 36,
              borderRadius: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon
              icon={faGraduationCap}
              size={18}
              color={COLORS.primary}
            />
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#24D26D",
              marginBottom: 10,
            }}
          >
            Points Forts
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {child.matieresFortes.map((matiere) =>
              renderSubjectTag(matiere, true)
            )}
          </View>
        </View>

        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#FC4E00",
              marginBottom: 10,
            }}
          >
            À Améliorer
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {child.matieresAmeliorer.map((matiere) =>
              renderSubjectTag(matiere.replace(/^\?/, "").trim(), false)
            )}
          </View>
        </View>
      </View>

      {/* Recent Activity Card */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333333" }}>
            Dernière Activité
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            borderLeftWidth: 3,
            borderLeftColor: COLORS.primary,
            paddingLeft: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: "#9E9E9E", marginBottom: 4 }}>
              {recentActivity.date}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#333333",
                marginBottom: 8,
              }}
            >
              {recentActivity.activite}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <FontAwesomeIcon
                icon={faClock}
                size={14}
                color="#9E9E9E"
                style={{ marginRight: 6 }}
              />
              <Text style={{ fontSize: 14, color: "#9E9E9E" }}>
                {recentActivity.duree}
              </Text>

              {recentActivity.score && (
                <>
                  <View
                    style={{
                      width: 1,
                      height: 12,
                      backgroundColor: "#E0E0E0",
                      marginHorizontal: 8,
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faStar}
                    size={14}
                    color={COLORS.primary}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.primary,
                      fontWeight: "600",
                    }}
                  >
                    {recentActivity.score}
                  </Text>
                </>
              )}
            </View>

            {recentActivity.commentaires && (
              <View
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.03)",
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 4,
                }}
              >
                <Text style={{ fontSize: 14, color: "#666666" }}>
                  {recentActivity.commentaires}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// Main Component
const EnfantsHome: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView | null>(null);

  // Get child ID from params
  const childId =
    typeof params.childId === "string" ? parseInt(params.childId, 10) : 0;

  // States
  const [child, setChild] = useState<Child | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  // Fetch child data only once when component mounts or childId changes
  useEffect(() => {
    const foundChild = CHILDREN_DATA.find((c) => c.id === childId) || null;
    setChild(foundChild);
  }, [childId]);

  // Handle back navigation
  const handleBack = (): void => {
    router.back();
  };

  // Handle tab selection
  const handleTabPress = (tabIndex: number): void => {
    setActiveTab(tabIndex);
  };

  // Render tab content based on active tab
  const renderContent = () => {
    if (!child) return null;

    switch (activeTab) {
      case 0:
        return <Overview child={child} scrollViewRef={scrollViewRef} />;
      case 1:
        return <HistoriqueActivites isTabComponent childData={child} />;
      case 2:
        return <PerformanceComponent isTabComponent childData={child} />;
      default:
        return null;
    }
  };

  // If child data not found
  if (!child) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#333333" }}>Enfant non trouvé</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent
      />

      <View style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
        {/* Header Profile Section - Only show on Overview tab */}
        {activeTab === 0 && (
          <View
            style={{
              position: "relative",
              zIndex: 10,
              backgroundColor: "#FFFFFF",
              paddingBottom: 20,
              alignItems: "center",
              justifyContent: "center",
              height: 330,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <TouchableOpacity
              onPress={handleBack}
              style={{
                position: "absolute",
                left: 16,
                top: 16,
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(0,0,0,0.05)",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 20,
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333333" />
            </TouchableOpacity>

            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                  borderWidth: 4,
                  borderColor: "#FFFFFF",
                  overflow: "hidden",
                  position: "absolute",
                  top: -60,
                  zIndex: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 10,
                }}
              >
                <Image
                  source={child.profileImage}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 70,
                  }}
                />
              </View>

              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  width: "100%",
                  paddingTop: 90,
                  paddingBottom: 20,
                  alignItems: "center",
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: -2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                    marginTop: 20,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    size={16}
                    color="#9E9E9E"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      color: "#333333",
                      textAlign: "center",
                    }}
                  >
                    {child.name}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faGraduationCap}
                    size={16}
                    color="#9E9E9E"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#666666",
                      textAlign: "center",
                    }}
                  >
                    {child.classe} • {child.age} ans
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Main Content Area */}
        <View style={{ flex: 1 }}>
          {renderContent()}

          {/* Custom Tab Bar */}
          <CustomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EnfantsHome;
