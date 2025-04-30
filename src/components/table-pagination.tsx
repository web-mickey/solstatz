import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const TablePagination = (props: TablePaginationProps) => {
  const { currentPage, totalPages, onPageChange } = props;

  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = [];
  if (totalPages > 5) {
    if (currentPage > 2) {
      visiblePages.push(1);
    }
    if (currentPage > 2) visiblePages.push("...");
    if (currentPage > 1) visiblePages.push(currentPage - 1);
    visiblePages.push(currentPage);
    if (currentPage < totalPages) visiblePages.push(currentPage + 1);
    if (currentPage < totalPages - 1) visiblePages.push("...");

    if (currentPage < totalPages - 1) {
      visiblePages.push(totalPages);
    }
  } else {
    visiblePages.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
  }

  return (
    <div className="flex justify-center items-center gap-2 pt-6">
      {visiblePages.map((page, index) =>
        typeof page === "number" ? (
          <Button
            key={index}
            variant="brand"
            onClick={() => onPageChange(page)}
            disabled={currentPage === page}
            className="py-3 rounded-xl font-bold"
          >
            {page}
          </Button>
        ) : (
          <span key={index} className="px-2">
            {page}
          </span>
        )
      )}
    </div>
  );
};
