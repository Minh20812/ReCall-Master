import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCreateQuestionMutation } from "@/redux/api/questionApi";
import { useGetTopicsQuery } from "@/redux/api/topicApi";
import MobileQuestionForm from "./MobileQuestionForm";
import DesktopQuestionForm from "./DesktopQuestionForm";
import { initialQuestionState } from "../../utils/questionUtils";

export function QuickAddQuestion({ onQuestionsSave }) {
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [step, setStep] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewTopicDialogOpen, setIsNewTopicDialogOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestionState);
  const [excelQuestions, setExcelQuestions] = useState([]);

  const isMobile = useIsMobile();
  const [createQuestion] = useCreateQuestionMutation();
  const {
    data: topics,
    isLoading: topicsLoading,
    refetch: refetchTopics,
  } = useGetTopicsQuery();

  // Save question to backend
  const handleSaveQuestions = () => {
    // Prepare question data
    const questionData = {
      ...currentQuestion,
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
        onQuestionsSave([res]); // Pass as an array with a single element

        // Reset form
        setCurrentQuestion(initialQuestionState);
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

  // Common props to pass to mobile and desktop components
  const commonProps = {
    questionType,
    setQuestionType,
    step,
    setStep,
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
    createQuestion,
  };

  return isMobile ? (
    <MobileQuestionForm {...commonProps} />
  ) : (
    <DesktopQuestionForm {...commonProps} />
  );
}

export default QuickAddQuestion;
