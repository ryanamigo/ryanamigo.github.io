import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, ButtonGroup } from '@chakra-ui/react';

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pagesToShow = Math.min(totalPages, 5); // 显示的页码数量，最多显示5个
    const pages: React.ReactNode[] = [];

    if (currentPage <= 2) {
      // 当前页在前两页时，显示前三页
      for (let i = 1; i <= Math.min(pagesToShow, totalPages); i++) {
        pages.push(renderPageButton(i));
      }
    } else if (currentPage >= totalPages - 1) {
      // 当前页在最后两页时，显示最后三页
      for (let i = totalPages - Math.min(pagesToShow, totalPages) + 1; i <= totalPages; i++) {
        pages.push(renderPageButton(i));
      }
    } else {
      // 显示当前页的前一页、当前页和后一页
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(renderPageButton(i));
      }
    }

    return pages;
  };

  const renderPageButton = (pageNumber: number) => {
    const isActive = pageNumber === currentPage;

    return (
      <Button
        key={pageNumber}
        variant={isActive ? 'solid' : 'outline'}
        colorScheme="brand"
        onClick={() => onPageChange(pageNumber)}
        size="sm"
      >
        {pageNumber}
      </Button>
    );
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <ButtonGroup>
      <Button size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
        <ChevronLeftIcon />
      </Button>
      {renderPageNumbers()}
      <Button size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
        <ChevronRightIcon />
      </Button>
    </ButtonGroup>
  );
};

export default Paginator;
