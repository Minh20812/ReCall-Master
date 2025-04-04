import { Input } from "@/components/ui/input";
import { Search, ListFilter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetTopicsQuery } from "@/redux/api/topicApi";

export function QuestionsFilter({
  searchQuery,
  categoryFilter,
  onFilterChange,
}) {
  // Fetch topics for the filter
  const { data: topics, isLoading: topicsLoading } = useGetTopicsQuery();

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search questions..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onFilterChange(e.target.value, categoryFilter)}
        />
      </div>
      <div className="flex gap-2">
        <div className="w-[180px]">
          <Select
            value={categoryFilter}
            onValueChange={(value) => onFilterChange(searchQuery, value)}
          >
            <SelectTrigger>
              <ListFilter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {!topicsLoading &&
                topics?.map((topic) => (
                  <SelectItem key={topic._id} value={topic._id}>
                    {topic.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
