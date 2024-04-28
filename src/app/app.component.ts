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
  public loading: boolean[] = [];
  public arrSubs: Subscription[] = [];

  constructor(
    private loadingOverlayService: LoadingOverlayService,
  ) {}

  ngOnInit(): void {
    this.loading = this.loadingOverlayService.loading;

    this.arrSubs.push(
      this.loadingOverlayService.getLoading.subscribe({
        next: (res: boolean[]) => {
          this.loading = res;
        },
        error: (err: any) => {
          // console.log('loading error', err);

        }
      })
    );

  }

  ngOnDestroy(): void {
    this.arrSubs.forEach((s:Subscription) => s.unsubscribe());
  }

  checkLoading(): any {
    setTimeout(() => {
      return this.loading.some((b:boolean) => b === true);
    }, 0);
  }

}
