import { ColumnId } from '@/types/kanban'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MobileStageSelectorProps {
  currentColumn: ColumnId
  onColumnChange: (columnId: ColumnId) => void
  columns: Array<{
    id: ColumnId
    title: string
    count: number
  }>
}

export function MobileStageSelector({
  currentColumn,
  onColumnChange,
  columns,
}: MobileStageSelectorProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
      <Select value={currentColumn} onValueChange={onColumnChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {columns.map((column) => (
            <SelectItem key={column.id} value={column.id}>
              <span className="flex items-center justify-between w-full">
                <span>{column.title}</span>
                <span className="ml-2 text-sm text-gray-500">({column.count})</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}