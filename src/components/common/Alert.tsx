import { twMerge } from "tailwind-merge";

export default function Alert({
  title,
  subtitle,
  isOk,
  isNotOk,
  onClick,
  onCancel,
}: {
  title: string;
  subtitle?: string;
  isOk: string;
  isNotOk?: string;
  onClick?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] dark:bg-[rgba(0,0,0,0.6)] flex justify-center items-center z-50">
      <div
        className="w-[300px] h-[180px] bg-[var(--white)] dark:bg-[var(--dark-bg-secondary)]
        rounded-[20px] flex flex-col justify-between px-4 py-4 shadow-md"
      >
        {/* 텍스트 */}

        <div className="flex flex-col justify-center items-center flex-1 text-center">
          <p className="text-[var(--gray-700)] text-[16px] dark:text-[var(--dark-gray-700)]">
            {title}
          </p>
          {subtitle && (
            <p className="text-[var(--gray-700)] dark:text-[var(--dark-gray-700)] text-[14px] mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex justify-center gap-[20px] mt-2 text-[14px]">
          <button
            className="text-white bg-[var(--primary-pink)] px-3 py-1 rounded
              hover:bg-[var(--primary-pink-tone)] cursor-pointer dark:bg-[var(--dark-primary-pink-tone)] 
              dark:hover:bg-[var(--dark-primary-pink-point)]"
            onClick={onClick}
          >
            {isOk}
          </button>
          {isNotOk && (
            <button
              className={twMerge(
                "bg-[var(--gray-300-50)] text-[var(--gray-500)] dark:text-[var(--dark-white)] px-3 py-1 rounded hover:bg-[var(--gray-300)]",
                "cursor-pointer dark:bg-[var(--dark-bg-tertiary)] dark:hover:bg-[var(--dark-bg-primary)]"
              )}
              onClick={onCancel}
            >
              {isNotOk}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
