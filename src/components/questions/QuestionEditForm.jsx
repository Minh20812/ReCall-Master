import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  useUpdateQuestionMutation,
  useGetQuestionDetailsQuery,
} from "@/redux/api/questionApi";
import { useGetTopicsQuery } from "@/redux/api/topicApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Plus,
  AlertCircle,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Tag,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const QuestionEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get question from location state or fetch it
  const initialQuestion = location.state?.question;

  const { data: fetchedQuestion, isLoading: isQuestionLoading } =
    useGetQuestionDetailsQuery(id, {
      skip: !!initialQuestion,
    });

  const { data: topics, isLoading: isTopicsLoading } = useGetTopicsQuery();
  const [updateQuestion, { isLoading: isUpdating, isSuccess, error }] =
    useUpdateQuestionMutation();

  const [formData, setFormData] = useState({
    content: "",
    type: "multiple_choice",
    difficulty: 3,
    topic: "",
    tags: [],
    answers: [
      { content: "", isCorrect: true, explanation: "" },
      { content: "", isCorrect: false, explanation: "" },
    ],
  });

  const [tagInput, setTagInput] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [activeTab, setActiveTab] = useState("question");

  // Load question data when available
  useEffect(() => {
    const questionData = initialQuestion || fetchedQuestion;
    if (questionData) {
      // Ensure answers array has at least 2 items for multiple choice
      const answers = [...(questionData.answers || [])];
      if (answers.length < 2 && questionData.type === "multiple_choice") {
        answers.push({ content: "", isCorrect: false, explanation: "" });
      }

      setFormData({
        ...questionData,
        answers,
      });
    }
  }, [initialQuestion, fetchedQuestion]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    // If changing question type
    if (name === "type") {
      let answers = [...formData.answers];

      // Adjust answers for different question types
      if (value === "true_false") {
        // For true/false, only need two options
        answers = [
          {
            content: "True",
            isCorrect: formData.answers[0]?.isCorrect || false,
            explanation: formData.answers[0]?.explanation || "",
          },
          {
            content: "False",
            isCorrect: !formData.answers[0]?.isCorrect || false,
            explanation: formData.answers[1]?.explanation || "",
          },
        ];
      } else if (value === "multiple_choice" && answers.length < 2) {
        // For multiple choice, ensure we have at least 2 options
        while (answers.length < 2) {
          answers.push({ content: "", isCorrect: false, explanation: "" });
        }
      }

      setFormData({
        ...formData,
        [name]: value,
        answers,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle answer changes
  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = [...formData.answers];
    updatedAnswers[index] = {
      ...updatedAnswers[index],
      [field]: value,
    };

    // If setting an answer as correct, make sure others are set to false for single select
    if (field === "isCorrect" && value === true) {
      updatedAnswers.forEach((answer, i) => {
        if (i !== index) {
          updatedAnswers[i] = { ...answer, isCorrect: false };
        }
      });
    }

    setFormData({
      ...formData,
      answers: updatedAnswers,
    });
  };

  // Add a new answer option
  const addAnswer = () => {
    setFormData({
      ...formData,
      answers: [
        ...formData.answers,
        { content: "", isCorrect: false, explanation: "" },
      ],
    });
  };

  // Remove an answer option
  const removeAnswer = (index) => {
    // Don't remove if it would leave less than 2 options for multiple choice
    if (formData.type === "multiple_choice" && formData.answers.length <= 2) {
      return;
    }

    const updatedAnswers = formData.answers.filter((_, i) => i !== index);

    // If we removed the correct answer, make the first one correct
    const hasCorrect = updatedAnswers.some((answer) => answer.isCorrect);
    if (!hasCorrect && updatedAnswers.length > 0) {
      updatedAnswers[0].isCorrect = true;
    }

    setFormData({
      ...formData,
      answers: updatedAnswers,
    });
  };

  // Handle tag input
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        });
      }
      setTagInput("");
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.content.trim()) {
      errors.content = "Question content is required";
    }

    if (!formData.topic) {
      errors.topic = "Topic is required";
    }

    const hasCorrectAnswer = formData.answers.some(
      (answer) => answer.isCorrect
    );
    if (!hasCorrectAnswer) {
      errors.answers = "At least one answer must be marked as correct";
    }

    const emptyAnswers = formData.answers.some(
      (answer) => !answer.content.trim()
    );
    if (emptyAnswers) {
      errors.answerContent = "All answer options must have content";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Switch to the tab with errors
      if (validationErrors.content || validationErrors.topic) {
        setActiveTab("question");
      } else if (validationErrors.answers || validationErrors.answerContent) {
        setActiveTab("answers");
      }
      return;
    }

    try {
      await updateQuestion({
        ...formData,
        questionId: id,
      }).unwrap();

      toast.success("Question updated successfully");
      // Navigate back to questions list on successful update
      navigate("/questions");
    } catch (err) {
      toast.error(
        err.data?.message ||
          "Failed to update question or Not authorized to update this question"
      );
    }
  };

  // Loading state
  if (isQuestionLoading || (isTopicsLoading && !initialQuestion)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading question data...</div>
      </div>
    );
  }

  // Get difficulty label
  const getDifficultyLabel = (level) => {
    const labels = {
      1: "Very Easy",
      2: "Easy",
      3: "Medium",
      4: "Hard",
      5: "Very Hard",
    };
    return labels[level] || "Medium";
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center mb-6 gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/questions")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Question</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.data?.message ||
              "Failed to update question or Not authorized to update this question. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Question updated successfully.</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle>Question Editor</CardTitle>
            <CardDescription>
              Update the question information and answer options.
            </CardDescription>
          </CardHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="px-6">
              <TabsList className="grid grid-cols-2 w-full max-w-md">
                <TabsTrigger
                  value="question"
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Question Details</span>
                </TabsTrigger>
                <TabsTrigger
                  value="answers"
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Answer Options</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="question" className="m-0 pt-4">
              <CardContent className="space-y-6">
                {/* Question content */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="content" className="text-base font-medium">
                      Question Content
                    </Label>
                    {validationErrors.content && (
                      <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.content}
                      </span>
                    )}
                  </div>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className={`min-h-[120px] ${
                      validationErrors.content
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                    placeholder="Enter your question here..."
                  />
                </div>

                {/* Topic and Type selectors - side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="topic" className="text-base font-medium">
                        Topic
                      </Label>
                      {validationErrors.topic && (
                        <span className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {validationErrors.topic}
                        </span>
                      )}
                    </div>
                    <Select
                      value={formData.topic}
                      onValueChange={(value) =>
                        handleSelectChange("topic", value)
                      }
                    >
                      <SelectTrigger
                        className={
                          validationErrors.topic
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics?.map((topic) => (
                          <SelectItem key={topic._id} value={topic._id}>
                            {topic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-base font-medium">
                      Question Type
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleSelectChange("type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple_choice">
                          Multiple Choice
                        </SelectItem>
                        <SelectItem value="true_false">True/False</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Difficulty */}
                <div className="space-y-3">
                  <Label htmlFor="difficulty" className="text-base font-medium">
                    Difficulty Level:{" "}
                    <span className="font-normal">
                      {getDifficultyLabel(formData.difficulty)}
                    </span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Very Easy</span>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={formData.difficulty}
                        onChange={(e) =>
                          handleSelectChange(
                            "difficulty",
                            Number.parseInt(e.target.value)
                          )
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <span className="text-sm">Very Hard</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="tags" className="text-base font-medium">
                      Tags
                    </Label>
                    <Tag className="h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3 min-h-[36px]">
                    {formData.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1 text-sm"
                      >
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer ml-1 hover:text-red-500"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                    {formData.tags.length === 0 && (
                      <span className="text-sm text-gray-400 italic">
                        No tags added yet
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      id="tagInput"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Add tags (press Enter)"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTag}
                      disabled={!tagInput.trim()}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add relevant tags to help categorize this question.
                  </p>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="answers" className="m-0 pt-4">
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-medium">Answer Options</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            {formData.type === "multiple_choice"
                              ? "Select one correct answer and provide explanations for each option."
                              : "Select whether True or False is the correct answer."}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {formData.type === "multiple_choice" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addAnswer}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" /> Add Option
                    </Button>
                  )}
                </div>

                {(validationErrors.answers ||
                  validationErrors.answerContent) && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {validationErrors.answers ||
                        validationErrors.answerContent}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-6">
                  <RadioGroup
                    value={formData.answers
                      .findIndex((a) => a.isCorrect)
                      .toString()}
                    onValueChange={(value) => {
                      const index = Number.parseInt(value);
                      formData.answers.forEach((_, i) => {
                        handleAnswerChange(i, "isCorrect", i === index);
                      });
                    }}
                    className="space-y-4"
                  >
                    {formData.answers.map((answer, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 transition-all ${
                          answer.isCorrect
                            ? "border-green-200 bg-green-50 dark:text-black"
                            : "hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="pt-1">
                            <input
                              type="radio"
                              id={`correct-${index}`}
                              name="correctAnswer"
                              checked={answer.isCorrect}
                              onChange={() =>
                                handleAnswerChange(index, "isCorrect", true)
                              }
                              className="h-4 w-4"
                            />
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                              <Label
                                htmlFor={`correct-${index}`}
                                className={`text-sm font-medium ${
                                  answer.isCorrect ? "text-green-700" : ""
                                }`}
                              >
                                {answer.isCorrect
                                  ? "Correct Answer"
                                  : "Answer Option"}
                              </Label>

                              {formData.type === "multiple_choice" &&
                                formData.answers.length > 2 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeAnswer(index)}
                                    className="text-red-500 h-8 px-2 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                            </div>

                            <div className="space-y-2">
                              <Input
                                id={`answer-${index}`}
                                value={answer.content}
                                onChange={(e) =>
                                  handleAnswerChange(
                                    index,
                                    "content",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter answer option"
                                disabled={formData.type === "true_false"}
                                className={
                                  validationErrors.answerContent &&
                                  !answer.content.trim()
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor={`explanation-${index}`}
                                className="text-sm"
                              >
                                Explanation{" "}
                                {answer.isCorrect
                                  ? "(Why this is correct)"
                                  : "(Why this is incorrect)"}
                              </Label>
                              <Textarea
                                id={`explanation-${index}`}
                                value={answer.explanation}
                                onChange={(e) =>
                                  handleAnswerChange(
                                    index,
                                    "explanation",
                                    e.target.value
                                  )
                                }
                                placeholder={
                                  answer.isCorrect
                                    ? "Explain why this is the correct answer"
                                    : "Explain why this answer is incorrect"
                                }
                                rows={2}
                                className="min-h-[80px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>

          <Separator className="my-2" />

          <CardFooter className="flex justify-between py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/questions")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="min-w-[120px]"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default QuestionEditForm;
