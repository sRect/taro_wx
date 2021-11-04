import React, { useState } from "react";
import { View, Text, Button, ScrollView, Map } from "@tarojs/components";
import Taro, { useReady, useDidShow, useDidHide, } from '@tarojs/taro';
import { locationServices } from "../../services";
import { hasOwnProperty } from "../../utils";

const showLocation = true;

const About = () => {
  const [systemSetting, setSystemSetting] = useState({});
  const [location, setLocation] = useState({longitude: '',latitude: '' });
  const [locationList, setLocationList] = useState([]);

  // 地理位置信息传到后台
  const handleSendLocationData = async (obj) => {
    const [err] = await locationServices
      .getLocation({
        ...obj,
      })
      .then((data) => [null, data])
      .catch((e) => [e, null]);

    if (err) {
      Taro.showToast({
        title: "网络错误",
        icon: "error",
        duration: 2000,
      });

      return;
    }

    // Taro.showToast({
    //   icon: "success",
    //   title: "数据发送成功",
    //   duration: 2000,
    // });
  };

  const handleGetLocation = () => {
    if(Taro.canIUse('startLocationUpdateBackground')) {
      // https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html
      // 小程序全局配置
      // https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#permission
      // wx.authorize({scope: "scope.userInfo"})，不会弹出授权窗口，请使用 <button open-type="getUserInfo"/>
      // 需要授权 scope.userLocation、scope.userLocationBackground 时必须配置地理位置用途说明

      Taro.startLocationUpdateBackground({
        success() {
          Taro.onLocationChange((data) => {
            setLocationList((pre) => [...pre, data]);

            setLocation({longitude: data.longitude, latitude: data.latitude })

            handleSendLocationData(data);
          });
        },
        fail(err) {
          console.log(err);
          Taro.showToast({
            icon: 'error',
            title: '定位失败'
          });

          Taro.openSetting();
        }
      })
    } else {
      Taro.showToast({
        icon: 'error',
        title: '您的设备暂不支持定位'
      })
    }
  }

  // 检查手机是否打开位置信息开关
  // 检查是否给微信开了定位权限
  const checkMobileLocationAuth = () => {
    return new Promise((resolve, reject) => {
      Taro.getSystemInfoAsync({
        success(data) {
          console.log(data)
          setSystemSetting(data);

          if(data && hasOwnProperty(data, 'locationEnabled') && !data.locationEnabled) {
            Taro.showModal({
              title: "提示",
              content: "请打开手机设置-位置信息(GPS)开关",
              confirmText: "确定",
              showCancel: false,
            });

            reject();
          }

          if(data && hasOwnProperty(data, 'locationAuthorized') && !data.locationAuthorized) {
            Taro.showModal({
              title: "提示",
              content: "请打开手机设置-应用设置-应用管理-微信-权限管理-定位权限开关",
              confirmText: "确定",
              showCancel: false,
              success() {
                // Taro.openSetting();
              }
            });

            reject();
          }

          resolve();
        },
        fail() {
          reject();
        }
      });
    })
  }

  // 检查当前小程序是否开了定位权限
  const checkMiniAppLocationAuth = () => {
    return new Promise((resolve, reject) => {
      if(!Taro.canIUse("getSetting")) return reject();

      Taro.getSetting({
        success: function (res) {
          console.log(res.authSetting);
          const authSetting = res.authSetting;

          if(authSetting &&
            hasOwnProperty(authSetting, 'scope.userLocation') &&
            hasOwnProperty(authSetting, 'scope.userLocationBackground') &&
            authSetting['scope.userLocation'] &&
            authSetting['scope.userLocationBackground']
          ) {
            resolve();
          } else {
            if(Taro.canIUse("openSetting")) {
              Taro.showModal({
                title: "提示",
                content: "请在点击确定后，在弹出的选项中务必勾选“使用小程序期间和离开小程序之后”选项",
                confirmText: "确定",
                showCancel: false,
                success() {
                  Taro.openSetting();
                }
              });
            } else {
              Taro.showModal({
                title: "提示",
                content: "请点击右上角“...”更多-设置-位置信息，在弹出的选项中务必勾选“使用小程序期间和离开小程序之后”选项",
                confirmText: "确定",
                showCancel: false,
              });
            }

            reject();
          }
        }
      })
    })
  }

  useReady(() => {
    console.log("useReady==>");
  });

  useDidShow(() => {
    console.log("useDidShow==>");
    // if(Taro.canIUse("getSetting")) {
    //   Taro.getSetting({
    //     success(res) {
    //       const authSetting = res.authSetting;
    //       if(authSetting &&
    //         hasOwnProperty(authSetting, 'scope.userLocation') &&
    //         hasOwnProperty(authSetting, 'scope.userLocationBackground') &&
    //         authSetting['scope.userLocation'] &&
    //         authSetting['scope.userLocationBackground']
    //       ) {
    //         // 此时已经引导用户开启了小程序后台持续定位权限
    //         // 可以进行持续定位了
    //         console.log("what????");
    //       }
    //     }
    //   })
    // }
    if(Taro.canIUse("stopLocationUpdate")) {
      Taro.stopLocationUpdate({
        complete() {
          checkMobileLocationAuth()
            .then(checkMiniAppLocationAuth)
            .then(() => {
              // 全部ok，可以进行持续定位
              handleGetLocation();
            })
            .catch(() => {
              console.log("err==>");
            });
        }
      })
    }
  });

  useDidHide(() => {
    console.log("useDidHide==>");
  });

  return (
      <View>
        <Text>systemSetting:</Text>
        <View>
          <View>设备型号: {systemSetting.model}</View>
          <View>操作系统及版本: {systemSetting.system}</View>
          <View>客户端平台: {systemSetting.platform}</View>
          <View>SDKVersion: {systemSetting.SDKVersion}</View>
          <View>地理位置的系统开关: {systemSetting.locationEnabled ? 'true' : 'false'}</View>
          <View>允许微信使用定位的开关: {systemSetting.locationAuthorized ? 'true' : 'false'}</View>
          <View>true模糊定位，false精确定位-ios: {systemSetting.locationReducedAccuracy}</View>
        </View>
        <Button type="warn" open-type="getUserInfo">getUserInfo</Button>

        <Button type="primary" onClick={handleGetLocation}>btn</Button>
        <View>
          <Map style="width: 100%; height: 200px;" showLocation={showLocation} scale={16} longitude={location.longitude} latitude={location.latitude} />
        </View>
        <View>
          <View>
            <Text>历史消息：</Text>
            <ScrollView
              style="width: 100%; height:300px;"
              scrollY
            >
              {
                locationList.map((item, index) => {
                  return (
                    <View key={index} style="border-bottom: 1px solid #ccc; margin-bottom: 5px;">
                      <View>index: {index}</View>
                      <View>longitude: {item.longitude}</View>
                      <View>latitude: {item.latitude}</View>
                      <View>speed: {item.speed}</View>
                    </View>
                  )
                })
              }
            </ScrollView>
          </View>
        </View>
      </View>
    )
}

export default About;
