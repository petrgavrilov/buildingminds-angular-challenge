import { computed, effect, EffectRef, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { DataService } from '@app/core/services/data.service';
import { StorageService } from '@app/core/services/storage.service';
import { Site } from '@app/sites/model/site.interface';
import { TagsService } from '@app/tags/services/tags.service';
import { Observable, tap } from 'rxjs';

interface SiteFilterData {
  siteType: string | null;
  tags: string[];
}

type SitesFilterStorageData = Omit<SiteFilterData, 'tags'>;

type SiteFilterFunction = (sites: Site[], data: SiteFilterData) => Site[];

@Injectable({ providedIn: 'root' })
export class SitesService {
  private dataService = inject(DataService);
  private tagsService = inject(TagsService);
  private storageService = inject(StorageService);
  private filtersKey = 'sitesFilters';

  private selectedTags: Signal<string[]> = this.tagsService.getSelectedTags();
  private siteType: WritableSignal<string | null> = signal<string | null>(null);
  private sites: WritableSignal<Site[]> = signal<Site[]>([]);
  private siteTypes: Signal<string[]> = computed(() => this.extractTypes(this.sites()));
  public filteredSites: Signal<Site[]> = computed(() => {
    const sites = this.sites();
    const siteType = this.siteType();
    const tags = this.selectedTags();
    return this.filterSites(sites, { siteType, tags });
  });

  private saveFilters: EffectRef = effect(() => {
    this.storageService.setItem<SitesFilterStorageData>(this.filtersKey, {
      siteType: this.siteType(),
    });
  });

  constructor() {
    this.restoreFilters();
  }

  private restoreFilters(): void {
    const filters = this.storageService.getItem<SitesFilterStorageData>(this.filtersKey);
    if (filters) {
      this.siteType.set(filters.siteType);
    }
  }

  private filterSites(sites: Site[], data: SiteFilterData): Site[] {
    const filterFns: SiteFilterFunction[] = [this.filterByTags, this.filterByType];
    return filterFns.reduce((filteredSites, filter) => filter(filteredSites, data), sites);
  }

  private extractTypes(sites: Site[]) {
    return Array.from(new Set(sites.map((site) => site.siteType)));
  }

  private filterByType: SiteFilterFunction = (sites, { siteType }) => {
    if (!siteType) {
      return sites;
    }
    return sites.filter((site) => site.siteType === siteType);
  };

  private filterByTags: SiteFilterFunction = (sites, { tags }) => {
    if (tags.length === 0) {
      return sites;
    }
    return sites.filter((site) => {
      return tags.every((tag) => site.tags.includes(tag));
    });
  };

  public setSites(sites: Site[]): void {
    this.sites.set(sites);
  }

  public getSiteTypes(): Signal<string[]> {
    return computed(() => this.siteTypes());
  }

  public getSiteType(): WritableSignal<string | null> {
    return this.siteType;
  }

  public getFilteredSites(): Signal<Site[]> {
    return this.filteredSites;
  }

  public getTotalRecords(): Signal<number> {
    return computed(() => this.sites().length);
  }

  public loadSites(): Observable<Site[]> {
    return this.dataService.getSites().pipe(tap((sites) => this.setSites(sites)));
  }
}
