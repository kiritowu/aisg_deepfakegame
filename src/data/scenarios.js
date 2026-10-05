// Phase One content. Add/remove entries here to extend the video round.
// Videos live in /public/videos and are referenced by absolute path.
export const SCENARIOS = [
  {
    id: 1,
    label: "REAL",
    isReal: true,
    emoji: "👩‍🏫",
    description: "A teacher presents a graph on a whiteboard during a recorded lecture. She gestures naturally, blinks normally, and the classroom background is consistent.",
    theme: "Classroom Lecture",
    bg: "#1a3a2a",
    clues: ["Natural blinking pattern", "Consistent lighting", "Background objects stable"],
    clueTypes: ["green", "green", "green"],
    video: "/videos/v1.MOV",
    explanation: "This is a real video. The natural eye movement, consistent audio-lip sync, and stable environment are all indicators of genuine footage.",
    tip: "Real videos have consistent lighting and natural human micro-expressions."
  },
  {
    id: 2,
    label: "FAKE",
    isReal: false,
    emoji: "📱",
    description: "A late-night video call from your 'son' on a friend's phone. He needs money via PayNow — now, and secretly.",
    theme: "Family Impersonation Call",
    bg: "#2a1a1a",
    clues: ["Camera stays perfectly still, even though he's holding the phone ⚠️", "Face is overly smooth, with glossy, glassy eyes ⚠️", "Pressures you to send money now and keep it a secret ⚠️"],
    clueTypes: ["red", "red", "red"],
    video: "/videos/sg1_web.mp4",
    explanation: "Deepfake! He seems to hold the phone at arm's length, but the camera never shakes. His face is unnaturally smooth and his eyes look glossy. The urgency and secrecy are classic scam tactics too. Hang up and call your family member back on the number you already have.",
    tip: "Got an urgent money request by video call? Hang up and call back on a number you trust. A hand-held phone always shakes a little — a perfectly steady shot is a warning sign."
  },
  {
    id: 3,
    label: "REAL",
    isReal: true,
    emoji: "📰",
    description: "A news reporter delivers a live broadcast from the field.",
    theme: "News Broadcast",
    bg: "#1a2a3a",
    clues: ["Hair moves with wind", "Lips match audio", "Natural background"],
    clueTypes: ["green", "green", "green"],
    video: "/videos/v3_web.mp4",
    explanation: "This is authentic footage. Dynamic environmental elements like moving hair and background motion are extremely difficult for current AI to convincingly fake.",
    tip: "Environmental details like wind, shadows, and background movement are hard for AI to fake convincingly."
  },
  {
    id: 4,
    label: "FAKE",
    isReal: false,
    emoji: "💸",
    description: "An Instagram Reel: a 'finfluencer' says she made $50,000 in 3 months. Join her Telegram group!",
    theme: "Investment Scam Reel",
    bg: "#2a1a2a",
    clues: ["Hair stays still even though the fans are blowing at her ⚠️", "Face is overly smooth and glossy ⚠️", "Misspelt caption: 'GUARANTED PROFITS' ⚠️"],
    clueTypes: ["red", "red", "red"],
    video: "/videos/sg3_web.mp4",
    explanation: "Deepfake! Two fans are blowing right at her, yet her hair barely moves. Her face is unnaturally smooth and glossy, and the caption misspells 'GUARANTEED'. And no real investment can 'guarantee' returns with 'zero risk'.",
    tip: "Check if things react the way they should — wind should move hair. Misspelt text and 'guaranteed returns' are scam red flags."
  },
  {
    id: 5,
    label: "REAL",
    isReal: true,
    emoji: "👨‍💼",
    description: "A CEO gives a press conference statement. The background shows a real office, lighting is slightly imperfect, and there are occasional natural pauses and 'ums'.",
    theme: "Corporate Press Conference",
    bg: "#1a2a1a",
    clues: ["Imperfect natural pauses", "Slightly uneven lighting (real)", "Genuine hesitation"],
    clueTypes: ["green", "green", "green"],
    video: "/videos/v5.MOV",
    explanation: "Real! Genuine human speech has imperfections — filler words, pauses, and varied pacing. AI-generated voice tends to sound overly polished and uniform.",
    tip: "Natural human imperfections like 'ums', pauses, and slight lighting inconsistencies are signs of authenticity."
  },
  {
    id: 6,
    label: "FAKE",
    isReal: false,
    emoji: "📱",
    description: "A viral social media video shows an AI company's founder seemingly announcing a product recall. His teeth look blurred and his ears blend oddly into the background.",
    theme: "Tech Announcement",
    bg: "#2a2a1a",
    clues: ["Blurry teeth ⚠️", "Ear-background blending ⚠️", "Suspicious claim content"],
    clueTypes: ["red", "red", "red"],
    video: "/videos/v6.MOV",
    explanation: "Deepfake! AI models consistently struggle to render teeth and ear edges realistically. If the content of the announcement seems shocking, that's an extra red flag.",
    tip: "Look at teeth — they are consistently one of the hardest facial features for AI to render."
  },
  {
    id: 7,
    label: "FAKE",
    isReal: false,
    emoji: "🔬",
    description: "A video shows a 'scientist' claiming a common household product cures cancer. The background shifts slightly between cuts and the voice audio sounds slightly robotic.",
    theme: "Health Misinformation",
    bg: "#2a1a1a",
    clues: ["Background inconsistency ⚠️", "Robotic voice quality ⚠️", "Extraordinary health claim"],
    clueTypes: ["red", "red", "red"],
    video: "/videos/v7.MOV",
    explanation: "This is a deepfake used for health misinformation — a dangerous combination. Background flickering between cuts and AI-synthesized voice are clear giveaways.",
    tip: "Extraordinary claims combined with video anomalies are a major warning sign. Always verify health information with accredited medical sources."
  },
  {
    id: 8,
    label: "REAL",
    isReal: true,
    emoji: "🎤",
    description: "A recorded interview shows two people in conversation. Both speakers have natural eye contact, spontaneous laughter, and the lighting casts consistent shadows on both faces.",
    theme: "Live Interview",
    bg: "#1a1a2a",
    clues: ["Consistent shadow direction", "Spontaneous reactions", "Natural eye contact between speakers"],
    clueTypes: ["green", "green", "green"],
    video: "/videos/v8.MOV",
    explanation: "This is real footage. Spontaneous social reactions, consistent environmental shadows, and natural gaze patterns between multiple people are very hard to fake with AI.",
    tip: "Multi-person scenes with authentic social interaction are much harder to deepfake than solo clips."
  }
];

// Which scenarios (by id) make up the Phase One round, in order.
export const PHASE_ONE_SCENARIO_IDS = [2, 3, 4];

export const PHASE_ONE_SCENARIOS = PHASE_ONE_SCENARIO_IDS
  .map(id => SCENARIOS.find(s => s.id === id))
  .filter(Boolean);

export const QUESTION_TIME_LIMIT = 15;
