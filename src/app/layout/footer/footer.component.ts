import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();

  socials = [
    { name: 'GitHub', url: 'https://github.com/shahid08569', icon: 'github' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/shahidhussain', icon: 'linkedin' },
    { name: 'Email', url: 'mailto:shahidhussaain08569@gmail.com', icon: 'email' },
  ];
}
