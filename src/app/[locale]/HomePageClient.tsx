"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Gamepad2,
  Gift,
  Info,
  Layers,
  ListChecks,
  Map,
  Package2,
  Puzzle,
  ShieldAlert,
  Skull,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
// import { SidebarAd } from "@/components/ads/SidebarAd";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Shared styling tokens
const CARD =
  "p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors";
const BADGE =
  "inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border whitespace-nowrap";

// Tier color tokens (item tier list & character tier list)
const TIER_STYLES: Record<string, string> = {
  S: "bg-amber-500/15 border-amber-500/40 text-amber-400",
  A: "bg-orange-500/15 border-orange-500/40 text-orange-400",
  B: "bg-sky-500/15 border-sky-500/40 text-sky-400",
  C: "bg-slate-500/15 border-slate-500/40 text-slate-300",
  D: "bg-zinc-500/15 border-zinc-500/40 text-zinc-400",
};

// Character difficulty colors
const DIFFICULTY_STYLES: Record<string, string> = {
  "Very Easy": "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
  Easy: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
  Moderate: "bg-sky-500/15 border-sky-500/40 text-sky-400",
  Hard: "bg-orange-500/15 border-orange-500/40 text-orange-400",
  "Very Hard": "bg-red-500/15 border-red-500/40 text-red-400",
  Extreme: "bg-red-500/15 border-red-500/40 text-red-400",
};

// Challenge difficulty colors
const CHAL_DIFFICULTY: Record<string, string> = {
  Easy: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
  Medium: "bg-sky-500/15 border-sky-500/40 text-sky-400",
  Hard: "bg-orange-500/15 border-orange-500/40 text-orange-400",
  Extreme: "bg-red-500/15 border-red-500/40 text-red-400",
};

// Unlock priority colors (matched by substring)
function priorityStyle(priority: string): string {
  const p = priority.toLowerCase();
  if (p.includes("essential")) {
    return "bg-red-500/15 border-red-500/40 text-red-400";
  }
  if (p.includes("highest")) {
    return "bg-orange-500/15 border-orange-500/40 text-orange-400";
  }
  if (p.includes("high")) {
    return "bg-orange-500/15 border-orange-500/40 text-orange-400";
  }
  if (p.includes("medium")) {
    return "bg-sky-500/15 border-sky-500/40 text-sky-400";
  }
  return "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]";
}

