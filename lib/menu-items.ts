import {
    Activity,
    AlertTriangle,
    Building2,
    Clipboard,
    FileCheck,
    FileText,
    HelpCircle,
    Home,
    Package2,
    Settings,
    Shield,
    ShieldAlert,
    Grid2X2,
    Users,
    ContactRound,
    LayoutList,
    CircleCheck,
    Star,
    Clock8,
    ShieldX,
    FileCog,
    FileBadge,
    ListCheck,
    Network,
    Box,
    FileCheck2,
    LayoutDashboard,
    Building,
    MapPin,
    User,
    Grid2x2Check,
    FileChartColumn,
    ClipboardCheck,
    Triangle,
    SquareActivity,
    MessageCircleQuestion,
    BookText,
    LifeBuoy,
    MessageSquare,
    Handshake,
    Calendar,
    RefreshCw,
    Search,
    UserCheck,
} from 'lucide-react';

import type { MenuItem } from '@/types/menu';

export const menuItems: MenuItem[] = [
    {
        icon: Home,
        label: 'Home',
        path: '/',
    },
    {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/dashboard',
    },
    {
        icon: AlertTriangle,
        label: 'Risk',
        module: 'Risk',
        secondaryMenu: [
            {
                label: 'Dashboard',
                icon: LayoutDashboard,
                path: '/risk/dashboard',
            },
            {
                label: 'My Risks',
                icon: Triangle,
                path: '/risk/my-risks',
            },
            {
                label: 'Risk Register',
                icon: ListCheck,
                path: '/risk/register',
            },
            {
                label: 'Action Plans',
                icon: ClipboardCheck,
                path: '/risk/action-plans',
            },
            {
                label: 'Risk Controls',
                icon: Shield,
                path: '/risk/controls',
            },
            {
                label: 'Assessments',
                icon: FileCheck2,
                path: '/risk/assessments',
            },
            {
                label: 'Reports',
                icon: FileChartColumn,
                path: '/risk/reports',
            },
            {
                label: 'Settings',
                icon: Settings,
                path: '/risk/settings',
            },
        ],
    },
    {
        icon: Box,
        label: 'Asset',
        module: 'Asset',
        secondaryMenu: [
            {
                label: 'Dashboard',
                icon: LayoutDashboard,
                path: '/asset/dashboard',
            },
            {
                label: 'Assets',
                icon: LayoutList,
                path: '/asset/assets',
            },
            {
                label: 'Employees',
                icon: ContactRound,
                path: '/asset/employees',
            },
            {
                label: 'Sites',
                icon: Building,
                path: '/asset/sites',
            },
            {
                label: 'Locations',
                icon: MapPin,
                path: '/asset/locations',
            },
            {
                label: 'Departments',
                icon: Network,
                path: '/asset/departments',
            },
            {
                label: 'Categories',
                icon: Grid2X2,
                path: '/asset/categories',
            },
            {
                label: 'Statuses',
                icon: CircleCheck,
                path: '/asset/statuses',
            },
            {
                label: 'Reports',
                icon: FileChartColumn,
                path: '/asset/reports',
            },
        ],
    },
    {
        icon: ShieldAlert,
        label: 'Incident',
        module: 'Incident',
        secondaryMenu: [
            {
                label: 'Dashboard',
                icon: LayoutDashboard,
                path: '/incident/dashboard',
            },
            {
                label: 'My Incidents',
                icon: AlertTriangle,
                path: '/incident/my-incidents',
            },
            {
                label: 'Incident Register',
                icon: ListCheck,
                path: '/incident/register',
            },
            {
                label: 'Knowledge Base',
                icon: BookText,
                path: '/incident/knowledge-base',
            },
            {
                label: 'Reports',
                icon: FileChartColumn,
                path: '/incident/reports',
            },
            {
                label: 'Settings',
                icon: Settings,
                path: '/incident/settings',
            },
        ],
    },
    {
        icon: FileCheck,
        label: 'Compliance',
        module: 'Compliance',
        secondaryMenu: [
            {
                label: 'Dashboard',
                icon: LayoutDashboard,
                path: '/compliance/dashboard',
            },
            {
                label: 'Regulations & Standards',
                icon: BookText,
                path: '/compliance/regulations',
            },
            {
                label: 'Controls Management',
                icon: ListCheck,
                path: '/compliance/controls',
            },
            {
                label: 'Compliance Monitoring',
                icon: Activity,
                path: '/compliance/monitoring',
            },
            {
                label: 'Monitoring Plans',
                icon: Calendar,
                path: '/compliance/monitoring-plans',
            },
            {
                label: 'Assessments',
                icon: FileCheck2,
                path: '/compliance/assessments',
            },
            {
                label: 'Issues & Findings',
                icon: AlertTriangle,
                path: '/compliance/issues',
            },
            {
                label: 'Training & Awareness',
                icon: Users,
                path: '/compliance/training',
            },
            {
                label: 'Attestation Management',
                icon: Shield,
                path: '/compliance/attestation',
            },
            {
                label: 'Reports',
                icon: FileChartColumn,
                path: '/compliance/reports',
            },
            {
                label: 'Settings',
                icon: Settings,
                path: '/compliance/settings',
            },
        ],
    },
    {
        icon: Search,
        label: 'Audit',
        module: 'Audit',
        secondaryMenu: [
            {
                label: 'Dashboard',
                icon: LayoutDashboard,
                path: '/audit/dashboard',
            },
            {
                label: 'Audit Universe',
                icon: Network,
                path: '/audit/universe',
            },
            {
                label: 'Annual Audit Plans',
                icon: Calendar,
                path: '/audit/annual-plans',
            },
            {
                label: 'Audit Engagements',
                icon: ClipboardCheck,
                path: '/audit/engagements',
            },
            {
                label: 'Findings',
                icon: AlertTriangle,
                path: '/audit/findings',
            },
            {
                label: 'Corrective Action Plans',
                icon: FileCheck2,
                path: '/audit/action-plans',
            },
            {
                label: 'Finding Follow-Up',
                icon: RefreshCw,
                path: '/audit/follow-up',
            },
            {
                label: 'Audit Reporting',
                icon: FileChartColumn,
                path: '/audit/reporting',
            },
            {
                label: 'Workpapers',
                icon: FileText,
                path: '/audit/workpapers',
            },
            {
                label: 'Resource Management',
                icon: Users,
                path: '/audit/resources',
            },
            {
                label: 'Reports',
                icon: FileChartColumn,
                path: '/audit/reports',
            },
            {
                label: 'Settings',
                icon: Settings,
                path: '/audit/settings',
            },
        ],
    },
    {
        icon: Building2,
        label: 'Governance',
        module: 'Governance',
        secondaryMenu: [
            {
                label: 'Dashboard',
                icon: LayoutDashboard,
                path: '/governance/dashboard',
            },
            {
                label: 'Objectives & Strategy',
                icon: Grid2x2Check,
                path: '/governance/objectives',
            },
            {
                label: 'Organisational Structure',
                icon: Building,
                path: '/governance/org-structure',
            },
            {
                label: 'Policies',
                icon: FileText,
                path: '/governance/policies',
            },
            {
                label: 'Committee Management',
                icon: Users,
                path: '/governance/committees',
            },
            {
                label: 'Delegations of Authority',
                icon: UserCheck,
                path: '/governance/delegations',
            },
            {
                label: 'Business Continuity',
                icon: Shield,
                path: '/governance/business-continuity',
            },
            {
                label: 'Conflict of Interest',
                icon: Handshake,
                path: '/governance/conflict-of-interest',
            },
            {
                label: 'Reports',
                icon: FileChartColumn,
                path: '/governance/reports',
            },
            {
                label: 'Settings',
                icon: Settings,
                path: '/governance/settings',
            },
        ],
    },
    {
        icon: SquareActivity,
        label: 'Performance',
        module: 'Performance',
        secondaryMenu: [
            {
                label: 'Dashboard',
                icon: LayoutDashboard,
                path: '/performance/dashboard',
            },
            {
                label: 'KPIs',
                icon: SquareActivity,
                path: '/performance/kpis',
            },
            {
                label: 'Metrics',
                icon: Activity,
                path: '/performance/metrics',
            },
            {
                label: 'Scorecards',
                icon: Grid2x2Check,
                path: '/performance/scorecards',
            },
            {
                label: 'Reviews',
                icon: FileCheck2,
                path: '/performance/reviews',
            },
            {
                label: 'Reports',
                icon: FileChartColumn,
                path: '/performance/reports',
            },
            {
                label: 'Categories',
                icon: Grid2X2,
                path: '/performance/categories',
            },
            {
                label: 'Settings',
                icon: Settings,
                path: '/performance/settings',
            },
        ],
    },
];

export const bottomMenuItems: MenuItem[] = [
    {
        icon: HelpCircle,
        label: 'Help',
        secondaryMenu: [
            { label: 'FAQs', icon: MessageCircleQuestion, path: '/help/faq' },
            { label: 'User Guide', icon: BookText, path: '/help/user-guide' },
            { label: 'Contact Support', icon: LifeBuoy, path: '/help/contact-support' },
            { label: 'Share Feedback', icon: MessageSquare, path: '/help/feedback' },
        ],
    },
    {
        icon: Settings,
        label: 'Settings',
        secondaryMenu: [{ label: 'Account', icon: User, path: '/settings/account' }],
    },
];
