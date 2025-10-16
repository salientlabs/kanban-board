import { useState, useTransition } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Application, Column, ColumnId } from '@/types/kanban';
import { KanbanColumn } from './KanbanColumn';
import { ApplicationCard } from './ApplicationCard';
import { MobileStageSelector } from './MobileStageSelector';
import { ApplicationDetails } from '@/components/ApplicationDetails';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const sampleApplications: Application[] = [
  {
    id: '1',
    title: 'John Smith - Senior Developer',
    description: 'Strong experience in React and Node.js. Previous role at Tech Corp.',
    priority: 'high',
    dueDate: '2024-10-20',
    status: 'Review CV',
    columnId: 'long-list'
  },
  {
    id: '2',
    title: 'Sarah Johnson - Product Manager',
    description: '10 years experience in SaaS products. MBA from Stanford.',
    priority: 'high',
    dueDate: '2024-10-18',
    status: 'Initial screening',
    columnId: 'short-list'
  },
  {
    id: '3',
    title: 'Michael Chen - Data Scientist',
    description: 'PhD in Machine Learning. Published researcher with Python expertise.',
    priority: 'medium',
    dueDate: '2024-10-22',
    status: 'Technical interview scheduled',
    columnId: 'interview'
  },
  {
    id: '4',
    title: 'Emily Brown - UX Designer',
    description: 'Award-winning portfolio. Specializes in enterprise applications.',
    priority: 'high',
    dueDate: '2024-10-19',
    status: 'Offer pending approval',
    columnId: 'offer'
  },
  {
    id: '5',
    title: 'David Wilson - Marketing Manager',
    description: 'Led successful campaigns for Fortune 500 companies.',
    priority: 'medium',
    dueDate: '2024-10-25',
    status: 'Background check',
    columnId: 'compliance'
  },
  {
    id: '6',
    title: 'Lisa Anderson - Frontend Developer',
    description: 'React specialist with accessibility expertise. Previous at Google.',
    priority: 'low',
    dueDate: '2024-10-28',
    status: 'Equipment setup',
    columnId: 'onboarding'
  },
  {
    id: '7',
    title: 'James Taylor - DevOps Engineer',
    description: 'AWS certified. Kubernetes expert with CI/CD experience.',
    priority: 'medium',
    dueDate: '2024-10-15',
    status: 'Started on 10/01',
    columnId: 'hired'
  },
  {
    id: '8',
    title: 'Maria Garcia - Sales Director',
    description: 'Exceeded targets by 150% in previous role. B2B SaaS expert.',
    priority: 'high',
    dueDate: '2024-10-21',
    status: 'Phone screening',
    columnId: 'long-list'
  },
  {
    id: '9',
    title: 'Robert Lee - Backend Developer',
    description: 'Java and Spring Boot expert. Microservices architecture.',
    priority: 'medium',
    dueDate: '2024-10-23',
    status: 'Code test sent',
    columnId: 'short-list'
  },
  {
    id: '10',
    title: 'Jennifer White - HR Manager',
    description: 'SHRM certified. Experience in tech industry recruitment.',
    priority: 'low',
    dueDate: '2024-10-26',
    status: 'Culture fit interview',
    columnId: 'interview'
  }
];

