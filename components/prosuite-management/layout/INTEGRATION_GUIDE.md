# PageSectionHeader Integration Guide

## Overview
The `PageSectionHeader` component provides a consistent header pattern across all pages in ProSuite, similar to the "Activity" page design.

## Basic Integration Pattern

```tsx
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'

export default function MyPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <PageSectionHeader
        title="Page Title"
        subTitle="Optional subtitle or description"
      />
      
      {/* Your page content here */}
    </div>
  )
}
```

## With Import/Export Functionality

```tsx
'use client'
import { useState } from 'react'
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Manager' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Developer' },
  ])

  const handleTemplateDownload = (format: 'csv' | 'xlsx') => {
    console.log(`Downloading ${format} template for employees`)
    // Your template download logic here
  }

  const handleAddEmployee = () => {
    console.log('Opening add employee modal')
    // Your add logic here
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log('Importing file:', file.name)
      // Your import logic here
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <PageSectionHeader
        title="Employee Management"
        subTitle="Manage your team members and their roles"
        showImportExport={true}
        onTemplateDownload={handleTemplateDownload}
        onAddEmployee={handleAddEmployee}
        fileField={{
          onChange: handleFileImport,
        }}
        exportData={employees}
        exportHeaders={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
        ]}
      />
      
      {/* Employee table/grid here */}
    </div>
  )
}
```

## With Custom Actions

```tsx
'use client'
import { useRouter } from 'next/navigation'
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'

export default function EmployeeDetailPage() {
  const router = useRouter()

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <PageSectionHeader
        title="Employee Details"
        subTitle="View and edit employee information"
        customAction={{
          action: () => console.log('Save changes'),
          showBackButton: true,
          onBack: () => router.back(),
        }}
        showImportExport={false}
      />
      
      {/* Employee detail form here */}
    </div>
  )
}
```

## With StatsGrid Integration (Activity Page Pattern)

```tsx
'use client'
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'
import { StatsGrid } from '@/components/prosuite-management/cards/StatsCard'
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Users',
      number: 1234,
      icon: <Users className="w-5 h-5" />,
      statColor: 'text-blue-500',
      lastMonthDifference: 12.5,
      trendChartColor: '#3B82F6',
    },
    {
      title: 'Active Sessions',
      number: 892,
      icon: <Activity className="w-5 h-5" />,
      statColor: 'text-emerald-500',
      lastMonthDifference: 8.3,
      trendChartColor: '#10B981',
    },
    {
      title: 'Revenue',
      number: '$45,231',
      icon: <DollarSign className="w-5 h-5" />,
      statColor: 'text-purple-500',
      lastMonthDifference: -3.2,
      trendChartColor: '#A855F7',
    },
    {
      title: 'Growth Rate',
      number: 23,
      icon: <TrendingUp className="w-5 h-5" />,
      statColor: 'text-orange-500',
      lastMonthDifference: 15.7,
      trendChartColor: '#F97316',
      isHealthScore: true,
    },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <PageSectionHeader
        title="Dashboard Overview"
        subTitle="Key metrics and performance indicators"
        showImportExport={false}
      />
      
      <StatsGrid stats={stats} />
      
      {/* Additional dashboard content */}
    </div>
  )
}
```

## Customizing Colors

```tsx
<PageSectionHeader
  title="Custom Styled Page"
  subTitle="With custom colors"
  textColor="#FF6B6B"
  accentColor="#4ECDC4"
/>
```

## Without Padding (For Nested Headers)

```tsx
<PageSectionHeader
  title="Section Header"
  removePadding={true}
/>
```

## Complete Activity Page Example

See `/app/(dashboard)/activity/page.tsx` for a full implementation showing:
- PageSectionHeader with all features
- StatsGrid with 4 stats cards
- Activity feed with icons and timestamps
- Task cards with priority badges and tabs
- Responsive two-column layout

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Page/section title |
| `subTitle` | `string` | - | Optional subtitle |
| `showImportExport` | `boolean` | `true` | Show import/export actions |
| `onTemplateDownload` | `(format) => void` | - | Template download handler |
| `onAddEmployee` | `() => void` | - | Add action handler |
| `customAction` | `CustomAction` | - | Custom action config |
| `fileField` | `FileField` | - | File input config |
| `exportData` | `any[]` | `[]` | Data to export |
| `exportHeaders` | `Array` | `[]` | Export column headers |
| `textColor` | `string` | `'#006EAD'` | Title text color |
| `accentColor` | `string` | `'#91BC4D'` | Accent bar color |
| `removePadding` | `boolean` | `false` | Remove bottom padding |

## Best Practices

1. **Consistent Spacing**: Always wrap pages in a container with padding
   ```tsx
   <div className="p-4 md:p-6 lg:p-8 space-y-6">
   ```

2. **Export Data**: Provide meaningful export data and headers for better UX
   
3. **Subtitles**: Use subtitles to provide context about the page purpose

4. **Custom Actions**: Use `customAction` for primary page actions, reserve import/export for data operations

5. **Color Consistency**: Stick to the default colors unless you have a specific design requirement
