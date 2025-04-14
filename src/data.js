// data.js

const quests = [
  { id: 1, title: "Complete a Pomodoro session", level: 1, xpReward: 10 },
  { id: 2, title: "Declutter your workspace", level: 1, xpReward: 8 },
  { id: 3, title: "Stretch for 5 minutes", level: 1, xpReward: 5 },
  { id: 4, title: "Take a 10-minute walk", level: 1, xpReward: 7 },
  { id: 5, title: "Organize your to-do list", level: 1, xpReward: 6 },
  { id: 6, title: "Meditate for 10 minutes", level: 2, xpReward: 12 },
  { id: 7, title: "Read for 20 minutes", level: 2, xpReward: 10 },
  { id: 8, title: "Write a journal entry", level: 2, xpReward: 9 },
  { id: 9, title: "Learn a new keyboard shortcut", level: 2, xpReward: 8 },
  { id: 10, title: "Practice deep breathing", level: 2, xpReward: 6 },
  { id: 11, title: "Plan your next day", level: 3, xpReward: 7 },
  { id: 12, title: "Drink a glass of water", level: 3, xpReward: 3 },
  { id: 13, title: "Clean up your email inbox", level: 3, xpReward: 8 },
  { id: 14, title: "Review your goals", level: 3, xpReward: 6 },
  { id: 15, title: "Do 15 push-ups", level: 3, xpReward: 10 },
  { id: 16, title: "Learn a new word", level: 3, xpReward: 4 },
];

export const generateQuestByLevel = (level) => {
  const filtered = quests.filter(q => q.level <= level);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 8); // Only return 8 tasks
};
