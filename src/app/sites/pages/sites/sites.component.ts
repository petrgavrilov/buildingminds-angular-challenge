import { SlicePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SitesSkeletonComponent } from '@app/sites/components/sites-skeleton/sites-skeleton.component';
import { SitesService } from '@app/sites/services/sites.service';
import { LazyLoadTriggerComponent } from '@app/ui/components/lazy-load-trigger/lazy-load-trigger.component';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

const LIMIT_STEP = 50;

@Component({
  selector: 'app-sites',
  templateUrl: 'sites.component.html',
  imports: [
    FormsModule,
    TableModule,
    TagModule,
    SelectModule,
    SlicePipe,
    LazyLoadTriggerComponent,
    SitesSkeletonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SitesComponent {
  private sitesService = inject(SitesService);

  public siteTypes: Signal<string[]> = this.sitesService.getSiteTypes();
  public siteType: WritableSignal<string | null> = this.sitesService.getSiteType();
  public filteredSites = this.sitesService.getFilteredSites();
  public totalRecords: Signal<number> = this.sitesService.getTotalRecords();
  public totalFiltered: Signal<number> = computed(() => this.filteredSites().length);
  public currentLimit: WritableSignal<number> = linkedSignal({
    source: this.filteredSites,
    computation: () => LIMIT_STEP,
  });

  constructor() {
    if (this.totalRecords() === 0) {
      this.sitesService.loadSites().pipe(takeUntilDestroyed()).subscribe();
    }
  }

  public increaseLimit(): void {
    this.currentLimit.update((limit) => limit + LIMIT_STEP);
  }
}
