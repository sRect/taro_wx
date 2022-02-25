// import Taro from "@tarojs/taro";
import requestIns from "../services/request";
import { BASE_URL } from "../config/index";

const locationServices = {
  getLocation(data) {
    return requestIns({
      url: `${BASE_URL}/resources/action/testAction:test`,
      method: "POST",
      // header: {
      //   "Content-Type": "application/json;charset=utf-8",
      // },
      data,
    });
  },
};

export { locationServices };
