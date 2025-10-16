# Responsive Kanban Board - Mobile & Tablet Views

## Current State Analysis

The kanban board currently displays 7 columns in a horizontal grid layout:
- Desktop: All 7 columns visible (xl:grid-cols-7)
- Current breakpoints: grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Issues: On tablets and phones, columns stack vertically or show limited columns, making it difficult to see the full pipeline

## Chosen Approach

### Mobile View (< 640px): Single Column View with Stage Selector
**Implementation**: Show one column at a time with a ShadCN Select component to switch between stages
**Benefits**: 
- Maximum screen real estate for cards
- Clear focus on current stage
- No horizontal scrolling needed
- Clean, native mobile UI pattern

### Tablet View (640px - 1024px): 2-3 Column Layout with Horizontal Scroll
**Implementation**: Show 2-3 columns at a time with smooth horizontal scrolling
**Benefits**: 
- Good balance of visibility and usability
- Can see multiple stages for context
- Drag-and-drop works well
- Natural progression from mobile to desktop

## Implementation Plan

### Phase 1: Add ShadCN Select Component
```bash
pnpm dlx shadcn@latest add select
```

### Phase 2: Mobile Implementation
1. **Create Mobile Layout**
   - Single column display
   - ShadCN Select at the top for stage selection
   - Full width cards
   - Maintain drag-and-drop within column

2. **Select Component Setup**
   - Display current stage name
   - Show all 7 stages in dropdown
   - Include column counts in labels
   - Update view on selection

3. **Mobile-Specific Styling**
   - Larger touch targets (min 44px)
   - Increased padding for cards
   - Optimized font sizes
   - Sticky select header

### Phase 3: Tablet Implementation
1. **Responsive Grid Adjustment**
   - Show 2 columns on smaller tablets (640px-768px)
   - Show 3 columns on larger tablets (768px-1024px)
   - Maintain current column structure

2. **Horizontal Scroll Enhancement**
   - Smooth scroll behavior
   - CSS scroll-snap for column alignment
   - Visual scroll indicators
   - Touch-friendly scrollbar

3. **Tablet Optimizations**
   - Appropriate card sizing
   - Balanced whitespace
   - Maintain drag-and-drop between visible columns

## Technical Implementation Details

### Breakpoint Strategy
```typescript
// Mobile: < 640px (sm breakpoint)
// Tablet: 640px - 1024px (sm to lg)
// Desktop: >= 1024px (lg and above)
```

### State Management
```typescript
// Add selected column state for mobile view
const [selectedColumn, setSelectedColumn] = useState<ColumnId>('long-list');

// Conditional rendering based on viewport
const isMobile = useMediaQuery('(max-width: 639px)');
const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
```

### Component Structure
```
KanbanBoard/
├── KanbanBoard.tsx (main container with responsive logic)
├── MobileStageSelector.tsx (new - ShadCN select wrapper)
├── KanbanColumn.tsx (adapt for mobile/tablet)
└── ApplicationCard.tsx (responsive card sizing)
```

### CSS Adjustments
```css
/* Mobile */
@media (max-width: 639px) {
  .kanban-container {
    display: block;
  }
  .kanban-column {
    width: 100%;
    min-height: calc(100vh - 200px);
  }
}

/* Tablet */
@media (min-width: 640px) and (max-width: 1023px) {
  .kanban-container {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(300px, 1fr);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }
  .kanban-column {
    scroll-snap-align: start;
  }
}
```

## User Experience Enhancements

### Mobile Experience
1. **Stage Selector Features**
   - Shows current stage name
   - Displays count badges (e.g., "Interview (3)")
   - Smooth transitions between stages
   - Maintains scroll position per stage

2. **Touch Optimizations**
   - Larger add buttons
   - Increased tap areas on cards
   - Touch-friendly spacing
   - Clear visual feedback

### Tablet Experience
1. **Scroll Indicators**
   - Fade indicators on scroll edges
   - Optional mini-map of all columns
   - Current position indicator

2. **Smooth Scrolling**
   - Momentum scrolling
   - Snap to column edges
   - Prevent accidental vertical scroll

## Testing Checklist

- [ ] Mobile stage selector works correctly
- [ ] Drag-and-drop works within mobile column
- [ ] Tablet shows correct number of columns
- [ ] Horizontal scroll is smooth on tablet
- [ ] Column counts update correctly
- [ ] Add buttons work on all screen sizes
- [ ] No layout breaks at breakpoint transitions
- [ ] Touch targets meet 44px minimum
- [ ] Performance is smooth with many cards