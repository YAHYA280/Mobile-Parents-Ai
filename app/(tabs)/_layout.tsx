import { Tabs } from "expo-router";
import { View, Text, Platform } from "react-native";
import { Image } from "expo-image";
import { COLORS, icons, FONTS, SIZES } from "../../constants";
import { useTheme } from "@/theme/ThemeProvider";

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
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View
                style={{
                  alignItems: "center",
                  paddingTop: 16,
                  width: SIZES.width / 4,
                }}
              >
                <Image
                  source={focused ? icons.home : icons.home2Outline}
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
                    color: focused
                      ? COLORS.primary
                      : dark
                        ? COLORS.gray3
                        : COLORS.gray3,
                  }}
                >
                  Home
                </Text>
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View
                style={{
                  alignItems: "center",
                  paddingTop: 16,
                  width: SIZES.width / 4,
                }}
              >
                <Image
                  source={
                    focused ? icons.chatBubble2 : icons.chatBubble2Outline
                  }
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
                    color: focused
                      ? COLORS.primary
                      : dark
                        ? COLORS.gray3
                        : COLORS.gray3,
                  }}
                >
                  Inbox
                </Text>
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View
                style={{
                  alignItems: "center",
                  paddingTop: 16,
                  width: SIZES.width / 4,
                }}
              >
                <Image
                  source={focused ? icons.cart : icons.cartOutline}
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
                    color: focused
                      ? COLORS.primary
                      : dark
                        ? COLORS.gray3
                        : COLORS.gray3,
                  }}
                >
                  Transactions
                </Text>
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View
                style={{
                  alignItems: "center",
                  paddingTop: 16,
                  width: SIZES.width / 4,
                }}
              >
                <Image
                  source={focused ? icons.user : icons.userOutline}
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
                    color: focused
                      ? COLORS.primary
                      : dark
                        ? COLORS.gray3
                        : COLORS.gray3,
                  }}
                >
                  Profile
                </Text>
              </View>
            );
          },
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
