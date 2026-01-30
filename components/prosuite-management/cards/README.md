# StatsCard Component Usage Guide

## Overview
The `StatsCard` and `StatsGrid` components provide a beautiful, responsive way to display statistics with trend indicators and mini charts.

## Basic Usage

```tsx
import { StatsGrid } from '@/components/prosuite-management/cards/StatsCard'
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react'

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
    title: 'Revenue',
    number: '$45,231',
    icon: <DollarSign className="w-5 h-5" />,
    statColor: 'text-emerald-500',
    lastMonthDifference: 8.3,
    trendChartColor: '#10B981',
  },
]

export default function Dashboard() {
  return <StatsGrid stats={stats} />
}
```

## Props

### StatsCardProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | The stat title/label |
| `number` | `number \| string` | Required | The stat value to display |
| `icon` | `React.ReactNode` | Required | Icon to display |
| `statColor` | `string` | `''` | Tailwind class for icon color |
| `titleColor` | `string` | `''` | Tailwind class for title color |
| `trendTextColor` | `string` | `''` | Tailwind class for trend text |
| `positiveTrendColor` | `string` | `'text-emerald-500'` | Color for positive trends |
| `negativeTrendColor` | `string` | `'text-red-500'` | Color for negative trends |
| `lastMonthDifference` | `number` | `0` | Percentage change from last month |
| `isHealthScore` | `boolean` | `false` | Adds % suffix to number |
| `trendData` | `TrendDataPoint[]` | `[]` | Custom trend data points |
| `showTrendChart` | `boolean` | `true` | Show/hide mini trend chart |
| `trendChartColor` | `string` | `'#10B981'` | Color for trend chart line |
| `trendChartHeight` | `number` | `32` | Height of trend chart in pixels |
| `loading` | `boolean` | `false` | Show loading skeleton |
| `href` | `string` | `undefined` | Make card clickable with link |

## Examples

### With Custom Trend Data
```tsx
const stats = [{
  title: 'Sales',
  number: 5420,
  icon: <TrendingUp className="w-5 h-5" />,
  trendData: [
    { value: 100, label: 'Jan' },
    { value: 150, label: 'Feb' },
    { value: 200, label: 'Mar' },
    { value: 180, label: 'Apr' },
    { value: 250, label: 'May' },
    { value: 300, label: 'Jun' },
  ],
  lastMonthDifference: 20,
}]
```

### With Loading State
```tsx
const stats = [{
  title: 'Loading...',
  number: 0,
  icon: <Activity className="w-5 h-5" />,
  loading: true,
}]
```

### As Clickable Card
```tsx
const stats = [{
  title: 'Active Users',
  number: 892,
  icon: <Users className="w-5 h-5" />,
  href: '/users',
  lastMonthDifference: 5.2,
}]
```

### Health Score
```tsx
const stats = [{
  title: 'System Health',
  number: 98,
  icon: <Activity className="w-5 h-5" />,
  isHealthScore: true,
  lastMonthDifference: 2,
}]
```

## Grid Layouts

The `StatsGrid` automatically adjusts columns based on the number of stats:
- 1 stat: Single column
- 2 stats: 1 column mobile, 2 columns desktop
- 3 stats: 1 column mobile, 2 columns tablet, 3 columns desktop
- 4+ stats: 1 column mobile, 2 columns tablet, 4 columns desktop

## Responsive Breakpoints

- `xxxs`: Extra extra small screens
- `xs`: Extra small screens
- `sm`: Small screens
- `md`: Medium screens
- `lg`: Large screens

## Integration with PageSectionHeader

```tsx
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'
import { StatsGrid } from '@/components/prosuite-management/cards/StatsCard'

export default function MyPage() {
  return (
    <div className="p-6 space-y-6">
      <PageSectionHeader
        title="Dashboard Overview"
        subTitle="Key metrics and performance indicators"
      />
      <StatsGrid stats={stats} />
    </div>
  )
}
```
