// app/Enfants/Performance/components/ProgressTrendsCard.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChartLine, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import Svg, { Path, Line, Text as SvgText, G, Circle } from "react-native-svg";

import { COLORS } from "../../../../constants/theme";
import { Activity } from "../../../../data/Enfants/CHILDREN_DATA";

interface ProgressTrendsCardProps {
  activities: Activity[];
}

interface DataPoint {
  date: Date;
  score: number;
}

// Create animated SVG components
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProgressTrendsCard: React.FC<ProgressTrendsCardProps> = ({
  activities,
}) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [pathAnimation] = useState(new Animated.Value(0));
  const [pointAnimation] = useState(new Animated.Value(0));

  const windowWidth = Dimensions.get("window").width;
  const chartWidth = windowWidth - 80;
  const chartHeight = 180;
  const paddingHorizontal = 30;
  const paddingVertical = 20;

  const innerWidth = chartWidth - paddingHorizontal * 2;
  const innerHeight = chartHeight - paddingVertical * 2;

  const pathRef = useRef<string>("");

  // Process activities data for the chart
  useEffect(() => {
    const processData = () => {
      if (!activities || activities.length === 0) {
        // Generate mock data for demonstration if no activities
        const mockData: DataPoint[] = [];
        const endDate = new Date();

        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(endDate.getMonth() - i);

          // Generate a score that trends upward with some variation
          const baseScore = 50 + (5 - i) * 8;
          const variation = Math.random() * 10 - 5; // +/- 5%
          const score = Math.min(Math.max(baseScore + variation, 0), 100);

          mockData.push({ date, score });
        }

        return mockData;
      }

      // Sort activities by date
      const sortedActivities = [...activities].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Group by month and calculate average scores
      const monthlyScores: {
        [key: string]: { total: number; count: number; date: Date };
      } = {};

      sortedActivities.forEach((activity) => {
        if (!activity.score || !activity.score.includes("/")) return;

        const [score, possible] = activity.score
          .split("/")
          .map((num) => parseInt(num, 10));

        const percentage = (score / possible) * 100;
        const date = new Date(activity.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

        if (!monthlyScores[monthKey]) {
          monthlyScores[monthKey] = { total: 0, count: 0, date };
        }

        monthlyScores[monthKey].total += percentage;
        monthlyScores[monthKey].count += 1;
      });

      // Convert to array of data points
      return Object.values(monthlyScores)
        .map((item) => ({
          date: item.date,
          score: item.total / item.count,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    };

    const newData = processData();
    setData(newData);

    // Create the animated path
    if (newData.length > 0) {
      const createPath = () => {
        if (newData.length < 2) return "";

        const maxDate = Math.max(...newData.map((d) => d.date.getTime()));
        const minDate = Math.min(...newData.map((d) => d.date.getTime()));
        const dateRange = maxDate - minDate;

        const getX = (date: Date) => {
          if (dateRange === 0) return paddingHorizontal; // Handle edge case
          return (
            paddingHorizontal +
            ((date.getTime() - minDate) / dateRange) * innerWidth
          );
        };

        const getY = (score: number) => {
          return chartHeight - paddingVertical - (score / 100) * innerHeight;
        };

        let path = `M ${getX(newData[0].date)} ${getY(newData[0].score)}`;

        for (let i = 1; i < newData.length; i++) {
          path += ` L ${getX(newData[i].date)} ${getY(newData[i].score)}`;
        }

        return path;
      };

      pathRef.current = createPath();

      // Animate the path
      Animated.parallel([
        Animated.timing(pathAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(pointAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [activities, pathAnimation, pointAnimation]);

  // Generate the x-axis labels
  const renderXAxisLabels = () => {
    if (data.length === 0) return null;

    const maxDate = Math.max(...data.map((d) => d.date.getTime()));
    const minDate = Math.min(...data.map((d) => d.date.getTime()));
    const dateRange = maxDate - minDate;

    return data.map((point, index) => {
      const x =
        paddingHorizontal +
        ((point.date.getTime() - minDate) / dateRange) * innerWidth;

      return (
        <SvgText
          key={index}
          x={x}
          y={chartHeight - paddingVertical / 2}
          fontSize="10"
          fill="#666666"
          textAnchor="middle"
        >
          {point.date.toLocaleDateString("fr-FR", { month: "short" })}
        </SvgText>
      );
    });
  };

  // Generate the y-axis labels
  const renderYAxisLabels = () => {
    const steps = 5;
    const labels = [];

    for (let i = 0; i <= steps; i++) {
      const value = (i / steps) * 100;
      const y = chartHeight - paddingVertical - (value / 100) * innerHeight;

      labels.push(
        <G key={i}>
          <Line
            x1={paddingHorizontal - 5}
            y1={y}
            x2={chartWidth - paddingHorizontal}
            y2={y}
            stroke="rgba(0,0,0,0.05)"
            strokeWidth={1}
          />
          <SvgText
            x={paddingHorizontal - 10}
            y={y + 4} // Adjust for vertical alignment
            fontSize="10"
            fill="#666666"
            textAnchor="end"
          >
            {`${Math.round(value)}%`}
          </SvgText>
        </G>
      );
    }

    return labels;
  };

  // Render data points
  const renderDataPoints = () => {
    if (data.length === 0) return null;

    const maxDate = Math.max(...data.map((d) => d.date.getTime()));
    const minDate = Math.min(...data.map((d) => d.date.getTime()));
    const dateRange = maxDate - minDate;

    return data.map((point, index) => {
      const x =
        paddingHorizontal +
        ((point.date.getTime() - minDate) / dateRange) * innerWidth;
      const y =
        chartHeight - paddingVertical - (point.score / 100) * innerHeight;

      // Apply scaling animation to points
      const scale = pointAnimation
        ? pointAnimation.interpolate({
            inputRange: [0, 0.8, 1],
            outputRange: [0, 1.2, 1],
          })
        : 1;

      // Use an animated transform instead of a scale prop
      const animatedStyle = {
        transform: [{ scale }],
        opacity: pointAnimation,
      };

      return (
        <AnimatedCircle
          key={index}
          cx={x}
          cy={y}
          r={6}
          fill="#FFFFFF"
          stroke={COLORS.primary}
          strokeWidth={2}
          opacity={pointAnimation}
          // Use the transform property of SVG
          transform={`translate(${x} ${y}) scale(${scale}) translate(-${x} -${y})`}
        />
      );
    });
  };

  // Determine if trend is positive
  const isPositiveTrend = () => {
    if (data.length < 2) return true;
    return data[data.length - 1].score > data[0].score;
  };

  // Calculate the average growth percentage
  const calculateGrowthPercentage = () => {
    if (data.length < 2) return 0;

    const firstScore = data[0].score;
    const lastScore = data[data.length - 1].score;

    if (firstScore === 0) return 0; // Avoid division by zero

    return ((lastScore - firstScore) / firstScore) * 100;
  };

  // Generate trend insights
  const getTrendInsight = () => {
    const growth = calculateGrowthPercentage();

    if (growth >= 20) {
      return "Progression exceptionnelle ! Continuez dans cette direction.";
    } else if (growth >= 10) {
      return "Bonne progression sur la période. Les efforts portent leurs fruits.";
    } else if (growth >= 0) {
      return "Progression stable. Continuez à pratiquer régulièrement.";
    } else if (growth >= -10) {
      return "Légère baisse des performances. Un peu plus de pratique pourrait aider.";
    } else {
      return "Baisse significative. Un soutien supplémentaire pourrait être nécessaire.";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Progression dans le temps</Text>
        <View style={styles.iconContainer}>
          <FontAwesomeIcon
            icon={faChartLine}
            size={20}
            color={COLORS.primary}
          />
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Chart grid lines */}
          {renderYAxisLabels()}

          {/* X axis */}
          <Line
            x1={paddingHorizontal}
            y1={chartHeight - paddingVertical}
            x2={chartWidth - paddingHorizontal}
            y2={chartHeight - paddingVertical}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth={1}
          />

          {/* X axis labels */}
          {renderXAxisLabels()}

          {/* Data line */}
          {pathRef.current && (
            <AnimatedPath
              d={pathRef.current}
              fill="none"
              stroke={COLORS.primary}
              strokeWidth={3}
              strokeDasharray={`${innerWidth * 2}`}
              strokeDashoffset={pathAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [innerWidth * 2, 0],
              })}
            />
          )}

          {/* Data points */}
          {renderDataPoints()}
        </Svg>
      </View>

      <View style={styles.insightContainer}>
        <View style={styles.insightIconContainer}>
          <FontAwesomeIcon icon={faLightbulb} size={18} color="#F3BB00" />
        </View>
        <View style={styles.insightTextContainer}>
          <Text style={styles.insightTitle}>
            {isPositiveTrend() ? "Tendance positive" : "Tendance à surveiller"}
          </Text>
          <Text style={styles.insightText}>{getTrendInsight()}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Début de période</Text>
          <Text style={styles.statValue}>
            {data.length > 0 ? `${data[0].score.toFixed(1)}%` : "N/A"}
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Fin de période</Text>
          <Text style={styles.statValue}>
            {data.length > 0
              ? `${data[data.length - 1].score.toFixed(1)}%`
              : "N/A"}
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Évolution</Text>
          <Text
            style={[
              styles.statValue,
              {
                color: calculateGrowthPercentage() >= 0 ? "#24D26D" : "#FC4E00",
              },
            ]}
          >
            {data.length > 0
              ? `${calculateGrowthPercentage() >= 0 ? "+" : ""}${calculateGrowthPercentage().toFixed(1)}%`
              : "N/A"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 142, 105, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  chartContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  insightContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(243, 187, 0, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  insightIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(243, 187, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  insightTextContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    height: "100%",
    marginHorizontal: 8,
  },
});

export default ProgressTrendsCard;
