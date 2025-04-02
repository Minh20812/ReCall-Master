import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { Camera, Mic, Upload } from "lucide-react";
import { useCreateQuestionMutation } from "@/redux/api/questionApi";
import { useGetTopicsQuery } from "@/redux/api/topicApi"; // Assuming you have this

export function QuickAddQuestion({ onQuestionsSave }) {
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [step, setStep] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    content: "",
    type: "multiple_choice",
    topic: "",
    difficulty: 3,
    priority: 3,
    answers: [],
    tags: [],
    media: [],
  });
  const [excelQuestions, setExcelQuestions] = useState([]);

  const isMobile = useIsMobile();
  const [createQuestion] = useCreateQuestionMutation();
  const { data: topics, isLoading: topicsLoading } = useGetTopicsQuery();

  // Handle option changes for multiple choice
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

  // Handle file upload for Excel import
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const formattedQuestions = jsonData.map((row) => {
        // Create answers array in correct format
        const answers = [];

        if (row["A"])
          answers.push({
            content: row["A"],
            isCorrect: row["Answer"] === "A",
            explanation: "",
          });
        if (row["B"])
          answers.push({
            content: row["B"],
            isCorrect: row["Answer"] === "B",
            explanation: "",
          });
        if (row["C"])
          answers.push({
            content: row["C"],
            isCorrect: row["Answer"] === "C",
            explanation: "",
          });
        if (row["D"])
          answers.push({
            content: row["D"],
            isCorrect: row["Answer"] === "D",
            explanation: "",
          });

        return {
          content: row["Question"] || "",
          type: "multiple_choice",
          answers,
          difficulty: row["Difficulty"]
            ? parseInt(row["Difficulty"]) || 3
            : row["Difficulty"] === "easy"
            ? 1
            : row["Difficulty"] === "medium"
            ? 3
            : row["Difficulty"] === "hard"
            ? 5
            : 3,
          topic: row["Topic"] || "",
          priority: 3,
          tags: [],
          media: [],
        };
      });

      setExcelQuestions(formattedQuestions);
    };

    reader.readAsArrayBuffer(file);
  };

  // Save question to backend
  const handleSaveQuestions = () => {
    // Prepare question data
    const questionData = {
      ...currentQuestion,
      // Convert string difficulty to number if needed
      difficulty:
        typeof currentQuestion.difficulty === "string"
          ? parseInt(currentQuestion.difficulty)
          : currentQuestion.difficulty,
    };

    // Create question
    createQuestion(questionData)
      .unwrap()
      .then((res) => {
        console.log("Question created:", res);
        onQuestionsSave(res);

        // Reset form
        setCurrentQuestion({
          content: "",
          type: "multiple_choice",
          topic: "",
          difficulty: 3,
          priority: 3,
          answers: [],
          tags: [],
          media: [],
        });
        setStep(0);
        setIsDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error creating question:", error);
      });
  };

  // Save imported questions from Excel
  const handleSaveImportedQuestions = () => {
    // Save all questions from Excel one by one
    const promises = excelQuestions.map((question) =>
      createQuestion(question).unwrap()
    );

    Promise.all(promises)
      .then((responses) => {
        console.log("All questions created:", responses);
        onQuestionsSave(responses);
        setExcelQuestions([]);
        setIsDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error creating questions:", error);
      });
  };

  // Initialize answers based on question type
  useEffect(() => {
    if (questionType === "multiple_choice") {
      // Initialize with 4 empty answer options
      setCurrentQuestion((prev) => ({
        ...prev,
        type: "multiple_choice",
        answers: prev.answers.length
          ? prev.answers
          : [
              { content: "", isCorrect: false, explanation: "" },
              { content: "", isCorrect: false, explanation: "" },
              { content: "", isCorrect: false, explanation: "" },
              { content: "", isCorrect: false, explanation: "" },
            ],
      }));
    } else if (questionType === "true_false") {
      // Initialize with True/False options
      setCurrentQuestion((prev) => ({
        ...prev,
        type: "true_false",
        answers: [
          { content: "True", isCorrect: false, explanation: "" },
          { content: "False", isCorrect: false, explanation: "" },
        ],
      }));
    } else if (questionType === "essay") {
      // Essay questions don't have predefined answers
      setCurrentQuestion((prev) => ({
        ...prev,
        type: "essay",
        answers: [],
      }));
    }
  }, [questionType]);

  const renderQuestionTypeStep = () => (
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

  const renderQuestionDetailsStep = () => (
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
          <Select
            value={currentQuestion.topic}
            onValueChange={(value) =>
              setCurrentQuestion((prev) => ({ ...prev, topic: value }))
            }
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
                topics?.map((topic) => (
                  <SelectItem key={topic._id} value={topic._id}>
                    {topic.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
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

  const renderMultipleChoiceStep = () => (
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

  const renderEssayStep = () => (
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

  const renderExcelImportStep = () => (
    <div className="p-4">
      <div className="flex items-center justify-center w-full">
        <Label
          htmlFor="excel-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Excel files (.xlsx) supported
            </p>
          </div>
          <Input
            id="excel-upload"
            type="file"
            className="hidden"
            accept=".xlsx"
            onChange={handleFileUpload}
          />
        </Label>
      </div>
      {excelQuestions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-semibold">
            Preview ({excelQuestions.length} questions)
          </h3>
          <div className="max-h-64 overflow-y-auto">
            <ul className="mt-2 space-y-1">
              {excelQuestions.map((q, index) => (
                <li key={index} className="border p-2 rounded">
                  <strong>Q{index + 1}:</strong> {q.content}
                  {q.type === "multiple_choice" && (
                    <>
                      <br />
                      <strong>Options:</strong>{" "}
                      {q.answers.map((a) => a.content).join(" | ")}
                      <br />
                      <strong>Correct:</strong>{" "}
                      {q.answers
                        .filter((a) => a.isCorrect)
                        .map((a) => a.content)
                        .join(", ")}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <Button
            className="mt-4 w-full"
            onClick={handleSaveImportedQuestions}
            disabled={excelQuestions.length === 0}
          >
            Save All Questions
          </Button>
        </div>
      )}
    </div>
  );

  const steps = [
    { title: "Question Type", render: renderQuestionTypeStep },
    { title: "Question Details", render: renderQuestionDetailsStep },
    {
      title: "Answer Options",
      render:
        questionType === "essay" ? renderEssayStep : renderMultipleChoiceStep,
    },
    { title: "Import from Excel", render: renderExcelImportStep },
  ];

  const MobileContent = () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Add Question</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Add New Question</DrawerTitle>
            <DrawerDescription>
              Step {step + 1} of {steps.length}: {steps[step].title}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{steps[step].render()}</div>
          <DrawerFooter>
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
              >
                Back
              </Button>
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)}>Next</Button>
              ) : (
                <Button onClick={handleSaveQuestions}>Save Question</Button>
              )}
            </div>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );

  const DesktopContent = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Question</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
          <DialogDescription>
            Create a new question for your learning system
          </DialogDescription>
        </DialogHeader>
        <Tabs
          value={questionType}
          onValueChange={(value) => setQuestionType(value)}
          className="pt-2"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="multiple_choice">Multiple Choice</TabsTrigger>
            <TabsTrigger value="true_false">True/False</TabsTrigger>
            <TabsTrigger value="essay">Essay</TabsTrigger>
            <TabsTrigger value="import">Import Excel</TabsTrigger>
          </TabsList>
          <TabsContent value="multiple_choice" className="space-y-4 pt-4">
            {renderQuestionDetailsStep()}
            {renderMultipleChoiceStep()}
          </TabsContent>
          <TabsContent value="true_false" className="space-y-4 pt-4">
            {renderQuestionDetailsStep()}
            {renderMultipleChoiceStep()}
          </TabsContent>
          <TabsContent value="essay" className="space-y-4 pt-4">
            {renderQuestionDetailsStep()}
            {renderEssayStep()}
          </TabsContent>
          <TabsContent value="matching" className="space-y-4 pt-4">
            {renderQuestionDetailsStep()}
            {/* Add matching specific UI here */}
            <div className="p-4 text-center text-gray-500">
              Matching question UI coming soon...
            </div>
          </TabsContent>
          <TabsContent value="import" className="space-y-4 pt-4">
            {renderExcelImportStep()}
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSaveQuestions}
            disabled={questionType === "import"}
          >
            Save Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return isMobile ? <MobileContent /> : <DesktopContent />;
}
