export function calculateNextReview(createdAt, difficulty) {
  const date = new Date(createdAt);

  // Use difficulty to determine review interval (in days)
  let interval;
  switch (difficulty) {
    case 1:
      interval = 7;
      break; // Very easy - weekly
    case 2:
      interval = 5;
      break; // Easy - 5 days
    case 3:
      interval = 3;
      break; // Medium - 3 days
    case 4:
      interval = 2;
      break; // Hard - 2 days
    case 5:
      interval = 1;
      break; // Very hard - daily
    default:
      interval = 3;
  }

  date.setDate(date.getDate() + interval);
  return date.toISOString().split("T")[0];
}

export function getReviewType(difficulty) {
  switch (difficulty) {
    case 1:
      return "Weekly";
    case 2:
      return "5-day";
    case 3:
      return "3-day";
    case 4:
      return "2-day";
    case 5:
      return "Daily";
    default:
      return "3-day";
  }
}

export function formatDifficulty(level) {
  const levels = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard"];
  return levels[level - 1] || "Medium";
}

export const initialQuestionState = {
  content: "",
  type: "multiple_choice",
  topic: "",
  difficulty: 3,
  priority: 3,
  answers: [],
  tags: [],
  media: [],
};

// Initialize answers based on question type
export const initializeAnswers = (type, existingAnswers = []) => {
  if (type === "multiple_choice") {
    // Initialize with 4 empty answer options if no existing answers
    return existingAnswers.length
      ? existingAnswers
      : [
          { content: "", isCorrect: false, explanation: "" },
          { content: "", isCorrect: false, explanation: "" },
          { content: "", isCorrect: false, explanation: "" },
          { content: "", isCorrect: false, explanation: "" },
        ];
  } else if (type === "true_false") {
    // Initialize with True/False options
    return [
      { content: "True", isCorrect: false, explanation: "" },
      { content: "False", isCorrect: false, explanation: "" },
    ];
  } else if (type === "essay") {
    // Essay questions don't have predefined answers
    return [];
  }
  return existingAnswers;
};
