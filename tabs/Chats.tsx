import type { ImageSourcePropType } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { messsagesData } from "../data";
import { SIZES, COLORS } from "../constants";

// Define the type for message item
interface MessageItem {
  id: string;
  fullName: string;
  userImg: ImageSourcePropType;
  isOnline?: boolean;
  lastMessage: string;
  lastMessageTime: string;
  messageInQueue: number;
}

// Type for navigation
type NavigationProp = NativeStackNavigationProp<any, any>;

const Chats: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const renderItem = ({
    item,
    index,
  }: {
    item: MessageItem;
    index: number;
  }) => (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigation.navigate("chat", {
          userName: item.fullName,
        })
      }
      style={[
        styles.userContainer,
        {
          borderBottomWidth: 1,
        },
        index % 2 !== 0
          ? {
              backgroundColor: COLORS.tertiaryWhite,
              borderBottomWidth: 1,
              borderTopWidth: 0,
            }
          : null,
      ]}
    >
      <View style={styles.userImageContainer}>
        {item.isOnline && item.isOnline === true && (
          <View style={styles.onlineIndicator} />
        )}

        <Image
          source={item.userImg}
          resizeMode="contain"
          style={styles.userImage}
        />
      </View>
      <View style={{ flexDirection: "row", width: SIZES.width - 104 }}>
        <View style={[styles.userInfoContainer]}>
          <Text
            style={[
              styles.userName,
              {
                color: COLORS.black,
              },
            ]}
          >
            {item.fullName}
          </Text>
          <Text style={styles.lastSeen}>{item.lastMessage}</Text>
        </View>
        <View
          style={{
            position: "absolute",
            right: 4,
            alignItems: "center",
          }}
        >
          <Text
            style={[
              styles.lastMessageTime,
              {
                color: COLORS.black,
              },
            ]}
          >
            {item.lastMessageTime}
          </Text>
          <View>
            {item.messageInQueue > 0 && (
              <TouchableOpacity
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: item.messageInQueue
                    ? COLORS.primary
                    : "transparent",
                  marginTop: 12,
                }}
              >
                <Text
                  style={[styles.messageInQueue]}
                >{`${item.messageInQueue}`}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={messsagesData}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
  iconBtnContainer: {
    height: 40,
    width: 40,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  notiContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 16,
    width: 16,
    borderRadius: 999,
    backgroundColor: "red",
    position: "absolute",
    top: 1,
    right: 1,
    zIndex: 999,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  notiText: {
    fontSize: 10,
    color: COLORS.white,
    fontFamily: "medium",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  headerTitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.black,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    height: 50,
    marginVertical: 22,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  searchInput: {
    width: "100%",
    height: "100%",
    marginHorizontal: 12,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  flatListContainer: {
    paddingBottom: 100,
  },
  userContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: COLORS.secondaryWhite,
    borderBottomWidth: 1,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  oddBackground: {
    backgroundColor: COLORS.tertiaryWhite,
  },
  userImageContainer: {
    paddingVertical: 15,
    marginRight: 22,
  },
  onlineIndicator: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.white,
    borderWidth: 2,
    position: "absolute",
    top: 14,
    right: 2,
    zIndex: 1000,
  },
  userImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  userInfoContainer: {
    flexDirection: "column",
  },
  userName: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "bold",
    marginBottom: 4,
  },
  lastSeen: {
    fontSize: 14,
    color: "gray",
  },
  lastMessageTime: {
    fontSize: 12,
    fontFamily: "regular",
  },
  messageInQueue: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.white,
  },
});

export default Chats;
