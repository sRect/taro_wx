import Taro from "@tarojs/taro";

const requestIns = ({ url, method = "POST", data }) => {
  const sendData = {
    content: {
      detail: {
        ...data,
      },
    },
  };

  return Taro.request({
    url,
    method,
    // header: {
    //   "Content-Type": "application/json;charset=utf-8",
    // },
    data: JSON.stringify(sendData),
  });
};

export default requestIns;
