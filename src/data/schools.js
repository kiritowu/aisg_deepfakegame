// Phase Two content. Each audience segment has its own challenge image and hotspots.
// Hotspot geometry is percentages of the image; title/reason drive the review panel.
// The export/prop name stays `SCHOOLS` so App.jsx / PhaseTwo.jsx need no changes.
//
// Age-group segments, each with its own AI-altered challenge image + hotspots.
// Order below = display order in the picker (youngest first):
//   youth   → reuses the existing engineering lab scene  (/engineering.png)
//   adults  → fake YouTube "passive income" investment ad with a deepfaked guru  (/adults.png)
//   seniors → fake "official" endorsing a crypto/investment platform  (/seniors.png)
export const SCHOOLS = [
  {
    id: 'youth',
    name: 'Youth',
    icon: '🧑',
    image: '/engineering.png',
    hotspots: [
      { id: 't1', left: 70.7, top: 45.7, w: 8.7, h: 23.9, title: 'Poster', reason: 'The text appears blurry and not fully readable, which is a common issue in AI-generated images.' },
      { id: 't2', left: 52.5, top: 86.6, w: 7.9, h: 7.4, title: 'Equipment Label', reason: 'The label looks unclear and distorted, suggesting it may not be real or properly rendered.' },
      { id: 't3', left: 44.0, top: 52.2, w: 7.8, h: 8.3, title: 'Skin Tone', reason: "The hand's skin tone looks inconsistent with the rest of the person's body, suggesting possible AI generation or editing." },
      { id: 't4', left: 50.6, top: 28.1, w: 4.0, h: 15.9, title: 'Upper Structure', reason: 'The component appears to be floating without proper support, which is physically unrealistic in the real world.' },
      { id: 't5', left: 53.9, top: 21.9, w: 3.7, h: 12.7, title: 'Upper Structure', reason: 'The component appears to be floating without proper support, which is physically unrealistic in the real world.' },
      { id: 't6', left: 47.0, top: 30.0, w: 3.9, h: 10.2, title: "Person's Face", reason: 'The facial features look slightly blended with the background, suggesting possible AI face generation.' },
    ],
  },
  {
    id: 'adults',
    name: 'Adult',
    icon: '💼',
    image: '/adults.png',
    hotspots: [
      { id: 't1', left: 54, top: 50, w: 11, h: 14, title: 'Thumbs-up hand', reason: 'Count the fingers on the thumbs-up hand — there are too many. Malformed or extra fingers are one of the most reliable signs of an AI-generated image.' },
      { id: 't2', left: 40, top: 32, w: 13, h: 20, title: 'Waxy face', reason: "The presenter's face is waxy and over-smoothed, and the ear blends into the hair/background — typical of an AI-generated or face-swapped person." },
      { id: 't3', left: 19, top: 61, w: 25, h: 9, title: 'Impossible promise + typo', reason: "The headline reads 'GUARANTED PASSIVE INCOME' — 'guaranteed' is misspelled, and no real investment can 'guarantee' weekly income. That's a scam hook." },
      { id: 't4', left: 12, top: 89, w: 17, h: 5, title: 'Fake verified channel', reason: "The channel name 'SG Wealth Acadamy' is misspelled and carries a fake blue verified tick. Scam pages fake the checkmark and get the spelling subtly wrong." },
      { id: 't5', left: 12, top: 23, w: 17, h: 13, title: 'Fake bank logo', reason: "'DSB — Digital Assets Bank' is a distorted logo mimicking a real bank (DBS). AI garbles logos, and impersonating a trusted brand is a scam tell." },
      { id: 't6', left: 88, top: 57, w: 23, h: 42, title: 'Bot comments', reason: "Every comment is identical — 'I made $5000 my first week!!' — with smeared, look-alike avatars. Copy-paste bot testimonials are manufactured social proof." },
    ],
  },
  {
    id: 'seniors',
    name: 'Senior',
    icon: '👴',
    image: '/seniors.png',
    hotspots: [
      { id: 't1', left: 24, top: 52, w: 17, h: 24, title: 'Raised hand', reason: 'Count the fingers on the raised hand — there are too many. Malformed or extra fingers are one of the most reliable signs of an AI-generated image.' },
      { id: 't3', left: 74, top: 24, w: 44, h: 6, title: 'Misspelled banner', reason: "The banner reads 'INVESTMNET OPPORTUNITY' — 'investment' is misspelled. AI often produces almost-correct text with subtle spelling errors." },
      { id: 't4', left: 91, top: 37, w: 13, h: 19, title: 'Blurred QR code', reason: "The 'Scan to invest' QR code is blurred and won't actually scan. AI imitates QR codes without making them work — and any QR rushing you to 'invest' is a scam." },
      { id: 't5', left: 75, top: 13, w: 46, h: 13, title: 'Impossible promise', reason: "'GUARANTEED CRYPTO RETURNS' is an impossible promise. No legitimate authority guarantees investment returns — this is a classic scam hook." },
      { id: 't6', left: 51, top: 82, w: 33, h: 7, title: 'Fake authority', reason: "There is no Singapore body called the 'National Financial Council'. Singapore's financial regulator is the Monetary Authority of Singapore (MAS). Official-sounding fake names are a scam tell." },
      { id: 't7', left: 16, top: 23, w: 15, h: 28, title: 'Distorted flag', reason: "Singapore's flag has five stars arranged in a circle beside the crescent. Here the stars are misplaced and irregular — AI often distorts national flags and emblems." },
    ],
  },
]

export const PHASE_TWO_TIME_LIMIT = 30
