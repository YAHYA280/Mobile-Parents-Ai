import { Tabs } from "expo-router";
import { Image } from "expo-image";
import { Paths } from "@/navigation";
import { useTheme } from "@/theme/ThemeProvider";
import { View, Text, Platform } from "react-native";

import { icons, FONTS, SIZES, COLORS } from "../../constants";

// Create a reusable tab icon component to avoid repetition
interface TabIconProps {
  focused: boolean;
  icon: any;
  outlineIcon: any;
  label: string;
  dark: boolean;
}

const TabIcon = ({ focused, icon, outlineIcon, label, dark }: TabIconProps) => {
  return (
    <View
      style={{
        alignItems: "center",
        paddingTop: 16,
        width: SIZES.width / 4,
      }}
    >
      <Image
        source={focused ? icon : outlineIcon}
        contentFit="contain"
        style={{
          width: 24,
          height: 24,
          tintColor: focused
            ? COLORS.primary
            : dark
              ? COLORS.gray3
              : COLORS.gray3,
        }}
      />
      <Text
        style={{
          ...FONTS.body4,
          color: focused ? COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  const { dark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: Platform.OS !== "ios",
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 0,
          height: Platform.OS === "ios" ? 90 : 60,
          backgroundColor: dark ? COLORS.dark1 : COLORS.white,
        },
      }}
    >
      <Tabs.Screen
        name={Paths.Index}
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.home}
              outlineIcon={icons.home2Outline}
              label="Home"
              dark={dark}
            />
          ),
        }}
      />
      <Tabs.Screen
        name={Paths.Enfant}
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.users}
              outlineIcon={icons.users}
              label="Enfant"
              dark={dark}
            />
          ),
        }}
      />
      <Tabs.Screen
        name={Paths.Transactions}
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.cart}
              outlineIcon={icons.cartOutline}
              label="Transactions"
              dark={dark}
            />
          ),
        }}
      />
      <Tabs.Screen
        name={Paths.Support}
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.chat}
              outlineIcon={icons.chatOutline}
              label="Support"
              dark={dark}
            />
          ),
        }}
      />
      <Tabs.Screen
        name={Paths.Profile}
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.user}
              outlineIcon={icons.userOutline}
              label="Profile"
              dark={dark}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
