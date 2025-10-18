
export default defineEventHandler(() => {
  return {
    data: [
      { category: 'Feed Cost', budget: 1200000, actual: 1150000 },
      { category: 'Medicine Cost', budget: 80000, actual: 90000 },
      { category: 'Hatchery Cost', budget: 250000, actual: 240000 },
      { category: 'Overhead Cost', budget: 300000, actual: 310000 },
      { category: 'DOC Sale', budget: 2500000, actual: 2600000 },
      { category: 'Other Income', budget: 50000, actual: 45000 },
    ]
  }
})
