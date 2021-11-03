export default {
  pages: ["pages/index/index", "pages/about/index"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  permission: {
    "scope.userLocation": {
      desc: "高速公路行驶持续后台定位",
    },
  },
};
