import { Component } from 'react'
import { View, Text, Button, Icon } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.less'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  // 跳转到about
  gotoAbout = () => {
    console.log("goto about");
    Taro.navigateTo({
      url: '/pages/about/index'
    })
  }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <Button type='primary' className='button' onClick={this.gotoAbout}>
          <Icon size='23' type='warn' className='icon' /> goto about
        </Button>
      </View>
    )
  }
}
