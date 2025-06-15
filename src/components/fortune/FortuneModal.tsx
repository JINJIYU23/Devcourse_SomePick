import { motion } from "framer-motion";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import ShareButton from "./ShareButton";

interface FortuneData {
  userName?: string | null;
  status: string | null;
  loveTitle: string | null;
  loveDescription: string | null;
  loveAdvice: string;
}
interface Props {
  isOpen: boolean;
  onClose: () => void;
  cardIndex: number;
  backGroundImage: string;
  fortuneData: FortuneData | null;
}

export default function FortuneModal({
  isOpen,
  onClose,
  cardIndex,
  backGroundImage,
  fortuneData,
}: Props) {
  // 카드 캡쳐
  const imgRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen || cardIndex === null) return null;

  const handleShare = async () => {
    if (!imgRef.current) return;

    try {
      const image = imgRef.current;
      const canvas = await html2canvas(image, {
        scale: 2,
        backgroundColor: null,
      });

      canvas.toBlob((blob) => {
        if (blob !== null) {
          saveAs(blob, "result.png");
        }
      });
    } catch (e) {
      console.log("사진 다운 에러", e);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-[rgba(0,0,0,0.9)] flex flex-col items-center justify-center z-50"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        ref={imgRef}
        className="transition-transform duration-300 ease-in-out w-[500px] h-[751px] relative"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
      >
        <div
          className="w-full h-full flex flex-col justify-center text-white p-5"
          style={{
            backgroundImage: `url(${backGroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-[30px] right-[20px] text-white text-2xl hover:text-gray-500 z-10"
          >
            X
          </button>

          {fortuneData ? (
            <motion.div
              className="text-center px-4 py-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 1 }}
            >
              <p className="text-[18px]">
                {new Date().getFullYear()}년 {new Date().getMonth() + 1}월{" "}
                {new Date().getDate()}일
              </p>
              <p className="text-[20px] font-bold mt-[10px] mb-6">
                {fortuneData.loveTitle}
              </p>
              <p className="text-[16px] mt-[10px] mb-4 leading-relaxed">
                {fortuneData.loveDescription}
              </p>
              <p className="text-[16px] mt-[10px] italic leading-relaxed">
                💡 {fortuneData.loveAdvice}
              </p>
            </motion.div>
          ) : (
            <div className="text-center">
              <p>운세를 불러오는 중..</p>
            </div>
          )}
        </div>
      </motion.div>
      <div>
        <ShareButton onClick={handleShare} />
      </div>
    </motion.div>
  );
}
