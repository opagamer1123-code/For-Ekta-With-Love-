export type ReelThumbnailSize = 'square' | 'standard' | 'tall' | 'featured';

export interface ReelItem {
  id: number;
  title: string;
  caption?: string;
  videoUrl: string;
  thumbnailUrl: string;
  category?: 'Promises' | 'Cute Moments' | 'Manifestation' | 'Memories' | 'Heartfelt' | string;
  isFeatured?: boolean;
  size?: ReelThumbnailSize;
}

export const reelsData: ReelItem[] = [
  {
    id: 1,
    title: "Bas Tu Chahiye",
    caption: "“Tere se behtar milne ki baat chhod, dusri taraf Bhagwan bhi khada ho toh bhi tu chahiye” ♡",
    videoUrl: "/assets/aistudio/SaveClip.App_AQM-Zg59F4rOyTUwrUiBk3-Y0S9j9hAqS_dzM9XHbsAoNlMWhITVyH_1Yj8gwgx9MhQj7v1TuRAiY_qbYmDRcLO2aoDiYTeR1nvNbsY_e9510177.mp4",
    thumbnailUrl: "/assets/aistudio/reel_01_poster.jpg",
    category: "Promises",
    isFeatured: true,
    size: "featured",
  },
  {
    id: 2,
    title: "Manifesting Cute Moments With You",
    caption: "Manifesting all these cute moments with you :) ♡",
    videoUrl: "/assets/aistudio/SaveClip.App_AQOsC6Dp1BVaQAoscuEGVmf47lYc0yQz3m3dChT9w9qdGn7cUWUZxvVbG9OLI7cibEoTDfdkRpSzxqU74fK8kka8y4l99n8pKhkGpbM_7a52ef04.mp4",
    thumbnailUrl: "/assets/aistudio/reel_02_poster.jpg",
    category: "Cute Moments",
    size: "square",
  },
  {
    id: 3,
    title: "I'll Wait For You",
    caption: "“Because God is not letting me forget about you and me. I will wait for you, Ekta ♡”",
    videoUrl: "/assets/aistudio/SaveClip.App_AQPxiv7WI1wGD44_vhAdBKAgybDRpLN4_Rb7xD4eLASYpljKb43k1sNH43gbtF23RJrZVKGyWkBg299LC6mTR7h3dn47wkWFsLcKKqA_f5a2a0ee.mp4",
    thumbnailUrl: "/assets/aistudio/reel_03_poster.jpg",
    category: "Promises",
    size: "tall",
  },
  {
    id: 4,
    title: "Naam Se Bhi Pyaar Hai <3",
    caption: "“Looks?? Mujhe toh uske naam se bhi pyaar hai <3”",
    videoUrl: "/assets/aistudio/SaveClip.App_AQOtnECu1lOd3eSc2L27JshNexCjPFL-uHv-dYAAp5zJSE9yKBVojMX31j__FbfsldG4f1ltbFTwJcafU3nFznnwvz66O_nX_XgJtf0_69f8194e.mp4",
    thumbnailUrl: "/assets/aistudio/reel_04_poster.jpg",
    category: "Cute Moments",
    size: "square",
  },
  {
    id: 5,
    title: "if Mahadev accepted the Manifestation",
    caption: "“You manifested and Mahadev accepted 🕉️🔱”",
    videoUrl: "/assets/aistudio/SaveClip.App_AQNTr0KGF4VefNYjuKts_OsMQYyOekq8mwIHv10hgZZ7X7DnWdYgmW5T8zKk_qgGtOFL8-kNZevpt-a-Q0cid9LvTiZNnWD_rhfPZxs_c370e6c1.mp4",
    thumbnailUrl: "/assets/aistudio/reel_05_poster.jpg",
    category: "Manifestation",
    size: "square",
  },
  {
    id: 6,
    title: "Har Pal, Har Lamha, Har Waqt Tu Chahiye",
    caption: "“Na tujhse behtar chahiye, na tere jaisa chahiye... Har pal, har lamha, har waqt mujhe sirf tu chahiye 🧿❤️”",
    videoUrl: "/assets/aistudio/SaveClip.App_AQMDix3FxhI-0ejcUSc392wcKzxIuP0tk9_HrWTyOfzhuuwe0XOkrSDb4Aw3W439hmzWAoSAhX3UAoS2BB8Dc1Z_-OGzcoPYrnLyIo4_afa2a0bb.mp4",
    thumbnailUrl: "/assets/aistudio/reel_06_poster.jpg",
    category: "Promises",
    size: "tall",
  },
  {
    id: 7,
    title: "The Last Wish",
    caption: "“तू बता किस मंदिर में मैं मांगू तुझे... तू मिले तो ये मुसाफ़िर मुकम्मल हो ♡”",
    videoUrl: "/assets/aistudio/SaveClip.App_AQMqba0OIszNJos3UDZJNMPvqi8k3SL50ZAbyWckDu4vRIkUXBQmuttmYNsuGGMXC0r3cIpCrYVuuX8_rE8ASk6lmk1hI_8rmTxHYWU_ec70c66f.mp4",
    thumbnailUrl: "/assets/aistudio/reel_07_poster.jpg",
    category: "Manifestation",
    size: "tall",
  },
  {
    id: 8,
    title: "I Need You For Forever",
    caption: "“Don't forget that I'm praying for you to be my lifetime partner... No matter how hard life gets, I still want to do things with you ♡”",
    videoUrl: "/assets/aistudio/SaveClip.App_AQO-86kC0yahXxpFxdrDLYyxYZCbOe7jCmTr1FyVw5SrNiARy86UuYF0R6fJEj83onDUTDSGdZCE9LuzpkcaTwfZU30wHNMwKH23JpQ_8b42a5fb.mp4",
    thumbnailUrl: "/assets/aistudio/reel_08_poster.jpg",
    category: "Promises",
    size: "square",
  },
  {
    id: 9,
    title: "Mukti Hai Prem",
    caption: "“प्रेम से मुंह मोड़ रहे हो तो शिव को कैसे पाओगे... प्रेम में मृत्यु नहीं, मुक्ति है और मैं प्रेम ही हूँ 🕉️🔱”",
    videoUrl: "/assets/aistudio/SaveClip.App_AQPx7XRJoEA1fNUEY8jjJMPdqqMPdaRi1-k265uBJlC_ZpUb7BfS5I86KZW3GVuZUAjw7kCsAanQtZNiHSpvNAksWrhhsJxInPQiz8U_589b03fb.mp4",
    thumbnailUrl: "/assets/aistudio/reel_09_poster.jpg",
    category: "Manifestation",
    isFeatured: true,
    size: "featured",
  },
];
