import { atom } from "recoil";

export const isLoggedInState = atom({
  key: "isLoggedInState",
  default: true,

  // 개발중이라 트루로 해놓은 것 나중에 false 로 바꿔야함.
});
