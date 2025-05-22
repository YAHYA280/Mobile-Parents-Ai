// components/children/AnimatedTabBar.tsx
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
          bottom: Platform.OS === "ios" ? 25 : 25,
          paddingBottom:
            Platform.OS === "ios" ? Math.max(insets.bottom - 10, 5) : 10,
        },
      ]}
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 300 }}
    >
      {tabs.map((tab, index) => (
        <TabButton
          key={tab.id}
          tab={tab}
          isActive={activeTab === index}
          onPress={() => onTabPress(index)}
        />
      ))}
    </MotiView>
  );
};

interface TabButtonProps {
  tab: { id: number; name: string; icon: any };
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ tab, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.tabContent}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isActive ? `${COLORS.primary}15` : "transparent",
            },
          ]}
        >
          <FontAwesomeIcon
            icon={tab.icon}
            size={22}
            color={isActive ? COLORS.primary : "rgba(0, 0, 0, 0.4)"}
          />
        </View>

        <Text
          style={[
            styles.tabText,
            { color: isActive ? COLORS.primary : "rgba(0, 0, 0, 0.4)" },
          ]}
        >
          {tab.name}
        </Text>
      </View>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -2,
  },
  tabText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 2,
  },
});

export default AnimatedTabBar;
