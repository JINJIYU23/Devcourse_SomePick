import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiMiniMoon, HiMiniSun } from "react-icons/hi2";
import { TbBell, TbMessageHeart, TbUserCircle } from "react-icons/tb";
import { Link, NavLink, useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import {
  fetchNotifications,
  subscribeNotification,
} from "../../apis/notification";
import logoImage from "../../assets/images/new_logo.png";
import HeaderModal from "../../components/modals/HeaderModal";
import Notifications from "../../components/modals/Notifications";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useAuthStore } from "../../stores/authStore";

export default function Header() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // const [isAlertOpen, setIsAlertOpen] = useState(false);
  const outsideRef = useRef<HTMLDivElement | null>(null);

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const isLogin = useAuthStore((state) => state.isLogin);
  const session = useAuthStore((state) => state.session);
  const couple = session?.user.user_metadata.status;

  // 초기 알림 데이터
  useEffect(() => {
    const loadNotifications = async () => {
      if (!isLogin) return;

      try {
        const data = await fetchNotifications();
        if (data) {
          setNotifications(data);
          setHasUnreadNotifications(data.length > 0);
        }
      } catch (error) {
        console.error("알림 로드 에러:", error);
      }
    };

    loadNotifications();
  }, [isLogin, session]);

  // 헤더에서는 상태 업데이트
  const addNotification = useCallback(
    (newNotification: NotificationData) => {
      if (newNotification.sender_id === session?.user.id) return;
      setNotifications((prev) => [newNotification, ...prev]);
      setHasUnreadNotifications(true);
    },
    [session]
  );

  // 실시간 알림 구독
  useEffect(() => {
    if (!isLogin) return;

    let channel: RealtimeChannel | null = null;

    const subscribe = async () => {
      const res = await subscribeNotification(addNotification);
      channel = res ?? null;
    };

    subscribe();

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [isLogin, addNotification]);

  const updateNotifications = (updatedNotifications: NotificationData[]) => {
    setNotifications(updatedNotifications);
    setHasUnreadNotifications(updatedNotifications.length > 0);
  };

  const closeHeaderModal = (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        outsideRef.current &&
        !outsideRef.current.contains(e.target as Node)
      ) {
        setIsNotificationOpen(false);
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen, isModalOpen]);

  return (
    <>
      <div className="header flex justify-center items-center bg-white dark:bg-[var(--dark-bg-primary)] border-b-2 border-b-[var(--primary-pink)] fixed w-full z-40 h-[66px]">
        <div className="w-[1350px] flex items-center justify-between">
          <img
            src={logoImage}
            alt="로고 이미지"
            onClick={() => navigate("/")}
            className="cursor-pointer w-[10%]"
          />
          <div className="relative flex items-center gap-[65px] dark:text-[var(--dark-gray-700)]">
            <NavLink
              className={({ isActive }) =>
                twMerge(
                  "relative header-menu",
                  isActive &&
                    (isDark
                      ? "header-menu__active text-white"
                      : "header-menu__active text-black"),
                  isDark && "dark-mode-class__active"
                )
              }
              to={"/post/dating"}
            >
              연애백과
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                twMerge(
                  "relative header-menu",
                  isActive &&
                    (isDark
                      ? "header-menu__active text-white"
                      : "header-menu__active text-black"),
                  isDark && "dark-mode-class__active"
                )
              }
              to={"/post/free"}
            >
              자유 게시판
            </NavLink>
            <div className="flex items-center">
              {couple === "couple" ? (
                <NavLink
                  to={"/couplecalendar"}
                  className={({ isActive }) =>
                    twMerge(
                      "relative flex header-menu cursor-pointer mr-[65px]",
                      isActive &&
                        (isDark
                          ? "header-menu__active text-white"
                          : "header-menu__active text-black")
                    )
                  }
                >
                  커플 캘린더
                </NavLink>
              ) : (
                <NavLink
                  to={"/matching"}
                  className={({ isActive }) =>
                    twMerge(
                      "relative header-menu cursor-pointer mr-[65px]",
                      isActive &&
                        (isDark
                          ? "header-menu__active text-white"
                          : "header-menu__active text-black")
                    )
                  }
                >
                  소개팅
                </NavLink>
              )}
              <NavLink
                to={"/todayfortune"}
                className={({ isActive }) =>
                  twMerge(
                    "relative header-menu cursor-pointer",
                    isActive &&
                      (isDark
                        ? "header-menu__active text-white"
                        : "header-menu__active text-black")
                  )
                }
              >
                오늘의 운세
              </NavLink>
            </div>
          </div>
          <div className="flex items-center gap-[35px] text-[var(--gray-700)]">
            {isLogin &&
              (couple === "couple" ? (
                <>
                  <div
                    className="relative cursor-pointer"
                    onClick={() => {
                      setIsNotificationOpen((state) => !state);
                    }}
                  >
                    <TbBell
                      size={25}
                      className="dark:text-[var(--dark-gray-700)] cursor-pointer"
                    />
                    {hasUnreadNotifications && (
                      <span className="absolute top-[-7px] right-[-2px] text-[var(--red)] text-[16px]">
                        ●
                      </span>
                    )}
                    {isNotificationOpen && (
                      <div ref={outsideRef}>
                        <Notifications
                          notifications={notifications}
                          onNotificationsChange={updateNotifications}
                        />
                      </div>
                    )}
                  </div>
                  <div
                    className="relative cursor-pointer"
                    onClick={() => setIsModalOpen((state) => !state)}
                  >
                    <TbUserCircle
                      size={25}
                      className="dark:text-[var(--dark-gray-700)] cursor-pointer"
                    />
                    {isModalOpen && (
                      <div ref={outsideRef}>
                        <HeaderModal onClose={() => setIsModalOpen(false)} />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to={"/message"}>
                    <TbMessageHeart
                      size={25}
                      className="dark:text-[var(--dark-gray-700)] cursor-pointer"
                    />
                  </Link>
                  <div
                    className="relative cursor-pointer"
                    onClick={() => {
                      setIsNotificationOpen((state) => !state);
                    }}
                  >
                    <TbBell
                      size={25}
                      className="dark:text-[var(--dark-gray-700)] cursor-pointer"
                    />

                    {hasUnreadNotifications && (
                      <span className="absolute top-[-7px] right-[-2px] text-[var(--red)] text-[18px]">
                        ●
                      </span>
                    )}
                    {isNotificationOpen && (
                      <div ref={outsideRef}>
                        <Notifications
                          notifications={notifications}
                          onNotificationsChange={updateNotifications}
                        />
                      </div>
                    )}
                  </div>
                  <div
                    className="relative cursor-pointer"
                    onClick={() => setIsModalOpen((state) => !state)}
                  >
                    <TbUserCircle
                      size={25}
                      className="dark:text-[var(--dark-gray-700)] cursor-pointer"
                    />
                    {isModalOpen && (
                      <div ref={outsideRef}>
                        <HeaderModal onClose={closeHeaderModal} />
                      </div>
                    )}
                  </div>
                </>
              ))}

            {!isLogin && (
              <NavLink
                className={({ isActive }) =>
                  twMerge(
                    "relative header-menu inline-block whitespace-nowrap dark:text-[var(--dark-gray-700)]",
                    isActive && "header-menu__active text-black",
                    isDark && "dark-mode-class text-white"
                  )
                }
                to={"/auth/login"}
              >
                로그인/회원가입
              </NavLink>
            )}
            <>
              <button onClick={toggleDarkMode}>
                {isDark ? (
                  <div className="cursor-pointer">
                    <HiMiniSun
                      size={25}
                      className="dark:text-[var(--dark-gray-700)]"
                    />
                  </div>
                ) : (
                  <div className="cursor-pointer">
                    <HiMiniMoon
                      size={25}
                      className="dark:text-[var(--dark-gray-700)]"
                    />
                  </div>
                )}
              </button>
            </>
          </div>
        </div>
      </div>
      <div className="w-full h-[66px]" />
    </>
  );
}
