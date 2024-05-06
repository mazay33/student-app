class QueryBuilder {
	private filter: Record<string, any> = {};

	setFilter(key: string, value: any): this {
		if (value && typeof value === 'number') {
			this.filter[key] = value;
		} else if (typeof value === 'string') {
			this.filter[key] = value || '';
		}

		return this;
	}

	setPage(page: number): this {
		this.filter.page = page;
		return this;
	}

	setPageSize(pageSize: number): this {
		this.filter.page_size = pageSize;
		return this;
	}

	setSortBy(sortBy: string): this {
		if (sortBy) {
			this.filter.sort_by = sortBy;
		}
		return this;
	}

	setSortType(sortType: 'asc' | 'desc'): this {
		if (sortType) {
			this.filter.sort_type = sortType;
		}
		return this;
	}

	buildUrl(): string {
		const params = new URLSearchParams();
		Object.entries(this.filter).forEach(([key, value]) => {
			params.append(key, value.toString());
		});
		return `?${params.toString()}`;
	}
}

export default QueryBuilder;
