import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const QuestionDetails = ({
  currentQuestion,
  setCurrentQuestion,
  topics,
  topicsLoading,
  onCreateNewTopic,
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="question">Question Content</Label>
        <Textarea
          id="question"
          placeholder="Enter your question here..."
          value={currentQuestion.content}
          onChange={(e) =>
            setCurrentQuestion((prev) => ({
              ...prev,
              content: e.target.value,
            }))
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="topic">Topic</Label>
          <div className="flex gap-2">
            <Select
              value={currentQuestion.topic}
              onValueChange={(value) => {
                if (value === "create_new") {
                  onCreateNewTopic();
                } else {
                  setCurrentQuestion((prev) => ({ ...prev, topic: value }));
                }
              }}
              className="flex-1"
            >
              <SelectTrigger id="topic">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {topicsLoading ? (
                  <SelectItem value="" disabled>
                    Loading topics...
                  </SelectItem>
                ) : (
                  <>
                    {topics?.map((topic) => (
                      <SelectItem key={topic._id} value={topic._id}>
                        {topic.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="create_new" className="text-primary">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create new topic
                      </div>
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={onCreateNewTopic}
              title="Create new topic"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="difficulty">Difficulty (1-5)</Label>
          <Select
            value={currentQuestion.difficulty.toString()}
            onValueChange={(value) =>
              setCurrentQuestion((prev) => ({
                ...prev,
                difficulty: parseInt(value),
              }))
            }
          >
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 (Very Easy)</SelectItem>
              <SelectItem value="2">2 (Easy)</SelectItem>
              <SelectItem value="3">3 (Medium)</SelectItem>
              <SelectItem value="4">4 (Hard)</SelectItem>
              <SelectItem value="5">5 (Very Hard)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="priority">Priority (1-5)</Label>
        <Select
          value={currentQuestion.priority.toString()}
          onValueChange={(value) =>
            setCurrentQuestion((prev) => ({
              ...prev,
              priority: parseInt(value),
            }))
          }
        >
          <SelectTrigger id="priority">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 (Low)</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3 (Medium)</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5 (High)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
