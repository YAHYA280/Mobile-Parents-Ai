// app/Enfants/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { ChildrenProvider } from "@/contexts/ChildrenContext";
import { ActivitiesProvider } from "@/contexts/ActivitiesContext";
import { FiltersProvider } from "@/contexts/FiltersContext";

export default function EnfantsLayout() {
  return (
    <ChildrenProvider>
      <ActivitiesProvider>
        <FiltersProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            {/* Only define screens that actually exist */}
            <Stack.Screen
              name="index"
              options={{
                title: "Mes Enfants",
              }}
            />
            <Stack.Screen
              name="[id]"
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
            {/* Only include these if the files actually exist */}
            {/* If these files don't exist, remove these screens */}
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
        </FiltersProvider>
      </ActivitiesProvider>
    </ChildrenProvider>
  );
}
