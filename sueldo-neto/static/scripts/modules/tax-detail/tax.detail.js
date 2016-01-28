System.register(['angular2/core'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var TaxDetail;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            TaxDetail = (function () {
                function TaxDetail() {
                }
                TaxDetail.prototype.calculateAmountAfected = function () {
                    var restAmountAfected = this.tax.incomeByYear, acumulateAmountAfected = 0, amount = 0, maxAmountAfected = (this.scale.topScale - this.scale.bottomScale) * this.tax.UIT;
                    if (this.prevTaxDetail) {
                        restAmountAfected = this.tax.incomeByYear - this.prevTaxDetail.acumulateAmount;
                        amount = restAmountAfected;
                    }
                    if (restAmountAfected == 0) {
                        amount = 0;
                    }
                    if (restAmountAfected > maxAmountAfected) {
                        amount = maxAmountAfected;
                    }
                    this.amountAfected = amount;
                };
                TaxDetail.prototype.calculateAcumulateAmount = function () {
                    var acumulateAmount = this.amountAfected;
                    if (this.prevTaxDetail) {
                        acumulateAmount = this.prevTaxDetail.acumulateAmount + this.amountAfected;
                    }
                    this.acumulateAmount = acumulateAmount;
                };
                Object.defineProperty(TaxDetail.prototype, "totalTax", {
                    get: function () {
                        return this.amountAfected * this.scale.percent;
                    },
                    enumerable: true,
                    configurable: true
                });
                __decorate([
                    core_1.Input('tax-detail'), 
                    __metadata('design:type', TaxDetail)
                ], TaxDetail.prototype, "taxDetail", void 0);
                TaxDetail = __decorate([
                    core_1.Component({
                        selector: 'templates/tax-detail/tax-detail-component',
                        template: "\n      <div>Monto afecto: {{taxDetail.amountAfected}}</div>\n      <div>Impuestos: {{taxDetail.totalTax}}</div>\n    "
                    }), 
                    __metadata('design:paramtypes', [])
                ], TaxDetail);
                return TaxDetail;
            })();
            exports_1("TaxDetail", TaxDetail);
        }
    }
});