// Section header used by every module
function SectionHeader({
  eyebrow,
  title,
  intro,
  icon,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="mb-8 md:mb-12 scroll-reveal text-center">
      <div
        className="mb-3 md:mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                   bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
      >
        <span className="text-[hsl(var(--nav-theme-light))]">{icon}</span>
        <span className="text-xs md:text-sm font-semibold tracking-wide text-[hsl(var(--nav-theme-light))]">
          {eyebrow}
        </span>
      </div>
      <h2 className="mb-3 md:mb-4 text-3xl md:text-5xl font-bold leading-tight">
        {title}
      </h2>
      <p className="mx-auto max-w-3xl text-base md:text-lg text-muted-foreground">
        {intro}
      </p>
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.thebindingofisaacrepentance.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "The Binding of Isaac: Repentance Wiki",
        description:
          "Complete The Binding of Isaac: Repentance Wiki covering items, characters, unlocks, bosses, routes, challenges, seeds, synergies, and mods for the dark roguelike dungeon shooter on Steam.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "The Binding of Isaac: Repentance - Dark Roguelike Dungeon Shooter",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "The Binding of Isaac: Repentance Wiki",
        alternateName: "The Binding of Isaac: Repentance",
        url: siteUrl,
        description:
          "Complete The Binding of Isaac: Repentance Wiki resource hub for items, characters, unlocks, bosses, challenges, routes, and mods",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "The Binding of Isaac: Repentance Wiki - Dark Roguelike Dungeon Shooter",
        },
        sameAs: [
          "https://store.steampowered.com/app/1426300/The_Binding_of_Isaac_Repentance/",
          "https://discord.com/invite/isaac",
          "https://www.reddit.com/r/bindingofisaac/",
        ],
      },
      {
        "@type": "VideoGame",
        name: "The Binding of Isaac: Repentance",
        gamePlatform: ["PC", "Steam"],
        applicationCategory: "Game",
        genre: ["Roguelike", "Dungeon Crawler", "Shooter", "Indie"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 4,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/1426300/The_Binding_of_Isaac_Repentance/",
        },
      },
      {
        "@type": "VideoObject",
        name: "The Binding of Isaac: Repentance Launch Trailer",
        description:
          "Official Nicalis launch trailer for The Binding of Isaac: Repentance, the ultimate dark roguelike dungeon shooter.",
        uploadDate: "2021-03-31",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/JUKJYuSN_KM",
        url: "https://www.youtube.com/watch?v=JUKJYuSN_KM",
      },
    ],
  };

  // Module 5 boss accordion state
  const [bossExpanded, setBossExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Tools Grid 8 cards -> section id mapping (order matches en.json tools.cards)
  const toolSectionIds = [
    "beginner-guide",
    "item-tier-list",
    "characters-and-tainted-characters",
    "unlock-guide",
    "bosses-and-endings",
    "challenges-and-rewards",
    "best-mods",
    "repentance-plus-online-co-op",
  ];

  const m = t.modules;
  const beginner = m.isaacBeginnerGuide;
  const items = m.isaacItemTierList;
  const characters = m.isaacCharacters;
  const unlocks = m.isaacUnlockGuide;
  const bosses = m.isaacBossesAndEndings;
  const challenges = m.isaacChallenges;
  const mods = m.isaacBestMods;
  const coop = m.isaacOnlineCoop;

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/1426300/The_Binding_of_Isaac_Repentance/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero，IntersectionObserver 进入视口自动播放 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="JUKJYuSN_KM"
              title="The Binding of Isaac: Repentance - Launch Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 模块导航区，置于 Video 之后、Latest Updates 之前 */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = toolSectionIds[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section（无文章时自动隐藏） */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={12} />

      {/* Module 1: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={beginner.eyebrow}
            title={beginner.title}
            intro={beginner.intro}
            icon={<BookOpen className="w-4 h-4" />}
          />

          <div className="scroll-reveal mb-8 md:mb-10 rounded-xl border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)] p-4 md:p-6">
            <p className="text-sm md:text-base text-muted-foreground">
              {beginner.subtitle}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {beginner.steps.map((step: any, index: number) => (
              <div key={index} className={CARD}>
                <div className="flex flex-col gap-3 md:flex-row md:gap-5">
                  <div className="flex items-center gap-3 md:flex-col md:items-center md:gap-2">
                    <div className="flex h-11 w-11 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                      <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                        {step.step}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <div className="mb-3 flex items-start gap-2 text-sm text-[hsl(var(--nav-theme-light))]">
                      <Target className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>{step.goal}</span>
                    </div>
                    <ul className="mb-4 space-y-1.5">
                      {step.details.map((d: string, di: number) => (
                        <li key={di} className="flex items-start gap-2 text-sm md:text-base text-muted-foreground">
                          <Check className="mt-1 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                    {step.checklist?.length > 0 && (
                      <div className="rounded-lg border border-border bg-white/5 p-3 md:p-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Checklist
                        </p>
                        <ul className="space-y-1.5">
                          {step.checklist.map((c: string, ci: number) => (
                            <li key={ci} className="flex items-start gap-2 text-sm">
                              <ClipboardCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Sparkles className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {beginner.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 4 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Item Tier List */}
      <section id="item-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={items.eyebrow}
            title={items.title}
            intro={items.intro}
            icon={<Layers className="w-4 h-4" />}
          />

          <div className="space-y-8 md:space-y-10">
            {items.tiers.map((tier: any, ti: number) => (
              <div key={ti} className="scroll-reveal">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span
                    className={`${BADGE} h-10 w-10 justify-center text-lg font-extrabold ${TIER_STYLES[tier.tier] || TIER_STYLES.D}`}
                  >
                    {tier.tier}
                  </span>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold">{tier.label}</h3>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
                  {tier.entries.map((entry: any, ei: number) => (
                    <div key={ei} className={CARD}>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h4 className="font-bold">{entry.name}</h4>
                      </div>
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {entry.type && (
                          <span className={`${BADGE} bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]`}>
                            {entry.type}
                          </span>
                        )}
                        {entry.pool && (
                          <span className={`${BADGE} bg-white/5 border-border text-muted-foreground`}>
                            {entry.pool}
                          </span>
                        )}
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">{entry.effect}</p>
                      {entry.best_use && (
                        <p className="mb-2 flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                          <span className="text-muted-foreground">{entry.best_use}</span>
                        </p>
                      )}
                      {entry.caution && (
                        <p className="mb-2 flex items-start gap-2 text-sm">
                          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                          <span className="text-muted-foreground">{entry.caution}</span>
                        </p>
                      )}
                      {entry.unlock && (
                        <p className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                          <span>Unlock: {entry.unlock}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Characters and Tainted Characters */}
      <section id="characters-and-tainted-characters" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={characters.eyebrow}
            title={characters.title}
            intro={characters.intro}
            icon={<Users className="w-4 h-4" />}
          />

          <div className="space-y-8 md:space-y-10">
            {characters.tiers.map((tier: any, ti: number) => (
              <div key={ti} className="scroll-reveal">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span
                    className={`${BADGE} h-10 w-10 justify-center text-lg font-extrabold ${TIER_STYLES[tier.tier] || TIER_STYLES.D}`}
                  >
                    {tier.tier}
                  </span>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold">{tier.label}</h3>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  {tier.entries.map((entry: any, ei: number) => (
                    <div key={ei} className={CARD}>
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold">{entry.name}</h4>
                          {entry.variant && (
                            <span className={`${BADGE} bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]`}>
                              {entry.variant}
                            </span>
                          )}
                        </div>
                        {entry.difficulty && (
                          <span className={`${BADGE} ${DIFFICULTY_STYLES[entry.difficulty] || DIFFICULTY_STYLES.Hard}`}>
                            {entry.difficulty}
                          </span>
                        )}
                      </div>
                      <dl className="space-y-2 text-sm">
                        {entry.unlock && (
                          <div className="flex items-start gap-2">
                            <dt className="flex-shrink-0 text-muted-foreground"><Gift className="h-4 w-4" /></dt>
                            <dd className="text-muted-foreground">{entry.unlock}</dd>
                          </div>
                        )}
                        {entry.starts_with && (
                          <div className="flex items-start gap-2">
                            <dt className="flex-shrink-0 text-muted-foreground"><Package2 className="h-4 w-4" /></dt>
                            <dd className="text-muted-foreground">{entry.starts_with}</dd>
                          </div>
                        )}
                        {entry.core_mechanic && (
                          <div className="flex items-start gap-2">
                            <dt className="flex-shrink-0 text-muted-foreground"><Target className="h-4 w-4" /></dt>
                            <dd className="text-muted-foreground">{entry.core_mechanic}</dd>
                          </div>
                        )}
                      </dl>
                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {entry.strengths?.length > 0 && (
                          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                            <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-emerald-400">
                              <Zap className="h-3.5 w-3.5" /> Strengths
                            </p>
                            <ul className="space-y-1">
                              {entry.strengths.map((s: string, si: number) => (
                                <li key={si} className="text-xs text-muted-foreground">• {s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {entry.weaknesses?.length > 0 && (
                          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-2.5">
                            <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-red-400">
                              <ShieldAlert className="h-3.5 w-3.5" /> Weaknesses
                            </p>
                            <ul className="space-y-1">
                              {entry.weaknesses.map((w: string, wi: number) => (
                                <li key={wi} className="text-xs text-muted-foreground">• {w}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 4: Unlock Guide */}
      <section id="unlock-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={unlocks.eyebrow}
            title={unlocks.title}
            intro={unlocks.intro}
            icon={<ClipboardCheck className="w-4 h-4" />}
          />

          <div className="scroll-reveal relative space-y-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] pl-6 md:pl-8">
            {unlocks.phases.map((phase: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.65rem] md:-left-[2.15rem] flex h-4 w-4 items-center justify-center">
                  <div className="h-4 w-4 rounded-full border-2 border-background bg-[hsl(var(--nav-theme))]" />
                </div>
                <div className={CARD}>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold">{phase.phase}</h3>
                    {phase.priority && (
                      <span className={`${BADGE} ${priorityStyle(phase.priority)}`}>
                        {phase.priority}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    {phase.requirement && (
                      <p className="flex items-start gap-2 text-muted-foreground">
                        <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                        <span><span className="font-semibold text-foreground">Requirement:</span> {phase.requirement}</span>
                      </p>
                    )}
                    {phase.unlocks && (
                      <p className="flex items-start gap-2 text-muted-foreground">
                        <Gift className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                        <span><span className="font-semibold text-foreground">Unlocks:</span> {phase.unlocks}</span>
                      </p>
                    )}
                    {phase.recommended_actions && (
                      <p className="flex items-start gap-2 text-muted-foreground">
                        <ListChecks className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                        <span><span className="font-semibold text-foreground">Actions:</span> {phase.recommended_actions}</span>
                      </p>
                    )}
                    {phase.next_target && (
                      <p className="flex items-start gap-2 text-muted-foreground">
                        <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                        <span><span className="font-semibold text-foreground">Next:</span> {phase.next_target}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Bosses and Endings */}
      <section id="bosses-and-endings" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={bosses.eyebrow}
            title={bosses.title}
            intro={bosses.intro}
            icon={<Skull className="w-4 h-4" />}
          />

          <div className="scroll-reveal space-y-2">
            {bosses.bosses.map((boss: any, index: number) => {
              const open = bossExpanded === index;
              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-border"
                >
                  <button
                    onClick={() => setBossExpanded(open ? null : index)}
                    className="flex w-full items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Skull className="h-5 w-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                      <span className="font-semibold text-base md:text-lg">{boss.heading}</span>
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && (
                    <div className="space-y-3 border-t border-border p-4 md:p-5 text-sm text-muted-foreground">
                      <p className="flex items-start gap-2">
                        <Map className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                        <span><span className="font-semibold text-foreground">Route:</span> {boss.route}</span>
                      </p>
                      {boss.requirements?.length > 0 && (
                        <div>
                          <p className="mb-1 flex items-center gap-2 font-semibold text-foreground">
                            <ClipboardCheck className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" /> Requirements
                          </p>
                          <ul className="ml-6 space-y-1">
                            {boss.requirements.map((r: string, ri: number) => (
                              <li key={ri} className="list-disc">{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {boss.attacks?.length > 0 && (
                        <div>
                          <p className="mb-1 flex items-center gap-2 font-semibold text-foreground">
                            <Swords className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" /> Attacks
                          </p>
                          <ul className="ml-6 space-y-1">
                            {boss.attacks.map((a: string, ai: number) => (
                              <li key={ai} className="list-disc">{a}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {boss.preparation?.length > 0 && (
                        <div>
                          <p className="mb-1 flex items-center gap-2 font-semibold text-foreground">
                            <Wrench className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" /> Preparation
                          </p>
                          <ul className="ml-6 space-y-1">
                            {boss.preparation.map((p: string, pi: number) => (
                              <li key={pi} className="list-disc">{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {boss.result && (
                        <p className="flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                          <Trophy className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                          <span><span className="font-semibold text-foreground">Result:</span> {boss.result}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 6 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 6: Challenges and Rewards */}
      <section id="challenges-and-rewards" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={challenges.eyebrow}
            title={challenges.title}
            intro={challenges.intro}
            icon={<Swords className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            {challenges.challenges.map((challenge: any, index: number) => (
              <div key={index} className={CARD}>
                <div className="mb-2 flex items-center gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)] text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                    {challenge.number}
                  </span>
                  <h4 className="font-bold leading-tight">{challenge.challenge}</h4>
                </div>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {challenge.difficulty && (
                    <span className={`${BADGE} ${CHAL_DIFFICULTY[challenge.difficulty] || CHAL_DIFFICULTY.Hard}`}>
                      {challenge.difficulty}
                    </span>
                  )}
                  {challenge.destination && (
                    <span className={`${BADGE} bg-white/5 border-border text-muted-foreground`}>
                      → {challenge.destination}
                    </span>
                  )}
                </div>
                <dl className="space-y-1 text-xs text-muted-foreground md:text-sm">
                  {challenge.character && (
                    <div className="flex gap-1.5">
                      <dt className="font-semibold text-foreground">Character:</dt>
                      <dd>{challenge.character}</dd>
                    </div>
                  )}
                  {challenge.setup && (
                    <div className="flex gap-1.5">
                      <dt className="font-semibold text-foreground">Setup:</dt>
                      <dd>{challenge.setup}</dd>
                    </div>
                  )}
                  {challenge.rules && (
                    <div className="flex gap-1.5">
                      <dt className="font-semibold text-foreground">Rules:</dt>
                      <dd>{challenge.rules}</dd>
                    </div>
                  )}
                </dl>
                {challenge.strategy && (
                  <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground md:text-sm">
                    <ListChecks className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                    <span>{challenge.strategy}</span>
                  </p>
                )}
                {challenge.reward && (
                  <p className="mt-2 flex items-start gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2 py-1.5 text-xs md:text-sm">
                    <Gift className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                    <span><span className="font-semibold text-foreground">Reward:</span> {challenge.reward}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Best Mods */}
      <section id="best-mods" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={mods.eyebrow}
            title={mods.title}
            intro={mods.intro}
            icon={<Puzzle className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            {mods.mods.map((mod: any, index: number) => (
              <div key={index} className={CARD}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-base font-bold md:text-lg">{mod.name}</h4>
                  {mod.category && (
                    <span className={`${BADGE} bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]`}>
                      {mod.category}
                    </span>
                  )}
                </div>
                {mod.best_for && (
                  <p className="mb-2 text-sm text-[hsl(var(--nav-theme-light))]">
                    {mod.best_for}
                  </p>
                )}
                <p className="mb-3 text-sm text-muted-foreground">{mod.description}</p>
                <dl className="space-y-1.5 text-xs text-muted-foreground md:text-sm">
                  {mod.compatibility && (
                    <div className="flex items-start gap-1.5">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                      <span><span className="font-semibold text-foreground">Compatibility:</span> {mod.compatibility}</span>
                    </div>
                  )}
                  {mod.requirements && (
                    <div className="flex items-start gap-1.5">
                      <Wrench className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                      <span><span className="font-semibold text-foreground">Requirements:</span> {mod.requirements}</span>
                    </div>
                  )}
                  {mod.conflicts && (
                    <div className="flex items-start gap-1.5">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
                      <span><span className="font-semibold text-foreground">Conflicts:</span> {mod.conflicts}</span>
                    </div>
                  )}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 7: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 8: Repentance+ Online Co-op */}
      <section id="repentance-plus-online-co-op" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={coop.eyebrow}
            title={coop.title}
            intro={coop.intro}
            icon={<Gamepad2 className="w-4 h-4" />}
          />

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {coop.steps.map((step: any, index: number) => (
              <div key={index} className={CARD}>
                <div className="flex flex-col gap-3 md:flex-row md:gap-5">
                  <div className="flex items-center gap-3 md:flex-col md:items-center md:gap-2">
                    <div className="flex h-11 w-11 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                      <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                        {step.step}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg md:text-xl font-bold">{step.heading}</h3>
                    {step.details?.length > 0 && (
                      <ul className="space-y-1.5">
                        {step.details.map((d: string, di: number) => (
                          <li key={di} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {step.options?.length > 0 && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {step.options.map((opt: any, oi: number) => (
                          <div key={oi} className="rounded-lg border border-border bg-white/5 p-3">
                            <p className="mb-1 text-sm font-semibold text-[hsl(var(--nav-theme-light))]">{opt.mode}</p>
                            <p className="text-xs text-muted-foreground">{opt.use}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {step.updates?.length > 0 && (
                      <div className="rounded-lg border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)] p-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Patch Notes
                        </p>
                        <ul className="space-y-1.5">
                          {step.updates.map((u: any, ui: number) => (
                            <li key={ui} className="flex items-start gap-2 text-sm">
                              <span className={`${BADGE} bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]`}>
                                {u.version}
                              </span>
                              <span className="text-muted-foreground">{u.focus}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/isaac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/bindingofisaac/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/app/1426300"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/1426300/The_Binding_of_Isaac_Repentance/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
