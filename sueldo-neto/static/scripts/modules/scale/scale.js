System.register([], function(exports_1) {
    var Scale;
    return {
        setters:[],
        execute: function() {
            Scale = (function () {
                function Scale(bottomScale, topScale, percent) {
                    this.bottomScale = bottomScale;
                    this.topScale = topScale;
                    this.percent = percent;
                }
                return Scale;
            })();
            exports_1("Scale", Scale);
        }
    }
});
