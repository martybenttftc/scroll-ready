import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, FlatList, StyleSheet, View, type ListViewToken } from 'react-native';

import { FeedCard } from '@/components/feed-card';
import { StoryCard } from '@/components/story-card';
import { localDayNumber, storyForDay, type Story } from '@/content/stories';
import type { Card } from '@/content/types';
import { feed, stories } from '@/content/catalog';
import { useTheme } from '@/hooks/use-theme';

// A feed page is a card, or today's story on top (ADR 0005).
type Page = { kind: 'story'; id: string; story: Story } | { kind: 'card'; id: string; card: Card };

// The home feed: one full-screen card per page, swiped vertically.
export default function FeedScreen() {
  const theme = useTheme();
  const [height, setHeight] = useState(0);
  // The story is re-picked only when the app comes back to the foreground on a new day,
  // so it never swaps out mid-scroll at midnight but doesn't go stale in the background.
  const [day, setDay] = useState(() => localDayNumber(new Date()));
  const pages = useMemo<Page[]>(() => {
    const story = storyForDay(stories, day);
    const cardPages = feed.map((card): Page => ({ kind: 'card', id: card.id, card }));
    // One fixed id, so the page stays active when a new day's story replaces it.
    return story ? [{ kind: 'story', id: 'story-of-the-day', story }, ...cardPages] : cardPages;
  }, [day]);
  const [activeId, setActiveId] = useState(pages[0]?.id);
  // The story's swipe hint goes away once someone has swiped into the feed. Session only
  // until saves land on the device (the "Saves that last" backlog item), which should remember it too.
  const [swipedIn, setSwipedIn] = useState(false);
  useEffect(() => {
    // Only after a real trip to the background: iOS also goes inactive and back for
    // Control Center, Face ID, and call banners, and that shouldn't swap the story.
    let last = AppState.currentState;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && last === 'background') setDay(localDayNumber(new Date()));
      last = state;
    });
    return () => sub.remove();
  }, []);
  // Saves, quiz answers, and reveals live above the list so they survive FlatList
  // unmounting off-screen rows. Not persisted yet: the "Saves that last" backlog item stores them on the device.
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
    if (!first) return;
    setActiveId(first.id);
    if (first.kind === 'card') setSwipedIn(true);
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
              // Keyed by story, so a new day's story mounts fresh: any open reader closes and the entrance replays.
              <StoryCard
                key={item.story.id}
                story={item.story}
                height={height}
                active={item.id === activeId}
                showHint={!swipedIn}
              />
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
          extraData={[activeId, savedIds, answers, revealedIds, swipedIn]}
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
