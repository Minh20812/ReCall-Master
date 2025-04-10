import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, Eye, Trash2, Star, Edit } from "lucide-react";
import { useGetTopicsQuery } from "@/redux/api/topicApi";
import { useDeleteQuestionMutation } from "@/redux/api/questionApi";
import { QuestionsTablePagination } from "./QuestionsTablePagination";
import { useState } from "react";
import QuestionModalInfo from "./QuestionModalInfo";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export function QuestionsTable({
  tabValue,
  questionsData,
  isQuestionsLoading,
  page,
  pageSize,
  onPageChange,
  refetchQuestions,
}) {
  // State for modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const navigate = useNavigate(); // For navigation to edit page

  // Get topics for name lookup
  const { data: topics, isLoading: topicsLoading } = useGetTopicsQuery();

  // Add this to get current user info
  const { userInfo } = useSelector((state) => state.auth);

  // Delete question mutation
  const [deleteQuestion] = useDeleteQuestionMutation();

  // Handler for question deletion
  const handleDeleteQuestion = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(id).unwrap();
        toast.success("Question deleted successfully");
        refetchQuestions();
      } catch (err) {
        toast.error(err.data?.message || "Failed to delete question");
      }
    }
  };

  // Handler for opening question modal
  const handleViewQuestion = (question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  // Handler for editing question
  const handleEditQuestion = (question) => {
    // Navigate to the edit question page with the question ID
    navigate(`/questions/edit/${question._id}`, { state: { question } });
  };

  // Get the questions to display based on the selected tab
  const getTabQuestions = (tabValue) => {
    if (!questionsData || !questionsData.questions) return [];

    // All questions tab
    if (tabValue === "all") return questionsData.questions;

    // Due for review tab
    if (tabValue === "due") {
      const today = new Date().toISOString().split("T")[0];
      return questionsData.questions.filter((q) => {
        const nextReview = calculateNextReview(q.createdAt, q.difficulty);
        return nextReview <= today;
      });
    }

    // Filter by question type
    return questionsData.questions.filter((q) => q.type === tabValue);
  };

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

  // Calculate next review date
  const calculateNextReview = (createdAt, difficulty) => {
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
  };

  // Format review type based on difficulty
  const getReviewType = (difficulty) => {
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

  const questions = getTabQuestions(tabValue);

  return (
    <>
      {/* Question Modal */}
      <QuestionModalInfo
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        question={selectedQuestion}
        onEdit={handleEditQuestion}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead className="w-[120px]">Type</TableHead>
            <TableHead className="w-[120px]">Topic</TableHead>
            <TableHead className="w-[120px]">Difficulty</TableHead>
            <TableHead className="w-[150px]">Next Review</TableHead>
            <TableHead className="w-[180px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isQuestionsLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Loading questions...
              </TableCell>
            </TableRow>
          ) : questions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No{" "}
                {tabValue === "due"
                  ? "questions due for review"
                  : tabValue === "all"
                  ? "questions"
                  : `${tabValue.replace("_", " ")} questions`}{" "}
                found.
              </TableCell>
            </TableRow>
          ) : (
            questions.map((question) => {
              // Find topic name from the topics list with flexible matching
              const topicName =
                !topicsLoading && topics
                  ? topics.find((t) => {
                      // Handle both string ID and object ID formats
                      const topicId =
                        typeof t._id === "object" ? t._id.$oid : t._id;
                      const questionTopicId =
                        typeof question.topic === "object"
                          ? question.topic.$oid
                          : question.topic;
                      return topicId === questionTopicId;
                    })?.name || "Uncategorized"
                  : "Loading...";

              // Calculate next review date
              const nextReview = calculateNextReview(
                question.createdAt,
                question.difficulty
              );
              const reviewType = getReviewType(question.difficulty);

              return (
                <TableRow key={question._id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="line-clamp-2">{question.content}</span>
                      {question.tags && question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {question.tags.map((tag, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize">
                        {question.type === "multiple_choice"
                          ? "Multiple Choice"
                          : question.type === "true_false"
                          ? "True/False"
                          : question.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{topicName}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {renderDifficultyStars(question.difficulty)}
                        </TooltipTrigger>
                        <TooltipContent>
                          {formatDifficulty(question.difficulty)}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary">
                        {reviewType}
                      </span>
                      <span>{new Date(nextReview).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-blue-500 cursor-pointer"
                        onClick={() => handleViewQuestion(question)}
                      >
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>

                      {canModifyQuestion(question) && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-green-500 cursor-pointer"
                            onClick={() => handleEditQuestion(question)}
                          >
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-red-500 cursor-pointer"
                            onClick={() => handleDeleteQuestion(question._id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Pagination controls for All Questions tab only */}
      {tabValue === "all" && questionsData && questionsData.pagination && (
        <QuestionsTablePagination
          pagination={questionsData.pagination}
          page={page}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
