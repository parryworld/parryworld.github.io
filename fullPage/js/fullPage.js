
;(function($){
  var defaults = {
    selectors: {
      sections: '#fullpage',
      section: '.section',
      pagination: '.pagination',
      active: '.active'
    },
    index: 0,
    easing: 'ease',
    animationTime: 1200,
    loop: false,
    autoplay: false,
    autoplaySpeed: 3000,
    pagination: true,
    keyboard: true,
    direction : "vertical",
  };

  var _prefix = (function(element) {
    var aPrefix = ['webkit', 'Moz', 'o', 'ms'];
    var props = "";
    for (var i in aPrefix) {
      props = aPrefix[i] + 'Transition';
      if (element.style[props] !== undefined) {
        return '-' + aPrefix[i].toLowerCase() + '-';
      }
    }
    return "";
  })(document.createElement('div'));

  var FullPage = (function(){
    function FullPage(element, options) {
      this.options = $.extend(true, defaults, options || {});
      this.element = element;
      this.init();
    }

    FullPage.prototype = {
      init: function() {
        var me = this;
        me.selectors = me.options.selectors;
        me.sections = me.element.find(me.selectors.section);
        me.index = me.options.index;
        me.pageCount = me.sections.length;
        me.canScroll = true;
        me.direction = me.options.direction === 'vertical';
        if (me.options.autoplay) {
          me.options.loop = true;
        }

        if (me.options.pagination) {
          me._initPagination();
        }

        me._initLayout();

        me._initIndex();

        me._initEvent();

        if (me.options.autoplay) {
          me._initAutoPlay();
        }
      },

      next: function() {
        var me = this;
        if (me.index < me.pageCount - 1) {
          me.index++;
        } else {
          return;
        }
        me._scrollPage();
      },

      prev: function() {
        var me = this;
        if (me.index > 0) {
          me.index--;
        } else if (me.options.loop) {
          me._resetPosition(me.pageCount - 1);
          me.index--;
        } else {
          return;
        }
        me._scrollPage();
      },

      _initPagination: function() {
        var me = this;
        var htmlPages = '<ul class="pagination ' + (me.direction ? 'vertical' : 'horizontal') + '">';
        for (var i = 0; i < me.pageCount; i++) {
          htmlPages += '<li></li>';
        }
        htmlPages += '</ul>';
        me.element.after(htmlPages);
        me.pages = $(me.selectors.pagination + ' li');
        me.pages.eq(me.index).addClass(me.selectors.active.substr(1));
        me.pages.click(function() {
          me.index = $(this).index();
          me._scrollPage();
        });
      },

      _initLayout: function() {
        var me = this;

        if (me.options.loop && me.pageCount > 1) {
          me.element.append(me.sections.first().clone());
          me.sections = me.element.find(me.selectors.section);
          me.pageCount = me.sections.length;
        }

        if (!me.direction) {
          var width = me.pageCount * 100 + '%';
          var sectionWidth = (100 / me.pageCount).toFixed(2) + '%';
          me.element.width(width);
          me.sections.width(sectionWidth).css('float', 'left');
        }
      },

      _initEvent: function() {
        var me = this;
        $(document).on('mousewheel DOMMouseScroll', function(e) {
          var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
          if (me.canScroll) {
            if (delta < 0) {
              me.next();
            } else if (delta > 0) {
              me.prev();
            }
          }
        });
        if (me.options.keyboard) {
          $(document).keydown(function(e) {
            var keyCode = e.which;
            if (me.canScroll) {
              if ((me.direction && keyCode === 40) || (!me.direction && keyCode === 39)) {
                me.next();
              }
              if ((me.direction && keyCode === 38) || (!me.direction && keyCode === 37)) {
                me.prev();
              }
            }
          });
        }
      },

      _initIndex: function() {
        var me = this;
        var pos = me.sections.eq(me.index).position();
        var translate = me.direction ? 'translateY(-' + pos.top + 'px)' : 'translateX(-' + pos.left + 'px)';
        $(me.element).css(_prefix + 'transform', translate);
      },

      _initAutoPlay: function() {
        var me = this;
        me.timer = setInterval(function() {
          if (me.canScroll) {
            me.next();
          }
        }, me.options.autoplaySpeed);
      },

      _scrollPage: function() {
        var me = this;
        var activeClass = me.selectors.active.substr(1);
        var activeIndex = me.options.loop && me.index === me.pageCount - 1 ? 0 : me.index;

        me.canScroll = false;
        var pos = me.sections.eq(me.index).position();
        var translate = me.direction ? 'translateY(-' + pos.top + 'px)' : 'translateX(-' + pos.left + 'px)';
        $(me.element).css(_prefix + 'transition', 'all ' + me.options.animationTime + 'ms ' + me.options.easing);
        $(me.element).css(_prefix + 'transform', translate);
        if (me.options.pagination) {
          me.pages.eq(activeIndex).addClass(activeClass).siblings().removeClass(activeClass);
        }
        setTimeout(function() {
          if (me.options.loop && me.index === me.pageCount - 1) {
            me._resetPosition(0);
          }
          me.canScroll = true;
        }, me.options.animationTime + 200);
      },

      _resetPosition: function(index) {
        var me = this;
        me.index = index;
        var pos = me.sections.eq(me.index).position();
        var translate = me.direction ? 'translateY(-' + pos.top + 'px)' : 'translateX(-' + pos.left + 'px)';
        $(me.element).css(_prefix + 'transition', '');
        $(me.element).css(_prefix + 'transform', translate);
      }
    };

    return FullPage;
  })();

  $.fn.fullPage = function(options) {
    return this.each(function(){
      var me = $(this);
      var instance = me.data('fullPage');
      if (!instance) {
        me.data('fullPage', (instance = new FullPage(me, options)));
      }
    });
  }
})(jQuery);
