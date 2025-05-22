import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClock, faStar } from "@fortawesome/free-solid-svg-icons";
import { MotiView } from "moti";
import { COLORS } from "@/constants/theme";
import { enhanceActivity } from "@/data/Enfants/CHILDREN_DATA";

interface RecentActivityCardProps {
  recentActivity: any;
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  recentActivity,
}) => {
  const activity = enhanceActivity(recentActivity);

  return (
    <MotiView
      style={styles.container}
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", delay: 1800, damping: 15 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dernière Activité</Text>
      </View>

      <View style={styles.activityContent}>
        <MotiView
          style={styles.activityDetails}
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: "timing", delay: 2000, duration: 400 }}
        >
          <Text style={styles.date}>{activity.date}</Text>
          <Text style={styles.activityName}>{activity.activite}</Text>

          <View style={styles.activityMeta}>
            <FontAwesomeIcon
              icon={faClock}
              size={14}
              color="#9E9E9E"
              style={styles.metaIcon}
            />
            <Text style={styles.metaText}>{activity.duree}</Text>

            {activity.score && (
              <>
                <View style={styles.separator} />
                <FontAwesomeIcon
                  icon={faStar}
                  size={14}
                  color={COLORS.primary}
                  style={styles.metaIcon}
                />
                <Text
                  style={[
                    styles.metaText,
                    { color: COLORS.primary, fontWeight: "600" },
                  ]}
                >
                  {activity.score}
                </Text>
              </>
            )}
          </View>

          {activity.commentaires && (
            <MotiView
              style={styles.commentsContainer}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", delay: 2200, duration: 400 }}
            >
              <Text style={styles.comments}>{activity.commentaires}</Text>
            </MotiView>
          )}
        </MotiView>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  activityContent: {
    flexDirection: "row",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    paddingLeft: 12,
  },
  activityDetails: {
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: "#9E9E9E",
    marginBottom: 4,
  },
  activityName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  activityMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metaIcon: {
    marginRight: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#9E9E9E",
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 8,
  },
  commentsContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  comments: {
    fontSize: 14,
    color: "#666666",
  },
});

export default RecentActivityCard;
