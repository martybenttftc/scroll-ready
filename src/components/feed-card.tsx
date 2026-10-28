import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Linking,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
  type HostInstance,
} from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Rise } from '@/components/rise';
import { BottomTabInset, Motion, Palette, Spacing, Type } from '@/constants/theme';
import type { Card } from '@/content/types';
import { independentSourceCount, isShippable } from '@/content/types';
import { skills, tracks } from '@/content/catalog';

const typeLabel: Record<Card['type'], string> = {
  tip: 'Tip',
  step: 'Step',
  myth: 'Myth or fact',
  quiz: 'Quick quiz',
  scenario: 'Scenario',
  gear: 'Gear pick',
  checklist: 'Checklist',
};

// Card types that hold back the answer until a tap, so people think first.
const revealPrompt: Partial<Record<Card['type'], string>> = {
  myth: 'Why? Think, then tap to see',
  scenario: 'What would you do? Tap to see',
};

// Called only from tap handlers, so scrolling back to an answered card stays quiet.
// Web isn't a release target, so it has no announcement.
const announce = (text: string) => {
  // queue: true (iOS only) waits for VoiceOver to finish reading the tapped choice's
  // new label. Android ignores it, so check TalkBack before the Android release.
  if (Platform.OS !== 'web') AccessibilityInfo.announceForAccessibilityWithOptions(text, { queue: true });
};

