import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { mergeApplicationConfig } from '@angular/core';

const clientConfig = {
  providers: [
    provideClientHydration(withEventReplay())
  ]
};

const mergedConfig = mergeApplicationConfig(appConfig, clientConfig);

bootstrapApplication(AppComponent, mergedConfig)
  .catch((err) => console.error(err));
