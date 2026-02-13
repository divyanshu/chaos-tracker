# Visual Design: Consumer Apps (B2C)

Consumer apps prioritize emotional connection, delight, and first-impression impact. Users choose your app over alternatives partly based on how it *feels*.

## Key Characteristics

- **Emotional design** is paramount — personality, warmth, brand expression
- **Mobile-first** — design for touch, then scale up
- **Onboarding matters** — first-time users are common; guide them visually
- **Accessibility affects everyone** — diverse user base with varying abilities
- **Color psychology is amplified** — users make emotional judgments in <50ms

## Color Guidelines

Color carries more emotional weight in consumer apps than any other type:

| Category | Palette Approach | Examples |
|----------|-----------------|----------|
| Food & Beverage | Warm reds, oranges, yellows — appetite stimulants | DoorDash, Yelp |
| Health & Wellness | Greens, soft blues, earth tones — calm, natural | Calm, Headspace |
| Finance (consumer) | Blues and greens — trust, growth | Robinhood, Cash App |
| Social / Communication | Vibrant, saturated primaries — energy, connection | Instagram, Snapchat |
| Travel | Sky blues, warm neutrals, photography-forward | Airbnb, Google Travel |
| Entertainment | Bold, saturated, dark backgrounds — immersion | Spotify, Netflix |
| Kids / Family | Pastels, bright primaries, playful contrast | Duolingo |

**Accent color strategy:** Pick one memorable accent color. Make it ownable. Spotify's green, Slack's aubergine, Notion's off-black — the accent becomes the brand.

## Typography

- Use expressive, characterful fonts — not just system defaults
- Larger body text (17-20px) for comfortable mobile reading
- Allow generous line spacing (1.5-1.7×) for thumb-scrollable content
- Headlines can be dramatic: use display fonts, variable weights, or mixed sizes
- Consider font personality: rounded = friendly, geometric = modern, serif = premium

**Recommended body sizes:**
- Mobile: 16-17px minimum
- Tablet: 17-18px
- Desktop: 18-20px

## Layout

- **Generous whitespace** — consumer apps should feel spacious, not cramped
- **Large touch targets** — minimum 44×44px (iOS) / 48×48dp (Android)
- **Thumb-zone design** — primary actions in bottom third of mobile screen
- **Full-bleed imagery** — images should be bold, large, and atmospheric
- **Card-based layouts** — natural for scrollable content feeds
- **Bottom navigation** — standard for mobile; max 5 items

## Motion & Delight

Consumer apps benefit most from thoughtful motion:

- **Onboarding animations** — guide users through first-time flows
- **Pull-to-refresh** — custom animations reinforce brand personality
- **Celebration moments** — confetti, success animations, streak celebrations
- **Skeleton screens** — animated loading states reduce perceived wait time
- **Haptic feedback** — pair with visual feedback for tactile confirmation

**Keep it purposeful:** Every animation should either provide feedback, guide attention, or reinforce a brand moment. Delete animations that are purely decorative.

## Consumer App Tokens (Starting Point)

```css
/* Consumer App — Warm, Inviting Style */
--color-primary-500: #FF6B35;      /* Energetic orange */
--color-primary-50: #FFF4ED;
--color-primary-900: #7A2E0E;
--color-neutral-0: #FFFFFF;
--color-neutral-50: #FAFAF8;       /* Warm white */
--color-neutral-100: #F5F3F0;
--color-neutral-200: #E8E4DF;
--color-neutral-400: #A09A93;
--color-neutral-600: #6B645C;
--color-neutral-900: #1F1C18;      /* Warm near-black */

--font-family-display: 'Plus Jakarta Sans', sans-serif;
--font-family-body: 'Plus Jakarta Sans', sans-serif;
--font-size-base: 17px;
--line-height-normal: 1.6;

--radius-md: 12px;                 /* Rounded, friendly */
--radius-lg: 16px;
--radius-xl: 24px;

--shadow-md: 0 4px 12px rgba(31, 28, 24, 0.08);
```
