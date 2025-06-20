import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-nav',
  templateUrl: 'nav.component.html',
  styleUrls: ['nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenubarModule],
})
export class NavComponent {
  public items: MenuItem[] = [
    {
      label: 'Buildings',
      icon: 'pi pi-home',
      routerLink: 'buildings',
    },
    {
      label: 'Sites',
      icon: 'pi pi-map-marker',
      routerLink: 'sites',
    },
  ];
}
