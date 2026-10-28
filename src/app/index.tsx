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
          renderItem={({ item }) => <FeedCard card={item} height={height} active={item.id === activeId} />}
          extraData={activeId}
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
