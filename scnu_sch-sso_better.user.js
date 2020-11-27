// ==UserScript==
// @name         scnu 学者网sso界面改善
// @namespace    https://github.com/wulnm/
// @version      0.7
// @description  学者网未结课课程排版优化，sso默认显示我的应用
// @author       wulnm
// @match        http://www.scholat.com/myCourses.html
// @match        https://sso.scnu.edu.cn/AccountService/user/index.html
// @grant        none
// @run-at document-end
// ==/UserScript==

(function () {
  "use strict";
  if (window.location.href == "http://www.scholat.com/myCourses.html") {
    var completedTD = [];
    var tab3 = document.getElementById("tabs_3");
    var completedLessons = [
      "程序语言基础",
      "Python程序设计语言",
      "数学建模方法",
      "ACM程序设计(一)",
      "概率论与数理统计",
    ];
    var closedLesson = document.getElementById("closeCourse");
    var learnLesson = document.getElementById("learnCourse");

    function toLessons() {
      if (document.location.href == "http://www.scholat.com/myCourses.html") {
        // 点击“学习的课程”
        let lessons = undefined;
        lessons = document.getElementById("ui-id-4").click();
        //window.location.href = "#tab_3";
      }
    }

    function toRealLessons() {
      function getTD(title) {
        // 获取课程 td
        return title.parentNode.parentNode.parentNode.parentNode;
      }

      let titles = Array.from(document.getElementsByClassName("evlistTitle"));
      // 对titles进行处理
      for (let i = titles.length - 1; i >= 0; i--) {
        if (getTD(titles[i]).parentNode == closedLesson) {
          titles.splice(i, 1, 0); // 删除已经学习完毕的课程
        }
      }
      while (titles[titles.length - 1] == 0) {
        titles.pop(); //删除空元素
      }

      let learnLesson = getTD(titles[0]).parentNode;

      for (let i = 0; i < titles.length; i++) {
        if (completedLessons.includes(titles[i].innerText)) {
          completedTD.push(getTD(titles[i]));
        }
      }

      //删除已完成的课程
      for (let i = 0; i < completedTD.length; i++) {
        learnLesson.removeChild(completedTD[i]);
      }

      //更改正在学习x门课的x
      let learnMsg = document.getElementById("learn_course_msg");
      let learnCnt = Number(
        learnMsg.innerText
          .replace(" ", "")
          .replace(" ", "")
          .match(/正在学习(\S*)门课程/)[1]
      );
      learnMsg.innerHTML =
        "正在学习&nbsp;<a>" +
        (learnCnt - completedLessons.length + "") +
        "</a>&nbsp;门课程";

      //新增一个未结课模块
      var almostMsg = document.createElement("div");
      almostMsg.innerHTML =
        '<span id="almostMsg" style="font-size:14px;">已结课但未被教师关闭&nbsp;<a>' +
        completedLessons.length +
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

      // TODO 增加3个模块之间的空隙
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
  }

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
})();
