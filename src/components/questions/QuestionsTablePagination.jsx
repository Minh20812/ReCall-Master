import { Button } from "@/components/ui/button";

export function QuestionsTablePagination({
  pagination,
  page,
  pageSize,
  onPageChange,
}) {
  return (
    <div className="flex items-center justify-between p-4 border-t">
      <div>
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, pagination.totalDocs)} of{" "}
          {pagination.totalDocs} questions
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= pagination.totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
