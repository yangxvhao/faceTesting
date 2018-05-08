//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tempFilePaths: '',
    userInfo: {},
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.BaaS.login().then(res => {
      console.log(res)
      this.setData({
        userInfo: wx.BaaS.storage.get('userinfo')
      })
    }, res => {
      if (res instanceof Error) {
        if (res.code === 600) {
          console.log('网络已断开')
        } else if (err.code === 601) {
          console.log('请求超时')
        }
      } else {
        console.log('用户拒绝授权')
        console.log('用户基本信息', res)
      }
    })
  },
  chooseimage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#CED63A",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })

  },

  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        that.setData({
          tempFilePaths: res.tempFilePaths[0],
        })
      }
    })
  }
})
