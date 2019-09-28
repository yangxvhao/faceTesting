Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoList:'',
    loading:true,
    Gender:
    {
      'male': '男',
      'female': '女'
    },
    FaceShape:
    {
      'square': '正方形',
      'triangle': '三角形',
      'oval': '椭圆',
      'heart': '心形',
      'round': '圆形'
    },
    RaceType: {
      yellow: '黄种人',
      white: '白种人',
      black: '黑种人',
      arabs: '阿拉伯人'
    },
    EmotionType: {
      angry: '生气',
      disgust: '厌恶',
      fear: '恐惧',
      happy: '开心',
      sad: '伤心',
      surprise: '惊讶',
      neutral: '平静'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    if(id){
      this.findByDb(id);
    }
  },

  findByDb: function (id) {
    var Product = new wx.BaaS.TableObject(35661)
    var query = new wx.BaaS.Query()
    query.compare('created_by', '=', parseInt(id))

    Product.setQuery(query).limit(10).offset(0).orderBy('-created_at').find().then(res => {
      var list = [];
      var result = res.data.objects;
      for(var o in result){
        var photo = new Object();
        photo.path = result[o].photo.path;
        var jsosStr = JSON.parse(result[o].face_result);
        jsosStr.face_list[0].beauty = Math.round(jsosStr.face_list[0].beauty)
        photo.result = jsosStr.face_list[0];
        list.push(photo);
      };
      this.setData({
        photoList: list,
        loading: false
      })
      // success
    }, err => {
      // err
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})