export function FeedCard({
  card,
  height,
  active,
  saved,
  onToggleSave,
  picked,
  onPick,
  revealed,
  onReveal,
}: {
  card: Card;
  height: number;
  active: boolean;
  saved: boolean;
  onToggleSave: (id: string) => void;
  picked: number | null;
  onPick: (id: string, choice: number) => void;
  revealed: boolean;
  onReveal: (id: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const [showSources, setShowSources] = useState(false);

  // The reveal button unmounts on tap, so move screen reader focus to the body it
  // revealed. Only after a tap, never when an already-revealed row remounts. Wait
  // until the fade-in ends (no wait with Reduce Motion): VoiceOver can drop focus
  // sent to a view that is still at opacity 0.
  const bodyRef = useRef<HostInstance>(null);
  const [focusBody, setFocusBody] = useState(false);
  useEffect(() => {
    if (!focusBody || !revealed) return;
    const timer = setTimeout(() => {
      setFocusBody(false);
      if (Platform.OS !== 'web' && bodyRef.current) AccessibilityInfo.sendAccessibilityEvent(bodyRef.current, 'focus');
    }, reduceMotion ? 0 : Motion.reveal + 50);
    return () => clearTimeout(timer);
  }, [focusBody, revealed, reduceMotion]);

  const trackTitle = tracks.find((t) => t.id === card.track)?.title ?? card.track;
  const skill = skills.find((s) => s.id === card.skill);
  const step = skill ? skill.cardIds.indexOf(card.id) + 1 : 0;
  // A quiz is its own reveal. Expert-tier cards show their guidance right away,
  // so nobody scrolls past a safety card without seeing what to do (docs/DESIGN.md).
  // Standard myth cards are a Myth or Fact guess. Caution and expert headlines state the safe
  // answer, so they never become a guessing game (docs/DESIGN.md, Card.verdict).
  const mythGuess =
    card.type === 'myth' && !card.quiz && card.verdict !== undefined && card.riskTier === 'standard';
  const quiz =
    card.quiz ??
    (mythGuess ? { choices: ['Myth', 'Fact'], answerIndex: card.verdict === 'myth' ? 0 : 1 } : undefined);
  // Caution and expert myths state the safe answer, so don't call them "Myth or fact".
  // Step cards already announce their position in the progress segments.
  const cardTypeLabel =
    (card.type === 'myth' && !mythGuess) || card.type === 'step' ? undefined : typeLabel[card.type];
  const prompt = quiz || card.riskTier === 'expert' ? undefined : revealPrompt[card.type];
  const answer = quiz ? (mythGuess ? `a ${card.verdict}` : quiz.choices[quiz.answerIndex]) : '';
  const bodyHidden = (quiz && picked === null) || (prompt !== undefined && !revealed);
  // Fade answers in only when they happen here, not when an answered row remounts.
  const [tappedHere, setTappedHere] = useState(false);
  const enter = reduceMotion || !tappedHere ? undefined : FadeIn.duration(Motion.reveal);
  const verified = isShippable(card);
  const sourceCount = verified ? independentSourceCount(card) : card.sources.length;

  // Only verified cards leave the app, and they carry their sources (and the 911
  // line for first aid) with them. ADR 0002.
  const share = () => {
    const lines = [card.headline, card.body];
    if (card.track === 'first-aid') lines.push('In an emergency, call 911.');
    const titles = card.sources.map((s) => s.title).join('; ');
    lines.push(`Checked against ${sourceCount} independent sources: ${titles}`);
    lines.push('From Scroll Ready');
    Share.share({ message: lines.join('\n\n') }).catch(() => {});
  };

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
      <View style={styles.top}>
        {skill && step > 0 && skill.cardIds.length > 1 && (
          <View
            style={styles.segments}
            accessible
            accessibilityLabel={`Step ${step} of ${skill.cardIds.length}`}>
            {skill.cardIds.map((id, i) => (
              <View
                key={id}
                style={[styles.segment, { backgroundColor: i < step ? Palette.bone : 'rgba(242,236,225,0.22)' }]}
              />
            ))}
          </View>
        )}
        {/* The card type stays off screen, where the buttons already show it, but screen readers hear it. */}
        <Text
          style={styles.trackLabel}
          numberOfLines={1}
          accessibilityLabel={[trackTitle, skill?.title, cardTypeLabel].filter(Boolean).join(', ')}>
          {[trackTitle, skill?.title].filter(Boolean).join(' · ')}
        </Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.row}>
          <View style={styles.content}>
            <Rise active={active} order={0}>
              <Text style={styles.headline} accessibilityRole="header">
                {card.headline}
              </Text>
            </Rise>

            {quiz && (
              <Rise active={active} order={1} style={styles.choices}>
                {quiz.choices.map((choice, i) => {
                  const answered = picked !== null;
                  const correct = i === quiz.answerIndex;
                  const mark = answered && correct ? 'Right answer' : answered && picked === i ? 'Your pick' : '';
                  return (
                    <Pressable
                      key={i}
                      accessibilityRole="button"
                      accessibilityState={{ disabled: answered, selected: picked === i }}
                      accessibilityLabel={mark ? `${choice}, ${mark}` : choice}
                      accessibilityHint={mythGuess && !answered ? 'Guess whether the headline is a myth or a fact' : undefined}
                      disabled={answered}
                      onPress={() => {
                        onPick(card.id, i);
                        setTappedHere(true);
                        const verdict = correct ? 'You got it.' : `It's ${answer}.`;
                        announce(`${verdict} ${card.body}`);
                      }}
                      style={({ pressed }) => [
                        styles.choice,
                        answered && correct && styles.choiceCorrect,
                        answered && !correct && picked === i && styles.choiceMissed,
                        pressed && styles.pressed,
                      ]}>
                      <Text
                        style={[styles.choiceText, answered && !correct && { color: Palette.stone }]}>
                        {choice}
                      </Text>
                      {mark !== '' && (
                        <Text style={[styles.choiceMark, { color: correct ? Palette.sage : Palette.stone }]}>
                          {mark}
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </Rise>
            )}

            {prompt && !revealed && (
              <Rise active={active} order={1}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    onReveal(card.id);
                    setFocusBody(true);
                    setTappedHere(true);
                  }}
                  style={({ pressed }) => [styles.reveal, pressed && styles.pressed]}>
                  <Text style={styles.revealText}>{prompt}</Text>
                </Pressable>
              </Rise>
            )}

            {bodyHidden ? null : quiz ? (
              <Animated.View entering={enter} style={styles.verdictBox}>
                <Text
                  style={[
                    styles.label,
                    { color: picked === quiz.answerIndex ? Palette.sage : Palette.blaze },
                  ]}>
                  {picked === quiz.answerIndex ? 'You got it' : `It's ${answer}`}
                </Text>
                <Text style={styles.body}>{card.body}</Text>
              </Animated.View>
            ) : prompt ? (
              <Animated.View entering={enter}>
                <Text ref={bodyRef} style={styles.body}>
                  {card.body}
                </Text>
              </Animated.View>
            ) : (
              <Rise active={active} order={1}>
                <Text style={styles.body}>{card.body}</Text>
              </Rise>
            )}

            {card.track === 'first-aid' && (
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="In an emergency, call 911"
                onPress={() => Linking.openURL('tel:911').catch(() => {})}
                style={({ pressed }) => [styles.emergency, pressed && styles.pressed]}>
                <SymbolView name={{ ios: 'phone', android: 'call', web: 'call' }} size={17} tintColor={Palette.blaze} />
                <Text style={styles.emergencyText}>Emergency? Call 911 first.</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.rail}>
            <RailButton
              label={saved ? 'Saved' : 'Save'}
              selected={saved}
              icon={
                saved
                  ? { ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' }
                  : { ios: 'bookmark', android: 'bookmark_border', web: 'bookmark_border' }
              }
              onPress={() => onToggleSave(card.id)}
            />
            {verified && (
              <RailButton
                label="Share"
                icon={{ ios: 'square.and.arrow.up', android: 'share', web: 'share' }}
                onPress={share}
              />
            )}
          </View>
        </View>

        <View style={styles.trust}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: showSources }}
            onPress={() => setShowSources((s) => !s)}
            style={styles.trustRow}>
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
          </Pressable>
          {showSources &&
            card.sources.map(({ title, url }, i) =>
              url ? (
                <Text
                  key={`${i}-${title}`}
                  accessibilityRole="link"
                  onPress={() => Linking.openURL(url).catch(() => {})}
                  style={[styles.sourceList, styles.sourceLink]}>
                  {title}
                </Text>
              ) : (
                <Text key={`${i}-${title}`} style={styles.sourceList}>
                  {title}
                </Text>
              ),
            )}
        </View>
      </View>
    </View>
  );
}

function RailButton({
  label,
  icon,
  selected = false,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof SymbolView>['name'];
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.railButton, pressed && styles.pressed]}>
      <SymbolView name={icon} size={22} tintColor={selected ? Palette.blaze : Palette.bone} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: Palette.nightPine,
    // One soft, neutral light from the top so the page isn't flat. No per-track color.
    backgroundImage: `radial-gradient(120% 60% at 50% 0%, ${Palette.canopyHigh} 0%, ${Palette.nightPine} 70%)`,
    paddingHorizontal: Spacing.four,
    justifyContent: 'space-between',
  },
  top: {
    gap: Spacing.three,
  },
  segments: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  segment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  trackLabel: {
    fontFamily: Type.bodySemiBold,
    fontSize: 13,
    color: Palette.ash,
  },
  bottom: {
    gap: Spacing.four,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.three,
  },
  content: {
    flex: 1,
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
  choices: {
    gap: Spacing.two,
  },
  choice: {
    minHeight: 56,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(242,236,225,0.16)',
    backgroundColor: 'rgba(242,236,225,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  choiceCorrect: {
    borderColor: Palette.sage,
    backgroundColor: 'rgba(92,201,168,0.16)',
  },
  choiceMissed: {
    borderStyle: 'dashed',
    borderColor: Palette.stone,
    backgroundColor: 'transparent',
  },
  choiceText: {
    fontFamily: Type.bodySemiBold,
    fontSize: 17,
    color: Palette.bone,
    flexShrink: 1,
  },
  choiceMark: {
    fontFamily: Type.bodyBold,
    fontSize: 13,
  },
  verdictBox: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: 16,
    backgroundColor: 'rgba(242,236,225,0.06)',
  },
  reveal: {
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(242,236,225,0.16)',
    backgroundColor: 'rgba(242,236,225,0.06)',
  },
  revealText: {
    fontFamily: Type.bodySemiBold,
    fontSize: 16,
    color: Palette.bone,
  },
  emergency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(240,123,118,0.12)',
  },
  emergencyText: {
    fontFamily: Type.bodySemiBold,
    fontSize: 15,
    color: Palette.bone,
  },
  rail: {
    gap: 18,
    paddingBottom: Spacing.one,
  },
  railButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(242,236,225,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  trust: {
    gap: Spacing.two,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 44,
  },
  trustText: {
    fontFamily: Type.bodyMedium,
    fontSize: 13,
    color: Palette.ash,
  },
  sourceLink: {
    textDecorationLine: 'underline',
  },
  sourceList: {
    fontFamily: Type.body,
    fontSize: 13,
    lineHeight: 19,
    color: Palette.ash,
  },
});
