System.register(['angular2/core', '../tax-detail/tax.detail', '../tax-detail/tax.detail.service'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, tax_detail_1, tax_detail_service_1;
    var TaxComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (tax_detail_1_1) {
                tax_detail_1 = tax_detail_1_1;
            },
            function (tax_detail_service_1_1) {
                tax_detail_service_1 = tax_detail_service_1_1;
            }],
        execute: function() {
            TaxComponent = (function () {
                function TaxComponent(taxDetailService) {
                    this.taxDetailService = taxDetailService;
                    this.incomeByMonth = 0;
                }
                Object.defineProperty(TaxComponent.prototype, "incomeAfectedByTax", {
                    get: function () {
                        return this.incomeByYear - this.freeIncomeAfectedByTax;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TaxComponent.prototype, "freeIncomeAfectedByTax", {
                    get: function () {
                        return this.UIT * 7;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TaxComponent.prototype, "incomeByYear", {
                    get: function () {
                        return this.incomeByMonth * 14;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TaxComponent.prototype, "UIT", {
                    get: function () {
                        return 3950;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TaxComponent.prototype, "isIncomeAfectedByTax", {
                    get: function () {
                        if (this.incomeAfectedByTax > 0) {
                            return true;
                        }
                        return false;
                    },
                    enumerable: true,
                    configurable: true
                });
                TaxComponent.prototype.calculateTaxDetail = function ($event) {
                    this.incomeByMonth = $event;
                    this.taxDetails = this.taxDetailService.getListTaxDetail(this);
                };
                TaxComponent = __decorate([
                    core_1.Component({
                        selector: 'tax-component',
                        templateUrl: 'templates/tax/tax-form.html',
                        directives: [tax_detail_1.TaxDetail],
                    }), 
                    __metadata('design:paramtypes', [tax_detail_service_1.TaxDetailService])
                ], TaxComponent);
                return TaxComponent;
            })();
            exports_1("TaxComponent", TaxComponent);
        }
    }
});
