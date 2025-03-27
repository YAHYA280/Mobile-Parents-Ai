import type { ListRenderItemInfo } from "react-native";
import type { NavigationProp } from "@react-navigation/native";

import React, { useState } from "react";
import CourseCard from "@/components/CourseCard";
import { useTheme } from "@/theme/ThemeProvider";
import SectionHeader from "@/components/SectionHeader";
import { useNavigation } from "@react-navigation/native";
import { icons, SIZES, COLORS, images } from "@/constants";
import { ScrollView } from "react-native-virtualized-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { banners, CATEGORIES, mostPopularCourses } from "@/data";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface Banner {
  id: string;
  discount: string;
  discountName: string;
  bottomTitle: string;
  bottomSubtitle: string;
}

interface HomeProps {
  navigation: any;
}

const Home: React.FC<HomeProps> = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { colors, dark } = useTheme();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "all",
  ]);

  const renderBannerItem = ({ item }: ListRenderItemInfo<Banner>) => (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerTopContainer}>
        <View>
          <Text style={styles.bannerDicount}>{item.discount} OFF</Text>
          <Text style={styles.bannerDiscountName}>{item.discountName}</Text>
        </View>
        <Text style={styles.bannerDiscountNum}>{item.discount}</Text>
      </View>
      <View style={styles.bannerBottomContainer}>
        <Text style={styles.bannerBottomTitle}>{item.bottomTitle}</Text>
        <Text style={styles.bannerBottomSubtitle}>{item.bottomSubtitle}</Text>
      </View>
    </View>
  );

  const keyExtractor = (item: { id: string }) => item.id;
  const keyExtractorCategory = (item: { value: string }) => item.value;

  const handleEndReached = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const renderDot = (index: number) => (
    <View
      style={[styles.dot, index === currentIndex ? styles.activeDot : null]}
      key={index}
    />
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.viewLeft}>
        <Image
          source={images.user7}
          resizeMode="contain"
          style={styles.userIcon}
        />
        <View style={styles.viewNameContainer}>
          <Text
            style={[
              styles.title,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          >
            Andrew Ainsley
          </Text>
        </View>
      </View>
      <View style={styles.viewRight}>
        <TouchableOpacity onPress={() => navigation.navigate("notifications")}>
          <Image
            source={icons.notificationBell2}
            resizeMode="contain"
            style={[
              styles.bellIcon,
              { tintColor: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBanner = () => (
    <View style={styles.bannerItemContainer}>
      <FlatList
        data={banners}
        renderItem={renderBannerItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / SIZES.width
          );
          setCurrentIndex(newIndex);
        }}
      />
      <View style={styles.dotContainer}>
        {banners.map((_, index) => renderDot(index))}
      </View>
    </View>
  );

  const renderPopularCourses = () => {
    const filteredCourses = mostPopularCourses.filter((course) => {
      if (selectedCategories.includes("all")) {
        return true;
      }
      return selectedCategories.includes(course.category);
    });

    const toggleCategory = (categoryId: string) => {
      if (categoryId === "all") {
        if (!selectedCategories.includes("all")) {
          setSelectedCategories(["all"]);
        }
        return;
      }

      const updatedCategories = [...selectedCategories];

      const allIndex = updatedCategories.indexOf("all");
      if (allIndex !== -1) {
        updatedCategories.splice(allIndex, 1);
      }

      const index = updatedCategories.indexOf(categoryId);
      if (index === -1) {
        updatedCategories.push(categoryId);
      } else {
        updatedCategories.splice(index, 1);

        if (updatedCategories.length === 0) {
          updatedCategories.push("all");
        }
      }

      setSelectedCategories(updatedCategories);
    };

    const renderCategoryItem = ({
      item,
    }: ListRenderItemInfo<{ value: string; label: string }>) => (
      <TouchableOpacity
        style={{
          backgroundColor: selectedCategories.includes(item.value)
            ? COLORS.primary
            : "transparent",
          padding: 10,
          marginVertical: 5,
          borderColor: COLORS.primary,
          borderWidth: 1.3,
          borderRadius: 24,
          marginRight: 12,
        }}
        onPress={() => toggleCategory(item.value)}
      >
        <Text
          style={{
            color: selectedCategories.includes(item.value)
              ? COLORS.white
              : COLORS.primary,
          }}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );

    return (
      <View style={{ paddingBottom: 40 }}>
        <SectionHeader
          title="Cours populaires"
          subtitle="Voir tout"
          onPress={() => navigation.navigate("mostpopularcourses")}
        />
        <FlatList
          data={CATEGORIES}
          keyExtractor={keyExtractorCategory}
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={renderCategoryItem}
        />
        {filteredCourses.length > 0 ? (
          <FlatList
            data={filteredCourses}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => (
              <CourseCard
                name={item.name}
                image={item.image}
                category={
                  CATEGORIES.find((cat) => cat.value === item.category)
                    ?.label || item.category
                }
                price={item.price}
                isOnDiscount={item.isOnDiscount}
                oldPrice={item.oldPrice}
                rating={item.rating}
                numStudents={item.numStudents}
                onPress={() => navigation.navigate("coursedetailsmore")}
              />
            )}
          />
        ) : (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ fontFamily: "medium", color: COLORS.gray }}>
              Aucun cours disponible dans cette catégorie
            </Text>
          </View>
        )}
      </View>
    );
  };
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 22 }}
        >
          {renderBanner()}
          {renderPopularCourses()}
        </ScrollView>
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
    backgroundColor: COLORS.white,
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    alignItems: "center",
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 32,
  },
  viewLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.greyscale900,
  },
  viewNameContainer: {
    marginLeft: 12,
  },
  viewRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  bellIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 8,
  },
  bannerContainer: {
    width: SIZES.width - 32,
    height: 154,
    paddingHorizontal: 28,
    paddingTop: 28,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
  },
  bannerTopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerDicount: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.white,
    marginBottom: 4,
  },
  bannerDiscountName: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.white,
  },
  bannerDiscountNum: {
    fontSize: 46,
    fontFamily: "bold",
    color: COLORS.white,
  },
  bannerBottomContainer: {
    marginTop: 8,
  },
  bannerBottomTitle: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.white,
  },
  bannerBottomSubtitle: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.white,
    marginTop: 4,
  },
  bannerItemContainer: {
    width: "100%",
    paddingBottom: 10,
    backgroundColor: COLORS.primary,
    height: 170,
    borderRadius: 32,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.white,
  },
});

export default Home;
