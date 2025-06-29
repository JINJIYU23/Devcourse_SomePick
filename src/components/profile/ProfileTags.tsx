import { twMerge } from "tailwind-merge";

export default function ProfileTags({
  title,
  list,
}: {
  title: string;
  list: string[];
}) {
  // const session = useAuthStore((state) => state.session);
  // const { userProfile }: { userProfile: ProfileData } = useLoaderData();
  // const myTags: {
  //   keywords: string;
  //   interests: string;
  //   ideal_types: string;
  // } = {
  //   keywords: session?.user.user_metadata.keywords,
  //   interests: session?.user.user_metadata.interests,
  //   ideal_types: session?.user.user_metadata.ideal_types,
  // };

  // const isMyProfile = userProfile.id === session?.user.id;
  return (
    <li className="flex flex-col items-start gap-5">
      <span className="user-info w-50!">{title}</span>
      <ul className="flex gap-3 flex-wrap">
        {list.map((item) => (
          <li
            key={item}
            className={twMerge(
              "flex px-2 py-[9px] border border-[var(--primary-pink)] rounded-[50px]",
              "dark:border-[var(--primary-pink-point)]"
              // session &&
              //   !isMyProfile &&
              //   targetList.split(",").some((tag) => tag === item) &&
              //   "bg-[var(--primary-pink-tone)] text-white"
            )}
          >
            <span className="inline-block text-[var(--gray-50)] leading-[1] text-sm">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </li>
  );
}
