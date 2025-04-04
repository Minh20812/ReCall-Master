import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { QuestionTypeSelector } from "./QuestionTypeSelector";
import { QuestionDetails } from "./QuestionDetails";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";
import { EssayOptions } from "./EssayOptions";
import { ExcelImport } from "./ExcelImport";
import { NewTopicDialog } from "./NewTopicDialog";
import { initializeAnswers } from "../../utils/questionUtils";

const MobileQuestionForm = ({
  questionType,
  setQuestionType,
  step,
  setStep,
  isNewTopicDialogOpen,
  setIsNewTopicDialogOpen,
  newTopicName,
  setNewTopicName,
  currentQuestion,
  setCurrentQuestion,
  excelQuestions,
  setExcelQuestions,
  topics,
  topicsLoading,
  refetchTopics,
  handleSaveQuestions,
  handleSaveImportedQuestions,
  createTopic,
}) => {
  // Initialize answers based on question type when it changes
  useEffect(() => {
    const answers = initializeAnswers(questionType, currentQuestion.answers);
    setCurrentQuestion((prev) => ({
      ...prev,
      type: questionType,
      answers,
    }));
  }, [questionType]);

  const steps = [
    {
      title: "Question Type",
      render: () => (
        <QuestionTypeSelector
          questionType={questionType}
          setQuestionType={setQuestionType}
        />
      ),
    },
    {
      title: "Question Details",
      render: () => (
        <QuestionDetails
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          topics={topics}
          topicsLoading={topicsLoading}
          onCreateNewTopic={() => setIsNewTopicDialogOpen(true)}
        />
      ),
    },
    {
      title: "Answer Options",
      render: () =>
        questionType === "essay" ? (
          <EssayOptions
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
          />
        ) : (
          <MultipleChoiceOptions
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            questionType={questionType}
          />
        ),
    },
    {
      title: "Import from Excel",
      render: () => (
        <ExcelImport
          excelQuestions={excelQuestions}
          setExcelQuestions={setExcelQuestions}
          handleSaveImportedQuestions={handleSaveImportedQuestions}
        />
      ),
    },
  ];

  return (
    <>
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

      <NewTopicDialog
        isOpen={isNewTopicDialogOpen}
        setIsOpen={setIsNewTopicDialogOpen}
        topicName={newTopicName}
        setTopicName={setNewTopicName}
        onCreateTopic={() => {
          if (!newTopicName.trim()) return;

          createTopic({
            name: newTopicName.trim(),
            description: "Created from question editor",
            icon: "BookOpen",
          })
            .unwrap()
            .then((res) => {
              setCurrentQuestion((prev) => ({ ...prev, topic: res._id }));
              setNewTopicName("");
              setIsNewTopicDialogOpen(false);
              refetchTopics();
            })
            .catch((error) => {
              console.error("Error creating topic:", error);
            });
        }}
      />
    </>
  );
};

export default MobileQuestionForm;
