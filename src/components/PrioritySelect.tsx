import { useState, useRef, useEffect } from 'react';
import type { PriorityLevel } from '../types/task.ts';

interface PrioritySelectProps {
  priorities: PriorityLevel[];
  valueId: string;
  onChange: (priorityId: string) => void;
  id?: string;
  'aria-label'?: string;
  className?: string;
}

export function PrioritySelect({
  priorities,
  valueId,
  onChange,
  id,
  'aria-label': ariaLabel,
  className = '',
}: PrioritySelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const justClosedRef = useRef(false);

  const current = priorities.find((p) => p.id === valueId) ?? priorities[0];
  const sorted = [...priorities].sort((a, b) => b.rank - a.rank);

  useEffect(() => {
    if (!open) return;
    function handlePointerDownOutside(e: PointerEvent) {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', handlePointerDownOutside, true);
    return () =>
      document.removeEventListener('pointerdown', handlePointerDownOutside, true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  function handleBlur() {
    requestAnimationFrame(() => {
      if (
        containerRef.current &&
        !containerRef.current.contains(document.activeElement)
      ) {
        setOpen(false);
      }
    });
  }

  function handleTriggerClick() {
    if (justClosedRef.current) {
      justClosedRef.current = false;
      return;
    }
    setOpen((v) => !v);
  }

  function handleOptionClick(p: PriorityLevel) {
    justClosedRef.current = true;
    onChange(p.id);
    setOpen(false);
  }

  function handleOptionPointerDown(e: React.PointerEvent) {
    e.stopPropagation();
  }

  return (
    <div
      ref={containerRef}
      className={`priority-select ${open ? 'priority-select--open' : ''} ${className}`.trim()}
      onBlur={handleBlur}
    >
      <button
        type="button"
        id={id}
        className="priority-select-trigger"
        onClick={handleTriggerClick}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!justClosedRef.current) setOpen((v) => !v);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel ?? 'Choisir la priorité'}
      >
        <span
          className="priority-select-dot"
          style={{ backgroundColor: current.color }}
        />
        <span className="priority-select-label">{current.label}</span>
        <span className="priority-select-chevron" aria-hidden>▼</span>
      </button>
      {open && (
        <div
          className="priority-select-dropdown"
          role="listbox"
          aria-labelledby={id}
        >
          {sorted.map((p) => (
            <button
              key={p.id}
              type="button"
              role="option"
              aria-selected={p.id === valueId}
              className="priority-select-option"
              onPointerDown={handleOptionPointerDown}
              onClick={(e) => {
                e.stopPropagation();
                handleOptionClick(p);
              }}
            >
              <span
                className="priority-select-dot"
                style={{ backgroundColor: p.color }}
              />
              <span className="priority-select-option-label">{p.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
