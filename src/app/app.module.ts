import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PuzzleComponent } from './puzzle/puzzle.component';
import { TileComponent } from './tile/tile.component';

import { FormsModule } from '@angular/forms';
import { SolverService } from './services/solver.service'

import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputMaskModule } from 'primeng/inputmask';
import { SliderModule } from 'primeng/slider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { GoalTileComponent } from './goal-tile/goal-tile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [
    AppComponent,
    PuzzleComponent,
    TileComponent,
    GoalTileComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BlockUIModule,
    ProgressSpinnerModule,
    InputMaskModule,
    SliderModule,
    SelectButtonModule,
    ButtonModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatCardModule,
    MatToolbarModule
  ],
  providers: [SolverService],
  bootstrap: [AppComponent]
})
export class AppModule { }
