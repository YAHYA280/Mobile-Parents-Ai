import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHome,
  faBookOpen,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { MotiView } from "moti";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/theme";

interface AnimatedTabBarProps {
  activeTab: number;
  onTabPress: (tabIndex: number) => void;
}

const AnimatedTabBar: React.FC<AnimatedTabBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  const insets = useSafeAreaInsets();

  const tabs = [
    { id: 0, name: "Aperçu", icon: faHome },
    { id: 1, name: "Activités", icon: faBookOpen },
    { id: 2, name: "Suivi", icon: faChartLine },
  ];

  return (
    <MotiView
      style={[
        styles.container,
        {
          bottom: Platform.OS === "ios" ? 13 : 20,
          paddingBottom:
            Platform.OS === "ios" ? Math.max(insets.bottom - 10, 5) : 10,
        },
      ]}
      from={{ opacity: 0, translateY: 100 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", delay: 500, damping: 15 }}
    >
      {tabs.map((tab, index) => (
        <TabButton
          key={tab.id}
          tab={tab}
          isActive={activeTab === index}
          onPress={() => onTabPress(index)}
          index={index}
        />
      ))}
    </MotiView>
  );
};

interface TabButtonProps {
  tab: { id: number; name: string; icon: any };
  isActive: boolean;
  onPress: () => void;
  index: number;
}

const TabButton: React.FC<TabButtonProps> = ({
  tab,
  isActive,
  onPress,
  index,
}) => {
  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MotiView
        style={styles.tabContent}
        animate={{
          scale: isActive ? 1.1 : 1,
        }}
        transition={{ type: "spring", damping: 15 }}
      >
        <MotiView
          style={[
            styles.iconContainer,
            {
              backgroundColor: isActive ? `${COLORS.primary}15` : "transparent",
            },
          ]}
          animate={{
            backgroundColor: isActive ? `${COLORS.primary}15` : "transparent",
          }}
          transition={{ type: "timing", duration: 200 }}
        >
          <FontAwesomeIcon
            icon={tab.icon}
            size={22}
            color={isActive ? COLORS.primary : "rgba(0, 0, 0, 0.4)"}
          />
        </MotiView>

        <MotiView
          animate={{
            opacity: isActive ? 1 : 0.6,
            translateY: isActive ? -2 : 0,
          }}
          transition={{ type: "timing", duration: 200 }}
        >
          <Text
            style={[
              styles.tabText,
              { color: isActive ? COLORS.primary : "rgba(0, 0, 0, 0.4)" },
            ]}
          >
            {tab.name}
          </Text>
        </MotiView>
      </MotiView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === "ios" ? 75 : 70,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    left: 20,
    right: 20,
    paddingTop: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowOffset: { height: 5, width: 0 },
    shadowRadius: 10,
    flexDirection: "row",
    zIndex: 100,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default AnimatedTabBar;
