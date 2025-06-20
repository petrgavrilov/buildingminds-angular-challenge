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
import { Site } from '../model/site.interface';
import { TagsService } from '../../tags/services/tags.service';
import { DataService } from '../../core/services/data.service';
import { StorageService } from '../../core/services/storage.service';

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
  private siteTypes: Signal<string[]> = computed(() =>
    this.extractTypes(this.sites())
  );

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
    const filters = this.storageService.getItem<SitesFilterStorageData>(
      this.filtersKey
    );
    if (filters) {
      this.siteType.set(filters.siteType);
    }
  }

  private filterSites(sites: Site[], data: SiteFilterData): Site[] {
    return [this.filterByTags, this.filterByType].reduce(
      (filteredSites, filter) => filter(filteredSites, data),
      sites
    );
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

  public loadSites(): void {
    this.dataService.getSites().subscribe((sites) => this.setSites(sites));
  }
}
