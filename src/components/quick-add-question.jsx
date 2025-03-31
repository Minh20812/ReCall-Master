import React, { useState } from "react";
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

export function QuickAddQuestion({ onQuestionsSave }) {
  const [questionType, setQuestionType] = useState("multiple-choice");
  const [step, setStep] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    type: "multiple-choice",
    category: "",
    difficulty: "medium",
    options: ["", "", "", ""],
  });
  const [excelQuestions, setExcelQuestions] = useState([]);

  const isMobile = useIsMobile();

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
        const options = [row["A"], row["B"], row["C"], row["D"]].filter(
          Boolean
        );
        const answerIndex = ["A", "B", "C", "D"].indexOf(row["Answer"]);
        return {
          question: row["Question"] || "",
          type: "multiple-choice",
          options,
          answer: answerIndex !== -1 ? options[answerIndex] : "",
          category: row["Category"] || "other",
          difficulty: row["Difficulty"] || "medium",
        };
      });

      setExcelQuestions(formattedQuestions);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSaveQuestions = () => {
    const finalQuestions =
      excelQuestions.length > 0 ? excelQuestions : [currentQuestion];

    if (onQuestionsSave) {
      onQuestionsSave(finalQuestions);
    }

    // Reset states
    setCurrentQuestion({
      question: "",
      type: "multiple-choice",
      category: "",
      difficulty: "medium",
      options: ["", "", "", ""],
    });
    setExcelQuestions([]);
    setIsDialogOpen(false);
  };

  const renderQuestionTypeStep = () => (
    <div className="grid grid-cols-2 gap-4 py-4">
      <Button
        variant={questionType === "multiple-choice" ? "default" : "outline"}
        className="h-24 flex flex-col gap-2"
        onClick={() => {
          setQuestionType("multiple-choice");
          setCurrentQuestion((prev) => ({ ...prev, type: "multiple-choice" }));
        }}
      >
        <span className="text-2xl">🔘</span>
        <span>Multiple Choice</span>
      </Button>
      <Button
        variant={questionType === "essay" ? "default" : "outline"}
        className="h-24 flex flex-col gap-2"
        onClick={() => {
          setQuestionType("essay");
          setCurrentQuestion((prev) => ({ ...prev, type: "essay" }));
        }}
      >
        <span className="text-2xl">📝</span>
        <span>Essay</span>
      </Button>
    </div>
  );

  const renderQuestionDetailsStep = () => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="question">Question</Label>
        <Textarea
          id="question"
          placeholder="Enter your question here..."
          value={currentQuestion.question}
          onChange={(e) =>
            setCurrentQuestion((prev) => ({
              ...prev,
              question: e.target.value,
            }))
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={currentQuestion.category}
            onValueChange={(value) =>
              setCurrentQuestion((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="biology">Biology</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="computer-science">Computer Science</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={currentQuestion.difficulty}
            onValueChange={(value) =>
              setCurrentQuestion((prev) => ({ ...prev, difficulty: value }))
            }
          >
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderMultipleChoiceStep = () => (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label>Answer Options</Label>
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...currentQuestion.options];
                  newOptions[index] = e.target.value;
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    options: newOptions,
                  }));
                }}
              />
              <Button
                variant={
                  currentQuestion.answer === option ? "default" : "outline"
                }
                size="icon"
                className="shrink-0"
                onClick={() =>
                  setCurrentQuestion((prev) => ({ ...prev, answer: option }))
                }
              >
                {currentQuestion.answer === option ? "✓" : ""}
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full"
          onClick={() => {
            const newOptions = [...currentQuestion.options, ""];
            setCurrentQuestion((prev) => ({ ...prev, options: newOptions }));
          }}
        >
          Add Option
        </Button>
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
        <Label htmlFor="keywords">Key Concepts/Keywords</Label>
        <Input
          id="keywords"
          placeholder="Enter keywords separated by commas"
          value={currentQuestion.keywords?.join(", ") || ""}
          onChange={(e) => {
            const keywords = e.target.value.split(",").map((k) => k.trim());
            setCurrentQuestion((prev) => ({ ...prev, keywords }));
          }}
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
                  <strong>Q{index + 1}:</strong> {q.question}
                  {q.type === "multiple-choice" && (
                    <>
                      <br />
                      <strong>Options:</strong> {q.options.join(" | ")}
                      <br />
                      <strong>Answer:</strong> {q.answer}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
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
        questionType === "multiple-choice"
          ? renderMultipleChoiceStep
          : renderEssayStep,
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
                <Button onClick={handleSaveQuestions}>Save Questions</Button>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="multiple-choice">Multiple Choice</TabsTrigger>
            <TabsTrigger value="essay">Essay</TabsTrigger>
            <TabsTrigger value="import">Import Excel</TabsTrigger>
          </TabsList>
          <TabsContent value="multiple-choice" className="space-y-4 pt-4">
            {renderQuestionDetailsStep()}
            {renderMultipleChoiceStep()}
          </TabsContent>
          <TabsContent value="essay" className="space-y-4 pt-4">
            {renderQuestionDetailsStep()}
            {renderEssayStep()}
          </TabsContent>
          <TabsContent value="import" className="space-y-4 pt-4">
            {renderExcelImportStep()}
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveQuestions}>
            Save Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return isMobile ? <MobileContent /> : <DesktopContent />;
}
