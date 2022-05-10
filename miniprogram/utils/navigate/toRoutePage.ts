import navigate, { ToRouterType } from "./index";

export const toLoginPage = (option?: ToRouterType) => {
  navigate("/pages/login/index", option);
};

export const toListPage = (option?: ToRouterType) => {
  navigate("/pages/list/index", option);
};

export const toSomeNeedAuthPage = (option?: ToRouterType) => {
  navigate("/pages/someNeedAuthPage/index", option);
};
export const to403Page = (option?: ToRouterType) => {
  navigate("/pages/403/index", option);
};