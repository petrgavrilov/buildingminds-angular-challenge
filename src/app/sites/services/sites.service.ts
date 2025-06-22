import { computed, effect, inject, Injectable, Signal } from '@angular/core';
import { DataService } from '@app/core/services/data.service';
import { EntitiesService, EntityFilterFunction } from '@app/core/services/entities.service';
import { Site } from '@app/sites/model/site.interface';
import { TagsService } from '@app/tags/services/tags.service';
import { Observable, tap } from 'rxjs';

interface SitesFilters {
  siteType: string | null;
}

interface SitesExternalFilters {
  tags: string[];
}

type SiteFilterFunction = EntityFilterFunction<Site, SitesFilters, SitesExternalFilters>;

@Injectable({ providedIn: 'root' })
export class SitesService extends EntitiesService<Site, SitesFilters, SitesExternalFilters> {
  private dataService = inject(DataService);
  private tagsService = inject(TagsService);

  private selectedTags: Signal<string[]> = this.tagsService.getSelectedTags();
  private sitesTypes: Signal<string[]> = computed(() => this.extractTypes(this.entities()));

  private filterByType: SiteFilterFunction = (sites, { siteType }) => {
    if (!siteType) {
      return sites;
    }
    return sites.filter((site) => site.siteType === siteType);
  };

  private filterByTags: SiteFilterFunction = (sites, _, { tags }) => {
    if (tags.length === 0) {
      return sites;
    }
    return sites.filter((site) => {
      return tags.every((tag) => site.tags.includes(tag));
    });
  };

  protected filterFunctions: SiteFilterFunction[] = [this.filterByTags, this.filterByType];

  constructor() {
    super({
      filtersStorageKey: 'sitesFilters',
    });

    effect(() => {
      const tags = this.selectedTags();
      this.setExternalFilters({ tags });
    });
  }

  private extractTypes(sites: Site[]) {
    return Array.from(new Set(sites.map((site) => site.siteType)));
  }

  public loadEntities(): Observable<Site[]> {
    return this.dataService.getSites().pipe(tap((sites) => this.setEntities(sites)));
  }

  public getSitesTypes(): Signal<string[]> {
    return computed(() => this.sitesTypes());
  }
}
