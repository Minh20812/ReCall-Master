import React from "react";
import { Button } from "@/components/ui/button";

export const QuestionTypeSelector = ({ questionType, setQuestionType }) => {
  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      <Button
        variant={questionType === "multiple_choice" ? "default" : "outline"}
        className="h-24 flex flex-col gap-2"
        onClick={() => setQuestionType("multiple_choice")}
      >
        <span className="text-2xl">🔘</span>
        <span>Multiple Choice</span>
      </Button>
      <Button
        variant={questionType === "true_false" ? "default" : "outline"}
        className="h-24 flex flex-col gap-2"
        onClick={() => setQuestionType("true_false")}
      >
        <span className="text-2xl">✓/✗</span>
        <span>True/False</span>
      </Button>
      <Button
        variant={questionType === "essay" ? "default" : "outline"}
        className="h-24 flex flex-col gap-2"
        onClick={() => setQuestionType("essay")}
      >
        <span className="text-2xl">📝</span>
        <span>Essay</span>
      </Button>
      <Button
        variant={questionType === "matching" ? "default" : "outline"}
        className="h-24 flex flex-col gap-2"
        onClick={() => setQuestionType("matching")}
      >
        <span className="text-2xl">🔄</span>
        <span>Matching</span>
      </Button>
    </div>
  );
};
