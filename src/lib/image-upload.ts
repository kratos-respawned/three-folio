import { GetImgKitTokenAction } from "@/app/admin/actions/project.actions";
import { env } from "@/env";
import { ImageSchema } from "@/schema/projectSchema";
import { inferServerActionReturnData } from "zsa";

function createFormData(
  imageFile: File,
  resp: inferServerActionReturnData<typeof GetImgKitTokenAction>[0] | undefined
) {
  const formData = new FormData();
  if (!resp) {
    throw new Error("Invalid response");
  }
  formData.append("token", resp.token);
  formData.append("file", imageFile);
  formData.append("folder", "/deepak-portfolio");
  formData.append("useUniqueFilename", "true");
  //   formData.append("webhookUrl", `${env.NEXT_PUBLIC_APP_URL}/api/imgkit`);
  formData.append("fileName", imageFile.name);
  formData.append("signature", resp.signature);
  formData.append("expire", resp.expire.toString());
  formData.append("publicKey", env.NEXT_PUBLIC_IMAGEKIT_KEY);
  return formData;
}
export const uploadImages = async (
  images: FileList,
  resp: inferServerActionReturnData<typeof GetImgKitTokenAction>
) => {
  const uploadPromises = Array.from(images).map((image, index) => {
    const formData = createFormData(image, resp.at(index));
    return fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body: formData,
    });
  });
  const responses = await Promise.allSettled(uploadPromises);
  const imageDataPromises = responses.map(async (resp, index) => {
    if (resp.status === "fulfilled") {
      const result = await resp.value.json();
      return result;
    }
    return undefined;
  });
  const imageData = await Promise.all(imageDataPromises);
  const filteredImageData = imageData.filter((data) => data !== undefined);
  return filteredImageData as ImageSchema[];
};
