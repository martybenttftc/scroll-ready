// Gear that cards can point to with gearIds. See ADR 0004.
// A gear item makes claims too ("why"), so it follows the same sourcing rules as a card.

export type GearItem = {
  id: string; // kebab-case, referenced by Card.gearIds
  name: string; // a kind of gear ("Squeeze water filter"), or a product on gear cards only
  why: string; // 15 words or fewer: what it does for this card's skill
  url: string; // https. Opens in Safari or the store's own app, never inside ours
  // true when the link earns us a commission. Any affiliate link on screen shows the disclosure.
  affiliate: boolean;
};

// Shown under any affiliate link. FTC rules want it next to the link, and Amazon Associates
// requires its own sentence.
export const AFFILIATE_DISCLOSURE =
  'Some links earn us a commission, at no cost to you. As an Amazon Associate we earn from qualifying purchases.';

// Empty until Amazon Associates approves the app and products are picked from verified cards.
export const gear: GearItem[] = [];

export const gearById = new Map(gear.map((g) => [g.id, g]));
