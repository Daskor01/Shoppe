export interface Filters {
  search: string
  category: string
  sortBy: string
  priceRange: [number, number]
  onSale: boolean
  inStock: boolean
}