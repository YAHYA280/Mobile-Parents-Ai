// app/Enfants/Historique/statement.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import type { Activity } from "../../../data/Enfants/CHILDREN_DATA";

import icons from "../../../constants/icons";
import { COLORS } from "../../../constants/theme";

interface StatementProps {
  activity: Activity;
}

const Statement: React.FC<StatementProps> = ({ activity }) => {
  const [expanded, setExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the appearance of the statement
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(heightAnim, {
        toValue: expanded ? 1 : 0,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      }),
    ]).start();
  }, [fadeAnim, heightAnim, expanded]);

  const toggleExpand = () => {
    setExpanded(!expanded);

    Animated.spring(heightAnim, {
      toValue: !expanded ? 1 : 0,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  };

  // Get mock statement data
  const getStatementData = () => {
    // This would normally come from the activity data
    return {
      title: "Exercice sur les fractions",
      description:
        "Dans cet exercice, nous allons explorer les concepts de base des fractions et apprendre à les manipuler dans différentes situations.",
      steps: [
        "Comprendre ce qu'est une fraction et comment elle représente une partie d'un tout.",
        "Identifier le numérateur et le dénominateur d'une fraction.",
        "Comparer des fractions ayant le même dénominateur.",
        "Additionner et soustraire des fractions simples.",
      ],
      note: "Prenez votre temps pour bien comprendre chaque concept avant de passer au suivant. N'hésitez pas à utiliser des représentations visuelles pour mieux visualiser les fractions.",
    };
  };

  const statementData = getStatementData();

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        padding: 16,
        backgroundColor: "rgba(0,0,0,0.03)",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.05)",
      }}
    >
      {/* Titre de l'énoncé */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: expanded ? 16 : 0,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: COLORS.primary,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <FontAwesomeIcon icon="file-alt" size={16} color="#FFFFFF" />
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: COLORS.black,
            }}
          >
            Énoncé de l&apos;exercice
          </Text>
        </View>

        <TouchableOpacity onPress={toggleExpand}>
          <FontAwesomeIcon
            icon={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={COLORS.gray3}
          />
        </TouchableOpacity>
      </View>

      {/* Contenu de l'énoncé - Only visible when expanded */}
      <Animated.View
        style={{
          maxHeight: heightAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1000], // Max height when expanded
          }),
          overflow: "hidden",
          marginTop: 12,
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.02)",
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",
              color: COLORS.black,
              marginBottom: 12,
            }}
          >
            {statementData.title}
          </Text>

          <Text
            style={{
              fontSize: 15,
              lineHeight: 22,
              color: COLORS.black,
              marginBottom: 16,
            }}
          >
            {statementData.description}
          </Text>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: COLORS.black,
                marginBottom: 10,
              }}
            >
              Étapes:
            </Text>

            {statementData.steps.map((step, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  marginBottom: 10,
                  alignItems: "flex-start",
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: COLORS.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                    marginTop: 2,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    lineHeight: 21,
                    color: COLORS.black,
                  }}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>

          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.05)",
              padding: 12,
              borderRadius: 8,
              flexDirection: "row",
            }}
          >
            <FontAwesomeIcon
              icon="info-circle"
              size={16}
              color={COLORS.primary}
              style={{ marginRight: 10, marginTop: 2 }}
            />
            <Text
              style={{
                fontSize: 14,
                fontStyle: "italic",
                color: COLORS.gray3,
                flex: 1,
              }}
            >
              {statementData.note}
            </Text>
          </View>
        </View>

        {/* Informations supplémentaires */}
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.02)",
            padding: 16,
            borderRadius: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <FontAwesomeIcon
              icon="info-circle"
              size={16}
              color={COLORS.primary}
              style={{ marginRight: 10 }}
            />
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: COLORS.black,
              }}
            >
              Détails de l&apos;activité
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginBottom: 8,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 90,
                opacity: 0.7,
              }}
            >
              <Text
                style={{
                  color: COLORS.gray3,
                  fontSize: 14,
                }}
              >
                Date:
              </Text>
            </View>
            <Text
              style={{
                flex: 1,
                color: COLORS.black,
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              {new Date(activity.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginBottom: 8,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 90,
                opacity: 0.7,
              }}
            >
              <Text
                style={{
                  color: COLORS.gray3,
                  fontSize: 14,
                }}
              >
                Assistant:
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "rgba(76, 175, 80, 0.1)",
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  color: "#4CAF50",
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                {activity.assistant || "J'Apprends"}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 90,
                opacity: 0.7,
              }}
            >
              <Text
                style={{
                  color: COLORS.gray3,
                  fontSize: 14,
                }}
              >
                Durée:
              </Text>
            </View>
            <Text
              style={{
                flex: 1,
                color: COLORS.black,
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              {activity.duree || "Non spécifiée"}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default Statement;
