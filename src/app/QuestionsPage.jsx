import { useState } from "react";
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

  // Mock questions data
  const questions = [
    {
      id: 1,
      question: "What is the function of mitochondria in a cell?",
      type: "multiple-choice",
      category: "Biology",
      created: "2023-05-15",
      nextReview: "2023-05-17",
      reviewType: "2-day",
    },
    {
      id: 2,
      question: "Explain the concept of supply and demand in economics.",
      type: "essay",
      category: "Economics",
      created: "2023-05-10",
      nextReview: "2023-05-17",
      reviewType: "7-day",
    },
    {
      id: 3,
      question:
        "Which of the following is NOT a primary color in the RGB color model?",
      type: "multiple-choice",
      category: "Computer Science",
      created: "2023-04-15",
      nextReview: "2023-05-15",
      reviewType: "30-day",
    },
    {
      id: 4,
      question: "Describe the causes of World War I.",
      type: "essay",
      category: "History",
      created: "2023-05-12",
      nextReview: "2023-05-14",
      reviewType: "2-day",
    },
    {
      id: 5,
      question: "What is the quadratic formula?",
      type: "multiple-choice",
      category: "Mathematics",
      created: "2023-05-08",
      nextReview: "2023-05-15",
      reviewType: "7-day",
    },
    {
      id: 6,
      question: "Explain the process of photosynthesis.",
      type: "essay",
      category: "Biology",
      created: "2023-04-20",
      nextReview: "2023-05-20",
      reviewType: "30-day",
    },
  ];

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      q.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

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
          <QuickAddQuestion>
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
                  <SelectItem value="computer science">
                    Computer Science
                  </SelectItem>
                  <SelectItem value="economics">Economics</SelectItem>
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
                {filteredQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No questions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuestions.map((question) => (
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
          <TabsContent value="due">
            {/* Similar table structure for due questions */}
          </TabsContent>
          <TabsContent value="multiple-choice">
            {/* Similar table structure for multiple choice questions */}
          </TabsContent>
          <TabsContent value="essay">
            {/* Similar table structure for essay questions */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
