System.register(['angular2/platform/browser', './modules/app.component', './modules/scale/scale.service'], function(exports_1) {
    var browser_1, app_component_1, scale_service_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (scale_service_1_1) {
                scale_service_1 = scale_service_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, [scale_service_1.ScaleService]);
        }
    }
});
