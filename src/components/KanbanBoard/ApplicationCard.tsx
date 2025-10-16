import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Application } from '@/types/kanban';
import { Calendar, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApplicationCardProps {
  application: Application;
  isDragging?: boolean;
  onClick?: () => void;
}

export function ApplicationCard({ application, isDragging, onClick }: ApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    high: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'touch-none',
        isSortableDragging && 'opacity-50',
        isDragging && 'rotate-3 scale-105'
      )}
    >
      <Card 
        className="cursor-move hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-900"
        onClick={() => {
          // Only trigger click if not dragging and not clicking on drag handle
          if (!isSortableDragging && onClick) {
            onClick();
          }
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div
              {...attributes}
              {...listeners}
              className="touch-none"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base font-medium line-clamp-1">
                {application.title}
              </CardTitle>
              <CardDescription className="text-xs mt-1 line-clamp-2">
                {application.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant="outline"
              className={cn('text-xs', priorityColors[application.priority])}
            >
              {application.priority}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Calendar className="h-3 w-3" />
              <span>{new Date(application.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
          {application.status && (
            <div className="mt-2">
              <span className="text-xs text-gray-600">
                Status: <span className="font-medium">{application.status}</span>
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}