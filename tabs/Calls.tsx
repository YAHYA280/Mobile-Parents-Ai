import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { callData } from '../data';
import { icons, COLORS } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

// Define the type for call item
interface CallItem {
  id: string;
  userImg: any;
  fullName: string;
  status: string;
  date: string;
}

// Type for navigation
type NavigationProp = NativeStackNavigationProp<any, any>;

const Calls: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { dark } = useTheme();

  const renderItem = ({ item, index }: { item: CallItem; index: number }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('call')}
      style={styles.callContainer}
      key={index}
    >
      <View style={styles.callLeftContainer}>
        <Image source={item.userImg} resizeMode="contain" style={styles.userImg} />
        <View style={styles.userInfoContainer}>
          <Text
            style={[
              styles.fullName,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            {item.fullName}
          </Text>
          <View style={styles.statusContainer}>
            <Image
              source={
                item.status === 'Incoming'
                  ? icons.arrowDownSquare
                  : item.status === 'Outgoing'
                    ? icons.arrowUpSquare
                    : icons.cancelSquare
              }
              resizeMode="contain"
              style={[
                styles.arrowIcon,
                {
                  tintColor:
                    item.status === 'Incoming'
                      ? COLORS.primary
                      : item.status === 'Outgoing'
                        ? COLORS.greeen
                        : 'red',
                },
              ]}
            />
            <Text style={styles.status}>{item.status} | </Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        </View>
      </View>
      <View style={styles.callRightContainer}>
        <Image source={icons.telephoneOutline} resizeMode="contain" style={styles.telephoneIcon} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={callData}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  callContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  callLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImg: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  fullName: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: 'bold',
  },
  userInfoContainer: {
    marginLeft: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  date: {
    fontSize: 12,
    fontFamily: 'regular',
    color: 'gray',
  },
  status: {
    fontSize: 12,
    fontFamily: 'regular',
    color: 'gray',
  },
  arrowIcon: {
    width: 12,
    height: 12,
    tintColor: COLORS.primary,
    marginRight: 6,
  },
  telephoneIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
});

export default Calls;
