import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  features = [
    {
      titleKey: 'HOME.FEATURE_QUALITY',
      descKey: 'HOME.FEATURE_QUALITY_DESC',
      icon: '✓'
    },
    {
      titleKey: 'HOME.FEATURE_SHIPPING',
      descKey: 'HOME.FEATURE_SHIPPING_DESC',
      icon: '🚚'
    },
    {
      titleKey: 'HOME.FEATURE_SECURE',
      descKey: 'HOME.FEATURE_SECURE_DESC',
      icon: '🔒'
    },
    {
      titleKey: 'HOME.FEATURE_SUPPORT',
      descKey: 'HOME.FEATURE_SUPPORT_DESC',
      icon: '💬'
    }
  ];
}
