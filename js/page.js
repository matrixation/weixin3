var page = {
  init: function() {
    this.initUI();
    this.dataRender();
  },
  initUI: function() {
    this.$container = $("#js-container");
    this.$audioParents = $(".js-audio");
    this.$audioLoops = this.$audioParents.find(".js-radio-step");
    this.$audios = this.$audioParents.find(".js-audiosrc");
    this.loopTimeId = null;
    this.renderData = "";
  },
  audioPlay: function(el) {
    el.play();
  },
  audioPause: function(el) {
    el.pause();
    el.currentTime = 0;
  },
  audioLoopPlay: function($el, audioEl) {
    var that = this;
    (function _loop() {
      that.loopTimeId = setTimeout(function() {
        if ($el.hasClass("icon-radio-step1")) {
          $el.addClass("icon-radio-step2").removeClass("icon-radio-step1 icon-radio-step3")
        } else if ($el.hasClass("icon-radio-step2")) {
          $el.addClass("icon-radio-step3").removeClass("icon-radio-step1 icon-radio-step2")
        } else if ($el.hasClass("icon-radio-step3")) {
          $el.addClass("icon-radio-step1").removeClass("icon-radio-step2 icon-radio-step3")
        }
        //如果语音播放结束就停止动画
        if (audioEl.ended) {
          $el.addClass("icon-radio-step3").removeClass("icon-radio-step2 icon-radio-step1");
          return;
        }
        _loop();
      }, 500)
    })()

  },
  audioLoopStop: function($el) {
    $el.addClass("icon-radio-step3").removeClass("icon-radio-step2 icon-radio-step1");
    clearTimeout(this.loopTimeId);
  },
  eventInit: function() {
    var that = this;
    $(function() {
      that.$container.on("click", ".js-audio", function(e) {
        var $that = $(this);
        var currentAudio = $that.find(".js-audiosrc")[0];
        var $currentLoop = $that.find(".js-radio-step");

        //先暂停所有播放的声音与动画
        that.$audioParents.not($that).each(function() {
          that.audioPause($(this).find('.js-audiosrc')[0]);
          that.audioLoopStop($(this).find('.js-radio-step'));
          $(this).attr("data-play-flag", false);
        })

        //如果继续点击当前语音就暂停播放
        if ($that.attr("data-play-flag") === 'true') {
          that.audioPause(currentAudio);
          that.audioLoopStop($currentLoop);
          $that.attr("data-play-flag", false);
        } else {
          //让当前的播放并且声音动画开始
          that.audioPlay(currentAudio);
          that.audioLoopPlay($currentLoop, currentAudio);
          $that.attr("data-play-flag", true);
        }

      })
    })


  },
  dataRender: function() {
    var that = this;
    $(function() {
      $.ajax({
        type: 'GET',
        url: 'http://localhost:3003/communication',
        dataType: 'json',
        success: function(data) {
          that.renderData = data;
          // that.renderData.end == '0' ? that.renderTemplate(that.renderData.posts) : "";
          that.renderData.end == '0' ? that.templateEngineer(that.renderData.posts) : "";
          that.initUI();
          that.eventInit();
        }
      })
    })
  },
  renderTemplate: function(renderData) {
    var html = ''
    for (var i = 0; i < renderData.length; i++) {
      var data = renderData[i];
      switch (data.type) {
        case 'leftText':
          html += ['<div class="flow-left leftText clearfix">',
            '      <div class="flow-time">',
            '        <div class="date-time">' + data.dateTime + '</div>',
            '      </div>',
            '      <div class="left-header">',
            '        <div class="img-box">',
            '          <img src="' + data.headImage + '"class="pic">',
            '        </div>',
            '      </div>',
            '      <div class="left-main">',
            '        <div class="left-txt">',
            '          <span class="left-arrow"></span> ' + data.content,
            '        </div>',
            '      </div>',
            '</div>'
          ].join("");
          break;
        case 'rightText':
          html += ['<div class="flow-right rightText clearfix">',
            '      <div class="flow-time">',
            '        <div class="date-time">' + data.dateTime + '</div>',
            '      </div>',
            '      <div class="right-header">',
            '        <div class="img-box">',
            '          <img src="' + data.headImage + '" class="pic">',
            '        </div>',
            '      </div>',
            '      <div class="right-main clearfix">',
            '        <div class="right-txt">',
            '          <span class="right-arrow"></span> ' + data.content,
            '        </div>',
            '      </div>',
            '</div>'
          ].join("");
          break;
        case 'leftSound':
          html += ['<div class="flow-left leftAudio clearfix">',
            '      <div class="flow-time">',
            '        <div class="date-time">' + data.dateTime + '</div>',
            '      </div>',
            '      <div class="left-header">',
            '        <div class="img-box">',
            '          <img src="' + data.headImage + '" class="pic">',
            '        </div>',
            '      </div>',
            '      <div class="left-main">',
            '        <div class="left-audio js-audio">',
            '          <i class="radio-step js-radio-step icon-radio-step3"></i>',
            '          <audio src="' + data.sound.url + '" class="js-audiosrc"></audio>',
            '          <span class="delay-second">' + data.sound.duration + '</span>',
            '        </div>',
            '      </div>',
            '</div>'
          ].join("");
          break;
        case 'rightSound':
          html += ['<div class="flow-right rightAudio clearfix">',
            '      <div class="flow-time">',
            '        <div class="date-time">' + data.dateTime + '</div>',
            '      </div>',
            '      <div class="right-header">',
            '        <div class="img-box">',
            '          <img src="' + data.headImage + '" class="pic">',
            '        </div>',
            '      </div>',
            '      <div class="right-main clearfix">',
            '        <div class="right-audio js-audio">',
            '          <i class="radio-step js-radio-step icon-radio-step3"></i>',
            '          <audio src="' + data.sound.url + '" class="js-audiosrc"></audio>',
            '          <span class="delay-second">' + data.sound.duration + '</span>',
            '        </div>',
            '      </div>',
            '</div>'
          ].join("");
          break;
        case 'leftImage':
          html += ['<div class="flow-left leftImg clearfix">',
            '      <div class="flow-time">',
            '        <div class="date-time">' + data.dateTime + '</div>',
            '      </div>',
            '      <div class="left-header">',
            '        <div class="img-box">',
            '          <img src="' + data.headImage + '" class="pic">',
            '        </div>',
            '      </div>',
            '      <div class="left-main">',
            '        <div class="left-img">',
            '            <span class="left-arrow"></span>',
            '            <img src="' + data.imageArray.turl + '">',
            '        </div>',
            '      </div>',
            '    </div>'
          ].join("");
          break;
        case 'rightImage':
          html += ['<div class="flow-right rightImg clearfix">',
            '      <div class="flow-time">',
            '        <div class="date-time">' + data.dateTime + '</div>',
            '      </div>',
            '      <div class="right-header">',
            '        <div class="img-box">',
            '          <img src="' + data.headImage + '" class="pic">',
            '        </div>',
            '      </div>',
            '      <div class="right-main clearfix">',
            '        <div class="right-img">',
            '          <span class="right-arrow"></span>',
            '          <img src="' + data.imageArray.turl + '" class="pic">',
            '        </div>',
            '      </div>',
            '</div>'
          ].join("");
          break;
      }
    }
    this.$container.html(html);
  },
  templateEngineer: function(renderData) {
    var htmls = this.$container.html(),
      htmlArr, replaceHtmls = "",
      newReplaceHtml,that = this;
    htmlArr = htmls.replace(/[\n\r]/g, '').split('#');

    for (var i = 0; i < renderData.length; i++) {
      var data = renderData[i];
      switch (data.type) {
        case 'leftText':
          replaceHtmls += that.filterHtmlTemplate(htmlArr[0],data);
          break;
        case 'rightText':
          replaceHtmls += that.filterHtmlTemplate(htmlArr[1],data);
          break;
        case 'leftSound':
          replaceHtmls += that.filterHtmlTemplate(htmlArr[2],data);
          break;
        case 'rightSound':
          replaceHtmls += that.filterHtmlTemplate(htmlArr[3],data);
          break;
        case 'leftImage':
          replaceHtmls += that.filterHtmlTemplate(htmlArr[4],data);
          break;
        case 'rightImage':
          replaceHtmls += that.filterHtmlTemplate(htmlArr[5],data);
          break;
      }
    }

    newReplaceHtml = replaceHtmls.replace(/\:src/g, function() {
      return arguments[0].slice(1)
    })
    this.$container.empty().html(newReplaceHtml);
  },
  filterHtmlTemplate:function(arr,data){
     return arr.replace(/{{(\w+\.?\w+)}}/g, function() {
      var args = arguments[1].split('.'),
        replaceStr;
      args.forEach(function(key, index) {
        if (!replaceStr) {
          replaceStr = data[key]
        } else {
          replaceStr = replaceStr[key]
        }
      })
      return replaceStr;
    });
  }
}

page.init()
