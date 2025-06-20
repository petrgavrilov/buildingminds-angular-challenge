import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Building } from '../../buildings/model/building.interface';
import { Site } from '../../sites/model/site.interface';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http: HttpClient = inject(HttpClient);

  getBuildings(): Observable<Building[]> {
    return this.http.get<Building[]>('/api/buildings');
  }

  getSites(): Observable<Site[]> {
    return this.http.get<Site[]>('/api/sites');
  }

  getTags(): Observable<string[]> {
    return this.http.get<string[]>('/api/tags');
  }
}
