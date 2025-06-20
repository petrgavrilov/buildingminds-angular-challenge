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
import { BuildingsSkeletonComponent } from '@app/buildings/components/buildings-skeleton/buildings-skeleton.component';
import { Building } from '@app/buildings/model/building.interface';
import { BuildingsService } from '@app/buildings/services/buildings.service';
import { LazyLoadTriggerComponent } from '@app/ui/components/lazy-load-trigger/lazy-load-trigger.component';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

const LIMIT_STEP = 50;

@Component({
  selector: 'app-buildings',
  templateUrl: 'buildings.component.html',
  imports: [
    FormsModule,
    TableModule,
    TagModule,
    SelectModule,
    SlicePipe,
    LazyLoadTriggerComponent,
    BuildingsSkeletonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingsComponent {
  private readonly buildingsService = inject(BuildingsService);

  public buildingTypes: Signal<string[]> = this.buildingsService.getBuildingTypes();
  public buildingType: WritableSignal<string | null> = this.buildingsService.getBuildingType();
  public filteredBuildings: Signal<Building[]> = this.buildingsService.getFilteredBuildings();
  public totalRecords: Signal<number> = this.buildingsService.getTotalRecords();
  public totalFiltered: Signal<number> = computed(() => this.filteredBuildings().length);
  public currentLimit: WritableSignal<number> = linkedSignal({
    source: this.filteredBuildings,
    computation: () => LIMIT_STEP,
  });

  constructor() {
    if (this.totalRecords() === 0) {
      this.buildingsService.loadBuildings().pipe(takeUntilDestroyed()).subscribe();
    }
  }

  public increaseLimit(): void {
    this.currentLimit.update((limit) => limit + LIMIT_STEP);
  }
}
