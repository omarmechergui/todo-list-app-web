// المهام الرياضية
export const sportQuests = [
  { id: 1, title: "Go for a run", xpReward: 15, type: "Sport" },
  { id: 2, title: "Do 30 push-ups", xpReward: 10, type: "Sport" },
  { id: 3, title: "Bike for 20 minutes", xpReward: 20, type: "Sport" },
  { id: 4, title: "Run 5 km", xpReward: 30, type: "Sport" },
  { id: 5, title: "Complete a yoga session", xpReward: 25, type: "Sport" },
  { id: 6, title: "Join a sports competition", xpReward: 50, type: "Sport" },
];

// المهام الثقافية
export const culturalQuests = [
  { id: 7, title: "Read a new book", xpReward: 10, type: "Culture" },
  { id: 8, title: "Write a summary of a documentary", xpReward: 20, type: "Culture" },
  { id: 9, title: "Visit a museum", xpReward: 25, type: "Culture" },
  { id: 10, title: "Attend a cultural event", xpReward: 30, type: "Culture" },
  { id: 11, title: "Learn about a new culture", xpReward: 15, type: "Culture" },
  { id: 12, title: "Watch a classic movie", xpReward: 20, type: "Culture" },
];

// دالة لتوليد المهام بناءً على المستوى
export const generateQuestByLevel = (level) => {
  const sportQuestsToShow = [...sportQuests];
  const culturalQuestsToShow = [...culturalQuests];

  if (level >= 2) {
    return [
      ...sportQuestsToShow,
      ...culturalQuestsToShow,
    ]; // دمج المهام الرياضية والثقافية للمستوى 2 أو أعلى
  } else {
    return [...sportQuestsToShow]; // فقط المهام الرياضية للمستوى الأول
  }
};
