import { useEffect, useRef, useState } from 'react';
import { Application } from '@/types/kanban';
import { X, Calendar, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MobileDetailsSheetProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (applicationId: string, updates: Partial<Application>) => void;
}

export function MobileDetailsSheet({
  application,
  isOpen,
  onClose,
}: MobileDetailsSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // Handle touch events for swipe down to close
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - startY;
    if (deltaY > 0) {
      setCurrentY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (currentY > 100) {
      onClose();
    }
    setCurrentY(0);
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const priorityColors = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 transition-transform duration-300 ease-out max-h-[75vh] flex flex-col',
          isOpen ? 'transform translate-y-0' : 'transform translate-y-full'
        )}
        style={{
          transform: isOpen ? `translateY(${currentY}px)` : 'translateY(100%)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 pb-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Application Details</h2>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Title */}
          <div>
            <h3 className="text-xl font-semibold">{application.title}</h3>
          </div>

          {/* Priority and Due Date */}
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={cn('text-sm', priorityColors[application.priority])}
            >
              {application.priority} priority
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{new Date(application.dueDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <p className="mt-1 text-base">{application.status}</p>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <p className="mt-1 text-base text-gray-600">{application.description}</p>
          </div>

          {/* Stage */}
          <div>
            <label className="text-sm font-medium text-gray-700">Current Stage</label>
            <p className="mt-1 text-base capitalize">{application.columnId.replace('-', ' ')}</p>
          </div>

          {/* Notes Section */}
          <div className="pt-4 border-t border-gray-200">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg min-h-[100px]">
              <p className="text-sm text-gray-500">No notes added yet...</p>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="pt-4 border-t border-gray-200">
            <label className="text-sm font-medium text-gray-700">Activity</label>
            <div className="mt-2 space-y-2">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Created</span> on {new Date().toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Moved to {application.columnId}</span> today
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="border-t border-gray-200 p-4 flex gap-3">
            <Button
              className="flex-1"
              onClick={() => {
                // Save logic here
                setIsEditing(false);
              }}
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </>
  );
}