import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Star, Edit } from "lucide-react";
import { useSelector } from "react-redux";

const QuestionModalInfo = ({ question, isOpen, onClose, onEdit }) => {
  // Handle case when question is undefined
  if (!question) return null;

  // Add this to get current user info
  const { userInfo } = useSelector((state) => state.auth);

  // Add this helper function to check if user can edit/delete
  const canModifyQuestion = (question) => {
    if (!userInfo || !question) return false;
    return (
      userInfo.isAdmin || // Admin can modify all questions
      question.user === userInfo._id || // Check string ID
      question.user?._id === userInfo._id || // Check object ID
      question.user?.toString() === userInfo._id?.toString() // Compare as strings
    );
  };

  // Format difficulty level for display
  const formatDifficulty = (level) => {
    const levels = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard"];
    return levels[level - 1] || "Medium";
  };

  // Render stars for difficulty
  const renderDifficultyStars = (level) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < level ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Format priority level for display
  const formatPriority = (priority) => {
    const priorities = ["Low", "Medium-Low", "Medium", "Medium-High", "High"];
    const index = priority - 1;
    return index >= 0 && index < priorities.length
      ? priorities[index]
      : "Medium";
  };

  // Get the correct answer
  const correctAnswer =
    question.answers?.find((answer) => answer.isCorrect)?.content ||
    "No correct answer provided";

  // Find any explanations from answers
  const explanations =
    question.answers
      ?.filter(
        (answer) => answer.explanation && answer.explanation.trim() !== ""
      )
      .map((answer) => ({
        content: answer.content,
        explanation: answer.explanation,
        isCorrect: answer.isCorrect,
      })) || [];

  // Handle edit button click
  const handleEdit = () => {
    onEdit(question);
    onClose(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Question Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Question */}
          <div className="space-y-2">
            <h3 className="font-medium">Question</h3>
            <p className="text-sm">{question.content}</p>
          </div>

          {/* Answers */}
          <div className="space-y-2">
            <h3 className="font-medium">Answers</h3>
            <ul className="list-disc pl-5 space-y-1">
              {question.answers?.map((answer, idx) => (
                <li key={idx} className="text-sm">
                  {answer.content}
                  {answer.isCorrect && (
                    <Badge className="ml-2 bg-green-500">Correct</Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Type</h3>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm capitalize">
                  {question.type === "multiple_choice"
                    ? "Multiple Choice"
                    : question.type === "true_false"
                    ? "True/False"
                    : question.type}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Difficulty</h3>
              <div className="flex items-center gap-2">
                {renderDifficultyStars(question.difficulty)}
                <span className="text-sm">
                  {formatDifficulty(question.difficulty)}
                </span>
              </div>
            </div>
          </div>

          {/* Priority if available */}
          {question.priority && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Priority</h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    question.priority <= 2
                      ? "outline"
                      : question.priority === 3
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {formatPriority(question.priority)}
                </Badge>
              </div>
            </div>
          )}

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {question.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <h3 className="font-medium">Created</h3>
              <p>{new Date(question.createdAt).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">Last Updated</h3>
              <p>{new Date(question.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Explanations if available */}
          {explanations.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Explanations</h3>
              <div className="space-y-2">
                {explanations.map((item, idx) => (
                  <div key={idx} className="text-sm">
                    <p>
                      <span className="font-medium">{item.content}</span>
                      {item.isCorrect && (
                        <Badge className="ml-2 bg-green-500 text-xs">
                          Correct
                        </Badge>
                      )}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media files if available */}
          {question.media && question.media.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Media</h3>
              <div className="grid grid-cols-2 gap-2">
                {question.media.map((media, idx) => (
                  <div key={idx} className="border rounded p-2">
                    <p className="text-xs truncate">
                      {media.fileName || media.url}
                    </p>
                    {media.type && media.type.startsWith("image") && (
                      <img
                        src={media.url}
                        alt="Question media"
                        className="mt-1 w-full h-auto max-h-24 object-contain"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          {canModifyQuestion(question) && (
            <Button
              variant="outline"
              onClick={handleEdit}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" /> Edit
            </Button>
          )}

          <Button onClick={() => onClose(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionModalInfo;
