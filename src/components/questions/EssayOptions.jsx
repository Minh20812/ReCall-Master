import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const EssayOptions = ({ currentQuestion, setCurrentQuestion }) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="model-answer">Model Answer</Label>
        <Textarea
          id="model-answer"
          placeholder="Enter the model answer here..."
          rows={4}
          value={currentQuestion.modelAnswer || ""}
          onChange={(e) =>
            setCurrentQuestion((prev) => ({
              ...prev,
              modelAnswer: e.target.value,
            }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="explanation">Explanation</Label>
        <Textarea
          id="explanation"
          placeholder="Enter explanation for grading..."
          rows={3}
          value={currentQuestion.explanation || ""}
          onChange={(e) =>
            setCurrentQuestion((prev) => ({
              ...prev,
              explanation: e.target.value,
            }))
          }
        />
      </div>
    </div>
  );
};
