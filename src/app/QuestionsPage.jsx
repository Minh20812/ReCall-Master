import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { QuickAddQuestion } from "@/components/questions/QuickAddQuestion";
import { QuestionsFilter } from "@/components/questions/QuestionsFilter";
import { QuestionsTabs } from "@/components/questions/QuestionsTabs";
import { useGetQuestionsQuery } from "@/redux/api/questionApi";

export default function QuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch questions using Redux query
  const {
    data: questionsData,
    isLoading: isQuestionsLoading,
    refetch: refetchQuestions,
  } = useGetQuestionsQuery({
    keyword: searchQuery,
    topic: categoryFilter !== "all" ? categoryFilter : undefined,
    type: type !== "all" ? type : undefined,
    page,
    pageSize,
  });

  // Handler for question save from QuickAddQuestion component
  const handleQuestionsSave = () => {
    refetchQuestions();
  };

  // Handler for filter changes
  const handleFilterChange = (query, category) => {
    setSearchQuery(query);
    setCategoryFilter(category);
  };

  // Handler for pagination changes
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handler for tab/type changes
  const handleTypeChange = (newType) => {
    setType(newType);
  };

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Questions</h1>
          </div>
          <QuickAddQuestion onQuestionsSave={handleQuestionsSave}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </QuickAddQuestion>
        </div>

        <QuestionsFilter
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          onFilterChange={handleFilterChange}
        />

        <QuestionsTabs
          type={type}
          onTypeChange={handleTypeChange}
          questionsData={questionsData}
          isQuestionsLoading={isQuestionsLoading}
          page={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          refetchQuestions={refetchQuestions}
        />
      </div>
    </div>
  );
}
