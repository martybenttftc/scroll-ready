/**
 * The app runs a single dark scheme for now (docs/DESIGN.md), so this ignores
 * the system setting. Switch back to useColorScheme when light mode returns.
 */

import { AppScheme, Colors } from '@/constants/theme';

export function useTheme() {
  return Colors[AppScheme];
}
