import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaxContentWidth, Palette, Spacing, Type } from '@/constants/theme';
import { tracks } from '@/content/catalog';
import { kindLabel, type Story } from '@/content/stories';

// The full story: plain text on the dark ground, the takeaway, then every source.
export function StoryReader({ story, visible, onClose }: { story: Story; visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const track = tracks.find((t) => t.id === story.track);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.sheet}>
        <View style={styles.bar}>
          <Text style={styles.label}>{kindLabel[story.kind]} story</Text>
          <Pressable accessibilityRole="button" onPress={onClose} hitSlop={8} style={styles.close}>
            <Text style={styles.closeText}>Done</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}>
          <Text style={styles.label}>
            {story.when} · {story.where}
          </Text>
          <Text style={styles.headline} accessibilityRole="header">
            {story.title}
          </Text>
          {story.paragraphs.map((p, i) => (
            <Text key={i} style={styles.body}>
              {p}
            </Text>
          ))}

          <View style={styles.takeaway}>
            <Text style={styles.label}>{track ? `The lesson · ${track.title}` : 'The lesson'}</Text>
            <Text style={styles.body}>{story.takeaway}</Text>
          </View>

          <View style={styles.sources}>
            <Text style={styles.label}>Sources</Text>
            {story.sources.map(({ title, url }, i) =>
              url ? (
                <Text
                  key={`${i}-${title}`}
                  accessibilityRole="link"
                  onPress={() => Linking.openURL(url).catch(() => {})}
                  style={[styles.source, styles.sourceLink]}>
                  {title}
                </Text>
              ) : (
                <Text key={`${i}-${title}`} style={styles.source}>
                  {title}
                </Text>
              ),
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: Palette.nightPine,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  close: {
    minHeight: 44,
    justifyContent: 'center',
  },
  closeText: {
    fontFamily: Type.bodySemiBold,
    fontSize: 16,
    color: Palette.blaze,
  },
  content: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
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
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: Palette.bone,
  },
  body: {
    fontFamily: Type.body,
    fontSize: 18,
    lineHeight: 28,
    color: Palette.boneSoft,
  },
  takeaway: {
    gap: Spacing.two,
    marginTop: Spacing.two,
    padding: Spacing.three,
    borderRadius: 16,
    backgroundColor: 'rgba(242,236,225,0.06)',
  },
  sources: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  source: {
    fontFamily: Type.body,
    fontSize: 14,
    lineHeight: 20,
    color: Palette.ash,
  },
  sourceLink: {
    textDecorationLine: 'underline',
  },
});
