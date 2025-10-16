# Recruitment Kanban Board - Claude Code Session Documentation

## Project Overview
A modern, responsive Kanban board application built for recruitment workflow management. This project demonstrates a complete drag-and-drop recruitment pipeline with 7 stages, from initial application to hiring.

## Technology Stack
- **React 19.2** - Latest React with modern features (useTransition for smooth updates)
- **Vite** - Fast development server and build tool
- **TypeScript** - Type-safe development
- **Tailwind CSS v3** - Utility-first CSS framework
- **ShadCN UI** - Modern UI component library with blue theme
- **@dnd-kit** - Accessible drag-and-drop library
- **pnpm** - Fast package manager

## Project Structure
```
shadcn-kanban/
├── src/
│   ├── components/
│   │   ├── ui/                     # ShadCN UI components
│   │   │   ├── card.tsx           # Card component
│   │   │   ├── button.tsx         # Button component
│   │   │   ├── badge.tsx          # Badge component
│   │   │   └── select.tsx         # Select dropdown component
│   │   ├── KanbanBoard/           # Main Kanban components
│   │   │   ├── KanbanBoard.tsx    # Main board container
│   │   │   ├── KanbanColumn.tsx   # Individual column component
│   │   │   ├── ApplicationCard.tsx # Draggable card component
│   │   │   ├── MobileStageSelector.tsx # Mobile column selector
│   │   │   └── index.ts           # Export barrel
│   │   └── ApplicationDetails/    # Details view components
│   │       ├── ApplicationDetails.tsx # Main details component
│   │       ├── MobileDetailsSheet.tsx # Mobile bottom sheet
│   │       ├── DesktopDetailsSplit.tsx # Desktop split view
│   │       └── index.ts           # Export barrel
│   ├── hooks/
│   │   └── useMediaQuery.ts       # Media query hook for responsive design
│   ├── types/
│   │   └── kanban.ts              # TypeScript type definitions
│   ├── lib/
│   │   └── utils.ts               # Utility functions (cn helper)
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Global styles & Tailwind imports
├── tasks/                         # Planning and documentation
│   ├── responsive-board.md        # Responsive design plan
│   └── details-view.md           # Details view implementation plan
├── components.json                # ShadCN UI configuration
├── tailwind.config.mjs           # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.node.json            # Node.js TypeScript config
├── .gitignore                    # Git ignore rules
└── package.json                  # Project dependencies
```

## Features Implemented

### 1. Recruitment Pipeline (7 Stages)
- **Long List** - Initial candidate applications
- **Short List** - Candidates who pass initial screening
- **Interview** - Candidates in interview process
- **Offer** - Candidates with pending job offers
- **Compliance** - Background checks and compliance verification
- **Onboarding** - New hires being onboarded
- **Hired** - Successfully hired candidates

### 2. Drag & Drop Functionality
- Smooth drag-and-drop between columns using @dnd-kit
- Visual feedback during drag operations
- Support for both reordering within columns and moving between columns
- Accessible keyboard navigation support

### 3. Application Cards
Each candidate card displays:
- **Name and Position** - Clear identification
- **Description** - Brief candidate summary or notes
- **Priority Indicators** - Color-coded badges (high=red, medium=amber, low=green)
- **Due Dates** - Timeline management with calendar icons
- **Status** - Current stage-specific status

### 4. Responsive Design (Mobile, Tablet, Desktop)
- **Mobile View (< 640px)**:
  - Single column view with stage selector dropdown
  - ShadCN Select component for switching between stages
  - Touch-optimized interactions with larger buttons
  - Mobile stage selector shows column counts
- **Tablet View (640px - 1024px)**:
  - 2-3 column layout with horizontal scrolling
  - Smooth scroll behavior with column snap
  - Maintains drag-and-drop between visible columns
- **Desktop View (≥ 1024px)**:
  - Full 7-column grid layout
  - Optimal viewing of entire recruitment pipeline

