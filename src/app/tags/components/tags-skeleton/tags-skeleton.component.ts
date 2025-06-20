import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-tags-skeleton',
  templateUrl: 'tags-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonModule],
})
export class TagsSkeletonComponent {}
