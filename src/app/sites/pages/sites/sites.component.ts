import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { SitesService } from '../../services/sites.service';
import { SlicePipe } from '@angular/common';
import { LazyLoadTriggerComponent } from '../../../ui/components/lazy-load-trigger/lazy-load-trigger.component';
import { SitesSkeletonComponent } from '../../components/sites-skeleton/sites-skeleton.component';

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
  public siteType: WritableSignal<string | null> =
    this.sitesService.getSiteType();
  public filteredSites = this.sitesService.getFilteredSites();
  public totalRecords: Signal<number> = this.sitesService.getTotalRecords();
  public totalFiltered: Signal<number> = computed(
    () => this.filteredSites().length
  );
  public currentLimit: WritableSignal<number> = linkedSignal({
    source: this.filteredSites,
    computation: () => LIMIT_STEP,
  });

  public ngOnInit(): void {
    this.sitesService.loadSites();
  }

  public increaseLimit(): void {
    this.currentLimit.update((limit) => limit + LIMIT_STEP);
  }
}
