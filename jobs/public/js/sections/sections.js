var App;

App = (function() {
  var catchDom, dom, events, functions, initialize, st, subscribeEvents;
  dom = {};
  st = {
    lnkLogin: ".lnk-login",
    loginBox: ".login-box",
    modal: ".modal",
    modalContent: ".modal-content",
    btnCloseModal: ".close-modal",
    filterSearchBar: "header .filter-search",
    headerTop: "header .header-top"
  };
  catchDom = function() {
    dom.lnkLogin = $(st.lnkLogin);
    dom.loginBox = $(st.loginBox);
    dom.modal = $(st.modal);
    dom.modalContent = $(st.modalContent);
    dom.btnCloseModal = $(st.btnCloseModal);
    dom.filterSearchBar = $(st.filterSearchBar);
    dom.headerTop = $(st.headerTop);
  };
  subscribeEvents = function() {
    dom.lnkLogin.on("click", events.showLoginBox);
    dom.btnCloseModal.on("click", events.closeModal);
    $(window).on("scroll", events.fixHeader);
  };
  events = {
    showLoginBox: function() {
      dom.modal.addClass('modal--open');
      dom.modalContent.animateCSS("don");
    },
    closeModal: function() {
      dom.modalContent.animateCSS("bounceOut", function() {
        return dom.modal.removeClass('modal--open');
      });
    },
    fixHeader: function() {
      var barPosition;
      if ($(".board").length) {
        barPosition = dom.headerTop.height();
        if ($(window).scrollTop() >= barPosition) {
          $("body").addClass("fixed");
        } else {
          $("body").removeClass("fixed");
        }
      }
    }
  };
  functions = {
    floatLabels: function() {
      $('input.floatlabel').floatlabel();
    }
  };
  initialize = function() {
    catchDom();
    $(function() {
      subscribeEvents();
      functions.floatLabels({
        transitionEasing: 'ease',
        labelStartTop: '50px',
        labelEndTop: '40px'
      });
    });
  };
  return {
    init: initialize
  };
})();

App.init();
