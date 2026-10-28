import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Palette, Spacing, Type } from '@/constants/theme';
import { trackStyle } from '@/constants/track-style';
import { cards, tracks } from '@/content/seed';
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
      <Text style={styles.title} accessibilityRole="header">
        Learn
      </Text>
      <Text style={styles.section}>Tracks</Text>
      <View style={styles.grid}>
        {tracks.map((track) => {
          const look = trackStyle(track.id);
          const count = cards.filter((c) => c.track === track.id).length;
          return (
            <View
              key={track.id}
              accessible
              accessibilityLabel={`${track.title}. ${track.blurb} ${count} ${count === 1 ? 'card' : 'cards'}.`}
              style={[
                styles.tile,
                {
                  backgroundColor: look.tint,
                  backgroundImage: `radial-gradient(90% 90% at 100% 0%, ${look.hue}55 0%, ${look.hue}00 70%)`,
                },
              ]}>
              <SymbolView name={look.icon} size={26} tintColor={look.hue} />
              <View style={styles.tileText}>
                <Text style={styles.tileTitle} numberOfLines={2}>
                  {track.title}
                </Text>
                <Text style={styles.tileMeta} numberOfLines={2}>
                  {track.blurb}
                </Text>
                <Text style={[styles.tileCount, { color: look.hue }]}>
                  {count} {count === 1 ? 'card' : 'cards'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.four - 4,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontFamily: Type.display,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.5,
    color: Palette.bone,
  },
  section: {
    fontFamily: Type.bodyBold,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Palette.ash,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 148,
    padding: 14,
    borderRadius: 20,
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  tileText: {
    gap: 2,
  },
  tileTitle: {
    fontFamily: Type.display,
    fontSize: 19,
    lineHeight: 23,
    color: Palette.bone,
  },
  tileMeta: {
    fontFamily: Type.body,
    fontSize: 13,
    lineHeight: 18,
    color: Palette.boneSoft,
  },
  tileCount: {
    fontFamily: Type.bodyBold,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: Spacing.one,
  },
});
