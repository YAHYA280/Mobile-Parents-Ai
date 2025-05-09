// app/Enfants/Historique/_layout.tsx
import { Stack } from "expo-router";

export default function HistoriqueLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}
