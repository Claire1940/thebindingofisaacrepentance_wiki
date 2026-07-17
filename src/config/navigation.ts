import type { LucideIcon } from 'lucide-react'
import {
	BookOpen,
	Package,
	Puzzle,
	Trophy,
	Swords,
	Users,
	Gamepad2,
	LifeBuoy,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'guide' -> t('nav.guide')
	path: string // URL 路径，如 '/guide'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 导航配置：The Binding of Isaac: Repentance 的 8 个内容分类
// 与 content/ 目录、关键词.json 的分类一一对应
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'items', path: '/items', icon: Package, isContentType: true },
	{ key: 'mods', path: '/mods', icon: Puzzle, isContentType: true },
	{ key: 'unlocks', path: '/unlocks', icon: Trophy, isContentType: true },
	{ key: 'bosses', path: '/bosses', icon: Swords, isContentType: true },
	{ key: 'multiplayer', path: '/multiplayer', icon: Users, isContentType: true },
	{ key: 'versions', path: '/versions', icon: Gamepad2, isContentType: true },
	{ key: 'support', path: '/support', icon: LifeBuoy, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> []

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