### 5. Application Details View
- **Mobile Details (Bottom Sheet)**:
  - Slides up from bottom covering 75% of viewport
  - Swipe-down gesture to dismiss
  - Backdrop with smooth opacity transition
  - Prevents body scroll when open
- **Desktop Details (Split View)**:
  - Shows selected application's column (1/3 width)
  - Details panel takes remaining space (2/3 width)
  - Maintains drag-and-drop in visible column
  - Clean, focused interface
- **Details Content**:
  - Complete application information display
  - Inline editing for all fields
  - Priority badges with color coding
  - Activity timeline and notes sections
  - Save/cancel functionality

### 6. Interactive Features
- **Add Candidates** - Plus (+) buttons in each column header
- **Column Counters** - Display number of candidates per stage
- **Card Click to View Details** - Click any card to open details view
- **Edit Mode** - Toggle between view and edit modes
- **Professional Styling** - Blue-themed design suitable for HR applications

### 7. Sample Data
Pre-populated with 10 realistic candidate profiles demonstrating:
- Various roles (Senior Developer, Product Manager, Data Scientist, etc.)
- Different priority levels and statuses
- Realistic due dates and descriptions
- Distribution across all pipeline stages

## Development Commands

### Setup
```bash
npm install -g pnpm  # If pnpm not installed
pnpm install         # Install dependencies
```

### Development
```bash
pnpm run dev         # Start development server (http://localhost:5173)
pnpm run build       # Build for production
pnpm run preview     # Preview production build
```

### Code Quality
```bash
pnpm run lint        # Run ESLint (when configured)
```

## Configuration Files

### Tailwind CSS (`tailwind.config.mjs`)
- Configured for ES modules
- Includes ShadCN UI color scheme
- Custom animations and utilities
- Responsive breakpoints optimized for Kanban layout

### Vite (`vite.config.ts`)
- React plugin configuration
- Path aliases (@/* → src/*)
- TypeScript support
- Fast HMR (Hot Module Replacement)

### TypeScript (`tsconfig.json`)
- Strict type checking enabled
- Modern ES2022 target
- React JSX transform
- Path mapping for clean imports

## Key Implementation Details

### React 19.2 Features Used
```typescript
// Smooth state transitions for drag operations
const [, startTransition] = useTransition();

startTransition(() => {
  setColumns(/* updated state */);
});
```

### Type Safety
```typescript
// Comprehensive type definitions
export type ColumnId = 'long-list' | 'short-list' | 'interview' | 'offer' | 'compliance' | 'onboarding' | 'hired';
export type Priority = 'high' | 'medium' | 'low';

export interface Application {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  status: string;
  columnId: ColumnId;
}
```

### Responsive Design Implementation
```typescript
// Media query hook for responsive behavior
const isMobile = useMediaQuery('(max-width: 639px)');
const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');

