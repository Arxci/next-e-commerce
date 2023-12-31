import Stripe from 'stripe'
import { NextResponse } from 'next/server'

import { stripe } from '@/lib/stripe'
import prismaDB from '@/lib/prisma'

export const POST = async (req: Request) => {
	const { productIds, quantity } = await req.json()

	if (!productIds || productIds.length === 0) {
		return new NextResponse('Products are required', { status: 400 })
	}

	if (!quantity || quantity.length === 0) {
		return new NextResponse('quantity is required', { status: 400 })
	}

	const products = await prismaDB.product.findMany({
		where: {
			id: {
				in: productIds,
			},
		},
	})

	const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

	interface ProductQuantityInterface {
		quantity: string
		id: string
	}

	let index = 0
	products.forEach((product) => {
		const productQuantity = quantity.find(
			(obj: ProductQuantityInterface) => obj.id === product.id
		).quantity
		line_items.push({
			quantity: productQuantity,
			price_data: {
				currency: 'USD',
				product_data: {
					name: product.name,
				},
				unit_amount: product.price.toNumber() * 100,
			},
		})
		index += 1
	})

	const order = await prismaDB.order.create({
		data: {
			isPaid: false,
			orderItems: {
				create: productIds.map((productId: string) => ({
					product: {
						connect: {
							id: productId,
						},
					},
				})),
			},
		},
	})

	const session = await stripe.checkout.sessions.create({
		line_items,
		mode: 'payment',
		billing_address_collection: 'required',
		phone_number_collection: {
			enabled: true,
		},
		success_url: `${process.env.FRONTEND_STORE_URL}/?success=1`,
		cancel_url: `${process.env.FRONTEND_STORE_URL}/?cancelled=1`,
		metadata: {
			orderId: order.id,
		},
	})

	return NextResponse.json({ url: session.url })
}
