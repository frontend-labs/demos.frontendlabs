import {Component} from 'angular2/core';
import {TaxComponent} from './tax.component';
import {TaxDetailService} from './tax.detail.service'
import {ScaleService} from './scale.service';

@Component({
  selector: 'my-app',
  directives: [TaxComponent],
  template: '<tax-component></tax-component>',
  providers: [TaxDetailService]
})

export class AppComponent {

}
