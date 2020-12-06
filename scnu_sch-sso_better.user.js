// ==UserScript==
// @name         scnu 学者网sso界面改善
// @namespace    https://github.com/wulnm/
// @version      0.8
// @description  学者网未结课课程排版优化，sso默认显示我的应用，教务系统跳过等待页面
// @author       wulnm
// @match        http://www.scholat.com/myCourses.html
// @match        https://sso.scnu.edu.cn/AccountService/user/index.html
// @match        https://jwxt.scnu.edu.cn/xtgl/index_initMenu.html?jsdm=&_t=*
// @require      https://cdn.jsdelivr.net/npm/vue/dist/vue.js
// @grant        none
// @run-at document-end

// @note         2020年12月4日 改良了学者网课程判定逻辑
// ==/UserScript==
(function () {
  "use strict";

  // 学者网
  if (window.location.href == "http://www.scholat.com/myCourses.html") {
    var completedTD = [];
    var tab3 = document.getElementById("tabs_3");

    var myLessons = [
      "软件测试技术",
      "科技文献阅读与写作",
      "平面动画",
      "大数据处理技术与应用",
    ];

    var closedLessonObj = document.getElementById("closeCourse");
    var learnLessonObj = document.getElementById("learnCourse");

    function toLessons() {
      // 点击“学习的课程”
      let lessons = undefined;
      lessons = document.getElementById("ui-id-4").click();
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
    sch_setting.innerHTML =
      '\
    <div v-show = "showSetting" class = "side_guide_main" style="position: fixed; width: 300px; right:100px;  top: 128px; border: 1px rgb(238, 238, 238); font-size: 16px; line-height: 1.25em; \
    color: rgb(255, 255, 255); background-color: rgb(51, 153, 153); right: 0px;">\
      <div style="padding: 15px; font-size: 16px;">\
        <ul>\
          <div id = "list" style="padding: 15px; font-size: 16px;">\
          \
        </div>\
        </ul>\
      </div>\
    </div>';
    document.getElementsByClassName("c")[0].appendChild(sch_setting);

    var allLessons = Array.from(document.getElementsByClassName("evlistTitle"));

    // 自定义div
    var listDiv = document.getElementById("list");
    for (let i in allLessons) {
      if (allLessons[i].innerText == undefined) continue;
      listDiv.innerHTML +=
        '<input type="checkbox" v-model="list" value="' +
        allLessons[i].innerText +
        '">' +
        allLessons[i].innerText +
        "<br>";
    }

    // 自定义按钮
    var divCustom = document.createElement("div");
    divCustom.innerHTML =
      '<div class="side_guide_main" style="position: fixed; width: 62px; top: 50px; cursor: pointer; border: 1px rgb(238, 238, 238); \
      font-size: 16px; line-height: 1.25em; color: rgb(255, 255, 255); background-color: rgb(51, 153, 153); right: 200px;">\
    <div class="side_guide" style="padding: 15px; font-size: 16px;"@click="toggleSetting()">\
     选项\
    </div>\
     </div>';
    sch_setting.appendChild(divCustom);

    var sch = new Vue({
      el: "#sch_app",
      methods: {
        toggleSetting: function () {
          this.showSetting = !this.showSetting;
          console.log(this.showSetting)
        },
      },
      data: {
        lessons: allLessons,
        list: [],
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

    document.getElementById("bannerbox").remove();
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
