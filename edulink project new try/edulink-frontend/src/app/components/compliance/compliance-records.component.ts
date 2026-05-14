import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-compliance-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title mb-0">Compliance Records</h2>
        <button class="btn-accent" (click)="showModal=true;resetForm()">+ Add Record</button>
      </div>
      <div class="table-wrapper">
        <table class="table table-hover mb-0">
          <thead><tr><th>ID</th><th>Entity ID</th><th>Type</th><th>Result</th><th>Date</th><th>Notes</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of records">
              <td>{{ r.complianceId }}</td><td>{{ r.entityId }}</td>
              <td><span class="badge bg-info text-dark">{{ r.type }}</span></td>
              <td>{{ r.result }}</td><td>{{ r.date }}</td><td>{{ r.notes }}</td>
              <td><button class="btn btn-sm btn-outline-primary" (click)="edit(r)">Edit</button></td>
            </tr>
            <tr *ngIf="records.length===0"><td colspan="7" class="text-center text-muted py-4">No records found</td></tr>
          </tbody>
        </table>
      </div>

      <div class="modal d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">{{ editId ? 'Edit Record' : 'Add Compliance Record' }}</h5>
              <button class="btn-close" (click)="showModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3"><label>Entity ID</label><input type="number" class="form-control mt-1" [(ngModel)]="form.entityId"></div>
              <div class="mb-3">
                <label>Type</label>
                <select class="form-select mt-1" [(ngModel)]="form.type">
                  <option value="ACCREDITATION">ACCREDITATION</option><option value="SAFETY">SAFETY</option><option value="FINANCIAL">FINANCIAL</option>
                </select>
              </div>
              <div class="mb-3"><label>Result</label><input class="form-control mt-1" [(ngModel)]="form.result"></div>
              <div class="mb-3"><label>Date</label><input type="date" class="form-control mt-1" [(ngModel)]="form.date"></div>
              <div class="mb-3"><label>Notes</label><textarea class="form-control mt-1" [(ngModel)]="form.notes" rows="3"></textarea></div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showModal=false">Cancel</button>
              <button class="btn-accent" (click)="save()">{{ editId ? 'Update' : 'Create' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ComplianceRecordsComponent implements OnInit {
  records: any[] = [];
  showModal = false;
  editId: number | null = null;
  form: any = {};

  constructor(private api: ApiService, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.api.getCompliance().subscribe(r => { this.records = r; this.cdr.detectChanges(); }); }

  resetForm(): void { this.editId = null; this.form = { entityId: '', type: 'ACCREDITATION', result: '', date: '', notes: '' }; }

  edit(r: any): void {
    this.editId = r.complianceId;
    this.form = { entityId: r.entityId, type: r.type, result: r.result, date: r.date, notes: r.notes };
    this.showModal = true;
  }

  save(): void {
    const obs = this.editId ? this.api.updateCompliance(this.editId, this.form) : this.api.createCompliance(this.form);
    obs.subscribe({
      next: () => { this.toast.show('Record saved', 'success'); this.showModal = false; this.api.getCompliance().subscribe(r => { this.records = r; this.cdr.detectChanges(); }); },
      error: () => this.toast.show('Failed', 'error')
    });
  }
}
