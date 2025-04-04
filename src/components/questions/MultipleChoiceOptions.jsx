import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const MultipleChoiceOptions = ({
  currentQuestion,
  setCurrentQuestion,
  questionType,
}) => {
  // Handle option changes
  const handleOptionChange = (index, value) => {
    const newAnswers = [...currentQuestion.answers];
    if (!newAnswers[index]) {
      newAnswers[index] = { content: "", isCorrect: false, explanation: "" };
    }
    newAnswers[index].content = value;
    setCurrentQuestion((prev) => ({ ...prev, answers: newAnswers }));
  };

  // Toggle correct answer
  const toggleCorrectAnswer = (index) => {
    const newAnswers = [...currentQuestion.answers];
    if (!newAnswers[index]) {
      newAnswers[index] = { content: "", isCorrect: false, explanation: "" };
    }

    // For true/false type, make this the only correct answer
    if (questionType === "true_false") {
      newAnswers.forEach((answer, i) => {
        answer.isCorrect = i === index;
      });
    } else {
      // For multiple choice, toggle this answer
      newAnswers[index].isCorrect = !newAnswers[index].isCorrect;
    }

    setCurrentQuestion((prev) => ({ ...prev, answers: newAnswers }));
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label>Answer Options</Label>
        <div className="space-y-2">
          {currentQuestion.answers.map((answer, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Option ${index + 1}`}
                value={answer.content}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <Button
                variant={answer.isCorrect ? "default" : "outline"}
                size="icon"
                className="shrink-0"
                onClick={() => toggleCorrectAnswer(index)}
              >
                {answer.isCorrect ? "✓" : ""}
              </Button>
            </div>
          ))}
        </div>
        {questionType === "multiple_choice" && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={() => {
              const newAnswers = [
                ...currentQuestion.answers,
                { content: "", isCorrect: false, explanation: "" },
              ];
              setCurrentQuestion((prev) => ({ ...prev, answers: newAnswers }));
            }}
          >
            Add Option
          </Button>
        )}
      </div>
    </div>
  );
};
