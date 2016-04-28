void function(win, undefined){

  umd("Performance", Performance);

  //====================================:Performance

  function Performance(options) {
    options = options || {};
    this.query = options.query || 'button';
    this.info = options.info || 'Click the code button, run tester, and see console.';
    this.timeout = options.timeout || 1e3;
    this.running = false;
    this.eleQuery = $(this.query);
    this.init.apply(this, [].slice.call(arguments));
  }

  Performance.prototype.init = function() {
    this.render();
    this.bind();
  };

  /**
   * 渲染 table 结构
   */
  Performance.prototype.render = function() {
    var info = this.info ? '<h3>' + this.info + '</h3>' : '';
    var table = '<div>' + info + '<div class="performance-box"><table><thead><tr>\
                  <td>Code</td><td>Speed (times/s)</td><td>Relative Rate</td></tr></thead>';
    forEach(this.eleQuery, function($trigger){
      var code = $trigger.textContent || $trigger.innerText;
      table += '<tr><td><button>' + code + '</button></td><td>-</td><td>-</td></tr>';
    });
    table += '</table><p class="performace-copyright">Generated By <a href="https://github.com/barretlee/performance" target="_blank">Performance</a><span class="performance-status">Cost ' + this.timeout + 'ms, testing...</span></p></div></div>';
    document.write('<style>\
        table {border-collapse:collapse;}\
        thead td {background:#EEE;font-weight:bold;}\
        td {text-align:center;padding:8px;border:1px solid #CCC;}\
        .performance-box {display:inline-block;font-family:Consolas;}\
        .performance-box button {white-space: pre-wrap;text-align:left;cursor:pointer;max-width:600px;overflow: scroll;}\
        .performance-status {float: left;color:#F40;font-size:14px;visibility:hidden;}\
        .performace-copyright {text-align:right;font-size:12px;\
        -webkit-user-select:none;height: 18px;;line-height:18px;;}\
      </style>' + table);
  };

  /**
   * 绑定事件
   */
  Performance.prototype.bind = function() {
    var self = this;
    forEach($('.performance-box button'), function($trigger, index){
      var code = $trigger.textContent || $trigger.innerText;
      addEventListener.call($trigger, 'click', function(evt) {
        var runed = $trigger.getAttribute('data-runed');
        if(self.running || runed) {
          evt.preventDefault();
          return;
        }
        self.updateStatus(true);
        $trigger.setAttribute('data-runed', 1);
        code = code.replace(/\n/, '');
        code = code.length > 50 ? code.slice(0, 47) + '...' : code;
        var tag = '#' + index + ": " + code;
        setTimeout(function(){
          window.console && console.group(tag);
          self.calc($trigger, index);
          window.console && console.groupEnd(tag);
        }, 16);
      });
    });
  };

  /**
   * 点击后更新状态
   */
  Performance.prototype.updateStatus = function(bool) {
    var $status = $('.performance-status')[0];
    if(bool) {
      $status.style.visibility = "visible";
    } else {
      $status.style.visibility = "hidden";
    }
  };

  /**
   * 开始计算
   */
  Performance.prototype.calc = function($trigger, index) {
    var self = this;
    var start = new Date* 1;
    var code = $trigger.textContent || $trigger.innerText;
    var fn = new Function('__f', 'for(var __j = ' + this.timeout + ', __s = new Date*1, __n = 0;\
      new Date - __s < __j;__n++){' + code + '} __f(__n);');
    fn(function(counter){
      self.update($trigger, index, counter);
    });
  };

  /**
   * 更新视图
   */
  Performance.prototype.update = function($trigger, index, counter) {
    var self = this;
    var tps = Math.floor(counter / (this.timeout / 1e3));
    var times = $trigger.getAttribute('data-times') || 0;
    $trigger.setAttribute('data-times', ++times);
    window.console && console.log('%cTried ' + times + ' times', 'color:blue;');
    window.console && console.log('%cRun ' + this.timeout + 'ms, ' + tps + ' hits per second.', 'font-weight:bold;color:#777;');
    $trigger.parentElement.nextElementSibling.innerHTML = tps;
    var speeds = [];
    var $trs = $('.performance-box tr');
    forEach($trs, function($tr, trIndex){
      if(trIndex == 0) {
        return;
      }
      var $last = $tr.children[1];
      var text = $last.innerHTML;
      if(text == '-' && trIndex != index + 1) {
        return;
      }
      speeds.push(+text);
    });
    var max = Math.max.apply(null, speeds);
    forEach($trs, function($tr, trIndex){
      if(trIndex == 0) {
        return;
      }
      var $last = $tr.children[2];
      var $m = $tr.children[1];
      var rate = $last.innerHTML;
      var speed = $m.innerHTML;
      if(rate == '-' && trIndex != index + 1) {
        return;
      }
      if(speed == '-' && trIndex === index + 1) {
        speed = rate;
      }
      $last.innerHTML = (speed * 100 / max).toFixed(2) + "%";
    });
    self.updateStatus(false);
  };

  //====================================:Uitls

  function forEach(arr, fn) {
    if(!arr.length || typeof fn !== 'function') {
      return;
    }
    for(var i = 0, len = arr.length; i < len; i++) {
      fn(arr[i], i);
    }
  }

  // mini Query
  function $(query) {
    var res = [];
    if (document.querySelectorAll) {
      res = document.querySelectorAll(query);
    } else {
      var firstStyleSheet = document.styleSheets[0] || document.createStyleSheet();
      query = query.split(',');
      for(var i = 0, len = query.length; i < len; i++) {
        firstStyleSheet.addRule(query[i], 'Barret:Lee');
      }
      for (var i = 0, len = document.all.length; i < len; i++) {
        var item = document.all[i];
        item.currentStyle.Barret && res.push(item);
      }
      firstStyleSheet.removeRule(0);
    }
    if(res.item) { /* Fuck IE8 */
      var ret = [];
      for(var i = 0, len = res.length; i < len; i++){
        ret.push(res.item(i));
      }
      res = ret;
    }
    return res;
  };

  function addEventListener(evt, fn){
    window.addEventListener ? this.addEventListener(evt, fn, false) : (window.attachEvent)
        ? this.attachEvent('on' + evt, fn) : this['on' + evt] = fn;
  }

  // UMD
  function umd(name, component) {
    switch (true) {
      case typeof module === 'object' && !!module.exports:
        module.exports = component;
        break;
      case typeof define === 'function' && !!define.amd:
        define(name, function() {
          return component;
        });
        break;
      default:
        try {
          if (typeof execScript === 'object') {
            execScript('var ' + name);
          }
        } catch (error) {}
        window[name] = component;
    }
  };

}(window, void 0);