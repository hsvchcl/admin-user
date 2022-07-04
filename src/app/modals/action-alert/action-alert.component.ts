import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-action-alert',
  templateUrl: './action-alert.component.html',
  styleUrls: ['./action-alert.component.css'],
})
export class ActionAlertComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    console.log(this.data);
  }
}
