System.register([], function(exports_1) {
    var SCALES;
    return {
        setters:[],
        execute: function() {
            exports_1("SCALES", SCALES = [
                { bottomScale: 0, topScale: 7, percent: 0 },
                { bottomScale: 7, topScale: 12, percent: 0.08 },
                { bottomScale: 12, topScale: 27, percent: 0.14 },
                { bottomScale: 27, topScale: 42, percent: 0.17 },
                { bottomScale: 42, topScale: 52, percent: 0.2 },
                { bottomScale: 52, topScale: 1000, percent: 0.3 }
            ]);
        }
    }
});
