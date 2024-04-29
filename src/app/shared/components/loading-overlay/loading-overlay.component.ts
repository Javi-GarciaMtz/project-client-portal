import { Component } from '@angular/core';
import { LoadingOverlayService } from '../../services/loading-overlay/loading-overlay.service';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss'
})
export class LoadingOverlayComponent {

  constructor(public loader: LoadingOverlayService) { }

}
