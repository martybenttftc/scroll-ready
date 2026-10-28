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
  // Lives above the list so a save survives FlatList unmounting off-screen rows.
  // Not persisted yet: backlog item 8 stores saves on the device.
  const [savedIds, setSavedIds] = useState<ReadonlySet<string>>(new Set());
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
            />
          )}
          extraData={[activeId, savedIds]}
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
