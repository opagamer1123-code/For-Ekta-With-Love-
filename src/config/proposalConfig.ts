import { NoteCategory } from '../types/notes';

export type ScrapbookIconType =
  | 'sparkle'
  | 'smile'
  | 'heart'
  | 'conversation'
  | 'eyes'
  | 'hair'
  | 'speech'
  | 'kindness'
  | 'personality'
  | 'habits'
  | 'laughter'
  | 'strength'
  | 'dreams'
  | 'playful'
  | 'care'
  | 'mind'
  | 'simply-ekta'
  | (string & {});

export interface LittleThingCard {
  id: string;
  title: string;
  content: string;
  revealedInitially: boolean;
  iconType: ScrapbookIconType;
  videoUrl?: string;
  videoPoster?: string;
  videoTitle?: string;
  videoCaption?: string;
}

export interface ProposalConfig {
  recipientName: string;
  senderName: string;
  siteTitle: string;
  welcome: {
    heading: string;
    subheading: string;
    buttonLabel: string;
  };
  letter: {
    salutation: string;
    paragraphs: string[];
    closing: string;
    signature: string;
    continueButton: string;
  };
  littleThings: {
    title: string;
    subtitle: string;
    cards: LittleThingCard[];
  };
  proposal: {
    leadIn: string;
    question: string;
    options: {
      yes: {
        label: string;
        responseTitle: string;
        responseMessage: string;
      };
      time: {
        label: string;
        responseTitle: string;
        responseMessage: string;
      };
      friend: {
        label: string;
        responseTitle: string;
        responseMessage: string;
      };
    };
  };
  starterNotes: Array<{
    id: string;
    title: string;
    content: string;
    date: string;
    isPinned: boolean;
    isShared: boolean;
    category: NoteCategory;
  }>;
}

