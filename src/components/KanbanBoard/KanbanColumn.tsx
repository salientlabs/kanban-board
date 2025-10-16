import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column, Application } from '@/types/kanban';
import { ApplicationCard } from './ApplicationCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  column: Column;
  onAddApplication: () => void;
  onCardClick?: (application: Application) => void;
}

export function KanbanColumn({ column, onAddApplication, onCardClick }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  const style = {
    backgroundColor: isOver ? '#e0f2fe' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4 min-h-[calc(100vh-200px)] sm:min-h-[500px] lg:min-h-[600px] transition-all border border-blue-100 dark:border-blue-900/50 hover:border-blue-200 dark:hover:border-blue-800/50 w-full sm:w-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-sm text-blue-900">{column.title}</h3>
          <span className="text-xs text-gray-600">
            {column.applications.length} {column.applications.length === 1 ? 'candidate' : 'candidates'}
          </span>
        </div>
        <Button
          onClick={onAddApplication}
          size="icon"
          variant="ghost"
          className="h-8 w-8 sm:h-6 sm:w-6"
        >
          <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
        </Button>
      </div>

      <SortableContext
        items={column.applications.map(app => app.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {column.applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onClick={() => onCardClick?.(application)}
            />
          ))}
        </div>
      </SortableContext>

      {column.applications.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          Drop candidates here
        </div>
      )}
    </div>
  );
}