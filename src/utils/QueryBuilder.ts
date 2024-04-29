class QueryBuilder {
  private filter: Record<string, any>

  private defaultFilter = {
    page: 1,
    page_size: 50,
  }

  constructor() {
    this.filter = { ...this.defaultFilter }
  }

  setFilter(key: string, value: any): QueryBuilder {
    this.filter[key] = value

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
    if (sortBy) {
      this.filter['sort_by'] = sortBy
    }

    return this
  }

  setSortType(sortType: 'asc' | 'desc'): QueryBuilder {
    if (sortType) {
      this.filter['sort_type'] = sortType
    }
    return this
  }

  buildUrl(): string {
    const params = new URLSearchParams()

    for (const key in this.filter) {
      if (this.filter.hasOwnProperty(key)) {
        params.append(key, this.filter[key].toString())
      }
    }

    return `?${params.toString()}`
  }
}

export default QueryBuilder
