import { feedOrder, loadCatalog, type ContentFile } from './load';
import { loadStories } from './stories';

export { EXPERT_TRACKS, themes, tracks } from './taxonomy';

// Metro bundles every content/<track>/<skill>.json file. A new file shows up with no
// import to add, so content batches never conflict over an index file. ADR 0003.
const context = require.context('../../content', true, /\.json$/);
const files: ContentFile[] = context.keys().map((path) => ({ path, data: context<unknown>(path) }));

const catalog = loadCatalog(files);
if (__DEV__) for (const p of catalog.problems) console.warn(`content: ${p}`);

export const skills = catalog.skills;
export const cards = catalog.cards;
export const feed = feedOrder(catalog.cards);

// Story of the day, one file per story in stories/<id>.json. ADR 0005.
const storyContext = require.context('../../stories', false, /\.json$/);
const storyFiles = storyContext.keys().map((path) => ({ path, data: storyContext<unknown>(path) }));
const storyCatalog = loadStories(storyFiles);
if (__DEV__) for (const p of storyCatalog.problems) console.warn(`stories: ${p}`);

export const stories = storyCatalog.stories;
