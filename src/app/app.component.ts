import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TagsComponent } from '@app/tags/components/tags/tags.component';
import { LayoutComponent } from '@app/ui/components/layout/layout.component';
import { NavComponent } from '@app/ui/components/nav/nav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, LayoutComponent, NavComponent, TagsComponent],
})
export class AppComponent {}
