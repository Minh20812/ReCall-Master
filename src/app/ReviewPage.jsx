import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Mic,
  XCircle,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function ReviewPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [essayAnswer, setEssayAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [selfEvaluation, setSelfEvaluation] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const isMobile = useIsMobile();
  const cardRef = useRef(null);

  // Mock questions data
  const questions = [
    {
      id: 1,
      type: "multiple-choice",
      question: "What is the function of mitochondria in a cell?",
      options: [
        "Cell division",
        "Protein synthesis",
        "Energy production",
        "Waste removal",
      ],
      correctAnswer: "Energy production",
      category: "Biology",
      reviewType: "2-day",
    },
    {
      id: 2,
      type: "essay",
      question: "Explain the concept of supply and demand in economics.",
      modelAnswer:
        "Supply and demand is a fundamental economic model that explains price determination in a market. It states that the price of a good will adjust until the quantity demanded equals the quantity supplied, resulting in an economic equilibrium.",
      category: "Economics",
      reviewType: "7-day",
    },
    {
      id: 3,
      type: "multiple-choice",
      question:
        "Which of the following is NOT a primary color in the RGB color model?",
      options: ["Red", "Green", "Yellow", "Blue"],
      correctAnswer: "Yellow",
      category: "Computer Science",
      reviewType: "30-day",
    },
  ];

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setEssayAnswer("");
      setShowAnswer(false);
      setSelfEvaluation(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer("");
      setEssayAnswer("");
      setShowAnswer(false);
      setSelfEvaluation(null);
    }
  };

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (showAnswer && currentQuestion < questions.length - 1) {
        handleNextQuestion();
      }
    },
    onSwipedRight: () => {
      if (currentQuestion > 0) {
        handlePreviousQuestion();
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  });

  // Simulate speech-to-text functionality
  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      // In a real app, this would stop recording and process the audio
      // For demo purposes, we'll just add some text after a delay
      setTimeout(() => {
        setEssayAnswer(
          (prev) =>
            prev +
            " Supply and demand is a basic economic concept that affects pricing of goods. When supply increases, prices tend to drop. When demand increases, prices tend to rise."
        );
      }, 500);
    } else {
      setIsRecording(true);
      // Vibration feedback for mobile devices
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    }
  };

  // Add haptic feedback for correct/incorrect answers
  useEffect(() => {
    if (showAnswer && navigator.vibrate && isMobile) {
      if (
        currentQuestionData.type === "multiple-choice" &&
        selectedAnswer === currentQuestionData.correctAnswer
      ) {
        navigator.vibrate([100, 50, 100]); // Success pattern
      } else if (
        currentQuestionData.type === "multiple-choice" &&
        selectedAnswer !== currentQuestionData.correctAnswer
      ) {
        navigator.vibrate(300); // Error pattern
      }
    }
  }, [showAnswer, currentQuestionData, selectedAnswer, isMobile]);

  return (
    <div className="container px-4 py-4 mx-auto max-w-4xl">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild className="h-8 px-2">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {!isMobile && "Back to Dashboard"}
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isMobile
                ? `~${questions.length * 5}m`
                : `Estimated time: ${questions.length * 5} minutes`}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Review Session</h2>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1}/{questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card
          className="overflow-hidden"
          ref={cardRef}
          {...(isMobile ? swipeHandlers : {})}
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl">
                {currentQuestionData.question}
              </CardTitle>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                  {currentQuestionData.category}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary">
                  {currentQuestionData.reviewType} Review
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className={cn("pt-6", isMobile && "px-3")}>
            {currentQuestionData.type === "multiple-choice" ? (
              <RadioGroup
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
                className="space-y-3"
              >
                {currentQuestionData.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                      showAnswer && option === currentQuestionData.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : showAnswer &&
                          selectedAnswer === option &&
                          option !== currentQuestionData.correctAnswer
                        ? "border-red-500 bg-red-50"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem
                      value={option}
                      id={`option-${index}`}
                      disabled={showAnswer}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer text-base font-medium"
                    >
                      {option}
                    </Label>
                    {showAnswer &&
                      option === currentQuestionData.correctAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    {showAnswer &&
                      selectedAnswer === option &&
                      option !== currentQuestionData.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="Type your answer here..."
                    value={essayAnswer}
                    onChange={(e) => setEssayAnswer(e.target.value)}
                    rows={6}
                    disabled={showAnswer}
                    className="w-full pr-10"
                  />
                  {isMobile && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className={cn(
                        "absolute right-2 bottom-2 h-8 w-8 rounded-full",
                        isRecording && "bg-red-100 text-red-500 "
                      )}
                      onClick={handleVoiceInput}
                    >
                      <Mic className="h-4 w-4" />
                      <span className="sr-only">Voice input</span>
                    </Button>
                  )}
                </div>

                {showAnswer && (
                  <div className="p-4 mt-4 space-y-2 rounded-lg bg-muted">
                    <h3 className="font-medium">Model Answer:</h3>
                    <p>{currentQuestionData.modelAnswer}</p>

                    <div className="pt-4">
                      <h3 className="mb-2 font-medium">How well did you do?</h3>
                      <div className="flex gap-2">
                        <Button
                          variant={
                            selfEvaluation === false ? "default" : "outline"
                          }
                          onClick={() => setSelfEvaluation(false)}
                          size="sm"
                          className="gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Needs Improvement
                        </Button>
                        <Button
                          variant={
                            selfEvaluation === true ? "default" : "outline"
                          }
                          onClick={() => setSelfEvaluation(true)}
                          size="sm"
                          className="gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Got It Right
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-4">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className={cn(isMobile && "px-3")}
            >
              {isMobile ? <ArrowLeft className="h-4 w-4" /> : "Previous"}
            </Button>
            <div>
              {!showAnswer ? (
                <Button
                  onClick={() => setShowAnswer(true)}
                  disabled={
                    currentQuestionData.type === "multiple-choice" &&
                    !selectedAnswer
                  }
                >
                  Check Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      {isMobile ? (
                        <ArrowRight className="h-4 w-4" />
                      ) : (
                        "Next Question"
                      )}
                    </>
                  ) : (
                    "Finish Review"
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        {isMobile && (
          <div className="text-xs text-center text-muted-foreground mt-2">
            Swipe left/right to navigate between questions
          </div>
        )}
      </div>
    </div>
  );
}
