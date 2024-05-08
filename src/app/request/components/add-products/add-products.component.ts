import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestService } from '../../services/request/request.service';
import { Product } from '../../interfaces/product.interface';
import { Subscription } from 'rxjs';
import { LoadingOverlayService } from '../../../shared/services/loading-overlay/loading-overlay.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { MeasurementAllMeasurements, ResponseAllMeasurements } from '../../interfaces/responseAllMeasurements.interface';
import { ResponseCreateCertificate } from '../../interfaces/responsesCreateCertificate.interface';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.scss'
})
export class AddProductsComponent implements OnInit, OnDestroy {

  private arrSubs: Subscription[] = [];
  public tabs: Product[] = [];
  public selectedIndex: number = 0;
  public unitsMeasurements: MeasurementAllMeasurements[] = [];

  constructor(
    private requestService: RequestService,
    private loadingOverlayService: LoadingOverlayService,
    private toastService: ToastService,
  ) {
    this.tabs.push({ unit_measurement_id: 0, name: '', brand: '', model: '', invoice: '', total_quantity: 0, labels_to_inspecc: 0, tariff_fraction: ''});

  }

  ngOnInit(): void {
    // * Obtenemos todas las unidades de medida
    this.loadingOverlayService.addLoading();
    this.arrSubs.push(
      this.requestService.getAllMeasurements().subscribe({
        next: (r: ResponseAllMeasurements) => {
          this.unitsMeasurements = r.data;
          this.loadingOverlayService.removeLoading();
        },
        error: (e: any) => {
          this.toastService.showSnackbar(false, 'Error desconocido durante la ejecución (CODE: 001)', 7000);
        }
      })
    );

    // * Si hay informacion previa de productos de una solicitud cargamos esa informacion
    if(this.requestService.productsRequestData.length > 0) {
      this.tabs = this.requestService.productsRequestData;
      this.requestService.setProducts( this.tabs );
    }

    // * Obtenemos el indice de las tabs en las que nos encontramso, y suscribimos a los cambios del indice para desplazar hasta el
    this.selectedIndex = this.requestService.index;
    this.arrSubs.push(
      this.requestService.getIndex.subscribe({
        next: (i:number) => {
          this.selectedIndex = i;
        }
      })
    );

    // * Seteamos el indice actual al arreglo de productos (Se utiliza para en el autocomplete al seleccionar uno, saber a que indice debemo trasladar al usuario)
    this.setIndexTabs();

  }

  ngOnDestroy(): void {
    this.arrSubs.forEach( (s:Subscription) => s.unsubscribe() );
  }

  // * Metodo que se encarga de asignar el indice al arreglo de productos
  setIndexTabs(): void {
    for (let i = 0; i < this.tabs.length; i++) {
      this.tabs[i].index = i;
    }
  }

  // * Metodo que se encarga de añadir una pestaña de productos
  addTab() {
    this.tabs.push({ unit_measurement_id: 0, name: '', brand: '', model: '', invoice: '', total_quantity: 0, labels_to_inspecc: 0, tariff_fraction: '' });
    this.setIndexTabs();
    this.selectedIndex = this.tabs.length-1;
  }

  // * Metodo que se encarga de eliminar una pestaña de los productos
  removeTab(index: number) {
    this.tabs.splice(index, 1);
    this.setIndexTabs();
    this.requestService.setProducts( this.tabs );
  }

  // * Metodo que se encarga de cambiar el indice en que se encuentra la pestaña actualmente
  changeIndex(value: number): void {
    this.selectedIndex += value;
  }

  // * Metodo que se encarga de persistir la informacion de los productos que se han agregado y de mostrar el formulario de la solicitud en lugar de los productos
  goBack(): void {
    this.requestService.productsRequestData = this.tabs
    this.requestService.setOption(0);
  }

  // * Metodo que atiendo el evento de cuando un producto sufre un cambio en su informacion o si ya esta listo para ser añadido al autocomplete y podamos realizar busquedas de el
  handlerSendProducts(content: [boolean, Product]): void {
    // * Si ya esta listo reemplazamos la informacion del producto que tenemos en tabs por el producto que llega en el evento
    if(content[0]) {
      const { index, ...updatedProduct } = content[1];
      const tabToUpdate = this.tabs[index!];
      if (tabToUpdate) {
        Object.assign(tabToUpdate, updatedProduct);
      }

    }

    // * Seteamos el valor de si es un producto ya listo para ser buscado
    this.tabs[content[1].index!].isReady = content[0];
    // * Notificamos que han habido cambios en las tabs
    this.requestService.setProducts( this.tabs );

  }

  // * Metodo que se encarga de guardar la solicitud
  saveRequest(): void{
    const everyReady: boolean = this.tabs.every((p:Product) => p.isReady === true);
    if( !everyReady ) {
      this.toastService.showSnackbar(false, 'Hay información faltante de algunos productos', 3000)
      return;
    }

    this.loadingOverlayService.addLoading();
    this.arrSubs.push(
      this.requestService.saveRequest(this.requestService.formRequestData, this.tabs).subscribe({
        next: (r:ResponseCreateCertificate) => {
          this.loadingOverlayService.removeLoading();
          this.toastService.showSnackbar(true, 'Solicitud creada correctamente', 5000);
          this.requestService.productsRequestData = [];
          this.requestService.resetFormRequestData();
          this.requestService.setOption(0);
        },
        error: (e:any) => {
          this.toastService.showSnackbar(false, 'Error desconocido durante la ejecución (CODE: 002)', 5000);
        }
      })
    );

  }

}
