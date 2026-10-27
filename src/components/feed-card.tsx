import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Card } from '@/content/types';
import { tracks } from '@/content/seed';
import { useTheme } from '@/hooks/use-theme';

const typeLabel: Record<Card['type'], string> = {
  tip: 'Tip',
  step: 'Step',
  myth: 'Myth or fact',
  quiz: 'Quick quiz',
  scenario: 'Scenario',
  gear: 'Gear pick',
  checklist: 'Checklist',
};

export function FeedCard({ card, height }: { card: Card; height: number }) {
  const theme = useTheme();
  const [picked, setPicked] = useState<number | null>(null);
  const trackTitle = tracks.find((t) => t.id === card.track)?.title ?? card.track;

  return (
    <View style={[styles.page, { height, backgroundColor: theme.background }]}>
      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.eyebrow}>
        {trackTitle} · {typeLabel[card.type]}
        {card.stepOrder ? ` · Step ${card.stepOrder}` : ''}
      </ThemedText>

      <ThemedText type="subtitle">{card.headline}</ThemedText>
      <ThemedText>{card.body}</ThemedText>

      {card.quiz && (
        <View style={styles.choices}>
          {card.quiz.choices.map((choice, i) => {
            const answered = picked !== null;
            const correct = i === card.quiz!.answerIndex;
            return (
              <Pressable
                key={choice}
                accessibilityRole="button"
                disabled={answered}
                onPress={() => setPicked(i)}
                style={[
                  styles.choice,
                  { backgroundColor: theme.backgroundElement },
                  answered && correct && { backgroundColor: theme.backgroundSelected },
                ]}>
                <ThemedText>
                  {choice}
                  {answered && correct ? '  ✓' : ''}
                  {answered && picked === i && !correct ? '  ✗' : ''}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      )}

      <ThemedText type="small" themeColor="textSecondary" style={styles.source}>
        Source: {card.sources.map((s) => s.title).join('; ')}
        {card.reviewedBy ? `\nReviewed by ${card.reviewedBy}` : ''}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  choices: {
    gap: Spacing.two,
  },
  choice: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  source: {
    marginTop: Spacing.four,
  },
});
