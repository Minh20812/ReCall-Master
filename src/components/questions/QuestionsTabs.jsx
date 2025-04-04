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
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all" onClick={() => onTypeChange("all")}>
          All Questions
        </TabsTrigger>
        <TabsTrigger value="due">Due for Review</TabsTrigger>
        <TabsTrigger
          value="multiple_choice"
          onClick={() => onTypeChange("multiple_choice")}
        >
          Multiple Choice
        </TabsTrigger>
        <TabsTrigger
          value="true_false"
          onClick={() => onTypeChange("true_false")}
        >
          True/False
        </TabsTrigger>
        <TabsTrigger value="essay" onClick={() => onTypeChange("essay")}>
          Essay
        </TabsTrigger>
      </TabsList>

      {/* All Questions Tab */}
      <TabsContent value="all" className="border rounded-md">
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
          className="border rounded-md"
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
  );
}
