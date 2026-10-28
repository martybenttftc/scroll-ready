import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Palette, Spacing, Type } from '@/constants/theme';
import { trackIcon } from '@/constants/track-style';
import { cards, themes, tracks } from '@/content/catalog';
import { useTheme } from '@/hooks/use-theme';

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
      {themes.map((theme) => (
        <View key={theme.id} style={styles.themeBlock}>
          <View style={styles.themeHeader}>
            <Text style={styles.themeTitle} accessibilityRole="header">
              {theme.title}
            </Text>
            <Text style={styles.themeBlurb}>{theme.blurb}</Text>
          </View>
          <View style={styles.grid}>
            {tracks
              .filter((track) => track.theme === theme.id)
              .map((track) => {
                const icon = trackIcon(track.id);
                const count = cards.filter((c) => c.track === track.id).length;
                const countLabel = count === 0 ? 'Coming soon' : `${count} ${count === 1 ? 'card' : 'cards'}`;
                return (
                  <View
                    key={track.id}
                    accessible
                    accessibilityLabel={`${track.title}. ${track.blurb} ${countLabel}.`}
                    style={styles.tile}>
                    <SymbolView name={icon} size={24} tintColor={count === 0 ? Palette.stone : Palette.blaze} />
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
  tileCount: {
    fontFamily: Type.bodySemiBold,
    fontSize: 13,
    color: Palette.ash,
    marginTop: Spacing.one,
  },
});
