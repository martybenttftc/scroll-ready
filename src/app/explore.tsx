import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { cards, tracks } from '@/content/catalog';
import { useTheme } from '@/hooks/use-theme';

// Learn tab: browse tracks like chapters. Skills and plans come next.
export default function LearnScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.four, paddingBottom: insets.bottom + BottomTabInset + Spacing.four },
      ]}>
      <ThemedText type="subtitle">Learn</ThemedText>
      {tracks.map((track) => {
        const count = cards.filter((c) => c.track === track.id).length;
        return (
          <View key={track.id} style={[styles.row, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="smallBold">{track.title}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {track.blurb} · {count} {count === 1 ? 'card' : 'cards'}
            </ThemedText>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  row: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
});
