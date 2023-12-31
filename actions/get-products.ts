import queryString from 'query-string'

import { Product } from '@/types'

const URL = `${process.env.NEXT_PUBLIC_API_URL}products`

interface Query {
	isFeatured?: string
	category?: string
	price?: string
	sort?: string
	skip?: string
	take?: string
	onSale?: string
}

const getProducts = async (
	query: Query
): Promise<{ pagination: { total: number }; data: Product[] }> => {
	const url = queryString.stringifyUrl({
		url: URL,
		query: {
			isFeatured: query.isFeatured,
			category: query.category,
			price: query.price,
			sort: query.sort,
			skip: query.skip,
			take: query.take,
			onSale: query.onSale,
		},
	})

	const res = await fetch(url, {
		cache: 'no-store',
	})

	return res.json()
}

export default getProducts
