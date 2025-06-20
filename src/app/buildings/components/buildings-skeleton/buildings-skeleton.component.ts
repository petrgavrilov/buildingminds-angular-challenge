import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-buildings-skeleton',
  templateUrl: 'buildings-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonModule, TableModule],
})
export class BuildingsSkeletonComponent {}
