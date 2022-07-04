import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.css'],
})
export class MainToolbarComponent implements OnInit {
  constructor() {}

  @Output() openMenu = new EventEmitter<any>();

  ngOnInit(): void {}

  openMain() {
    this.openMenu.emit();
  }
}
