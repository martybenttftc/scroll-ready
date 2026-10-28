import { useRef, useState } from 'react';
import { FlatList, StyleSheet, View, type ListViewToken } from 'react-native';

import { FeedCard } from '@/components/feed-card';
import { StoryCard } from '@/components/story-card';
import { storyForDate, type Story } from '@/content/stories';
import type { Card } from '@/content/types';
import { feed, stories } from '@/content/catalog';
import { useTheme } from '@/hooks/use-theme';

// A feed page is a card, or today's story on top (ADR 0005).
type Page = { kind: 'story'; id: string; story: Story } | { kind: 'card'; id: string; card: Card };

// The home feed: one full-screen card per page, swiped vertically.
export default function FeedScreen() {
  const theme = useTheme();
  const [height, setHeight] = useState(0);
  // Picked once per launch, so the story doesn't swap out mid-scroll at midnight.
  const [pages] = useState<Page[]>(() => {
    const story = storyForDate(stories, new Date());
    const cardPages = feed.map((card): Page => ({ kind: 'card', id: card.id, card }));
    return story ? [{ kind: 'story', id: `story:${story.id}`, story }, ...cardPages] : cardPages;
  });
  const [activeId, setActiveId] = useState(pages[0]?.id);
  // Per-card state lives above the list so it survives FlatList unmounting
  // off-screen rows. Not persisted yet: backlog item 8 stores it on the device.
  const [savedIds, setSavedIds] = useState<ReadonlySet<string>>(new Set());
  const [answers, setAnswers] = useState<Readonly<Record<string, number>>>({});
  const [revealedIds, setRevealedIds] = useState<ReadonlySet<string>>(new Set());
  const pick = (id: string, choice: number) => setAnswers((prev) => ({ ...prev, [id]: choice }));
  const reveal = (id: string) => setRevealedIds((prev) => new Set(prev).add(id));
  const toggleSave = (id: string) =>
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // FlatList requires these two to keep the same identity across renders.
  const viewability = useRef({ itemVisiblePercentThreshold: 60 }).current;
  const onViewable = useRef(({ viewableItems }: { viewableItems: ListViewToken[] }) => {
    const first: Page | undefined = viewableItems[0]?.item;
    if (first) setActiveId(first.id);
  }).current;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background }]}
      onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
      {height > 0 && (
        <FlatList
          data={pages}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) =>
            item.kind === 'story' ? (
              <StoryCard story={item.story} height={height} active={item.id === activeId} />
            ) : (
              <FeedCard
                card={item.card}
                height={height}
                active={item.id === activeId}
                saved={savedIds.has(item.id)}
                onToggleSave={toggleSave}
                picked={answers[item.id] ?? null}
                onPick={pick}
                revealed={revealedIds.has(item.id)}
                onReveal={reveal}
              />
            )
          }
          extraData={[activeId, savedIds, answers, revealedIds]}
          viewabilityConfig={viewability}
          onViewableItemsChanged={onViewable}
          // pagingEnabled pages by the exact view height. disableIntervalMomentum
          // stops a hard fling on Android from skipping past the next card.
          pagingEnabled
          disableIntervalMomentum
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
          windowSize={5}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
