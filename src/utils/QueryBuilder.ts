class QueryBuilder {
  private filter: Record<string, any>
  private debounceFilter: Record<string, any>

  private defaultFilter = {
    page: 1,
    page_size: 50,
  }

  constructor() {
    this.filter = { ...this.defaultFilter }
    this.debounceFilter = {}
  }

  setFilter(key: string, value: any, debounce?: boolean): QueryBuilder {
    if (!debounce) {
      this.filter[key] = value
    } else {
      this.debounceFilter[key] = { value, debounce }
    }

    return this
  }

  setPage(page: number): QueryBuilder {
    this.filter['page'] = page
    return this
  }

  setPageSize(pageSize: number): QueryBuilder {
    this.filter['page_size'] = pageSize
    return this
  }

  setSortBy(sortBy: string): QueryBuilder {
    this.filter['sort_by'] = sortBy
    return this
  }

  setSortType(sortType: 'asc' | 'desc'): QueryBuilder {
    this.filter['sort_type'] = sortType
    return this
  }

  getDebounceFilters(): Record<string, any> {
    return Object.entries(this.debounceFilter).map(([key]) => key)
  }

  buildUrl(): string {
    const params = new URLSearchParams()

    for (const key in this.filter) {
      if (this.filter.hasOwnProperty(key)) {
        params.append(key, this.filter[key].toString())
      }
    }

    for (const key in this.debounceFilter) {
      if (this.debounceFilter.hasOwnProperty(key)) {
        console.log(this.debounceFilter[key].value)

        params.append(key, this.debounceFilter[key].value)
      }
    }

    return `?${params.toString()}`
  }
}

export default QueryBuilder