const initialColumns: Column[] = [
  { id: 'long-list', title: 'Long List', applications: sampleApplications.filter(app => app.columnId === 'long-list') },
  { id: 'short-list', title: 'Short List', applications: sampleApplications.filter(app => app.columnId === 'short-list') },
  { id: 'interview', title: 'Interview', applications: sampleApplications.filter(app => app.columnId === 'interview') },
  { id: 'offer', title: 'Offer', applications: sampleApplications.filter(app => app.columnId === 'offer') },
  { id: 'compliance', title: 'Compliance', applications: sampleApplications.filter(app => app.columnId === 'compliance') },
  { id: 'onboarding', title: 'Onboarding', applications: sampleApplications.filter(app => app.columnId === 'onboarding') },
  { id: 'hired', title: 'Hired', applications: sampleApplications.filter(app => app.columnId === 'hired') },
];

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<ColumnId>('long-list');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [, startTransition] = useTransition();

  // Media queries for responsive design
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findApplication = (id: string): Application | undefined => {
    for (const column of columns) {
      const app = column.applications.find(app => app.id === id);
      if (app) return app;
    }
    return undefined;
  };

  const findColumn = (id: string): Column | undefined => {
    return columns.find(col => col.applications.some(app => app.id === id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findColumn(activeId);
    const overColumn = columns.find(col => col.id === overId) || findColumn(overId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn === overColumn) {
      // Reordering within the same column
      const columnIndex = columns.findIndex(col => col.id === activeColumn.id);
      const oldIndex = activeColumn.applications.findIndex(app => app.id === activeId);
      const newIndex = activeColumn.applications.findIndex(app => app.id === overId);

      if (oldIndex !== newIndex) {
        startTransition(() => {
          setColumns(prev => {
            const newColumns = [...prev];
            newColumns[columnIndex] = {
              ...activeColumn,
              applications: arrayMove(activeColumn.applications, oldIndex, newIndex)
            };
            return newColumns;
          });
        });
      }
    } else {
      // Moving between columns
      const activeApp = activeColumn.applications.find(app => app.id === activeId);
      if (!activeApp) return;

      startTransition(() => {
        setColumns(prev => {
          const newColumns = [...prev];
          const sourceColIndex = newColumns.findIndex(col => col.id === activeColumn.id);
          const destColIndex = newColumns.findIndex(col => col.id === overColumn.id);

          // Remove from source column
          newColumns[sourceColIndex] = {
            ...newColumns[sourceColIndex],
            applications: newColumns[sourceColIndex].applications.filter(app => app.id !== activeId)
          };

          // Add to destination column
          const updatedApp = { ...activeApp, columnId: overColumn.id };
          newColumns[destColIndex] = {
            ...newColumns[destColIndex],
            applications: [...newColumns[destColIndex].applications, updatedApp]
          };

          return newColumns;
        });
      });
    }

    setActiveId(null);
  };

  const handleAddApplication = (columnId: ColumnId) => {
    const newApp: Application = {
      id: `app-${Date.now()}`,
      title: 'New Application',
      description: 'Description here',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'New',
      columnId,
    };

    setColumns(prev => {
      const newColumns = [...prev];
      const columnIndex = newColumns.findIndex(col => col.id === columnId);
      newColumns[columnIndex] = {
        ...newColumns[columnIndex],
        applications: [...newColumns[columnIndex].applications, newApp]
      };
      return newColumns;
    });
  };

  const handleCardClick = (application: Application) => {
    setSelectedApplication(application);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedApplication(null);
  };

  const handleUpdateApplication = (applicationId: string, updates: Partial<Application>) => {
    setColumns(prev => {
      const newColumns = prev.map(column => ({
        ...column,
        applications: column.applications.map(app =>
          app.id === applicationId ? { ...app, ...updates } : app
        )
      }));
      return newColumns;
    });
    
    // Update selected application if it's the one being edited
    if (selectedApplication?.id === applicationId) {
      setSelectedApplication(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // Prepare columns data for mobile selector
  const columnsWithCounts = columns.map(col => ({
    id: col.id,
    title: col.title,
    count: col.applications.length
  }));

  // Get the visible columns based on device type and details view
  const getVisibleColumns = () => {
    if (isMobile) {
      // On mobile, show only the selected column
      return columns.filter(col => col.id === selectedColumnId);
    }
    if (!isMobile && isDetailsOpen && selectedApplication) {
      // On desktop with details open, show only the column containing the selected application
      return columns.filter(col => col.id === selectedApplication.columnId);
    }
    return columns; // Show all columns normally
  };

  const visibleColumns = getVisibleColumns();
  const selectedColumn = selectedApplication 
    ? columns.find(col => col.id === selectedApplication.columnId)
    : undefined;

  // Determine grid classes based on device type
  const getGridClasses = () => {
    if (isMobile) {
      return 'block'; // Single column on mobile
    }
    if (isTablet) {
      return 'grid grid-flow-col auto-cols-[minmax(300px,1fr)] overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100';
    }
    return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4';
  };

  return (
    <div className="w-full h-full flex">
      {/* Main Board Area */}
      <div className={`flex-1 ${!isMobile && isDetailsOpen ? 'flex' : ''}`}>
        {/* Mobile stage selector */}
        {isMobile && (
          <MobileStageSelector
            currentColumn={selectedColumnId}
            onColumnChange={(columnId) => setSelectedColumnId(columnId as ColumnId)}
            columns={columnsWithCounts}
          />
        )}
        
        <div className={`${isMobile ? "p-4" : "p-6"} ${!isMobile && isDetailsOpen ? 'flex-1' : ''}`}>
          {/* Header - hide on mobile since selector is sticky */}
          {!isMobile && (
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                Recruitment Pipeline
              </h1>
            </div>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className={`${getGridClasses()} ${isTablet ? 'gap-4 pb-4' : isMobile ? '' : 'gap-4 pb-6'}`}>
              {visibleColumns.map((column) => (
                <div 
                  key={column.id} 
                  className={isTablet ? 'snap-start' : ''}
                >
                  <KanbanColumn
                    column={column}
                    onAddApplication={() => handleAddApplication(column.id)}
                    onCardClick={handleCardClick}
                  />
                </div>
              ))}
            </div>

            <DragOverlay>
              {activeId ? (
                <ApplicationCard
                  application={findApplication(activeId)!}
                  isDragging
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Desktop Details Panel */}
        {!isMobile && isDetailsOpen && (
          <div className="w-2/3 h-full">
            <ApplicationDetails
              application={selectedApplication}
              column={selectedColumn}
              isOpen={isDetailsOpen}
              onClose={handleCloseDetails}
              onUpdate={handleUpdateApplication}
            />
          </div>
        )}
      </div>

      {/* Mobile Details Sheet */}
      {isMobile && (
        <ApplicationDetails
          application={selectedApplication}
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
          onUpdate={handleUpdateApplication}
        />
      )}
    </div>
  );
}