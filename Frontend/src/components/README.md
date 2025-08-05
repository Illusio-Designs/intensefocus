# Dashboard Components

A comprehensive collection of reusable React components for building modern dashboard interfaces.

## Components

### 1. Button
A versatile button component with multiple variants and sizes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: boolean
- `loading`: boolean
- `icon`: React node
- `fullWidth`: boolean
- `onClick`: function

**Usage:**
```jsx
import { Button } from './components';

<Button variant="primary" size="medium" onClick={handleClick}>
  Click me
</Button>
```

### 2. ActionButton
Compact action buttons for table rows with different action types.

**Props:**
- `type`: 'view' | 'edit' | 'delete' | 'download' | 'print'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: boolean
- `tooltip`: string
- `onClick`: function

**Usage:**
```jsx
import { ActionButton } from './components';

<ActionButton type="edit" onClick={() => handleEdit(id)} tooltip="Edit item" />
```

### 3. SearchBar
Advanced search component with filters and debounced search.

**Props:**
- `onSearch`: function(searchTerm, filter)
- `placeholder`: string
- `filters`: array of filter options
- `onFilterChange`: function
- `debounceMs`: number (default: 300)

**Usage:**
```jsx
import { SearchBar } from './components';

<SearchBar
  onSearch={handleSearch}
  placeholder="Search items..."
  filters={[
    { value: 'category1', label: 'Category 1' },
    { value: 'category2', label: 'Category 2' }
  ]}
/>
```

### 4. SortBy
Sorting component with visual indicators.

**Props:**
- `options`: array of sort options
- `currentSort`: string
- `onSortChange`: function(field, direction)
- `label`: string

**Usage:**
```jsx
import { SortBy } from './components';

<SortBy
  options={[
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' }
  ]}
  currentSort={sortBy}
  onSortChange={handleSort}
/>
```

### 5. Pagination
Complete pagination component with page navigation and items per page selection.

**Props:**
- `currentPage`: number
- `totalPages`: number
- `totalItems`: number
- `itemsPerPage`: number
- `onPageChange`: function(page)
- `onItemsPerPageChange`: function(items)
- `showItemsPerPage`: boolean

**Usage:**
```jsx
import { Pagination } from './components';

<Pagination
  currentPage={1}
  totalPages={10}
  totalItems={100}
  itemsPerPage={10}
  onPageChange={handlePageChange}
  onItemsPerPageChange={handleItemsPerPageChange}
/>
```

### 6. Select
Enhanced select component using react-select with custom styling.

**Props:**
- `options`: array of options
- `value`: selected value
- `onChange`: function
- `placeholder`: string
- `isMulti`: boolean
- `isClearable`: boolean
- `isSearchable`: boolean
- `isDisabled`: boolean
- `isLoading`: boolean
- `label`: string
- `error`: string
- `required`: boolean

**Usage:**
```jsx
import { Select } from './components';

<Select
  options={[
    { value: 'option1', label: 'Option 1', icon: '📱', description: 'Description' }
  ]}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder="Select an option..."
  isMulti={false}
  label="Category"
/>
```

## Styling

All components come with comprehensive CSS styling that includes:

- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Mode Support**: Automatic dark mode detection
- **Accessibility**: Proper focus states and ARIA attributes
- **Customization**: Easy to customize with CSS variables
- **Consistent Design**: Unified design system across all components

## Installation

The components use the following dependencies:
- `react-select` for enhanced select functionality
- `@mui/material` and related packages for additional UI components

```bash
npm install react-select @mui/material @emotion/react @emotion/styled @mui/icons-material
```

## Usage Example

See `DashboardDemo.jsx` for a complete example of how to use all components together in a dashboard interface.

## Customization

You can customize the appearance by modifying the CSS files in the `src/styles/` directory:

- `Button.css` - Button component styles
- `ActionButton.css` - Action button styles
- `SearchBar.css` - Search bar styles
- `SortBy.css` - Sort component styles
- `Pagination.css` - Pagination styles
- `Select.css` - Select component styles
- `index.css` - Global dashboard styles

## Features

- **TypeScript Ready**: Components are written with proper prop types
- **Performance Optimized**: Efficient rendering and minimal re-renders
- **Accessible**: WCAG compliant with proper keyboard navigation
- **Customizable**: Easy to extend and modify
- **Well Documented**: Comprehensive documentation and examples 