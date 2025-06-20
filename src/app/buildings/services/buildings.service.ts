import {
  computed,
  effect,
  EffectRef,
  inject,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { TagsService } from '../../tags/services/tags.service';
import { DataService } from '../../core/services/data.service';
import { Building } from '../model/building.interface';
import { StorageService } from '../../core/services/storage.service';

interface BuildingFilterData {
  buildingType: string | null;
  tags: string[];
}

type BuildingFilterStorageData = Omit<BuildingFilterData, 'tags'>;

type BuildingFilterFunction = (
  buildings: Building[],
  data: BuildingFilterData
) => Building[];

@Injectable({ providedIn: 'root' })
export class BuildingsService {
  private dataService = inject(DataService);
  private tagsService = inject(TagsService);
  private storageService = inject(StorageService);
  private filtersKey = 'buildingFilters';

  private selectedTags: Signal<string[]> = this.tagsService.getSelectedTags();
  private buildingType: WritableSignal<string | null> = signal<string | null>(
    null
  );
  private buildings: WritableSignal<Building[]> = signal<Building[]>([]);
  private buildingTypes: Signal<string[]> = computed(() =>
    this.extractTypes(this.buildings())
  );

  private filteredBuildings: Signal<Building[]> = computed(() => {
    const buildings = this.buildings();
    const buildingType = this.buildingType();
    const tags = this.selectedTags();
    return this.filterBuildings(buildings, { buildingType, tags });
  });

  private saveFilters: EffectRef = effect(() => {
    this.storageService.setItem<BuildingFilterStorageData>(this.filtersKey, {
      buildingType: this.buildingType(),
    });
  });

  constructor() {
    this.restoreFilters();
  }

  private restoreFilters(): void {
    const filters = this.storageService.getItem<BuildingFilterStorageData>(
      this.filtersKey
    );
    if (filters) {
      this.buildingType.set(filters.buildingType);
    }
  }

  private filterBuildings(
    buildings: Building[],
    data: BuildingFilterData
  ): Building[] {
    return [this.filterByTags, this.filterByType].reduce(
      (filteredBuildings, filter) => filter(filteredBuildings, data),
      buildings
    );
  }

  private extractTypes(buildings: Building[]) {
    return Array.from(
      new Set(buildings.map((building) => building.buildingType))
    );
  }

  private filterByType: BuildingFilterFunction = (
    buildings,
    { buildingType }
  ) => {
    if (!buildingType) {
      return buildings;
    }
    return buildings.filter(
      (building) => building.buildingType === buildingType
    );
  };

  private filterByTags: BuildingFilterFunction = (buildings, { tags }) => {
    if (tags.length === 0) {
      return buildings;
    }
    return buildings.filter((building) => {
      return tags.every((tag) => building.tags.includes(tag));
    });
  };

  public setBuildings(buildings: Building[]): void {
    this.buildings.set(buildings);
  }

  public getBuildingTypes(): Signal<string[]> {
    return computed(() => this.buildingTypes());
  }

  public getBuildingType(): WritableSignal<string | null> {
    return this.buildingType;
  }

  public getFilteredBuildings(): Signal<Building[]> {
    return this.filteredBuildings;
  }

  public getTotalRecords(): Signal<number> {
    return computed(() => this.buildings().length);
  }

  public loadBuildings(): void {
    this.dataService
      .getBuildings()
      .subscribe((buildings) => this.setBuildings(buildings));
  }
}
