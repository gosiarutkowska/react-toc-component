**🚀 [🦄 Live Demo - Try it now!](https://react-toc-component-lihwdbmjn-gosias-projects-da6b4f72.vercel.app) 🚀**
# React Table of Contents Component

A professional Table of Contents component built with React, TypeScript, and SASS for complex documentation sites.

## ✨ Features

- **📚 Hierarchical Navigation** - Multi-level tree with expand/collapse
- **🔍 Smart Search** - Debounced search with loading indicators
- **⚡ Asynchronous Loading** - API data loading with proper states
- **🎯 Active State Management** - Highlights current page and parent tree
- **⚓ Anchor Support** - Navigate to page sections
- **🎨 Smooth Animations** - Cubic-bezier transitions for expand/collapse
- **🌓 Theme Support** - Light/Dark mode with system preference
- **⌨️ Keyboard Navigation** - Full accessibility support
- **📱 Responsive Design** - Works on all devices
- **🛡️ Error Boundaries** - Graceful error handling
- **📦 TypeScript** - Fully typed with comprehensive interfaces

## 🚀 How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 🎯 Usage

### Basic Usage

```tsx
import { TableOfContents } from './components/TableOfContents';

function App() {
  return (
    <TableOfContents
      searchable={true}
      onItemClick={(item) => console.log('Navigate to:', item.url)}
      initialActiveId="getting-started"
    />
  );
}
```

### With Custom Data

```tsx
import { TableOfContents } from './components/TableOfContents';

const customData = {
  entities: {
    pages: {
      'intro': {
        id: 'intro',
        title: 'Introduction',
        url: '/docs/intro',
        level: 0,
        pages: [],
        anchors: []
      }
    },
    anchors: {}
  },
  topLevelIds: ['intro']
};

<TableOfContents 
  data={customData} 
  searchable={true}
/>
```

## 📋 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `JetBrainsHelpTOC` | `undefined` | TOC data structure |
| `onItemClick` | `(item: TOCItem) => void` | `undefined` | Item click callback |
| `onAnchorClick` | `(anchor: TOCAnchor) => void` | `undefined` | Anchor click callback |
| `initialActiveId` | `string` | `undefined` | Initially active item ID |
| `searchable` | `boolean` | `false` | Enable search functionality |
| `className` | `string` | `undefined` | Additional CSS class |

### API Methods

```tsx
const { api } = useTableOfContents();

api.setActiveById('page-id');    // Set active item
api.expandAll();                 // Expand all items
api.collapseAll();              // Collapse all items
api.filterByString('search');   // Filter by search term
api.clearFilter();              // Clear search filter
api.getActiveItem();            // Get currently active item
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ErrorBoundary/          # Error handling
│   └── TableOfContents/        # Main TOC components
├── hooks/
│   ├── useDebounced.ts         # Debounced values
│   ├── useTableOfContents.ts   # Main TOC logic
│   └── useTOCState.ts         # State management
├── types/                      # TypeScript definitions
├── utils/                      # Helper functions
├── styles/                     # SASS stylesheets
└── test/                       # Test files
```

## 🧪 Testing

```bash
npm test                 # Run all tests
npm run test:coverage   # Run with coverage
npm run test:ui         # Interactive test UI
```

Tests include:
- Unit tests for components and hooks
- Integration tests for user interactions
- Accessibility testing
- Error boundary testing

## 🎨 Customization

### Theme Variables

```scss
:root {
  --active-bg: #6B57FF;
  --hover-bg: rgba(107, 87, 255, 0.08);
  --level-1-bg: #FAFAFA;
  --level-2-bg: #F4F4F4;
}

:root[data-theme="dark"] {
  --active-bg: #7B61FF;
  --hover-bg: #252527;
  --level-1-bg: #303033;
  --level-2-bg: #252527;
}
```

## 👥 Accessibility

- **Keyboard navigation** support
- **Screen reader** support with ARIA labels
- **Focus management** with visible indicators
- **High contrast** mode support
- **Touch-friendly** targets for mobile

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate between items |
| `Enter` `Space` | Activate/Expand item |
| `→` | Expand collapsed item |
| `←` | Collapse expanded item |

## 🔧 Configuration

Environment variables:
```env
VITE_TOC_API_ENDPOINT=/api/jetbrainsHelpTOC.json
VITE_SEARCH_DEBOUNCE=400
```

## 📦 Tech Stack

- **React 19** with TypeScript
- **SASS Modules** for styling
- **Vite** for build tooling
- **Vitest** for testing
- **ESLint + Prettier** for code quality

## 🚀 Assignment Requirements

✅ **All Required Features Implemented:**
- React + TypeScript + SASS
- Asynchronous JSON data loading
- Loading placeholder during data fetch
- Root element click toggles expand/collapse
- Smooth color and icon animations
- Functional tests (Vitest + Testing Library)

✅ **Nice-to-Have Features:**
- JS API for programmatic control
- Topic filtering with search input
- Loading indicators during search
- Expand/collapse animations

✅ **Additional Improvements:**
- Error boundaries for better reliability
- Theme system with dark mode
- Keyboard accessibility
- Responsive design
