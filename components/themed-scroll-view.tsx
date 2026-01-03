import { ScrollView, type ScrollViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
  contentPadding?: number;
};

export function ThemedScrollView({
  style,
  contentContainerStyle,
  lightColor,
  darkColor,
  contentPadding = 16,
  ...otherProps
}: ThemedScrollViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <ScrollView
      style={[{ backgroundColor, flex: 1 }, style]}
      contentContainerStyle={[
        { padding: contentPadding },
        contentContainerStyle,
      ]}
      {...otherProps}
    />
  );
}

