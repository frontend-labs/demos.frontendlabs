
/*
Utils
 */
var Cookie, Utils, browser;

window.log = function() {
  var enviroment;
  enviroment = function() {
    return /(local\.|dev\.|localhost)/gi.test(document.domain);
  };
  if (typeof console !== "undefined" && enviroment()) {
    if (typeof console.log.apply !== "undefined") {
      console.log.apply(console, arguments);
      return;
    } else {
      console.log(Array.prototype.slice.call(arguments));
      return;
    }
  }
};

Cookie = {
  create: function(c, d, e) {
    var a, b;
    a = "";
    if (e) {
      b = new Date();
      b.setTime(b.getTime() + (e * 24 * 60 * 60 * 1000));
      a = "; expires=" + b.toGMTString();
    } else {
      a = "";
    }
    document.cookie = c + "=" + d + a + "; path=/";
    return this;
  },
  read: function(b) {
    var a, d, e, f;
    e = b + "=";
    a = document.cookie.split(";");
    d = 0;
    while (d < a.length) {
      f = a[d];
      while (f.charAt(0) === " ") {
        f = f.substring(1, f.length);
      }
      if (f.indexOf(e) === 0) {
        return f.substring(e.length, f.length);
      }
      d++;
    }
    return null;
  },
  del: function(a) {
    return this.create(a, "", -1);
  }
};

browser = (function() {
  var a, b;
  a = (function(d) {
    var c, e, f, g, h, i;
    d = d.toLowerCase();
    e = /(chrome)[ \/]([\w.]+)/.exec(d);
    g = /(webkit)[ \/]([\w.]+)/.exec(d);
    f = /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(d);
    i = /(msie) ([\w.]+)/.exec(d);
    c = /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(d);
    h = e || g || f || i || d.indexOf("compatible") < 0 && c || [];
    return {
      brw: h[1] || "",
      ver: h[2] || "0"
    };
  })(navigator.userAgent);
  b = {};
  if (a.brw) {
    b[a.brw] = true;
    b.version = a.ver;
  }
  if (b.chrome) {
    b.webkit = true;
  } else {
    if (b.webkit) {
      b.safari = true;
    }
  }
  return b;
})();

if (browser.msie) {
  switch (browser.version) {
    case '8.0':
      $('body').addClass('lt-ie8');
      break;
    case '9.0':
      $('body').addClass('lt-ie9');
      break;
  }
}

Utils = (function() {
  function Utils() {}

  return Utils;

})();

Utils.prototype.colorLog = function(msg, color) {
  log("%c" + msg, "color:" + color + ";font-weight:bold");
};
