import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Building } from '@app/buildings/model/building.interface';
import { Site } from '@app/sites/model/site.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  private http: HttpClient = inject(HttpClient);

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
