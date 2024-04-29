import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingOverlayService } from './shared/services/loading-overlay/loading-overlay.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'frontend';

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

}
