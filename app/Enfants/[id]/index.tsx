// app/Enfants/[id]/index.tsx
import { Redirect } from "expo-router";

export default function ChildDefaultScreen() {
  // Using a relative path with ./ to ensure correct typing
  return <Redirect href="./apercu" />;
}
