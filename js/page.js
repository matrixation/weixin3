var vm = new Vue({
  el: "#app",
  data: {
    renderData: []
  },
  created() {

  },
  mounted: function() {
    var that = this;
    this.$nextTick(function() {
      that.dataRender();
    })
  },
  methods: {
    initUI: function() {
      this.$container = $(".js-container");
      this.$audioParents = $(".js-audio");
      this.$audioLoops = this.$audioParents.find(".js-radio-step");
      this.$audios = this.$audioParents.find(".js-audiosrc");
      this.loopTimeId = null;
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
          $(".js-audio").not($that).each(function() {
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
            that.renderData = data.posts;
            // that.renderData.end == '0' ? that.renderTemplate(that.renderData.posts) : "";
            // that.renderData.end == '0' ? that.templateEngineer(that.renderData.posts) : "";
            that.initUI();
            that.eventInit();
          }
        })
      })
    }
  }
})
