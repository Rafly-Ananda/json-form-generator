import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Output() clickAction = new EventEmitter();
  @Input() buttonTitle!: string;
  @Input() disabled!: boolean;

  constructor() {}

  ngOnInit(): void {}

  onClick(): void {
    this.clickAction.emit();
  }
}
