
import React, {FC} from 'react';
import styles from './Pagination.module.css'

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({totalPages, currentPage, onPageChange}) => {

  const MAX_VISIBLE_PAGES = 7;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= MAX_VISIBLE_PAGES) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= MAX_VISIBLE_PAGES - 2) {
        pages.push(1, 2, 3, 4, 5, 6, 7, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 6, totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...',currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={styles.paginationButtonsBlock}>
      <button onClick={() => handlePageChange(currentPage - 1)}
              className={currentPage === 1 ? styles.removeButton : ''}>
        &lt;
      </button>

      {getPageNumbers().map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            className={page === currentPage ? styles.clickedButton : ''}
          >
            {page}
          </button>
        ) : (
          <span key={index} className={styles.dots}>
            ...
          </span>
        )
      )}

      <button onClick={() => handlePageChange(currentPage + 1)}
              className={currentPage === totalPages ? styles.removeButton : ''} >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
