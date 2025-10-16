import { useState } from 'react';
import { Application, Column } from '@/types/kanban';
import { X, Calendar, Edit2, Save, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DesktopDetailsSplitProps {
  application: Application;
  column?: Column;
  onClose: () => void;
  onUpdate: (applicationId: string, updates: Partial<Application>) => void;
}

export function DesktopDetailsSplit({
  application,
  column,
  onClose,
  onUpdate,
}: DesktopDetailsSplitProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedApplication, setEditedApplication] = useState(application);

  const handleSave = () => {
    onUpdate(application.id, editedApplication);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedApplication(application);
    setIsEditing(false);
  };

  const priorityColors = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="bg-white border-l border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Application Details</h2>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="icon"
                variant="default"
                onClick={handleSave}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancel}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Title Section */}
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editedApplication.title}
                onChange={(e) => setEditedApplication({ ...editedApplication, title: e.target.value })}
                className="text-2xl font-bold w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h1 className="text-2xl font-bold">{application.title}</h1>
            )}
          </div>

          {/* Priority and Due Date */}
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Priority</label>
              {isEditing ? (
                <select
                  value={editedApplication.priority}
                  onChange={(e) => setEditedApplication({ ...editedApplication, priority: e.target.value as Application['priority'] })}
                  className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              ) : (
                <Badge
                  variant="outline"
                  className={cn('text-sm', priorityColors[application.priority])}
                >
                  {application.priority} priority
                </Badge>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Due Date</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedApplication.dueDate}
                  onChange={(e) => setEditedApplication({ ...editedApplication, dueDate: e.target.value })}
                  className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(application.dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
            {isEditing ? (
              <input
                type="text"
                value={editedApplication.status}
                onChange={(e) => setEditedApplication({ ...editedApplication, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-base">{application.status}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            {isEditing ? (
              <textarea
                value={editedApplication.description}
                onChange={(e) => setEditedApplication({ ...editedApplication, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-base text-gray-600">{application.description}</p>
            )}
          </div>

          {/* Current Stage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Stage</CardTitle>
              <CardDescription>
                {column ? column.title : application.columnId.replace('-', ' ')}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Notes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[100px] p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">No notes added yet...</p>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-sm font-medium">Application created</p>
                    <p className="text-xs text-gray-500">{new Date().toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-sm font-medium">Moved to {application.columnId.replace('-', ' ')}</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}