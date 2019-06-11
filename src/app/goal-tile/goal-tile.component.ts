import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-goal-tile',
  templateUrl: './goal-tile.component.html',
  styleUrls: ['./goal-tile.component.scss']
})
export class GoalTileComponent implements OnInit {

  @Input() number;

  constructor() { }

  ngOnInit() {
  }

}
