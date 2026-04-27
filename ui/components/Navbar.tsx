"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { navbarStyles } from "@/ui/components/navbar/navbarStyles";

// SSR/CSR 일치 가드 — 서버 렌더 시 false / 클라이언트 hydration 후 true.
// `pathname` 이 SSR 에서 null 이라 active 클래스가 양쪽 false 로 일치 → hydration mismatch 회피.
const subscribe = () => () => {};
const getMounted = () => true;
const getMountedServer = () => false;

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Board", href: "/board" },
  { label: "Youtube", href: "/youtube" },
  { label: "뉴스", href: "/news" },
  { label: "저장된 기사", href: "/news/saved", requiresAuth: true },
  { label: "관심종목 관리", href: "/settings/watchlist", requiresAuth: true },
  { label: "종목 분석", href: "/stock-recommendation" },
  { label: "주식 Q&A", href: "/stock" },
  { label: "기업 정보", href: "/company-profile" },
  { label: "히스토리", href: "/dashboard" },
  { label: "스마트 머니", href: "/smart-money" },
  { label: "글로벌 포트폴리오", href: "/smart-money/global-portfolio" },
];

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export default function Navbar({ isAuthenticated = false, onLogout }: NavbarProps) {
  const pathname = usePathname();
  const mounted = useSyncExternalStore(subscribe, getMounted, getMountedServer);

  const menuItemStyle = (href: string) => {
    const isActive = mounted && pathname === href;
    return [
      navbarStyles.menuItem.base,
      isActive ? navbarStyles.menuItem.active : navbarStyles.menuItem.default,
    ].join(" ");
  };

  return (
    <nav className={navbarStyles.nav}>
      <div className={navbarStyles.inner}>
        <Link href="/" className={navbarStyles.logo}>
          Antelligen
        </Link>
        <div className={navbarStyles.menuList}>
          {menuItems.map((item) => {
            if (item.requiresAuth && !isAuthenticated) return null;
            return (
              <Link key={item.href} href={item.href} className={menuItemStyle(item.href)}>
                {item.label}
              </Link>
            );
          })}
          {isAuthenticated ? (
            <button onClick={onLogout} className={navbarStyles.authButton.logout}>
              Logout
            </button>
          ) : (
            <Link href="/login" className={navbarStyles.authButton.login}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
