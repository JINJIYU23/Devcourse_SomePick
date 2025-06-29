import { useState } from "react";
import { deleteImage, storeImage } from "../../apis/util";
import { useSignUpStore } from "../../stores/signUpStore";
import Icon from "../common/Icon";
import LoadingSpinner from "../common/LoadingSpinner";

export default function ProfileImgUpload({ type }: { type: string }) {
  const { setMainImgFile, mainImgUrl, setSubImgFile, subImgUrl } =
    useSignUpStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsLoading(true);
      setIsImageLoaded(false);

      try {
        const url = await storeImage(file, "temp");

        if (url) {
          if (type === "main") {
            setMainImgFile(file, url);
          } else {
            setSubImgFile(file, url);
          }

          setTimeout(() => {
            deleteImage(url);
          }, 600000); // 10분 뒤 삭제
        } else {
          console.error("image upload failed.");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const imageUrl = type === "main" ? mainImgUrl : subImgUrl;

  return (
    <>
      <label
        htmlFor={`profileImg-${type}`}
        className="relative flex justify-center items-center w-40 h-48 bg-[var(--gray-300-59)] dark:bg-[var(--dark-bg-tertiary)] rounded-[18px] shadow-[0_2.21px_8.85px_rgba(0,0,0,0.25)] cursor-pointer hover:bg-[var(--gray-300)] dark:hover:bg-[var(--dark-gray-500)]"
      >
        {(isLoading || (imageUrl && !isImageLoaded)) && (
          <LoadingSpinner className="absolute" />
        )}

        {!isLoading &&
          (imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt="프로필 이미지"
                draggable="false"
                className={`w-full h-full object-cover rounded-[18px] `}
                onLoad={() => setIsImageLoaded(true)}
              />
              <div className="group absolute flex justify-center items-center w-40 h-48 rounded-2xl object-cover cursor-pointer hover:bg-[rgba(0,0,0,0.5)]">
                <div className="hidden group-hover:flex justify-center items-center w-[50px] h-[50px] bg-[#EAEAEA] rounded-full">
                  <Icon width="30px" height="30px" left="-647px" top="-755px" />
                </div>
              </div>
            </>
          ) : (
            <>
              <Icon
                width="30px"
                height="30px"
                left="-647px"
                top="-755px"
                className="dark:hidden"
              />
              <Icon
                width="30px"
                height="30px"
                left="-647px"
                top="-818px"
                className="hidden dark:block"
              />
            </>
          ))}
        <input
          id={`profileImg-${type}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImgChange}
          disabled={isLoading}
        />
      </label>
    </>
  );
}
