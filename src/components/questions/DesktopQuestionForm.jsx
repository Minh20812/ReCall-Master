import React, { useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionDetails } from "./QuestionDetails";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";
import { EssayOptions } from "./EssayOptions";
import { ExcelImport } from "./ExcelImport";
import { NewTopicDialog } from "./NewTopicDialog";
import { initializeAnswers } from "../../utils/questionUtils";

const DesktopQuestionForm = ({
  questionType,
  setQuestionType,
  isDialogOpen,
  setIsDialogOpen,
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

  return (
    <>
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
              <QuestionDetails
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
                topics={topics}
                topicsLoading={topicsLoading}
                onCreateNewTopic={() => setIsNewTopicDialogOpen(true)}
              />
              <MultipleChoiceOptions
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
                questionType={questionType}
              />
            </TabsContent>
            <TabsContent value="true_false" className="space-y-4 pt-4">
              <QuestionDetails
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
                topics={topics}
                topicsLoading={topicsLoading}
                onCreateNewTopic={() => setIsNewTopicDialogOpen(true)}
              />
              <MultipleChoiceOptions
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
                questionType={questionType}
              />
            </TabsContent>
            <TabsContent value="essay" className="space-y-4 pt-4">
              <QuestionDetails
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
                topics={topics}
                topicsLoading={topicsLoading}
                onCreateNewTopic={() => setIsNewTopicDialogOpen(true)}
              />
              <EssayOptions
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
              />
            </TabsContent>
            <TabsContent value="matching" className="space-y-4 pt-4">
              <QuestionDetails
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
                topics={topics}
                topicsLoading={topicsLoading}
                onCreateNewTopic={() => setIsNewTopicDialogOpen(true)}
              />
              <div className="p-4 text-center text-gray-500">
                Matching question UI coming soon...
              </div>
            </TabsContent>
            <TabsContent value="import" className="space-y-4 pt-4">
              <ExcelImport
                excelQuestions={excelQuestions}
                setExcelQuestions={setExcelQuestions}
                handleSaveImportedQuestions={handleSaveImportedQuestions}
              />
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

      <NewTopicDialog
        isOpen={isNewTopicDialogOpen}
        setIsOpen={setIsNewTopicDialogOpen}
        newTopicName={newTopicName}
        setNewTopicName={setNewTopicName}
        onTopicCreated={(topicId) => {
          setCurrentQuestion((prev) => ({ ...prev, topic: topicId }));
        }}
        refetchTopics={refetchTopics}
      />
    </>
  );
};

export default DesktopQuestionForm;
