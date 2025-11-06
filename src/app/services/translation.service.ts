import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Translations {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = 'en';
  private translations: { [lang: string]: Translations } = {};
  private langChangeSubject = new BehaviorSubject<string>(this.currentLang);
  private translationsLoaded = false;
  
  public onLangChange = this.langChangeSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initTranslations();
  }

  private async initTranslations() {
    // Load all translations synchronously at startup
    try {
      const [enData, frData, esData] = await Promise.all([
        fetch('assets/i18n/en.json').then(r => r.json()),
        fetch('assets/i18n/fr.json').then(r => r.json()),
        fetch('assets/i18n/es.json').then(r => r.json())
      ]);
      
      this.translations['en'] = enData;
      this.translations['fr'] = frData;
      this.translations['es'] = esData;
      this.translationsLoaded = true;
      
      // Trigger a refresh after translations are loaded
      this.langChangeSubject.next(this.currentLang);
    } catch (error) {
      console.error('Error loading translations:', error);
      this.translationsLoaded = true;
    }
  }

  setDefaultLang(lang: string): void {
    this.currentLang = lang;
  }

  use(lang: string): void {
    this.currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    this.langChangeSubject.next(lang);
  }

  get(key: string, lang?: string): string {
    if (!this.translationsLoaded) {
      return key;
    }
    
    const language = lang || this.currentLang;
    const keys = key.split('.');
    let value: any = this.translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  }

  getCurrentLang(): string {
    return this.currentLang;
  }

  getBrowserLang(): string | undefined {
    if (typeof window !== 'undefined' && window.navigator) {
      return window.navigator.language.substring(0, 2);
    }
    return undefined;
  }
}