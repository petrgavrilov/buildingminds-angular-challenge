import { computed, effect, EffectRef, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { DataService } from '@app/core/services/data.service';
import { StorageService } from '@app/core/services/storage.service';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private dataService = inject(DataService);
  private storageService = inject(StorageService);
  private selectedTagsKey = 'selectedTags';

  private tags = signal<string[]>([]);
  private selectedTags: WritableSignal<string[]> = signal<string[]>(this.restoreSelectedTags());
  private tagsList: Signal<string[]> = computed(() => [...this.tags()].sort((prev, next) => prev.localeCompare(next)));
  private saveSelectedTags: EffectRef = effect(() => {
    this.storageService.setItem<string[]>(this.selectedTagsKey, this.selectedTags());
  });

  public getSelectedTags(): Signal<string[]> {
    return computed(() => this.selectedTags());
  }

  public getSelectedTagsSet(): Signal<Set<string>> {
    return computed(() => new Set(this.selectedTags()));
  }

  public onTagSelected(tag: string): void {
    const currentTags = this.selectedTags();
    if (currentTags.includes(tag)) {
      this.selectedTags.set(currentTags.filter((t) => t !== tag));
    } else {
      this.selectedTags.set([...currentTags, tag]);
    }
  }

  public loadTags(): Observable<string[]> {
    return this.dataService.getTags().pipe(
      tap((tags: string[]) => {
        this.tags.set(tags);
      })
    );
  }

  public getTagsList(): Signal<string[]> {
    return this.tagsList;
  }

  private restoreSelectedTags(): string[] {
    return this.storageService.getItem<string[], string[]>(this.selectedTagsKey, []);
  }
}
