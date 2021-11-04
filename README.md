## taro 微信小程序 持续定位

### 注意点

1. taro 项目配置文件`src/app.config.js`中要添加以下配置

```javascript
export default {
  requiredBackgroundModes: ["location"],
  permission: {
    "scope.userLocation": {
      desc: "如实填写实际用途", // 高速公路行驶持续后台定位
    },
  },
};
```

2. 检查手机是否打开位置信息开关

```javascript
Taro.getSystemInfoAsync({
  success(data) {
    console.log(data.locationEnabled);
  },
});
```

3. 检查是否给微信开了定位权限

```javascript
Taro.getSystemInfoAsync({
  success(data) {
    console.log(data.locationAuthorized);
  },
});
```

4. 检查当前小程序是否开了后台定位权限

```javascript
Taro.getSetting({
  success(res) {
    const authSetting = res.authSetting;
    if (
      !authSetting["scope.userLocation"] ||
      !authSetting["scope.userLocationBackground"]
    ) {
      // 让用户在弹出的选项中务必勾选“使用小程序期间和离开小程序之后”选项
      Taro.openSetting();
    }
  },
});
```

### 客户端详情

- 手机型号：小米 10
- 操作系统及版本：Android 10
- 客户端平台：android
- SDKVersion：2.20.2

### 实际测试

- 经过本地开发实际测试，把小程序切到后台后，切换到其他 app
- 或者手机直接锁屏

以上两种情况，1 分钟后，`startLocationUpdateBackground`api 即失效，只有重新解锁手机，重新回到微信，api 的实时位置监控才被唤醒，尚未找到解决方法

### 参考资料

1. [微信小程序授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)
2. [微信小程序全局配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#permission)
