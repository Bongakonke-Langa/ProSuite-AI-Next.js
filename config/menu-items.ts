export const topBarButtons = [
    {
        label: 'New Risk',
        path: '/risk-management/risks/create',
        primaryMenuItem: 'Risk',
        permissions: ['risk.create']
    },
    {
        label: 'New Asset',
        path: '/asset-management/assets/create',
        primaryMenuItem: 'Asset',
        permissions: ['asset.create']
    },
    {
        label: 'New Incident',
        path: '/incident-management/incidents/create',
        primaryMenuItem: 'Incident',
        permissions: ['incident.create']
    }
]
