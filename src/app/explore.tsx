import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Palette, Spacing, Type } from '@/constants/theme';
import { trackIcon } from '@/constants/track-style';
import { cards, themes, tracks } from '@/content/catalog';
import { useTheme } from '@/hooks/use-theme';

// Only tracks with cards show. A wall of "Coming soon" tiles reads as an unfinished app,
// and App Review rejects placeholder content (guideline 2.1).
const countByTrack = new Map<string, number>();
for (const c of cards) countByTrack.set(c.track, (countByTrack.get(c.track) ?? 0) + 1);
const openTracks = tracks.filter((t) => (countByTrack.get(t.id) ?? 0) > 0);
const openThemes = themes.filter((th) => openTracks.some((t) => t.theme === th.id));

// Learn tab: browse tracks like chapters. Skills and plans come next.
export default function LearnScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.four, paddingBottom: insets.bottom + BottomTabInset + Spacing.four },
      ]}>
      <Text style={styles.title} accessibilityRole="header">
        Learn
      </Text>
      {openThemes.map((theme) => (
        <View key={theme.id} style={styles.themeBlock}>
          <View style={styles.themeHeader}>
            <Text style={styles.themeTitle} accessibilityRole="header">
              {theme.title}
            </Text>
            <Text style={styles.themeBlurb}>{theme.blurb}</Text>
          </View>
          <View style={styles.grid}>
            {openTracks
              .filter((track) => track.theme === theme.id)
              .map((track) => {
                const icon = trackIcon(track.id);
                const count = countByTrack.get(track.id) ?? 0;
                const countLabel = `${count} ${count === 1 ? 'card' : 'cards'}`;
                return (
                  <View
                    key={track.id}
                    accessible
                    accessibilityLabel={`${track.title}. ${track.blurb} ${countLabel}.`}
                    style={styles.tile}>
                    <SymbolView name={icon} size={24} tintColor={Palette.ash} />
                    <View style={styles.tileText}>
                      <Text style={styles.tileTitle} numberOfLines={2}>
                        {track.title}
                      </Text>
                      <Text style={styles.tileMeta} numberOfLines={2}>
                        {track.blurb}
                      </Text>
                      <Text style={styles.tileCount}>
                        {countLabel}
                      </Text>
                    </View>
                  </View>
                );
              })}
          </View>
        </View>
      ))}
      {openTracks.length < tracks.length && <Text style={styles.footer}>More tracks are on the way.</Text>}
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
  themeBlock: {
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  themeHeader: {
    gap: 2,
  },
  themeTitle: {
    fontFamily: Type.display,
    fontSize: 22,
    lineHeight: 28,
    color: Palette.bone,
  },
  themeBlurb: {
    fontFamily: Type.body,
    fontSize: 14,
    lineHeight: 20,
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
    backgroundColor: Palette.canopy,
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
  footer: {
    fontFamily: Type.body,
    fontSize: 14,
    color: Palette.ash,
    textAlign: 'center',
    marginTop: Spacing.four,
  },
  tileCount: {
    fontFamily: Type.bodySemiBold,
    fontSize: 13,
    color: Palette.ash,
    marginTop: Spacing.one,
  },
});
