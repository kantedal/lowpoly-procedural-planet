import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {RenderService} from "../renderer/render.service";
import {MaterialModule} from "@angular/material";
import 'hammerjs';
import {SettingsService} from "../renderer/settings.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule
  ],
  providers: [
    RenderService,
    SettingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
