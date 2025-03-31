import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, ListFilter, Plus, Search } from "lucide-react";
import { QuickAddQuestion } from "@/components/quick-add-question";
import { Link } from "react-router-dom";

export default function QuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // State để lưu trữ danh sách câu hỏi
  const [questions, setQuestions] = useState([
    // Dữ liệu mẫu ban đầu có thể giữ lại để có sẵn một số câu hỏi
    {
      id: 1,
      question: "What is the function of mitochondria in a cell?",
      type: "multiple-choice",
      category: "Biology",
      created: "2023-05-15",
      nextReview: "2023-05-17",
      reviewType: "2-day",
    },
    // ... các câu hỏi mẫu khác
  ]);

  // Hàm xử lý khi lưu câu hỏi mới từ QuickAddQuestion
  const handleQuestionsSave = (newQuestions) => {
    // Thêm các trường cần thiết cho mỗi câu hỏi mới
    const formattedQuestions = newQuestions.map((q, index) => {
      const today = new Date();
      const nextReview = new Date();
      nextReview.setDate(today.getDate() + 2); // Mặc định review sau 2 ngày

      return {
        id: questions.length + index + 1, // Tạo ID tự động
        question: q.question,
        type: q.type || "multiple-choice",
        category: q.category || "Other",
        created: today.toISOString().split("T")[0],
        nextReview: nextReview.toISOString().split("T")[0],
        reviewType: "2-day",
        // Lưu thêm các thông tin khác nếu có
        options: q.options,
        answer: q.answer,
        difficulty: q.difficulty,
        modelAnswer: q.modelAnswer,
        keywords: q.keywords,
      };
    });

    // Thêm câu hỏi mới vào state
    setQuestions((prevQuestions) => [...prevQuestions, ...formattedQuestions]);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      (q.category && q.category.toLowerCase() === categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // Lọc câu hỏi theo loại tab
  const getTabQuestions = (tabValue) => {
    if (tabValue === "all") return filteredQuestions;
    if (tabValue === "due") {
      const today = new Date().toISOString().split("T")[0];
      return filteredQuestions.filter((q) => q.nextReview <= today);
    }
    return filteredQuestions.filter((q) => q.type === tabValue);
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

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search questions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="w-[180px]">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <ListFilter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="computer-science">
                    Computer Science
                  </SelectItem>
                  <SelectItem value="economics">Economics</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Questions</TabsTrigger>
            <TabsTrigger value="due">Due for Review</TabsTrigger>
            <TabsTrigger value="multiple-choice">Multiple Choice</TabsTrigger>
            <TabsTrigger value="essay">Essay</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead className="w-[120px]">Category</TableHead>
                  <TableHead className="w-[150px]">Next Review</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getTabQuestions("all").length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No questions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  getTabQuestions("all").map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">
                        {question.question}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="capitalize">{question.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{question.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary">
                            {question.reviewType}
                          </span>
                          <span>
                            {new Date(question.nextReview).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="due" className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead className="w-[120px]">Category</TableHead>
                  <TableHead className="w-[150px]">Next Review</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getTabQuestions("due").length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No questions due for review.
                    </TableCell>
                  </TableRow>
                ) : (
                  getTabQuestions("due").map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">
                        {question.question}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="capitalize">{question.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{question.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary">
                            {question.reviewType}
                          </span>
                          <span>
                            {new Date(question.nextReview).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="multiple-choice" className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead className="w-[120px]">Category</TableHead>
                  <TableHead className="w-[150px]">Next Review</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getTabQuestions("multiple-choice").length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No multiple-choice questions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  getTabQuestions("multiple-choice").map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">
                        {question.question}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="capitalize">{question.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{question.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary">
                            {question.reviewType}
                          </span>
                          <span>
                            {new Date(question.nextReview).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="essay" className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead className="w-[120px]">Category</TableHead>
                  <TableHead className="w-[150px]">Next Review</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getTabQuestions("essay").length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No essay questions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  getTabQuestions("essay").map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">
                        {question.question}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="capitalize">{question.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{question.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary">
                            {question.reviewType}
                          </span>
                          <span>
                            {new Date(question.nextReview).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
