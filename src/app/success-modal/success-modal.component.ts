// success-modal.component.ts
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html'
})
export class SuccessModalComponent {
  constructor(private dialogRef: MatDialogRef<SuccessModalComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
