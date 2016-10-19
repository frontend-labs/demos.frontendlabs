var App;

App = function() {
    var catchDom, dom, events, functions, initialize, st, subscribeEvents;
    return dom = {}, st = {
        body: "body",
        frmParsley: ".frm-parsley"
    }, catchDom = function() {
        dom.body = $(st.body), dom.frmParsley = $(st.frmParsley);
    }, subscribeEvents = function() {
        $("#btnNext").on("click", events.showStep2), $("#lnkOpenMenu").on("click", events.toggleMenu), 
        $("#btnCreateGame").on("click", events.tmp1);
    }, events = {
        showStep2: function() {
            $(".c-create-game__step1").hide(), $(".c-create-game__step2").fadeIn();
        },
        toggleMenu: function() {
            $(this).toggleClass("l-header__menu-icon--active"), $("#headerNav").slideToggle();
        },
        tmp1: function() {
            setTimeout(function() {
                !$("#frmSignUp").parsley().isValid() && $("#frmSignUp").parsley().isValid() || (window.location.href = "confirmar.html");
            }, 3e3);
        }
    }, functions = {
        formValidation: function() {
            dom.frmParsley.parsley();
        },
        focusTxt: function() {
            $("#txtGameName").focus();
        },
        dates: function() {
            var currentYear;
            currentYear = new Date().getFullYear(), $(".datedropper").dateDropper({
                lang: "es",
                minYear: currentYear,
                maxYear: currentYear + 1,
                lock: "from",
                lang: "es",
                format: "d/m/Y",
                dropPrimaryColor: "#F15252",
                dropTextColor: "#535353",
                dropBorder: "none",
                dropShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)"
            });
        }
    }, initialize = function() {
        catchDom(), subscribeEvents(), functions.focusTxt(), functions.dates(), functions.formValidation();
    }, {
        init: initialize
    };
}(), App.init();