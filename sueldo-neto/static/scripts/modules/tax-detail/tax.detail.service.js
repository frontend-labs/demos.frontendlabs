System.register(['angular2/core', '../tax-detail/tax.detail', '../scale/scale.service'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, tax_detail_1, scale_service_1;
    var TaxDetailService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (tax_detail_1_1) {
                tax_detail_1 = tax_detail_1_1;
            },
            function (scale_service_1_1) {
                scale_service_1 = scale_service_1_1;
            }],
        execute: function() {
            TaxDetailService = (function () {
                function TaxDetailService(scaleService) {
                    var _this = this;
                    Promise.resolve(scaleService.getScales())
                        .then(function (scales) { return _this.scales = scales; });
                }
                TaxDetailService.prototype.getScales = function () {
                    return this.scales;
                };
                TaxDetailService.prototype.getListTaxDetail = function (tax) {
                    var i = 0, taxDetails = [], lastTaxDetail;
                    for (i; i < this.scales.length; i++) {
                        var scale = this.scales[i];
                        var taxDetail = new tax_detail_1.TaxDetail();
                        taxDetail.scale = scale;
                        taxDetail.tax = tax;
                        taxDetail.prevTaxDetail = lastTaxDetail;
                        taxDetail.calculateAmountAfected();
                        taxDetail.calculateAcumulateAmount();
                        lastTaxDetail = taxDetail;
                        taxDetails.push(taxDetail);
                    }
                    return taxDetails;
                };
                TaxDetailService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [scale_service_1.ScaleService])
                ], TaxDetailService);
                return TaxDetailService;
            })();
            exports_1("TaxDetailService", TaxDetailService);
        }
    }
});
