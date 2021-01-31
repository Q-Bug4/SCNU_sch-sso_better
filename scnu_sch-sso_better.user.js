// ==UserScript==
// @name         scnu 学者网sso界面改善
// @namespace    https://github.com/wulnm/
// @version      1.0
// @description  学者网未结课课程排版优化，sso默认显示我的应用，教务系统跳过等待页面
// @author       wulnm
// @match        https://www.scholat.com/myCourses.html
// @match        https://sso.scnu.edu.cn/AccountService/user/index.html
// @match        https://jwxt.scnu.edu.cn/xtgl/index_initMenu.html?jsdm=&_t=*
// @require      https://cdn.jsdelivr.net/npm/vue/dist/vue.js

// @grant   GM_getValue
// @grant   GM_setValue
// @run-at document-end

// @note         2020年12月4日 改良了学者网课程判定逻辑
// @note         2020年12月7日 增加学者网自定义选项按钮
// @note         2021年1月22日 增加学者网自定义显示正在学习课程
// @note         2021年1月22日 将设置按钮移动至右上角
// @note         2021年1月31日 小小美化
// ==/UserScript==
(function () {
  "use strict";

  // 学者网
  if (window.location.href == "https://www.scholat.com/myCourses.html") {
    var completedTD = [];
    var tab3 = document.getElementById("tabs_3");

    function getCourseList(type) {
      let ObjList;
      if (type != undefined) ObjList = document.getElementById(type);
      else ObjList = document;
      let lessons = Array.from(ObjList.getElementsByClassName("evlistTitle"));
      let res = [];
      for (let i in lessons) {
        let text = lessons[i].innerText;
        if (text == undefined) continue;
        res.push(text);
      }
      return res;
    }

    var userList = GM_getValue("userList"); // 用户设置课程列表

    var closedLessonObj = document.getElementById("closeCourse");
    var learnLessonObj = document.getElementById("learnCourse");

    function toLessons() {
      // 点击“学习的课程”
      document.getElementById("ui-id-4").click();
    }

    function toRealLessons() {
      function getTD(title) {
        // 获取课程 td
        return title.parentNode.parentNode.parentNode.parentNode;
      }

      let lessons = Array.from(document.getElementsByClassName("evlistTitle")); // 所有课程的集合

      // 对titles进行处理
      for (let i = lessons.length - 1; i >= 0; i--) {
        if (getTD(lessons[i]).parentNode == closedLessonObj) {
          lessons.splice(i, 1, 0); // 删除已经学习完毕的课程
        }
      }
      while (lessons[lessons.length - 1] == 0) {
        lessons.pop(); //删除尾部的空元素
      }
      var myLessons = userList == undefined ? lessons : userList;

      for (let i = 0; i < lessons.length; i++) {
        if (!myLessons.includes(lessons[i].innerText)) {
          completedTD.push(getTD(lessons[i]));
        }
      }

      //删除已完成的课程
      for (let i = 0; i < completedTD.length; i++) {
        learnLessonObj.removeChild(completedTD[i]);
      }

      //更改正在学习x门课的x
      let learnMsg = document.getElementById("learn_course_msg");
      let learnCnt = Number(
        learnMsg.innerText
          .replace(" ", "") //文本比较特殊需要删除两个不同的空格
          .replace(" ", "")
          .match(/正在学习(\S*)门课程/)[1]
      );
      learnMsg.innerHTML =
        "正在学习&nbsp;<a>" +
        (learnCnt - completedTD.length + "") +
        "</a>&nbsp;门课程";

      //新增一个未结课模块
      var almostMsg = document.createElement("div");
      almostMsg.innerHTML =
        '<span id="almostMsg" style="font-size:14px;">已结课但未被教师关闭&nbsp;<a>' +
        completedTD.length +
        "</a>&nbsp;门课程</span>";
      tab3.appendChild(almostMsg);
      var Intro3 = document.createElement("div");
      Intro3.innerHTML =
        '\
<div id="pl_event_eventIntro3" class="ev_intro">\
<div class="evlist_main clearfix">\
<ul id="pl_event_eventList3" style="margin-top: 0px;">\
<table class="datalist" cellspacing="1" style="margin-left: 0px;" id="datalist3">\
<tbody id="alomostCourse">\
</tbody>\
</table>\
</ul>\
</div>\
</div>';
      tab3.appendChild(Intro3);

      //添加到新模块中
      for (let i = 0; i < completedTD.length; i++) {
        document.getElementById("alomostCourse").appendChild(completedTD[i]);
      }

      //增加3个模块之间的空隙
      let emptyTR1 = document.createElement("tr");
      emptyTR1.innerHTML =
        '<HR style="border:3 double #5DAC81" width="100%" color=#5DAC81 SIZE=3>';
      let emptyTR2 = document.createElement("tr");
      emptyTR2.innerHTML =
        '<HR style="border:3 double #33A6B8" width="100%" color=#33A6B8 SIZE=3>';
      document.getElementById("learnCourse").appendChild(emptyTR1);
      document.getElementById("closeCourse").appendChild(emptyTR2);
      document.getElementById("close_course_msg").innerHTML =
        "<br><br><br>" + document.getElementById("close_course_msg").innerHTML;
      document.getElementById("almostMsg").innerHTML =
        "<br><br><br>" + document.getElementById("almostMsg").innerHTML;
    }

    toLessons(); // 自动转向“学习的课程”页
    toRealLessons(); // 排列课程

    // 关闭每个课程的悬浮效果
    let evlist = document.getElementsByClassName("evlist_detail");
    for (let i = 0; i < evlist.length; i++) {
      evlist[i].style.display = "none";
    }

    var sch_setting = document.createElement("div");
    sch_setting.id = "sch_app";
    sch_setting.innerHTML = '\
    <div v-show="showSetting" style="position:absolute;left:100%;width:100%;text-align:left;background-color:rgb(18, 202, 255)">\
    <div id="list" style="margin:13px">\
      </div>\
    </div>\
    '
    var t5 = document.createElement("li");
    t5.id = "t5";
    t5.style = "position:absolute;top:0%;right:-30%";
    t5.innerHTML =
      '<p class="p1"  style="width:48px;text-align:left;">\
    <button style="position:absolute;cursor: pointer;top:20%;font-size:14px;background-color: #51A8DD;border-color: #577C8A;" @click="toggleSetting()">设置</button>\
     </p>';
     sch_setting.appendChild(t5);
    document.getElementsByClassName("navList")[0].appendChild(sch_setting);

    // document.getElementsByClassName("c")[0].appendChild(sch_setting);

    var allLessons = getCourseList();

    // 自定义div
    var listDiv = document.getElementById('list');

    var learnList = getCourseList("learnCourse"); //正在学习列表(学者网展示的列表)
    var closeList = getCourseList("closeCourse"); //已经被关闭的列表


    // 生成列表变量
    let tempList = [];
    for (let i = 0; i < allLessons.length; i++) {
      let lesson = allLessons[i];
      if (!closeList.includes(lesson)) tempList.push(lesson);
    }

    // 生成列表视图
    genUserlist(tempList);
    function genUserlist(lessons) {
      for (let i = 0; i < lessons.length; i++) {
        let lesson = lessons[i];
        if (lesson == undefined) continue;
        listDiv.innerHTML +=
          '<input type="checkbox" v-model="list" value="' +
          lesson +
          '">' +
          '<a style="color:#6E552F;margin:5px;" href="javascript:void(0);" @click="choose(\''+lesson +'\')">'+lesson+'</a>' +
          "<br>";
      }
    }
    // 生成操作按钮
    let actionDiv = document.createElement("div");
    actionDiv.innerHTML = '<button id="btnSave" @click="save()">保存</button>\
     <button id="btnCancel" @click="toggleSetting()">取消</button>'
    listDiv.appendChild(actionDiv);

    var sch = new Vue({
      el: "#sch_app",
      methods: {
        toggleSetting: function () {
          this.showSetting = !this.showSetting;
          // console.log(this.showSetting)
        },
        save: function () {
          GM_setValue("userList", this.list);
          location.reload();
        },
        choose : function(item){
          if(this.list.includes(item)){
            let pos = this.list.indexOf(item);
            this.list.splice(pos, 1);
          }else{
            this.list.push(item);
          }
        },
      },
      data: {
        lessons: allLessons,
        list: userList == undefined ? [] : userList,
        showSetting: false,
      },
    });
  }
  // sso综合平台
  if (
    window.location.href ==
    "https://sso.scnu.edu.cn/AccountService/user/index.html"
  ) {
    var appList = document.getElementById("oauthapp").parentNode;
    appList.style.display = "none";

    var myappList = document.getElementById("myapp").parentNode;
    myappList.style.display = "block";

    var head = document
      .getElementById("paginate-application")
      .getElementsByClassName("toc");
    head[0].classList["value"] = "toc";
    head[1].classList["value"] = "toc selected";

    document.getElementById("bannerList").remove();
  }
  // 教务系统
  if (
    window.location.href.includes(
      "https://jwxt.scnu.edu.cn/xtgl/index_initMenu.html"
    )
  ) {
    window.location.href = "https://jwxt.scnu.edu.cn/";
  }
})();
