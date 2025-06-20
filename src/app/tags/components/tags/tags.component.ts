import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { TagModule } from 'primeng/tag';
import { TagsService } from '../../services/tags.service';
import { TagsSkeletonComponent } from '../tags-skeleton/tags-skeleton.component';

@Component({
  selector: 'app-tags',
  templateUrl: 'tags.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagModule, TagsSkeletonComponent],
})
export class TagsComponent implements OnInit {
  private readonly tagsService = inject(TagsService);

  public tags: Signal<string[]> = this.tagsService.getTagsList();
  public selectedTags: Signal<Set<string>> =
    this.tagsService.getSelectedTagsSet();

  ngOnInit(): void {
    this.tagsService.loadTags();
  }

  onTagSelected(tag: string): void {
    this.tagsService.onTagSelected(tag);
  }
}
