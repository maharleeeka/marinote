import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, TouchableOpacity } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

interface AddStoryButtonProps {
  onAddPress?: () => void;
}

export function AddStoryButton({ onAddPress }: AddStoryButtonProps) {
  const tintColor = useThemeColor({}, 'tint');
  return <TouchableOpacity
          style={styles.addButton}
          onPress={onAddPress}
          activeOpacity={0.7}
        >
          <IconSymbol name="plus.circle.fill" size={28} color={tintColor} />
        </TouchableOpacity>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  logo: {
    width: 50,
    height: 50,
  },
  center: {
    flex: 1,
  },
  addButton: {
    padding: 4,
  },
});