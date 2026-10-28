import { useEvent } from 'expo';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useVideoPlayer, VideoView, type VideoPlayer } from 'expo-video';
import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { Palette, Spacing, Type } from '@/constants/theme';
import { AFFILIATE_DISCLOSURE, gearById } from '@/content/gear';
import type { Media } from '@/content/types';

// Below this, a picture is too small to teach anything, so the card shows text only.
const MIN_FRAME_HEIGHT = 120;
// The slot's margins and up to two credit lines.
const CHROME_HEIGHT = 2 * Spacing.three + Spacing.one + 2 * 15;

// A card's photo or video, with its credit. It fills whatever height the card's text leaves
// (a flex slot whose size doesn't depend on what's in it). It stays hidden when that space is too
// small or the file won't load (offline, or a dead link), so the card reads as plain text. ADR 0004.
export function CardMedia({ media, active }: { media: Media; active: boolean }) {
  // Once media has room, it stays, and shrinks if the text grows (sources opened, an answer
  // revealed). Hiding it again would drop a playing video back to the start.
  const [fits, setFits] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <View
      style={styles.slot}
      onLayout={(e) => {
        if (e.nativeEvent.layout.height >= MIN_FRAME_HEIGHT + CHROME_HEIGHT) setFits(true);
      }}>
      {fits && !failed && (
        <View style={styles.fill}>
          <View style={styles.frame}>
            {media.kind === 'photo' ? (
              <Image
                source={media.url}
                accessible
                accessibilityRole="image"
                accessibilityLabel={media.alt}
                contentFit="cover"
                transition={200}
                onError={() => setFailed(true)}
                style={StyleSheet.absoluteFill}
              />
            ) : active ? (
              // Mounted only on the card on screen, so off-screen clips don't buffer, and sound
              // and play choices reset when the person scrolls away.
              <CardVideo media={media} onError={() => setFailed(true)} />
            ) : (
              media.poster && (
                <Image source={media.poster} contentFit="cover" style={StyleSheet.absoluteFill} accessible={false} />
              )
            )}
          </View>
          <Pressable
            accessibilityRole="link"
            onPress={() => Linking.openURL(media.sourceUrl).catch(() => {})}
            hitSlop={{ top: 14, bottom: 14 }}>
            <Text style={styles.credit} numberOfLines={2}>
              {media.aiGenerated ? 'Illustration (AI-generated)' : media.kind === 'video' ? 'Video' : 'Photo'}:{' '}
              {media.credit}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// The player is a native object, not React state. Setting it here keeps the React Compiler
// from treating the hook's return value as frozen.
const setPlayerMuted = (player: VideoPlayer, muted: boolean) => {
  player.muted = muted;
};

function CardVideo({ media, onError }: { media: Media; onError: () => void }) {
  const reduceMotion = useReducedMotion();
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);
  const player = useVideoPlayer(media.url, (p) => {
    p.loop = true;
    p.muted = true;
  });

  const { status } = useEvent(player, 'statusChange', { status: player.status });
  useEffect(() => {
    if (status === 'error') onError();
  }, [status, onError]);

  // With reduce motion on, nothing moves until the person taps play.
  const playing = started || !reduceMotion;
  useEffect(() => {
    if (playing) player.play();
    else player.pause();
  }, [player, playing]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${media.alt}. ${!playing ? 'Play' : muted ? 'Turn sound on' : 'Turn sound off'}`}
      onPress={() => {
        if (!playing) return setStarted(true);
        setPlayerMuted(player, !muted);
        setMuted(!muted);
      }}
      style={StyleSheet.absoluteFill}>
      {media.poster && !playing && (
        <Image source={media.poster} contentFit="cover" style={StyleSheet.absoluteFill} accessible={false} />
      )}
      <VideoView
        player={player}
        nativeControls={false}
        contentFit="cover"
        style={[StyleSheet.absoluteFill, !playing && media.poster ? styles.hidden : undefined]}
        pointerEvents="none"
      />
      <View style={styles.badge} pointerEvents="none">
        <SymbolView
          name={
            !playing
              ? { ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }
              : muted
                ? { ios: 'speaker.slash.fill', android: 'volume_off', web: 'volume_off' }
                : { ios: 'speaker.wave.2.fill', android: 'volume_up', web: 'volume_up' }
          }
          size={16}
          tintColor={Palette.bone}
        />
      </View>
    </Pressable>
  );
}

// Gear for this card. Links leave the app for the store (Amazon doesn't allow its pages inside apps).
export function GearLinks({ gearIds }: { gearIds: string[] }) {
  const items = gearIds.flatMap((id) => gearById.get(id) ?? []);
  if (items.length === 0) return null;
  return (
    <View style={styles.gear}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="link"
          accessibilityHint="Opens the store outside the app"
          onPress={() => Linking.openURL(item.url).catch(() => {})}
          style={({ pressed }) => [styles.gearRow, pressed && styles.pressed]}>
          <SymbolView name={{ ios: 'bag', android: 'shopping_bag', web: 'shopping_bag' }} size={16} tintColor={Palette.bone} />
          <View style={styles.gearText}>
            <Text style={styles.gearName}>{item.name}</Text>
            <Text style={styles.gearWhy}>{item.why}</Text>
          </View>
          <SymbolView
            name={{ ios: 'arrow.up.right', android: 'open_in_new', web: 'open_in_new' }}
            size={13}
            tintColor={Palette.ash}
          />
        </Pressable>
      ))}
      {items.some((i) => i.affiliate) && <Text style={styles.disclosure}>{AFFILIATE_DISCLOSURE}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
    minHeight: 0,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
    maxHeight: 420,
    gap: Spacing.one,
    marginVertical: Spacing.three,
  },
  frame: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(242,236,225,0.06)',
  },
  hidden: {
    opacity: 0,
  },
  badge: {
    position: 'absolute',
    right: Spacing.two,
    bottom: Spacing.two,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  credit: {
    fontFamily: Type.body,
    fontSize: 11,
    lineHeight: 15,
    color: Palette.ash,
  },
  disclosure: {
    fontFamily: Type.body,
    fontSize: 13,
    lineHeight: 18,
    color: Palette.boneSoft,
  },
  gear: {
    gap: Spacing.two,
  },
  gearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: Spacing.two,
    borderRadius: 14,
    backgroundColor: 'rgba(242,236,225,0.06)',
  },
  gearText: {
    flex: 1,
  },
  gearName: {
    fontFamily: Type.bodySemiBold,
    fontSize: 15,
    color: Palette.bone,
  },
  gearWhy: {
    fontFamily: Type.body,
    fontSize: 13,
    color: Palette.ash,
  },
  pressed: {
    opacity: 0.7,
  },
});
