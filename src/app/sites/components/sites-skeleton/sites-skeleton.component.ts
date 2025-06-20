import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-sites-skeleton',
  templateUrl: 'sites-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonModule, TableModule],
})
export class SitesSkeletonComponent {}
