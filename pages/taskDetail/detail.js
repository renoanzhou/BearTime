// pages/taskDetail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    text:'',
    note:'',
    tasks:[]
  },
  getInputValue: function(e) {
    switch(e.target.id) {
      case 'taskName': {
        this.data.text = e.detail.value;
        break;
      }
      case 'notes': {
        this.data.note = e.detail.value;
      }
    }
  },
  saveTask: function() {
    this.data.tasks[this.data.id].text = this.data.text;
    this.data.tasks[this.data.id].note = this.data.note;
    wx.setStorage({
      key: "tasks",
      data: this.data.tasks
    });
    wx.navigateBack({
      delta: 1
    })
  },
  deleteTask: function() {
    var self = this;
    wx.showModal({
      title: '确定要删除任务吗?',
      success(res) {
        if (res.confirm) {
          self.data.tasks.splice(self.data.id,1);
          wx.setStorage({
            key: "tasks",
            data: self.data.tasks
          });
          wx.navigateBack({
            delta: 1
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.data.id = options.id;
    this.data.tasks = wx.getStorageSync("tasks")
    this.data.text = this.data.tasks[this.data.id].text;
    this.data.note = this.data.tasks[this.data.id].note;
    this.setData({
      id:this.data.id,
      text:this.data.text,
      note:this.data.note
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