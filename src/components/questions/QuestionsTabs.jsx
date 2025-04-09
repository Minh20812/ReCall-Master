import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionsTable } from "./QuestionsTable";

export function QuestionsTabs({
  type,
  onTypeChange,
  questionsData,
  isQuestionsLoading,
  page,
  pageSize,
  onPageChange,
  refetchQuestions,
}) {
  return (
    <div className="w-full">
      <Tabs defaultValue="all" className="w-full">
        <div className="overflow-x-auto scrollbar-thin">
          <TabsList className="flex min-w-max mb-1">
            <TabsTrigger
              value="all"
              onClick={() => onTypeChange("all")}
              className="px-3 py-1.5 text-sm"
            >
              All Questions
            </TabsTrigger>
            <TabsTrigger
              value="due"
              className="px-3 py-1.5 text-sm"
              onClick={() => onTypeChange("due")}
            >
              Due for Review
            </TabsTrigger>
            <TabsTrigger
              value="multiple_choice"
              onClick={() => onTypeChange("multiple_choice")}
              className="px-3 py-1.5 text-sm"
            >
              Multiple Choice
            </TabsTrigger>
            <TabsTrigger
              value="true_false"
              onClick={() => onTypeChange("true_false")}
              className="px-3 py-1.5 text-sm"
            >
              True/False
            </TabsTrigger>
            <TabsTrigger
              value="essay"
              onClick={() => onTypeChange("essay")}
              className="px-3 py-1.5 text-sm"
            >
              Essay
            </TabsTrigger>
          </TabsList>
        </div>

        {/* All Questions Tab */}
        <TabsContent value="all" className="border rounded-md mt-2">
          <QuestionsTable
            tabValue="all"
            questionsData={questionsData}
            isQuestionsLoading={isQuestionsLoading}
            page={page}
            pageSize={pageSize}
            onPageChange={onPageChange}
            refetchQuestions={refetchQuestions}
          />
        </TabsContent>

        {/* Other Tabs */}
        {["due", "multiple_choice", "true_false", "essay"].map((tabValue) => (
          <TabsContent
            key={tabValue}
            value={tabValue}
            className="border rounded-md mt-2"
          >
            <QuestionsTable
              tabValue={tabValue}
              questionsData={questionsData}
              isQuestionsLoading={isQuestionsLoading}
              refetchQuestions={refetchQuestions}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
