import { reveal, revealMarkdown, revealHighlight, revealMath, revealSearch, revealNotes, revealZoom } from "/Users/huy/Coder/Blog/node_modules/.pnpm/vuepress-plugin-md-enhance@2.0.0-beta.171_e7jwb2ulu5orbkux7obq5onfau/node_modules/vuepress-plugin-md-enhance/lib/client/reveal/index.js";

export const useReveal = () => [reveal(), revealMarkdown(), revealHighlight(), revealMath(), revealSearch(), revealNotes(), revealZoom()];
