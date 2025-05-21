// Historique home component/ActivityList.tsx
import React, { useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ListRenderItemInfo,
} from "react-native";
import { COLORS } from "../../../../constants/theme";
import type { Activity } from "../../../../data/Enfants/CHILDREN_DATA";
import ActivityItem from "./ActivityItem";
import EmptyActivities from "./EmptyActivities";
import PaginationControls from "./PaginationControls";

interface ActivityListProps {
  activities: Activity[];
  currentPage: number;
  isTabComponent: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onViewDetails: (activity: Activity) => void;
  hasActiveFilters: boolean;
  resetFilters: () => void;
  onShowTips: () => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  currentPage,
  isTabComponent,
  isLoading,
  onPageChange,
  onViewDetails,
  hasActiveFilters,
  resetFilters,
  onShowTips,
}) => {
  const flatListRef = useRef<FlatList<Activity>>(null);

  // Calculate pagination
  const ACTIVITIES_PER_PAGE = 4;
  const totalActivities = activities.length;
  const totalPages = Math.ceil(totalActivities / ACTIVITIES_PER_PAGE);
  const currentActivities = activities.slice(
    (currentPage - 1) * ACTIVITIES_PER_PAGE,
    currentPage * ACTIVITIES_PER_PAGE
  );

  const renderActivityItem = ({
    item,
    index,
  }: ListRenderItemInfo<Activity>) => (
    <ActivityItem item={item} index={index} onViewDetails={onViewDetails} />
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Results Counter when filters are active */}
      {hasActiveFilters && (
        <View
          style={{
            backgroundColor: "rgba(255, 142, 105, 0.1)",
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: COLORS.primary,
              fontWeight: "500",
              fontSize: 14,
            }}
          >
            {activities.length}{" "}
            {activities.length > 1 ? "activités trouvées" : "activité trouvée"}
          </Text>
          <TouchableOpacity onPress={resetFilters}>
            <Text
              style={{
                color: COLORS.primary,
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              Réinitialiser
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={currentActivities}
        renderItem={renderActivityItem}
        keyExtractor={(item, index) => `activity-${item.id || index}`}
        contentContainerStyle={{
          paddingBottom: isTabComponent ? 100 : 20,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyActivities
            hasActiveFilters={hasActiveFilters}
            resetFilters={resetFilters}
            onShowTips={onShowTips}
          />
        }
      />

      {/* Pagination Controls - Only show if there are activities and multiple pages */}
      {totalActivities > 0 && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </View>
  );
};

export default ActivityList;
