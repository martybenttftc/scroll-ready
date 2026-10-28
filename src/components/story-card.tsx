import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Rise } from '@/components/rise';
import { StoryReader } from '@/components/story-reader';
import { BottomTabInset, Palette, Spacing, Type } from '@/constants/theme';
import { kindLabel, type Story } from '@/content/stories';
import { independentSourceCount, isShippable } from '@/content/types';

// The first page of the feed: today's story, with a tap to read it in full. ADR 0005.
export function StoryCard({
  story,
  height,
  active,
  showHint,
}: {
  story: Story;
  height: number;
  active: boolean;
  showHint: boolean;
}) {
  const insets = useSafeAreaInsets();
  const [reading, setReading] = useState(false);
  const verified = isShippable(story);
  const sourceCount = verified ? independentSourceCount(story) : story.sources.length;

  return (
    <View
      style={[
        styles.page,
        {
          height,
          paddingTop: insets.top + Spacing.three,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.three,
        },
      ]}>
      <View style={styles.content}>
        <Rise active={active} order={0} style={styles.kicker}>
          <Text style={[styles.label, { color: Palette.blaze }]}>Story of the day · {kindLabel[story.kind]}</Text>
          <Text style={styles.label}>
            {story.when} · {story.where}
          </Text>
        </Rise>
        <Rise active={active} order={1}>
          <Text style={styles.headline} accessibilityRole="header">
            {story.title}
          </Text>
        </Rise>
        <Rise active={active} order={2}>
          <Text style={styles.body}>{story.dek}</Text>
        </Rise>
        <Rise active={active} order={3}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setReading(true)}
            style={({ pressed }) => [styles.read, pressed && styles.pressed]}>
            <Text style={styles.readText}>Read the story</Text>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              size={16}
              tintColor={Palette.ash}
            />
          </Pressable>
        </Rise>
        <View style={styles.trustRow}>
          <SymbolView
            name={
              verified
                ? { ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' }
                : { ios: 'pencil.and.outline', android: 'edit_note', web: 'edit_note' }
            }
            size={15}
            tintColor={verified ? Palette.sage : Palette.ash}
          />
          <Text style={styles.trustText}>
            {verified
              ? `Checked against ${sourceCount} independent sources`
              : `Draft · ${sourceCount} ${sourceCount === 1 ? 'source' : 'sources'}`}
          </Text>
        </View>
        {/* The story is a new user's first screen, so say that the feed continues below until they've
            swiped in. The row stays mounted and only goes transparent, so the story doesn't jump mid-swipe.
            Screen readers get their own wording, since VoiceOver scrolls with three fingers and TalkBack with two.
            Web reads the visible text, which says scroll down instead of swipe up. */}
        <View
          style={[styles.hint, !showHint && styles.hintGone]}
          accessible={Platform.OS !== 'web' && showHint}
          accessibilityLabel={Platform.select({
            ios: 'More skills below. Swipe up with three fingers to continue.',
            android: 'More skills below. Swipe up with two fingers to continue.',
          })}
          aria-hidden={!showHint}>
          <SymbolView
            name={{ ios: 'chevron.up', android: 'keyboard_arrow_up', web: 'keyboard_arrow_down' }}
            size={14}
            tintColor={Palette.stone}
          />
          <Text style={styles.hintText}>{Platform.OS === 'web' ? 'Scroll down for skills' : 'Swipe up for skills'}</Text>
        </View>
      </View>

      <StoryReader story={story} visible={reading} onClose={() => setReading(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: Palette.nightPine,
    backgroundImage: `radial-gradient(120% 60% at 50% 0%, ${Palette.canopyHigh} 0%, ${Palette.nightPine} 70%)`,
    paddingHorizontal: Spacing.four,
    justifyContent: 'flex-end',
  },
  kicker: {
    gap: Spacing.one,
  },
  content: {
    gap: Spacing.three,
  },
  label: {
    fontFamily: Type.bodyBold,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Palette.ash,
  },
  headline: {
    fontFamily: Type.display,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.5,
    color: Palette.bone,
  },
  body: {
    fontFamily: Type.body,
    fontSize: 18,
    lineHeight: 27,
    color: Palette.boneSoft,
  },
  read: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(242,236,225,0.16)',
    backgroundColor: 'rgba(242,236,225,0.06)',
  },
  readText: {
    fontFamily: Type.bodySemiBold,
    fontSize: 16,
    color: Palette.bone,
  },
  pressed: {
    opacity: 0.7,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 44,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  hintGone: {
    opacity: 0,
  },
  hintText: {
    fontFamily: Type.bodyMedium,
    fontSize: 13,
    color: Palette.stone,
  },
  trustText: {
    fontFamily: Type.bodyMedium,
    fontSize: 13,
    color: Palette.ash,
  },
});
