// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tasks: [],
    tasksUnder: '',
    tasksTop:0,//距离顶部的距离
    taskHeight:40, //任务的高度(不固定,需要动态获取)
    touch: { //记录每次滑动时初始高度,结束滑动时清零
      start:0,
      tempIndex:0
    },
    _index:999, // 用于拖拉时,点击时给对于的list添加class
    inputConfirm:0,
    inputText:'',
    inputValue:'',
    scrollHeight:''
  },
  taskClick: function(e) {
    this.setData({
      _index: e.target.dataset.id
    })
  },
  touchEvent: function(e) {
    switch(e.type) {
      case 'touchstart' : {
        this.myTouchStart(e)
        console.log('start');
        break;
      }case 'touchend': {
        console.log('end');
        this.myTouchEnd(e);
        break;
      }case 'touchmove' : {
        // this.myTouchMove(e);
        break;
      }
    }
  },
  myTouchStart: function(e) {
    this.data.touch.start = e.changedTouches[0].clientY; //记录初始高度
    this.setData({
      _index: e.target.dataset.id
    })
  },
  myTouchMove: function(e) {
    var el = e.target;
    var oldIndex = el.dataset.id - 0;
    var index = 0;
    // var targetIndex = Math.floor((e.changedTouches[0].clientY - this.data.tasksTop - (id) * this.data.taskHeight) / this.data.taskHeight);
    var positionEnd = e.changedTouches[0].clientY;
    var positionStart = this.data.touch.start;
    var tempIndex =this.data.touch.tempIndex;
    if (positionEnd > positionStart) {
      index = Math.floor((positionEnd - positionStart) / this.data.taskHeight);
      var temp = this.data.tasks.splice(oldIndex, 1);
      this.data.tasks.splice((oldIndex + index), 0, temp[0]);
      if(tempIndex!=index) {
        console.log('bb')
        this.data.touch.tempIndex = index;
        this.setData({
          tasksUnder: this.data.tasks,
        })
      }
    } else if (positionStart > positionEnd && tempIndex != index) {
      index = Math.floor((positionStart - positionEnd) / this.data.taskHeight);
      tempIndex = index;
      var temp = this.data.tasks.splice(oldIndex, 1);
      this.data.tasks.splice((oldIndex - index), 0, temp[0]);
      this.setData({
        tasksUnder: this.data.tasks,
      })
    }
  },
  testa: function(e) {
    //事件代理处理冒泡  ---todo
    
  },
  myTouchEnd: function(e) {
    var el = e.target;
    var oldIndex = el.dataset.id - 0;
    var index = 0;
    // var targetIndex = Math.floor((e.changedTouches[0].clientY - this.data.tasksTop - (id) * this.data.taskHeight) / this.data.taskHeight);
    var positionEnd = e.changedTouches[0].clientY;
    var positionStart = this.data.touch.start;
    if(positionEnd > positionStart) {
      index = Math.floor((positionEnd - positionStart) / this.data.taskHeight);
      console.log(index);
      var temp = this.data.tasks.splice(oldIndex,1);
      this.data.tasks.splice((oldIndex+index),0,temp[0]);
      console.log(this.data.tasks)
    } else if(positionStart > positionEnd) {
      index = Math.floor((positionStart - positionEnd) / this.data.taskHeight);
      var temp = this.data.tasks.splice(oldIndex, 1);
      this.data.tasks.splice((oldIndex - index), 0, temp[0]);
    }
    // console.log(targetIndex);
    this.setData({
      tasks: this.data.tasks,
      _index: 999,
      tasksUnder:this.data.tasks
    })
    this.data.touch.start = 0;
    console.log('end')
    console.log(e);
  },
  testbindtap(e) {
    var taskId = e.target.dataset.id;
    wx.navigateTo({
      url: `/pages/taskDetail/detail?id=${taskId}`
    })
  },
  inputCheck: function(e) {
    this.data.inputText = e.detail.value;
    if (e.detail.value && this.data.inputConfirm == 0) {
      this.setData({
        inputConfirm:1
      })
    } else if (!e.detail.value){
      this.setData({
        inputConfirm: 0
      })
    }
  },
  addTask: function() {
    if(this.data.inputText) {
      this.data.tasks.push({
        text: this.data.inputText,
      });
      var data = wx.getStorageSync('tasks') || [];
      data.push({
        text: this.data.inputText,
        note:''
      });
      // data = JSON.stringify(data);
      wx.setStorage({
        key: 'tasks',
        data: data,
      })
      this.setData({
        tasks:this.data.tasks,
        tasksUnder:this.data.tasks,
        inputValue: '',
        inputConfirm:0
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 120
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.data.tasks = wx.getStorageSync('tasks') || []; //获取本地数据
    var query = wx.createSelectorQuery();
    var self = this;
    var myClass =['.tasks-move-area', '.moveable-task'];
    query.select('.tasks-move-area').boundingClientRect();
    query.select('.moveable-task').boundingClientRect();
    query.exec(function (res) {
      console.log(res);
      self.data.tasksTop = res[0].top; //获取高度
      if(res[1]) {
        self.data.taskHeight = res[1].height; //获取单个任务高度
      }
    });
    this.setData({
      taskHeight: this.data.taskHeight,
      tasks:this.data.tasks,
      tasksUnder:this.data.tasks
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    this.data.tasks = wx.getStorageSync('tasks') || [];
    this.setData({
      taskHeight: this.data.taskHeight,
      tasks: this.data.tasks,
      tasksUnder: this.data.tasks
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