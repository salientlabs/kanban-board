import { Application, Column } from '@/types/kanban';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MobileDetailsSheet } from './MobileDetailsSheet';
import { DesktopDetailsSplit } from './DesktopDetailsSplit';

interface ApplicationDetailsProps {
  application: Application | null;
  column?: Column;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (applicationId: string, updates: Partial<Application>) => void;
}

export function ApplicationDetails({
  application,
  column,
  isOpen,
  onClose,
  onUpdate,
}: ApplicationDetailsProps) {
  const isMobile = useMediaQuery('(max-width: 639px)');

  if (!application || !isOpen) return null;

  if (isMobile) {
    return (
      <MobileDetailsSheet
        application={application}
        isOpen={isOpen}
        onClose={onClose}
        onUpdate={onUpdate}
      />
    );
  }

  return (
    <DesktopDetailsSplit
      application={application}
      column={column}
      onClose={onClose}
      onUpdate={onUpdate}
    />
  );
}