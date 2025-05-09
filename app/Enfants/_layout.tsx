// app/Enfants/_layout.tsx
import { Stack } from "expo-router";

export default function EnfantsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide default header
        animation: "slide_from_right", // Animation type
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Mes Enfants", // This won't show if headerShown is false
        }}
      />
      <Stack.Screen
        name="[id]/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Historique/index"
        options={{
          title: "Historique d'activités",
        }}
      />
      <Stack.Screen
        name="Historique/[activityId]/index"
        options={{
          title: "Détails de l'activité",
        }}
      />
      <Stack.Screen
        name="Historique/[activityId]/chat"
        options={{
          title: "Conversation",
        }}
      />
      <Stack.Screen
        name="Historique/[activityId]/video"
        options={{
          title: "Ressources vidéo",
        }}
      />
    </Stack>
  );
}
