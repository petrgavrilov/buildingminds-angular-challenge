import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  OnInit,
  Signal,
  WritableSignal,
} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { BuildingsService } from '../../services/buildings.service';
import { Building } from '../../model/building.interface';
import { LazyLoadTriggerComponent } from '../../../ui/components/lazy-load-trigger/lazy-load-trigger.component';
import { BuildingsSkeletonComponent } from '../../components/buildings-skeleton/buildings-skeleton.component';

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
export class BuildingsComponent implements OnInit {
  private readonly buildingsService = inject(BuildingsService);

  public buildingTypes: Signal<string[]> =
    this.buildingsService.getBuildingTypes();
  public buildingType: WritableSignal<string | null> =
    this.buildingsService.getBuildingType();
  public filteredBuildings: Signal<Building[]> =
    this.buildingsService.getFilteredBuildings();
  public totalRecords: Signal<number> = this.buildingsService.getTotalRecords();
  public totalFiltered: Signal<number> = computed(
    () => this.filteredBuildings().length
  );
  public currentLimit: WritableSignal<number> = linkedSignal({
    source: this.filteredBuildings,
    computation: () => LIMIT_STEP,
  });

  public ngOnInit(): void {
    this.buildingsService.loadBuildings();
  }

  public increaseLimit(): void {
    this.currentLimit.update((limit) => limit + LIMIT_STEP);
  }
}