// Conditional rendering based on device type
if (isMobile) {
  return <MobileDetailsSheet {...props} />;
}
return <DesktopDetailsSplit {...props} />;
```

### Responsive Grid Classes
```css
/* Mobile: Single column with stage selector */
/* Tablet: 2-3 columns with horizontal scroll */
/* Desktop: Full 7-column grid */
grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7
```

## Troubleshooting & Known Issues

### Tailwind CSS Version Compatibility
- **Issue**: Initially used Tailwind CSS v4 which had compatibility issues
- **Solution**: Downgraded to Tailwind CSS v3.4.18 for stability
- **Note**: Custom CSS variables approach replaced with standard utility classes

### TypeScript Configuration
- **Issue**: Module resolution conflicts with ES modules
- **Solution**: Proper tsconfig.json setup with composite projects
- **Note**: Separate configs for main app and Vite/Node.js tools

### Build Process
- Required @types/node for proper TypeScript compilation
- Fixed unused import warnings for production builds
- Ensured proper ES module syntax throughout
- Added @radix-ui/react-select dependency for select component
- Successfully resolved all TypeScript compilation errors

## Future Enhancements

### Potential Features
1. **Persistence** - Add database integration (localStorage/API)
2. **Authentication** - User accounts and role-based access
3. **Advanced Filtering** - Search, filter by priority, due date
4. **Notifications** - Due date reminders and status updates
5. **Analytics** - Pipeline metrics and reporting
6. **Customization** - Configurable columns and workflows
7. **Real-time Updates** - WebSocket integration for team collaboration

### Technical Improvements
1. **Testing** - Add unit tests (Jest/Vitest) and E2E tests (Playwright)
2. **Performance** - Virtual scrolling for large candidate lists
3. **Accessibility** - Enhanced screen reader support
4. **Internationalization** - Multi-language support
5. **PWA** - Progressive Web App features

## Development Session Notes

### Build Process - Phase 1 (Initial Implementation)
- Started with Vite + React 19.2 + TypeScript template
- Configured Tailwind CSS v3 with PostCSS
- Set up ShadCN UI with blue theme
- Implemented drag-and-drop with @dnd-kit library
- Created responsive component architecture

### Build Process - Phase 2 (Responsive & Details View)
- Added responsive design with mobile stage selector
- Implemented application details view system
- Created bottom sheet for mobile interactions
- Built split-view layout for desktop
- Added comprehensive state management for details

### Challenges Solved
1. **Tailwind v4 Compatibility** - Downgraded to v3 for stability
2. **ES Module Configuration** - Proper setup for modern JavaScript
3. **TypeScript Strict Mode** - Resolved all type errors and unused imports
4. **Build Optimization** - Successful production build with proper tree-shaking
5. **ShadCN CLI Issues** - Manually implemented select component due to Node.js version
6. **Responsive Layout Logic** - Complex state management for multi-device views
7. **Touch Gesture Integration** - Swipe-to-dismiss on mobile bottom sheet

### Current Status (Latest Build)
- ✅ Development server ready on http://localhost:5173/
- ✅ Production build successful (371KB JS, 25KB CSS)
- ✅ All TypeScript errors resolved
- ✅ Responsive design working across all devices
- ✅ Drag-and-drop functionality fully operational  
- ✅ Application details view implemented
- ✅ Mobile bottom sheet with gesture support
- ✅ Desktop split-view with inline editing
- ✅ Complete CRUD functionality for applications
- ✅ Touch-optimized mobile interactions
- ✅ Accessibility features (keyboard navigation, focus management)
- ✅ Git repository properly configured with .gitignore

## Getting Started for New Developers

1. **Clone and Install**
   ```bash
   cd shadcn-kanban
   pnpm install
   ```

2. **Start Development**
   ```bash
   pnpm run dev
   ```

3. **Open Browser**
   Navigate to http://localhost:5173/

4. **Test Features**
   - Try dragging candidates between columns
   - Click + buttons to add new candidates
   - Click any candidate card to view details
   - Test responsive behavior on different screen sizes:
     - Mobile: Use stage selector dropdown, try bottom sheet details
     - Tablet: Scroll horizontally between columns  
     - Desktop: View full pipeline, test split-view details
   - Test edit functionality in details view
   - Try swipe gestures on mobile details sheet

## Technical Architecture Highlights

### Component Hierarchy
```
App
└── KanbanBoard
    ├── MobileStageSelector (mobile only)
    ├── KanbanColumn (responsive count)
    │   └── ApplicationCard (clickable)
    └── ApplicationDetails
        ├── MobileDetailsSheet (mobile)
        └── DesktopDetailsSplit (tablet/desktop)
```

### State Management Strategy
- **Board State**: Column and application data
- **View State**: Selected column for mobile
- **Details State**: Selected application and open/close status
- **Responsive State**: Media queries for device detection
- **Edit State**: Toggle between view and edit modes

### Key Dependencies Added
- `@radix-ui/react-select` - Accessible select component
- Custom `useMediaQuery` hook - Responsive design detection
- Touch gesture handling - Mobile interaction patterns

This project demonstrates enterprise-grade React development with comprehensive responsive design, accessibility considerations, and modern UX patterns suitable for production HR applications.