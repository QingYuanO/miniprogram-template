import ApiService from "../index";

export const getSingleImg = () => {
  return ApiService.get("https://api.waifu.pics/sfw/waifu");
};
