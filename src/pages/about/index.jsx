import React, {useState} from "react";
import { View, Text, Button, ScrollView, Map } from "@tarojs/components";
import Taro, {useReady} from '@tarojs/taro';
import { locationServices } from "../../services";

const showLocation = true;

const About = () => {
  const [location, setLocation] = useState({longitude: '',latitude: '' });
  const [locationList, setLocationList] = useState([]);

  // 地理位置信息传到后台
  const handleSendLocationData = async (obj) => {
    const [err, res] = await locationServices
      .getLocation({
        ...obj,
      })
      .then((data) => [null, data])
      .catch((e) => [e, null]);

    if (err) {
      console.log("request err==>", err);
      Taro.showToast({
        title: "网络错误",
        icon: "error",
        duration: 2000,
      });

      return;
    }

    console.log("res===>", res);
    Taro.showToast({
      icon: "success",
      title: "数据发送成功",
      duration: 2000,
    });
  };

  const handleGetLocation = () => {
    if(Taro.canIUse('startLocationUpdateBackground')) {
      const setting = Taro.getSetting();
      console.log("setting===>",setting);

      // https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html
      // 小程序全局配置
      // https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#permission
      // wx.authorize({scope: "scope.userInfo"})，不会弹出授权窗口，请使用 <button open-type="getUserInfo"/>
      // 需要授权 scope.userLocation、scope.userLocationBackground 时必须配置地理位置用途说明

      Taro.startLocationUpdateBackground({
        success() {
          Taro.onLocationChange((data) => {
            console.log("data==>", data);
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

  useReady(() => {
    handleGetLocation();
  })

  return (
      <View>
        <Text>about page</Text>
        <button open-type="getUserInfo" />

        <Button type="primary" onClick={handleGetLocation}>btn</Button>
        <View>
          <Map style="width: 100%; height: 200px;" showLocation={showLocation} scale={16} longitude={location.longitude} latitude={location.latitude}/>
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
