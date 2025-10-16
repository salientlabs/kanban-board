# Application Details View - Implementation Plan

## Overview
Add a details view component that allows users to view and edit application details. The component will have different layouts based on the device type:
- **Mobile**: Bottom sheet taking up 3/4 of viewport height
- **Tablet/Desktop**: Split view with single column and details panel

## Mobile Layout (< 640px)

### Option 1: Bottom Sheet Modal
**Description**: Slide-up modal that covers 75% of screen height
**Implementation**: 
- Use CSS transforms for smooth slide animation
- Fixed positioning with backdrop
- Swipe-down gesture to dismiss
- Vertical scrolling for content overflow

### Option 2: Full Page Overlay
**Description**: Full screen overlay with close button
**Implementation**:
- Takes entire viewport
- Header with back/close button
- Native-like navigation feel

### Recommended: Bottom Sheet Modal
- More modern mobile pattern
- Maintains context of kanban board
- Easy gesture-based dismissal
- Better for quick interactions

## Tablet/Desktop Layout (≥ 640px)

### Option 1: Side Panel
**Description**: Details panel slides in from right
**Implementation**:
- Fixed width panel (400-500px)
- Board content shifts left
- Can show multiple columns still

### Option 2: Split View (Recommended)
**Description**: Show only selected card's column + details panel
**Implementation**:
- Column takes 1/3 of width
- Details panel takes 2/3 of width
- Clean focus on selected item
- No horizontal scrolling needed

### Option 3: Modal Dialog
**Description**: Centered modal overlay
**Implementation**:
- Traditional desktop pattern
- Backdrop dims background
- Fixed max-width

## Technical Implementation

### State Management
```typescript
// Add to KanbanBoard state
const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
const [isDetailsOpen, setIsDetailsOpen] = useState(false);

// Handle card click
const handleCardClick = (application: Application) => {
  setSelectedApplication(application);
  setIsDetailsOpen(true);
};
```

### Component Structure
```
components/
├── ApplicationDetails/
│   ├── ApplicationDetails.tsx (main component)
│   ├── MobileDetailsSheet.tsx (mobile bottom sheet)
│   ├── DesktopDetailsSplit.tsx (tablet/desktop split view)
│   └── index.ts
```

### Mobile Bottom Sheet Implementation
```typescript
interface MobileDetailsSheetProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
}

// Key features:
// - Fixed positioning
// - Transform translateY for animation
// - Touch gestures for dismissal
// - Backdrop with opacity
// - Max height 75vh with scroll
```

### Desktop Split View Implementation
```typescript
interface DesktopDetailsSplitProps {
  application: Application;
  column: Column;
  onClose: () => void;
  onUpdate: (updates: Partial<Application>) => void;
}

// Layout:
// - Grid with 1fr 2fr columns
// - Single column on left
// - Details panel on right
// - Maintain drag-drop in column
```

## Details Panel Content

### View Mode
- Application title and position
- Full description
- Priority badge with color
- Due date with calendar
- Current status
- Stage/column location
- Activity timeline
- Notes/comments section
- Attachments list

### Edit Mode
- Inline editing for all fields
- Date picker for due date
- Select dropdown for priority
- Textarea for description
- Status update field
- Add/remove attachments
- Save/Cancel buttons

## Interaction Patterns

### Mobile
1. **Open**: Tap any card to open details
2. **Close**: 
   - Swipe down on sheet
   - Tap backdrop
   - Tap close button
3. **Edit**: Tap edit button to enter edit mode
4. **Save**: Prominent save button at bottom

### Desktop
1. **Open**: Click any card to open split view
2. **Close**: 
   - Click close (X) button
   - Press Escape key
   - Click another card
3. **Edit**: Edit button or double-click fields
4. **Save**: Save button in header or Ctrl+S

## Animation & Transitions

### Mobile
```css
.bottom-sheet {
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
}

.bottom-sheet.open {
  transform: translateY(0);
}
```

### Desktop
```css
.split-view-enter {
  opacity: 0;
  transform: translateX(100%);
}

.split-view-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease-out;
}
```

## Responsive Considerations

### Breakpoint Handling
```typescript
const DetailsView = ({ application, isOpen, onClose }) => {
  const isMobile = useMediaQuery('(max-width: 639px)');
  
  if (isMobile) {
    return <MobileDetailsSheet {...props} />;
  }
  
  return <DesktopDetailsSplit {...props} />;
};
```

### Touch Optimizations
- Larger touch targets (min 44px)
- Swipe gestures on mobile
- Momentum scrolling
- Prevent accidental dismissal

## Accessibility

### Keyboard Navigation
- Escape key to close
- Tab navigation through fields
- Focus trap when open
- Return focus on close

### Screen Readers
- Proper ARIA labels
- Announce state changes
- Descriptive button text
- Form field labels

## Implementation Steps

### Phase 1: Basic Structure (2-3 hours)
1. Create ApplicationDetails component structure
2. Add selection state to KanbanBoard
3. Wire up card click handlers
4. Basic open/close functionality

### Phase 2: Mobile Implementation (3-4 hours)
1. Build MobileDetailsSheet component
2. Add slide animation
3. Implement swipe gestures
4. Add backdrop and close handlers

### Phase 3: Desktop Implementation (3-4 hours)
1. Build DesktopDetailsSplit component
2. Modify kanban layout for split view
3. Add smooth transitions
4. Maintain drag-drop functionality

### Phase 4: Details Content (2-3 hours)
1. Design details panel layout
2. Add all application fields
3. Implement view/edit modes
4. Add save functionality

### Phase 5: Polish (2 hours)
1. Refine animations
2. Add loading states
3. Error handling
4. Keyboard shortcuts

## Future Enhancements

1. **Rich Text Editor**: For description field
2. **File Attachments**: Upload and preview
3. **Activity Timeline**: Track all changes
4. **Comments System**: Team collaboration
5. **Email Integration**: Send updates
6. **Keyboard Shortcuts**: Power user features
7. **Autosave**: Prevent data loss
8. **Version History**: Track changes over time