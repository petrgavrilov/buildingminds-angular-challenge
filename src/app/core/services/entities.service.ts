import { computed, effect, EffectRef, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { StorageService } from '@app/core/services/storage.service';
import { Observable } from 'rxjs';

export type EntityFilterFunction<EntityType, EntityFilters extends object, ExternalFilters extends object> = (
  entities: EntityType[],
  entityFilters: EntityFilters,
  externalFilters: ExternalFilters
) => EntityType[];

export interface EntitiesServiceConfig {
  filtersStorageKey: string;
}

@Injectable()
export abstract class EntitiesService<EntityType, EntityFilters extends object, ExternalFilters extends object> {
  protected storageService = inject(StorageService);

  public entities: WritableSignal<EntityType[]> = signal<EntityType[]>([]);
  public entityFilters: WritableSignal<EntityFilters> = signal<EntityFilters>({} as EntityFilters);
  public externalFilters: WritableSignal<ExternalFilters> = signal<ExternalFilters>({} as ExternalFilters);

  public total: Signal<number> = computed(() => this.entities().length);
  public filteredEntities: Signal<EntityType[]> = computed(() => {
    const entities = this.entities();
    const entityFilters = this.entityFilters();
    const externalFilters = this.externalFilters();
    return this.filterEntities(entities, entityFilters, externalFilters);
  });
  public totalFiltered: Signal<number> = computed(() => this.filteredEntities().length);

  private filtersStorageKey: string;
  protected abstract filterFunctions: EntityFilterFunction<EntityType, EntityFilters, ExternalFilters>[];

  constructor({ filtersStorageKey }: EntitiesServiceConfig) {
    this.filtersStorageKey = filtersStorageKey;
    this.restoreFilters();
  }

  protected saveFilters: EffectRef = effect(() => {
    this.persistFilters(this.entityFilters());
  });

  protected persistFilters(entityFilters: EntityFilters): void {
    this.storageService.setItem<EntityFilters>(this.filtersStorageKey, entityFilters);
  }

  protected restoreFilters(): void {
    const filters: EntityFilters | null = this.storageService.getItem<EntityFilters>(this.filtersStorageKey);
    if (filters) {
      this.entityFilters.set(filters);
    }
  }

  protected filterEntities(
    entities: EntityType[],
    entityFilters: EntityFilters,
    externalFilters: ExternalFilters
  ): EntityType[] {
    return this.filterFunctions.reduce(
      (filteredEntities, filter) => filter(filteredEntities, entityFilters, externalFilters),
      entities
    );
  }

  public setEntities(entities: EntityType[]): void {
    this.entities.set(entities);
  }

  public getEntityFilters(): Signal<EntityFilters> {
    return this.entityFilters.asReadonly();
  }

  public getEntities(): Signal<EntityType[]> {
    return this.entities.asReadonly();
  }

  public getTotal(): Signal<number> {
    return this.total;
  }

  public setEntityFilters(filters: Partial<EntityFilters>): void {
    this.entityFilters.update((entityFilters) => ({ ...entityFilters, ...filters }));
  }

  public setExternalFilters(filters: Partial<ExternalFilters>): void {
    this.externalFilters.update((externalFilters) => ({ ...externalFilters, ...filters }));
  }

  public getFilteredEntities(): Signal<EntityType[]> {
    return this.filteredEntities;
  }

  public getTotalFiltered(): Signal<number> {
    return this.totalFiltered;
  }

  public abstract loadEntities(): Observable<EntityType[]>;
}
