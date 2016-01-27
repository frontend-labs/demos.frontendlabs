import {Injectable} from 'angular2/core';
import {ScaleService} from './scale.service';
import {TaxDetail} from './tax.detail';
import {Scale} from './scale';
import {TaxComponent} from './tax.component';

@Injectable()
export class TaxDetailService {

  public scales:Scale[];

  getScales() {
    return this.scales;
  }

  getListTaxDetail(tax:TaxComponent): TaxDetail[] {
    var i = 0,
        taxDetails = [],
        lastTaxDetail;

    for (i; i < this.scales.length; i++ ) {
      scale = this.scales[i];
      taxDetail = new TaxDetail();
      taxDetail.scale = scale;
      taxDetail.tax = tax;
      taxDetail.prevTaxDetail = lastTaxDetail;
      taxDetail.calculateAmountAfected()
      taxDetail.calculateAcumulateAmount()
      lastTaxDetail = taxDetail;
      taxDetails.push(taxDetail);
    }

    return taxDetails;
  }
  constructor (
      scaleService:ScaleService
  ) {
    Promise.resolve(scaleService.getScales())
      .then(scales => this.scales = scales);
  }
}

