//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    tempFilePaths: '',
    userInfo: {},
    tableID: 35661, 
    faceResult:'',
    error:false,
    errorApi:false,
    errorUpload:false,
    accessToken:'',
    Gender :
    {
      'male': '男',
      'female': '女'
    },
    FaceShape : 
      { 'square': '正方形' ,
      'triangle': '三角形' ,
      'oval': '椭圆' ,
      'heart': '心形' ,
      'round': '圆形' 
    },
    RaceType : {
      yellow: '黄种人' ,
      white: '白种人' ,
      black: '黑种人' ,
      arabs: '阿拉伯人' 
    },
    EmotionType : {
      angry: '生气' ,
      disgust: '厌恶' ,
      fear: '恐惧' ,
      happy: '开心' ,
      sad: '伤心' ,
      surprise: '惊讶' ,
      neutral: '平静' 
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.BaaS.login().then(res => {
      // console.log(res)
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
    this.setData({
      faceResult:'',
      error: false,
      errorApi: false,
      errorUpload: false
    })
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
      count:1,
      success: function (res) {
        // console.log(res);
        wx.showLoading({
          title: '上传中...',
        })
        that.setData({
          tempFilePaths: res.tempFilePaths[0],
        })
        let MyFile = new wx.BaaS.File()
        let fileParams = { filePath: res.tempFilePaths[0] }
        let metaData = { categoryName: 'image' }
        // let Product = new wx.BaaS.TableObject(35661)
        // let product = Product.create()

        MyFile.upload(fileParams, metaData).then(res => {
          /*
           * 注: 只要是服务器有响应的情况都会进入 success, 即便是 4xx，5xx 都会进入这里
           * 如果上传成功则会返回资源远程地址,如果上传失败则会返回失败信息
           */
          // console.log(res)
          // console.log(res.data.path)
          that.faceTest(res.data.path, res.data.file)
        }, err => {
          this.setData({
            errorUpload:true
          })
        })
      }
    })
  },

  findPhotoList:function (event){
    var id = event.currentTarget.dataset.variable;
    console.log(id);
    if(id){
    wx.navigateTo({
      url: 'photo?id=' + id,
      success: function(){
      }
    })
    }else{
      wx.showModal({
        title: '',
        content: '授权个人信息后才可查看！',
      })
    }
  },

  faceTest:function (photoPath,photo){
    this.getToken().then(res =>{
      // console.log(res)
      wx.BaaS.request({
        url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=' + res,
        method: 'POST',
        data: { image: photoPath, image_type: 'URL', face_field:'age,beauty,expression,faceshape,gender,glasses,race,emotion' }
      }).then(res => {
        let Product = new wx.BaaS.TableObject(35661)
        let product = Product.create()
        if (res.data.error_code != 0){
          this.setData({
            error:true
          })
        }
        wx.hideLoading();
        // console.log(res)
        this.setData({
         
          faceResult:res.data.result.face_list[0],
        
        })
        product.set('photo',photo)
        product.set('face_result', JSON.stringify(res.data.result))
        product.save()
        // success
      }, err => {
        console.log(res)
        // err
        this.setData({
          errorApi:true
        })
      })
    })
  },

  getToken:function(){
    return new Promise((reslove, reject) => {
      if(this.data.accessToken){
        reslove(this.data.accessToken)
      }else{
        wx.BaaS.request({
          url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=yGDbW8cYPPVr5Csu5gnBX4IH&client_secret=cxr9oNAqUxVtG0el480nn3qZecTGKNt1',
          method: 'GET',
        }).then(res => {
          // console.log(res.data.access_token)
          this.setData({
            accessToken: res.data.access_token
          })
          reslove(this.data.accessToken)
        }, err => {
          this.setData({
            errorApi: true
          })
        })
      }
    })
    
  }
})
