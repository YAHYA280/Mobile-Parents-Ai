// Historique home component/EmptyTipsModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { COLORS } from "../../../../constants/theme";

interface EmptyTipsModalProps {
  visible: boolean;
  onClose: () => void;
}

// Tip item type
interface Tip {
  id: string;
  title: string;
  description: string;
  icon: IconProp;
}

const EmptyTipsModal: React.FC<EmptyTipsModalProps> = ({
  visible,
  onClose,
}) => {
  // Tips data
  const tips: Tip[] = [
    {
      id: "1",
      title: "Encouragez l'utilisation des assistants",
      description:
        "Les assistants intelligents proposent des exercices adaptés au niveau de l'enfant. Plus ils sont utilisés, plus l'historique sera riche.",
      icon: "robot" as IconProp,
    },
    {
      id: "2",
      title: "Planifiez des sessions régulières",
      description:
        "Établissez un calendrier d'apprentissage régulier pour maintenir l'engagement et voir les progrès dans l'historique.",
      icon: "calendar-alt" as IconProp,
    },
    {
      id: "3",
      title: "Explorez différentes matières",
      description:
        "Encouragez l'enfant à explorer diverses matières pour développer un apprentissage équilibré et varié.",
      icon: "book" as IconProp,
    },
    {
      id: "4",
      title: "Suivez les progrès régulièrement",
      description:
        "Consultez régulièrement l'historique pour identifier les forces et les points à améliorer.",
      icon: "chart-line" as IconProp,
    },
  ];

  const renderTipItem = ({ item }: { item: Tip }) => (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 16,
        backgroundColor: "rgba(0,0,0,0.02)",
        padding: 16,
        borderRadius: 12,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: COLORS.primary,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
        }}
      >
        <FontAwesomeIcon icon={item.icon} size={20} color="#FFFFFF" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: COLORS.black,
            marginBottom: 6,
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: COLORS.gray3,
            lineHeight: 20,
          }}
        >
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "90%",
            maxHeight: "80%",
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: COLORS.black,
              }}
            >
              Conseils pour démarrer
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(0,0,0,0.05)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon
                icon={"times" as IconProp}
                size={16}
                color={COLORS.black}
              />
            </TouchableOpacity>
          </View>

          <FlatList
            data={tips}
            renderItem={renderTipItem}
            keyExtractor={(item) => item.id}
          />

          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
              marginTop: 10,
              elevation: 2,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
            onPress={onClose}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Compris
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EmptyTipsModal;
