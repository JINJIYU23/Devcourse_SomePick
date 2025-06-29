import { z } from "zod";

const commonSchema = {
  mainImageUrl: z.string(),
  mainImageFile: z.instanceof(File).nullable(),
  status: z.union([z.literal("solo"), z.literal("couple")]),
};

const soloSchema = z.object({
  ...commonSchema,
  status: z.literal("solo"),
  subImageUrl: z.string().min(1, "서브 이미지를 첨부해주세요"),
  subImageFile: z.instanceof(File).nullable(),
  nickname: z
    .string()
    .min(2, "닉네임을 2자부터 5자까지 입력 가능합니다")
    .max(5, "닉네임을 2자부터 5자까지 입력 가능합니다"),
  age: z.string().refine((age) => {
    const num = Number(age);
    return !isNaN(num) && num >= 20 && num < 100;
  }, "나이는 20부터 40까지 입력 가능합니다"),
  description: z.string().optional(),
  job: z.string(),
  location: z.string(),
  height: z.string().refine((height) => {
    const num = Number(height);
    return !isNaN(num) && num >= 130 && num <= 299;
  }, "키는 130부터 220까지 입력 가능합니다"),
  mbti: z.string(),
  keywordList: z
    .array(z.string())
    .min(4, "키워드는 최소 4개 이상 선택해야 합니다"),
  interestList: z
    .array(z.string())
    .min(4, "관심사는 최소 4개 이상 선택해야 합니다"),
  idealTypeList: z
    .array(z.string())
    .min(4, "이상형은 최소 4개 이상 선택해야 합니다"),
});

const coupleSchema = z.object({
  ...commonSchema,
  status: z.literal("couple"),
  partnerNickname: z.string(),
});

export const profileSchema = z.discriminatedUnion("status", [
  soloSchema,
  coupleSchema,
]);

export type FormValues = z.infer<typeof profileSchema>;
