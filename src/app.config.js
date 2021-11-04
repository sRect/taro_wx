export default {
  pages: ["pages/index/index", "pages/about/index"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  requiredBackgroundModes: ["location"],
  permission: {
    "scope.userLocation": {
      desc: "户外考勤拜访客户持续后台定位", // 高速公路行驶持续后台定位
    },
  },
};
