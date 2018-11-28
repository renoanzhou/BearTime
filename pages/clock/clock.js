//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    state: {
      start: 0,//0为未开始 1为开始一个时间
      finish:0 //0为未完成 1为完成状态
    },
    setMinute: 0,
    setSecond: 5,
    interval: "",
    showTime: "25:00",
    todayFinish:[],
    scrollHeight:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight/2 - res.windowWidth / 750 * 50
        })
      }
    })
  },
  onShow: function () {
    var app = getApp();
    this.data.state.finish = app.clockState.finish;
    this.data.setMinute = wx.getStorageSync("setting")['setMinute'];
    var finishTasks = wx.getStorageSync("finish");
    var todayDate = new Date().toLocaleDateString();
    this.data.todayFinish = [];
    for(var item in finishTasks) {
      var finishDate = new Date(finishTasks[item].finishTime);
      if (finishDate.toLocaleDateString() == todayDate) {
        finishTasks[item].time = this.formatTime(finishDate.getHours()) + ':' + this.formatTime(finishDate.getMinutes());
        this.data.todayFinish.push(finishTasks[item]);
      }
    }
    this.setData({
      setMinute: 0,
      state: this.data.state,
      todayFinish:this.data.todayFinish
    });
  },
  formatTime: function (num) {
    if(num < 10) {
      return '0' + num;
    } else {
      return num;
    }
  },
  tapClock: function() {
    var self = this;
    wx.showModal({
      title: '确定要停止吗?',
      success(res) {
        if (res.confirm) {
          self.data.showTime = self.formatTime(self.data.setMinute) + ':' + self.formatTime(self.data.setSecond);
          clearInterval(self.data.interval);
          self.data.interval = '';
          self.data.state.start = 0;
          self.setData({
            showTime:self.data.showTime,
            interval: self.data.interval,
            state:self.data.state
          })        
        } else if (res.cancel) {
        }
      }
    })
  },
  tomatoInit : function(time) {
    // 因为用date来确定时间,用来防抖,避免一种情况(刚开始的第一秒时间可能没过一秒就换下一秒了)
    var date = new Date();
    var now = date.getSeconds();
    var self = this;
    new Promise(function(resolve,reject){
      var temp = setInterval(function(){
        if(now + 1 == new Date().getSeconds()) {
          clearInterval(temp);//清除定时器
          resolve();
        }
      },200)
    }).then(function(){
      self.startTomato();
    })
  },
  clockSuccess: function() {
    //完成一个设置的时间后
    var app = getApp();
    app.clockState.finish = 1; // 任务时间完成,使用全局变量记录状态
    this.data.state.finish = 1;
    this.setData({
      state: this.data.state
    });
    wx.showModal({
      title: '任务时间已完成',
      content:'时间结束了,现在可以提交任务,然后休息一下啦~',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: `/pages/confirm/confirm`
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  startTomato: function () {
    if (this.data.state.finish == 1) {
      this.clockSuccess();
      return;
    }
    this.data.state.start = 1;
    if (this.data.interval) {
      //防抖
      return
    }
    var preSecond = new Date().getTime();
    var nowSecond;
    var showMinute = this.data.setMinute;
    var showSecond = this.data.setSecond;
    var sStatus = 0;// sStatus 用于判断秒是否有改变.
    var date;
    var self = this;
    this.data.showTime = this.formatTime(showMinute) + ':' + this.formatTime(showSecond); //初始化时间
    this.setData({
      state: this.data.state,
      showTime: this.data.showTime
    })
    console.log('da')
    this.data.interval = setInterval(function(){
      if (showSecond == 0 && showMinute == 0) {
        clearInterval(self.data.interval);
        self.data.state.start = 0;
        self.data.interval = '';
        setTimeout(function(){
          self.setData({
            state: self.data.state,
            interval: self.data.interval,
          })
        },1000)
        self.clockSuccess();
        console.log('结束')
      } else {
        date = new Date();
        nowSecond = date.getTime();
        sStatus = (nowSecond - preSecond < 1000) ? 0 : 1;
        if (sStatus) {
          if (showSecond == 0) {
            showSecond = 59;
            showMinute--;
          } else {
            showSecond--;
          }
        }
        if (sStatus) {
          preSecond = nowSecond;
          sStatus = 0;
          // let tempMinute = showMinute;
          // let tempSecond = showSecond;
          // if (tempMinute < 10) {
          //   tempMinute = '0' + tempMinute;
          // }
          // if (tempSecond < 10) {
          //   tempSecond = '0' + tempSecond;
          // }
          self.data.showTime = self.formatTime(showMinute) + ':' + self.formatTime(showSecond);
          self.setData({
            showTime: self.data.showTime
          })
        }
      }      
    },50)
  }
})
