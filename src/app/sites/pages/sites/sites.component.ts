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
import { Site } from '@app/sites/model/site.interface';
import { SitesService } from '@app/sites/services/sites.service';
import { LazyLoadTriggerComponent } from '@app/ui/components/lazy-load-trigger/lazy-load-trigger.component';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
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

  public siteTypes: Signal<string[]> = this.sitesService.getSitesTypes();
  public siteType: Signal<string | null> = computed(() => this.sitesService.entityFilters()?.siteType || null);
  public filteredSites: Signal<Site[]> = this.sitesService.getFilteredEntities();
  public totalRecords: Signal<number> = this.sitesService.getTotal();
  public totalFiltered: Signal<number> = this.sitesService.getTotalFiltered();
  public currentLimit: WritableSignal<number> = linkedSignal({
    source: this.filteredSites,
    computation: () => LIMIT_STEP,
  });

  constructor() {
    if (this.totalRecords() === 0) {
      this.sitesService.loadEntities().pipe(takeUntilDestroyed()).subscribe();
    }
  }

  public increaseLimit(): void {
    this.currentLimit.update((limit) => limit + LIMIT_STEP);
  }

  public onSiteTypeChange(event: SelectChangeEvent): void {
    this.sitesService.setEntityFilters({ siteType: event.value });
  }
}