export const proposalConfig: ProposalConfig = {
  recipientName: "Ekta",
  senderName: "Someone who thinks you are pretty special",
  siteTitle: "For Ekta, With Love ♡",
  welcome: {
    heading: "Ekta, this little corner of the internet is just for you.",
    subheading: "There is something I have been wanting to tell you...",
    buttonLabel: "Open my heart ♡",
  },
  letter: {
    salutation: "My Love, Ekta,",
    paragraphs: [
      "If someone ever asks me, “What is your biggest dream or what are you manifesting in life?” I think I’ll smile a little and say, “It’s her. It has always been her.”",
      "Because, my love, I don’t know how to explain it, but when I imagine my future, I don’t see just a beautiful house, a successful career, or a life full of happiness. I see you in it. I see you standing beside me when life gets difficult, holding my hand when I feel lost, laughing with me over the smallest things, and falling asleep in my arms after a long day.",
      "I want to be the person you choose, not just when you're happy, but when you're broken, tired, scared, and when the whole world feels against you. I want to know every little thing about you, your fears, your dreams, your insecurities, and all those parts of yourself that you think are too difficult to love. I want to love you in the ways you never even knew you needed.",
      "And honestly, I'm not asking for a perfect life with you. I'm asking for a real one. A life where we have arguments but never stop choosing each other, where we face problems together instead of walking away, where we grow older but never stop looking at each other with the same love we had in the beginning.",
      "I want to marry you someday. I want to stand in front of you, look into your eyes, and remember how once you were just a wish I made silently in my heart. I want to hold your hand and promise you that, as long as I can, you'll never have to face this world feeling like you're alone.",
      "Maybe I can't promise you that I'll give you everything you ever dream of, but I can promise that I'll keep trying. I'll celebrate your smallest achievements as if they're my biggest victories. I'll be proud of you when you succeed, comfort you when you fail, and remind you of your worth on the days you forget it yourself.",
      "And if God ever asks me what one thing I want from this life, I won't ask for wealth, fame, or a life without struggles. I'll ask for you. I'll ask for the privilege of loving you, the chance to grow with you, and the blessing of spending my life beside you.",
      "So, my love, if I could ask you for just one thing, it would be this: give me the chance to turn all these dreams into our reality. Let me love you, choose you, and build a home with you, not just a place made of walls, but a place where both our hearts feel safe.",
      "I don't know what tomorrow holds for us, but I know what I wish for it. I wish that one day, when someone asks me whether my biggest dream came true, I'll look at you, hold your hand a little tighter, and say with tears of happiness in my eyes,",
      "“Yes. She's right here beside me. The girl I once prayed for, the woman I fell in love with, and the person I get to call my wife. She was never just a part of my dream. She was the dream itself.”",
      "And if you ask me whether I'd choose you again, in another life, in another world, with a thousand different beginnings, my answer would still be you.",
      "It's you I want, it's you I pray for, it's you I see in my future, and it's you I want to come home to for the rest of my life. Will you let me love you forever?"
    ],
    closing: "Forever and always,",
    signature: "Yours ♡",
    continueButton: "Next: Moments in Motion ♡",
  },
  littleThings: {
    title: "Little Things That Make You, You ♡",
    subtitle: "A little collection of the things that make you so beautifully yourself.",
    cards: [
      {
        id: "lt-1",
        title: "Your Eyes ♡",
        content:
          "Brown was just an ordinary colour until I saw your eyes. The eyes that make me fall in love, the eyes that make me feel calm, the eyes in which I lose myself without even realising it. And if love had a colour, it would be the colour of your eyes.",
        revealedInitially: false,
        iconType: "eyes",
        videoUrl: "/assets/aistudio/SaveClip.App_AQM-Zg59F4rOyTUwrUiBk3-Y0S9j9hAqS_dzM9XHbsAoNlMWhITVyH_1Yj8gwgx9MhQj7v1TuRAiY_qbYmDRcLO2aoDiYTeR1nvNbsY_e9510177.mp4",
        videoPoster: "/assets/aistudio/reel_01_poster.jpg",
        videoTitle: "Bas Tu Chahiye ♡",
        videoCaption: "“Tere se behtar milne ki baat chhod, dusri taraf Bhagwan bhi khada ho toh bhi tu chahiye” ♡",
      },
      {
        id: "lt-2",
        title: "Your Hair ♡",
        content:
          "I don't know what it is about your hair, but even the smallest details seem beautiful to me. The way it falls, the way it frames your face, and the way it becomes a part of every little expression of yours. Sometimes, it's the simplest things about you that leave me completely mesmerised. Your hair is one of those little details I could admire without ever getting tired of it.",
        revealedInitially: false,
        iconType: "hair",
      },
      {
        id: "lt-3",
        title: "Your Beautiful Smile ♡",
        content:
          "If happiness could be captured in a single moment, I think it would look like your smile. There's something about it that makes everything around you feel a little brighter. Even on an ordinary day, your smile has a way of making a moment feel special. I hope you never forget how beautiful your smile is, especially on the days when you don't feel that way yourself.",
        revealedInitially: false,
        iconType: "smile",
        videoUrl: "/assets/aistudio/SaveClip.App_AQOsC6Dp1BVaQAoscuEGVmf47lYc0yQz3m3dChT9w9qdGn7cUWUZxvVbG9OLI7cibEoTDfdkRpSzxqU74fK8kka8y4l99n8pKhkGpbM_7a52ef04.mp4",
        videoPoster: "/assets/aistudio/reel_02_poster.jpg",
        videoTitle: "Your Beautiful Smile in Motion ♡",
        videoCaption: "Manifesting all these cute smile moments with you :) ♡",
      },
      {
        id: "lt-4",
        title: "The Way You Talk ♡",
        content:
          "There's something special about the way you talk. The words you choose, the little expressions you make, and the way even an ordinary conversation with you can become something worth remembering. I could listen to you talk about the simplest things and still find myself wishing the conversation would never end. Sometimes, it's not even what you're saying; it's simply that it's you saying it.",
        revealedInitially: false,
        iconType: "speech",
      },
      {
        id: "lt-5",
        title: "Your Kind Heart ♡",
        content:
          "One of the most beautiful things about you is the heart you carry. There's a certain beauty in someone who can make others feel valued through little acts of kindness. I hope you never lose that gentle part of yourself. The world needs more people who can make others feel a little less alone, simply by being kind.",
        revealedInitially: false,
        iconType: "kindness",
      },
      {
        id: "lt-6",
        title: "Your Personality ♡",
        content:
          "You have a way of being yourself that makes you different from everyone else. It's the combination of your thoughts, your expressions, your emotions, and all those little things that make up who you are. You don't have to be like anyone else to be special, Ekta. There's already something wonderful about the person you are, and I hope you always see that in yourself.",
        revealedInitially: false,
        iconType: "personality",
      },
      {
        id: "lt-7",
        title: "Your Little Habits ♡",
        content:
          "It's funny how the smallest things can become the most memorable. The little things you do without thinking, the expressions you make, the way you react to certain things, and all those tiny details you probably don't even notice about yourself. Maybe you consider them ordinary, but to someone who pays attention, they're little pieces of what makes you, you.",
        revealedInitially: false,
        iconType: "habits",
      },
      {
        id: "lt-8",
        title: "Your Laughter ♡",
        content:
          "Your laughter deserves a place of its own. There's something so lovely about seeing someone forget everything for a moment and laugh without holding back. I hope life gives you countless reasons to laugh like that. And I hope you never feel the need to hide that happiness, because it's one of the loveliest things about you.",
        revealedInitially: false,
        iconType: "laughter",
        videoUrl: "/assets/aistudio/SaveClip.App_AQOtnECu1lOd3eSc2L27JshNexCjPFL-uHv-dYAAp5zJSE9yKBVojMX31j__FbfsldG4f1ltbFTwJcafU3nFznnwvz66O_nX_XgJtf0_69f8194e.mp4",
        videoPoster: "/assets/aistudio/reel_04_poster.jpg",
        videoTitle: "Laughter Worth Remembering ♡",
        videoCaption: "“Looks?? Mujhe toh uske naam se bhi pyaar hai <3”",
      },
      {
        id: "lt-9",
        title: "Your Strength ♡",
        content:
          "There's a strength in you that deserves to be recognised, even on the days when you might not recognise it yourself. Life doesn't always go according to our plans, and not every difficult moment is visible to others. But I hope you remember that you are stronger than you sometimes give yourself credit for. You deserve to be proud of how far you've come.",
        revealedInitially: false,
        iconType: "strength",
      },
      {
        id: "lt-10",
        title: "Your Dreams ♡",
        content:
          "I wonder about all the beautiful things you dream of becoming and everything you wish to experience in life. I hope you never stop dreaming, never make yourself smaller for the world, and never give up on the things that make your heart excited. May you find the courage, opportunities, and happiness to turn those dreams into memories one day.",
        revealedInitially: false,
        iconType: "dreams",
      },
      {
        id: "lt-11",
        title: "Your Playful Side ♡",
        content:
          "I think there's something especially beautiful about the playful side of you. The silly moments, the unexpected reactions, and the little things that bring out that carefree version of yourself. You don't always have to be serious or have everything figured out. I hope you always keep that little spark in you that knows how to enjoy the simplest moments.",
        revealedInitially: false,
        iconType: "playful",
        videoUrl: "/assets/aistudio/SaveClip.App_AQMDix3FxhI-0ejcUSc392wcKzxIuP0tk9_HrWTyOfzhuuwe0XOkrSDb4Aw3W439hmzWAoSAhX3UAoS2BB8Dc1Z_-OGzcoPYrnLyIo4_afa2a0bb.mp4",
        videoPoster: "/assets/aistudio/reel_06_poster.jpg",
        videoTitle: "Playful Moments & Smiles ♡",
        videoCaption: "“Na tujhse behtar chahiye, na tere jaisa chahiye... Har pal, har lamha, har waqt mujhe sirf tu chahiye 🧿❤️”",
      },
      {
        id: "lt-12",
        title: "The Way You Care ♡",
        content:
          "Care isn't always expressed through grand gestures. Sometimes, it's found in the smallest details, in remembering something, asking if someone is okay, or simply making an effort to be there. There's something beautiful about the way a person makes others feel that they matter. I hope you always receive the same warmth and care that you give to the people around you.",
        revealedInitially: false,
        iconType: "care",
      },
      {
        id: "lt-13",
        title: "Your Beautiful Mind ♡",
        content:
          "Your beauty isn't only in what someone can see; it's also in everything that makes up your mind. Your thoughts, your opinions, your imagination, and the way you see the world. There's so much more to a person than their appearance, and I hope you never underestimate the beauty of your own mind. The way you think and the person you are beyond what the world sees is something worth appreciating.",
        revealedInitially: false,
        iconType: "mind",
      },
      {
        id: "lt-14",
        title: "Simply Ekta ♡",
        content:
          "Beyond every single quality I could ever describe, the truth is that it all comes back to one simple thing: it's you. Not an idealized version of you, not who the world expects you to be, but the genuine, warm, and wonderfully unique person you are every day.\n\nI didn't just notice your smile, your laughter, or the kindness in your heart—I fell for the soul behind all of them. The way you navigate life, the quiet courage you carry, and the warmth you leave wherever you go.\n\nEvery memory of you, every little thought, and every conversation has shown me how rare someone like you truly is. You make ordinary moments feel like poetry, and you make my heart feel at home.\n\nAnd if there's one thing I hope you always remember, Ekta, it's this: you don't have to become someone else to be wonderful. There's already so much beauty in simply being you. ♡",
        revealedInitially: false,
        iconType: "simply-ekta",
        videoUrl: "/assets/aistudio/SaveClip.App_AQMy3-T67BwfZDlSmXFHOm0XMcNGHJ5EzPvoKOfOadJrANEE1udYpS9sGjVGCV0edA72U5IMWXorTxz7ZcaBH4toSX6c62VphyVnlcg_d8579551.mp4",
        videoPoster: "/assets/aistudio/reel_10_poster.jpg",
        videoTitle: "Plan A OR Plan B ♡",
        videoCaption: "There was never a Plan B... it has always been you, Ekta ♡",
      },
    ],
  },
  proposal: {
    leadIn: "And there is one little thing I have been wanting to ask you...",
    question:
      "Ekta, you've become really special to me, and I'd love to see where things could go between us. I don't know what the future holds, but I'd be happy to figure it out together. Would you give us a chance? ♡",
    options: {
      yes: {
        label: "Yes, let's give our story a beautiful beginning ❤️",
        responseTitle: "Ekta ❤️",
        responseMessage:
          "Ekta, you have no idea how happy you've made me. ❤️ After all these feelings I've carried in my heart, getting this chance with you means more to me than words can explain. I don't promise that every day will be perfect, but I promise to care for you, respect you, stand beside you, and keep choosing you through every little moment of life. Maybe this is the beginning of the most beautiful chapter of our lives. Thank you for giving my heart a chance. I hope one day we look back at this moment and smile, knowing this was where our story began. ♡",
      },
      time: {
        label: "I need a little more time 🌷",
        responseTitle: "Take your time, Ekta 🌷",
        responseMessage:
          "Take your time, Ekta. You don't have to figure everything out today. Your feelings matter to me, and I'd rather have an honest answer when you're ready than a rushed one today. ♡",
      },
      friend: {
        label: "I'm sorry, I don't feel the same",
        responseTitle: "Thank you for your honesty ♡",
        responseMessage:
          "Thank you for being honest with me, Ekta. Maybe our hearts dream of different things, and that hurts, but I'll respect your decision. I genuinely hope life brings you all the happiness you deserve. Take care of yourself. ♡",
      },
    },
  },
  starterNotes: [
    {
      id: "starter-1",
      title: "A Thought of You",
      content:
        "[Example note: you can edit or delete this]\n\nSometimes in the middle of a quiet moment, a simple thought of your smile crosses my mind and makes the entire day feel a little lighter and more peaceful.",
      date: "October 14",
      isPinned: true,
      isShared: true, // Example note revealed to Ekta
      category: "thought",
    },
    {
      id: "starter-2",
      title: "Little Things I Admire",
      content:
        "[Example note: you can edit or delete this]\n\nThe natural grace you carry, the thoughtful attention you pay when listening to others, and the quiet goodness in how you carry yourself.",
      date: "October 19",
      isPinned: false,
      isShared: true, // Example note revealed to Ekta
      category: "admiration",
    },
    {
      id: "starter-3",
      title: "Words I Could Not Say",
      content:
        "[Example note: you can edit or delete this]\n\nI was nervous about expressing what was in my heart because I value your peace of mind above everything. But being honest with you felt like the truest thing to do.",
      date: "October 24",
      isPinned: false,
      isShared: false, // Private diary note
      category: "confession",
    },
    {
      id: "starter-4",
      title: "A Memory to Keep",
      content:
        "[Example note: you can edit or delete this]\n\nThat conversation where we shared our thoughts freely and time seemed to gently pause. It reminded me how rare and comforting genuine connection truly is.",
      date: "October 27",
      isPinned: false,
      isShared: false, // Private diary note
      category: "memory",
    },
  ],
};
