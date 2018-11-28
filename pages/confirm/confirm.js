// pages/confirm/confirm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tasks:[],
    confirmTasks:[]
  },
  checkboxChange: function(e) {
    console.log(e)
    this.data.confirmTasks = e.detail.value;
  },
  confirm: function() {
    var finishTasks = wx.getStorageSync('finish') || [];
    var finishTime = new Date().getTime();
    for(var item in this.data.confirmTasks) {
      var data = this.data.tasks.splice(item,1); //删除tasks中提交了的任务
      data[0].finishTime = finishTime;
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
    console.log('confirm onshow');
    this.data.tasks = wx.getStorageSync("tasks");
    this.setData({
      tasks:this.data.tasks
    })
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