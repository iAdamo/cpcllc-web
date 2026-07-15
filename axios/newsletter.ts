import { ApiClientSingleton } from "./conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const subscribeNewsletter = async (
  email: string,
  source = "homepage"
): Promise<{ subscribed: boolean }> => {
  const response = await axiosInstance.post("newsletter/subscribe", {
    email,
    source,
  });
  return response.data;
};
