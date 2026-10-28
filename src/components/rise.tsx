import { useEffect, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Motion } from '@/constants/theme';

// Off-screen cards rest slightly dimmed and lowered, so you can still read
// them mid-swipe. When a card snaps into view its lines rise into place one
// after another. With Reduce Motion on, nothing moves.
const RESTING_OPACITY = 0.4;

export function Rise({
  active,
  order = 0,
  style,
  children,
}: {
  active: boolean;
  order?: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      progress.set(1);
    } else if (active) {
      progress.set(withDelay(order * Motion.stagger, withTiming(1, { duration: Motion.rise })));
    } else {
      progress.set(0);
    }
  }, [active, order, reduceMotion, progress]);

  const animated = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      opacity: RESTING_OPACITY + (1 - RESTING_OPACITY) * p,
      transform: [{ translateY: (1 - p) * Motion.riseDistance }],
    };
  });

  return <Animated.View style={[style, animated]}>{children}</Animated.View>;
}
