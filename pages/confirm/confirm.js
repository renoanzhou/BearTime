// pages/confirm/confirm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tasks:[],
    confirmTasks:[],
    scrollHeight:0,
    inputValue:'',
    inputConfirm:0,
    inputText:'',
    isChoose:0//这个状态用于判断是否有选中任务
  },
  checkboxChange: function(e) {
    console.log(e)
    if(e.detail.value.length < 1) {
      this.data.isChoose = 0;
    } else {
      this.data.isChoose = 1;
    }
    this.setData({
      isChoose: this.data.isChoose
    })
    this.data.confirmTasks = e.detail.value;
  },
  confirm: function() {
    var finishTasks = wx.getStorageSync('finish') || [];
    var setting = wx.getStorageSync('setting')  //获得默认设置
    var finishTime = new Date().getTime();  //今日的时间 和今日完成任务列表有关
    for(var item in this.data.confirmTasks) {
      var data = this.data.tasks.splice(item,1); //删除tasks中提交了的任务
      data[0].finishTime = finishTime;
      data[0].setting = setting; //保存这个完成的钟的设置(钟设置时间等等...)
      finishTasks.push(data[0]);
    }
    wx.setStorage({
      key: 'finish',
      data: finishTasks ,
    });
    wx.setStorage({
      key: 'tasks',
      data: this.data.tasks,
    });
    var app = getApp();
    app.clockState.finish = 0;
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var self = this;
    this.data.tasks = wx.getStorageSync("tasks");
    this.setData({
      tasks:this.data.tasks
    });
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: (res.windowHeight - res.windowWidth / 750 * 280)
        })
      }
    })
  },
  inputCheck: function (e) {
    this.data.inputText = e.detail.value;
    if (e.detail.value && this.data.inputConfirm == 0) {
      this.setData({
        inputConfirm: 1
      })
    } else if (!e.detail.value) {
      this.setData({
        inputConfirm: 0
      })
    }
  },
  addTask: function () {
    if (this.data.inputText) {
      this.data.tasks.push({
        text: this.data.inputText,
      });
      var data = wx.getStorageSync('tasks') || [];
      data.push({
        text: this.data.inputText,
        note: ''
      });
      // data = JSON.stringify(data);
      wx.setStorage({
        key: 'tasks',
        data: data,
      })
      this.setData({
        tasks: this.data.tasks,
        tasksUnder: this.data.tasks,
        inputValue: '',
        inputConfirm: 0
      })
    }
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