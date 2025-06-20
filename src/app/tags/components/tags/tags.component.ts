import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TagsSkeletonComponent } from '@app/tags/components/tags-skeleton/tags-skeleton.component';
import { TagsService } from '@app/tags/services/tags.service';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-tags',
  templateUrl: 'tags.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagModule, TagsSkeletonComponent],
})
export class TagsComponent {
  private readonly tagsService = inject(TagsService);

  public tags: Signal<string[]> = this.tagsService.getTagsList();
  public selectedTags: Signal<Set<string>> = this.tagsService.getSelectedTagsSet();

  constructor() {
    if (this.tags().length === 0) {
      this.tagsService.loadTags().pipe(takeUntilDestroyed()).subscribe();
    }
  }

  onTagSelected(tag: string): void {
    this.tagsService.onTagSelected(tag);
  }
}
