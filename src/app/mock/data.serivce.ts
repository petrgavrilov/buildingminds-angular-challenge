import { Injectable } from '@angular/core';
import { DataService } from '../core/services/data.service';
import { defer, delay, map, Observable, of } from 'rxjs';
import { Site } from '../sites/model/site.interface';
import { Building } from '../buildings/model/building.interface';

@Injectable()
export class MockDataService extends DataService {
  override getBuildings(): Observable<Building[]> {
    return defer(() => import('../../../mock/data/buildings.json')).pipe(
      map((module) => module.default as Building[]),
      delay(this.generateRandomDelay())
    );
  }

  override getSites(): Observable<Site[]> {
    return defer(() => import('../../../mock/data/sites.json')).pipe(
      map((module) => module.default as Site[]),
      delay(this.generateRandomDelay())
    );
  }

  override getTags(): Observable<string[]> {
    return defer(() => import('../../../mock/data/tags.json')).pipe(
      map((module) => module.default as string[]),
      delay(this.generateRandomDelay())
    );
  }

  private generateRandomDelay(): number {
    return Math.floor(Math.random() * 500) + 500;
  }
}
