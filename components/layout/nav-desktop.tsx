'use client'

import * as React from 'react'
import Link from 'next/link'
import type { MainNavItem } from '@/types'

import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

interface NavDesktop {
	items?: MainNavItem[]
}

const NavDesktop = ({ items }: NavDesktop) => {
	return (
		<div className="flex gap-6 ">
			<Link
				aria-label="Home"
				href="/"
				className="items-center space-x-2 flex"
			>
				<span className=" font-bold inline-block">{siteConfig.name}</span>
			</Link>
			<NavigationMenu className="hidden lg:flex">
				<NavigationMenuList>
					{items?.[0]?.items ? (
						<NavigationMenuItem>
							<NavigationMenuTrigger className="h-auto">
								{items[0].title}
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
									<li className="row-span-3">
										<NavigationMenuLink asChild>
											<Link
												aria-label="Home"
												className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
												href="/"
											>
												<div className="mb-2 mt-4 text-lg font-medium">
													{siteConfig.name}
												</div>
												<p className="text-sm leading-tight text-muted-foreground">
													{siteConfig.description}
												</p>
											</Link>
										</NavigationMenuLink>
									</li>
									{items[0].items.map((item) => (
										<Link
											href={item.href || '/'}
											legacyBehavior
											passHref
											key={item.title}
										>
											<ListItem
												title={item.title}
												href={item.href}
											>
												{item.description}
											</ListItem>
										</Link>
									))}
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
					) : null}
					{items
						?.filter((item) => item.title !== items[0]?.title)
						.map((item) =>
							item?.items ? (
								<NavigationMenuItem key={item.title}>
									<NavigationMenuTrigger className="h-auto capitalize">
										{item.title}
									</NavigationMenuTrigger>
									<NavigationMenuContent>
										<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
											{item.items.map((item) => (
												<Link
													href={item.href || '/'}
													legacyBehavior
													passHref
													key={item.title}
												>
													<ListItem
														title={item.title}
														href={item.href}
													>
														{item.description}
													</ListItem>
												</Link>
											))}
										</ul>
									</NavigationMenuContent>
								</NavigationMenuItem>
							) : (
								item.href && (
									<NavigationMenuItem key={item.title}>
										<Link
											href={item.href}
											legacyBehavior
											passHref
										>
											<NavigationMenuLink
												className={cn(navigationMenuTriggerStyle(), 'h-auto')}
											>
												{item.title}
											</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
								)
							)
						)}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	)
}

export default NavDesktop

const ListItem = React.forwardRef<
	React.ElementRef<'a'>,
	React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
						className
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	)
})
ListItem.displayName = 'ListItem'
