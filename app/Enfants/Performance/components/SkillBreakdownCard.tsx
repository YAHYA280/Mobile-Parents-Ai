// Fixed SkillBreakdownCard.tsx
import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBrain, faCheck } from "@fortawesome/free-solid-svg-icons";
import Svg, { Polygon, Circle, Line, Text as SvgText } from "react-native-svg";

import { Child } from "../../../../data/Enfants/CHILDREN_DATA";

interface SkillBreakdownCardProps {
  childData: Child;
}

interface SkillData {
  name: string;
  value: number; // 0-100
  color: string;
}

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);

const SkillBreakdownCard: React.FC<SkillBreakdownCardProps> = ({
  childData,
}) => {
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [animation] = useState(new Animated.Value(0));
  // FIX: Add ref for points to avoid recreating them on each render
  const pointsRef = useRef<string>("");

  const windowWidth = Dimensions.get("window").width;
  const chartSize = windowWidth - 100; // Allow for padding
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  const radius = centerX - 40; // Smaller to fit in container

  useEffect(() => {
    // In a real app, this would be calculated from the child's activities,
    // but we'll use mock data for the example
    const mockSkills: SkillData[] = [
      { name: "Mathématiques", value: 85, color: "#4CAF50" },
      { name: "Français", value: 70, color: "#2196F3" },
      { name: "Logique", value: 90, color: "#9C27B0" },
      { name: "Sciences", value: 65, color: "#FF9800" },
      { name: "Créativité", value: 75, color: "#E91E63" },
    ];

    setSkills(mockSkills);

    // Start animation
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [childData, animation]);

  // Calculate points for the radar chart
  const getPolygonPoints = (
    skills: SkillData[],
    animationValue: number
  ): string => {
    if (skills.length === 0) return "";

    const points = skills.map((skill, index) => {
      const angle = (Math.PI * 2 * index) / skills.length - Math.PI / 2;
      const value = (skill.value / 100) * animationValue; // Scale by animation value
      const x = centerX + radius * value * Math.cos(angle);
      const y = centerY + radius * value * Math.sin(angle);
      return `${x},${y}`;
    });

    return points.join(" ");
  };

  // FIX: Pre-calculate start and end points for animation
  useEffect(() => {
    if (skills.length > 0) {
      // Create and cache the end points when skills are loaded
      pointsRef.current = getPolygonPoints(skills, 1);
    }
  }, [skills]);

  // FIX: Use a simple Polygon with fixed points instead of animated points
  const animatedScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Generate grid lines for the radar background
  const generateGridLines = () => {
    const levels = 4; // Number of concentric circles
    const result = [];

    // Add concentric circles
    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius * i) / levels;
      result.push(
        <Circle
          key={`circle-${i}`}
          cx={centerX}
          cy={centerY}
          r={levelRadius}
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth={1}
        />
      );
    }

    if (skills.length > 0) {
      for (let i = 0; i < skills.length; i++) {
        const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        result.push(
          <Line
            key={`line-${i}`}
            x1={centerX}
            y1={centerY}
            x2={x}
            y2={y}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth={1}
          />
        );

        // Add labels
        const skill = skills[i];
        const labelRadius = radius + 2;
        const labelX = centerX + labelRadius * Math.cos(angle);
        const labelY = centerY + labelRadius * Math.sin(angle);

        // Adjust text anchor based on position - use proper TextAnchor type
        let textAnchor: "start" | "middle" | "end" = "middle";
        if (labelX < centerX - 10) textAnchor = "end";
        else if (labelX > centerX + 10) textAnchor = "start";

        result.push(
          <SvgText
            key={`label-${i}`}
            x={labelX}
            y={labelY}
            textAnchor={textAnchor}
            fontWeight="bold"
            fontSize="12"
            fill={skill.color}
          >
            {skill.name}
          </SvgText>
        );
      }
    }

    return result;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Répartition des compétences</Text>
        <View style={styles.iconContainer}>
          <FontAwesomeIcon icon={faBrain} size={20} color="#9C27B0" />
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Svg
          width={chartSize}
          height={chartSize}
          viewBox={`0 0 ${chartSize} ${chartSize}`}
        >
          {/* Background grid */}
          {generateGridLines()}

          {/* Data polygon - FIX: use standard polygon with transform */}
          {skills.length > 0 && pointsRef.current && (
            <AnimatedPolygon
              points={pointsRef.current}
              fill="rgba(156, 39, 176, 0.3)"
              stroke="#9C27B0"
              strokeWidth={2}
              originX={centerX} // <- centre of the radar
              originY={centerY}
              scale={animatedScale} // <- single animated prop
            />
          )}
        </Svg>
      </View>

      <View style={styles.skillLegend}>
        {skills.map((skill, index) => (
          <View key={index} style={styles.skillItem}>
            <View style={[styles.colorDot, { backgroundColor: skill.color }]} />
            <Text style={styles.skillName}>{skill.name}</Text>
            <Text style={styles.skillValue}>{skill.value}%</Text>
          </View>
        ))}
      </View>

      <View style={styles.strengthsContainer}>
        <Text style={styles.strengthsTitle}>Points forts:</Text>
        {skills
          .filter((skill) => skill.value >= 80)
          .map((skill, index) => (
            <View key={index} style={styles.strengthItem}>
              <FontAwesomeIcon
                icon={faCheck}
                size={14}
                color="#24D26D"
                style={styles.strengthIcon}
              />
              <Text style={styles.strengthText}>
                Excellence en {skill.name.toLowerCase()}
              </Text>
            </View>
          ))}
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
    backgroundColor: "rgba(156, 39, 176, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  skillLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 20,
  },
  skillItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%", // two columns
    marginBottom: 10,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  skillName: {
    fontSize: 14,
    color: "#333333",
    flex: 1,
  },
  skillValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
  },
  strengthsContainer: {
    backgroundColor: "rgba(36, 210, 109, 0.05)",
    borderRadius: 12,
    padding: 16,
  },
  strengthsTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  strengthItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  strengthIcon: {
    marginRight: 8,
  },
  strengthText: {
    fontSize: 14,
    color: "#333333",
  },
});

export default SkillBreakdownCard;
