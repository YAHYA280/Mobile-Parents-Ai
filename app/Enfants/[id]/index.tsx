import { Redirect, useLocalSearchParams } from "expo-router";

export default function ChildDefaultScreen() {
  const { id } = useLocalSearchParams();
  // Use the actual ID value, not a placeholder
  return <Redirect href={`/Enfants/${id}/apercu`} />;
}
