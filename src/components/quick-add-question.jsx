import { useState } from "react";
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
  DrawerDescription,
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
import { Camera, Mic } from "lucide-react";

export function QuickAddQuestion({ children }) {
  const [questionType, setQuestionType] = useState("multiple-choice");
  const [step, setStep] = useState(0);
  const isMobile = useIsMobile();

  const steps = [
    {
      title: "Question Type",
      description: "Choose the type of question you want to create",
    },
    {
      title: "Question Details",
      description: "Enter your question and category",
    },
    { title: "Answer Options", description: "Define the possible answers" },
  ];

  const MobileContent = () => (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Add New Question</DrawerTitle>
            <DrawerDescription>
              Step {step + 1} of {steps.length}: {steps[step].description}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            {step === 0 && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={
                      questionType === "multiple-choice" ? "default" : "outline"
                    }
                    className="h-24 flex flex-col gap-2"
                    onClick={() => setQuestionType("multiple-choice")}
                  >
                    <span className="text-2xl">🔘</span>
                    <span>Multiple Choice</span>
                  </Button>
                  <Button
                    variant={questionType === "essay" ? "default" : "outline"}
                    className="h-24 flex flex-col gap-2"
                    onClick={() => setQuestionType("essay")}
                  >
                    <span className="text-2xl">📝</span>
                    <span>Essay</span>
                  </Button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="question">Question</Label>
                  <div className="relative">
                    <Textarea
                      id="question"
                      placeholder="Enter your question here..."
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-2 h-8 w-8 rounded-full"
                    >
                      <Mic className="h-4 w-4" />
                      <span className="sr-only">Voice input</span>
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="computer-science">
                        Computer Science
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select defaultValue="medium">
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
                <div className="grid gap-2">
                  <Label htmlFor="image" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Add Image (Optional)
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                  />
                </div>
              </div>
            )}

            {step === 2 && questionType === "multiple-choice" && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Answer Options</Label>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex gap-2">
                        <Input placeholder={`Option ${i}`} />
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0"
                        >
                          {i === 1 ? "✓" : ""}
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && questionType === "essay" && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="model-answer">Model Answer</Label>
                  <div className="relative">
                    <Textarea
                      id="model-answer"
                      placeholder="Enter the model answer here..."
                      rows={4}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-2 h-8 w-8 rounded-full"
                    >
                      <Mic className="h-4 w-4" />
                      <span className="sr-only">Voice input</span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Key Concepts/Keywords</Label>
                  <Input
                    id="keywords"
                    placeholder="Enter keywords separated by commas"
                  />
                </div>
              </div>
            )}
          </div>
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
                <Button type="submit">Save Question</Button>
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
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
          <DialogDescription>
            Create a new question for your spaced repetition learning.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue="multiple-choice"
          onValueChange={setQuestionType}
          className="pt-2"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="multiple-choice">Multiple Choice</TabsTrigger>
            <TabsTrigger value="essay">Essay</TabsTrigger>
          </TabsList>
          <TabsContent value="multiple-choice" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="question-mc">Question</Label>
              <Textarea
                id="question-mc"
                placeholder="Enter your question here..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category-mc">Category</Label>
                <Select>
                  <SelectTrigger id="category-mc">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="computer-science">
                      Computer Science
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty-mc">Difficulty</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="difficulty-mc">
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
            <div className="space-y-2">
              <Label>Answer Options</Label>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-2">
                    <Input placeholder={`Option ${i}`} />
                    <Button variant="outline" size="icon" className="shrink-0">
                      {i === 1 ? "✓" : ""}
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Add Option
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="essay" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="question-essay">Question</Label>
              <Textarea
                id="question-essay"
                placeholder="Enter your question here..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category-essay">Category</Label>
                <Select>
                  <SelectTrigger id="category-essay">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="computer-science">
                      Computer Science
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty-essay">Difficulty</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="difficulty-essay">
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
            <div className="space-y-2">
              <Label htmlFor="model-answer">Model Answer</Label>
              <Textarea
                id="model-answer"
                placeholder="Enter the model answer here..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Key Concepts/Keywords</Label>
              <Input
                id="keywords"
                placeholder="Enter keywords separated by commas"
              />
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button type="submit">Save Question</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return isMobile ? <MobileContent /> : <DesktopContent />;
}
