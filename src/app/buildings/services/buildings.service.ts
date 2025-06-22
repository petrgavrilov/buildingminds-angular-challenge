import { computed, effect, inject, Injectable, Signal } from '@angular/core';
import { Building } from '@app/buildings/model/building.interface';
import { DataService } from '@app/core/services/data.service';
import { EntitiesService, EntityFilterFunction } from '@app/core/services/entities.service';
import { TagsService } from '@app/tags/services/tags.service';
import { Observable, tap } from 'rxjs';

interface BuildingFilters {
  buildingType: string | null;
}

interface BuildingExternalFilters {
  tags: string[];
}

type BuildingFilterFunction = EntityFilterFunction<Building, BuildingFilters, BuildingExternalFilters>;

@Injectable({ providedIn: 'root' })
export class BuildingsService extends EntitiesService<Building, BuildingFilters, BuildingExternalFilters> {
  private dataService = inject(DataService);
  private tagsService = inject(TagsService);

  private selectedTags: Signal<string[]> = this.tagsService.getSelectedTags();
  private buildingTypes: Signal<string[]> = computed(() => this.extractTypes(this.entities()));

  private filterByType: BuildingFilterFunction = (buildings, { buildingType }) => {
    if (!buildingType) {
      return buildings;
    }
    return buildings.filter((building) => building.buildingType === buildingType);
  };

  private filterByTags: BuildingFilterFunction = (buildings, _, { tags }) => {
    if (tags.length === 0) {
      return buildings;
    }
    return buildings.filter((building) => {
      return tags.every((tag) => building.tags.includes(tag));
    });
  };

  protected filterFunctions: BuildingFilterFunction[] = [this.filterByTags, this.filterByType];

  constructor() {
    super({
      filtersStorageKey: 'buildingsFilters',
    });

    effect(() => {
      const tags = this.selectedTags();
      this.setExternalFilters({ tags });
    });
  }

  private extractTypes(buildings: Building[]) {
    return Array.from(new Set(buildings.map((building) => building.buildingType)));
  }

  public loadEntities(): Observable<Building[]> {
    return this.dataService.getBuildings().pipe(tap((buildings) => this.setEntities(buildings)));
  }

  public getBuildingTypes(): Signal<string[]> {
    return computed(() => this.buildingTypes());
  }
}
