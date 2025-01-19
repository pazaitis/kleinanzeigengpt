import CostManagement from '../../components/CostManagement'

const tabs = [
  { name: 'Overview', current: true },
  { name: 'Users', current: false },
  { name: 'Analyses', current: false },
  { name: 'Cost Management', current: false },
  // ... other tabs
]

function renderTabContent(currentTab) {
  switch (currentTab) {
    // ... other cases
    case 'Cost Management':
      return <CostManagement />
    default:
      return <Overview />
  }
} 