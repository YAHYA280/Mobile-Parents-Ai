// app/Enfants/[id]/index.tsx
import { Redirect } from "expo-router";

export default function ChildDefaultScreen() {
  // This automatically redirects to the apercu tab when navigating to /Enfants/[id]
  return <Redirect href="apercu" />;
}
