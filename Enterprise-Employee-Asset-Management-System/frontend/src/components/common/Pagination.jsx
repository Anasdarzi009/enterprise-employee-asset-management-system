import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage,
  totalItems,
  pageSize = 8,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 0.5rem',
        fontSize: '0.85rem',
        color: '#64748b',
      }}
    >
      <div>
        Showing <strong style={{ color: '#0f172a' }}>{startItem}</strong> to{' '}
        <strong style={{ color: '#0f172a' }}>{endItem}</strong> of{' '}
        <strong style={{ color: '#0f172a' }}>{totalItems}</strong> entries
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          className="btn btn-secondary btn-sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 0.75rem',
            fontWeight: 600,
            color: '#0f172a',
          }}
        >
          {currentPage} / {totalPages}
        </span>
        <button
          className="btn btn-secondary btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
