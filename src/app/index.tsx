import { useRef, useState } from 'react';
import { FlatList, StyleSheet, View, type ListViewToken } from 'react-native';

import { FeedCard } from '@/components/feed-card';
import type { Card } from '@/content/types';
import { feed } from '@/content/catalog';
import { useTheme } from '@/hooks/use-theme';

// The home feed: one full-screen card per page, swiped vertically.
export default function FeedScreen() {
  const theme = useTheme();
  const [height, setHeight] = useState(0);
  const [activeId, setActiveId] = useState(feed[0]?.id);
  // Saves, quiz answers, and reveals live above the list so they survive FlatList
  // unmounting off-screen rows. Not persisted yet: backlog item 8 stores them on the device.
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
    const first: Card | undefined = viewableItems[0]?.item;
    if (first) setActiveId(first.id);
  }).current;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background }]}
      onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
      {height > 0 && (
        <FlatList
          data={feed}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <FeedCard
              card={item}
              height={height}
              active={item.id === activeId}
              saved={savedIds.has(item.id)}
              onToggleSave={toggleSave}
              picked={answers[item.id] ?? null}
              onPick={pick}
              revealed={revealedIds.has(item.id)}
              onReveal={reveal}
            />
          )}
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
