import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-compliance-audits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="section-title mb-0">Audit Records</h2>
        <button class="btn-accent" (click)="showModal=true;resetForm()">+ Add Audit</button>
      </div>
      <div class="table-wrapper">
        <table class="table table-hover mb-0">
          <thead><tr><th>ID</th><th>Officer ID</th><th>Scope</th><th>Findings</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let a of audits">
              <td>{{ a.auditId }}</td><td>{{ a.officerId }}</td><td>{{ a.scope }}</td>
              <td>{{ a.findings }}</td><td>{{ a.date }}</td>
              <td><span class="badge" [ngClass]="a.status==='COMPLETED'?'bg-success':'bg-warning text-dark'">{{ a.status }}</span></td>
              <td><button class="btn btn-sm btn-outline-primary" (click)="edit(a)">Edit</button></td>
            </tr>
            <tr *ngIf="audits.length===0"><td colspan="7" class="text-center text-muted py-4">No audits found</td></tr>
          </tbody>
        </table>
      </div>

      <div class="modal d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">{{ editId ? 'Edit Audit' : 'Add Audit' }}</h5>
              <button class="btn-close" (click)="showModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3"><label>Officer ID</label><input type="number" class="form-control mt-1" [(ngModel)]="form.officerId"></div>
              <div class="mb-3"><label>Scope</label><input class="form-control mt-1" [(ngModel)]="form.scope"></div>
              <div class="mb-3"><label>Findings</label><textarea class="form-control mt-1" [(ngModel)]="form.findings" rows="3"></textarea></div>
              <div class="mb-3"><label>Date</label><input type="date" class="form-control mt-1" [(ngModel)]="form.date"></div>
              <div class="mb-3">
                <label>Status</label>
                <select class="form-select mt-1" [(ngModel)]="form.status">
                  <option value="PENDING">PENDING</option><option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
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
export class ComplianceAuditsComponent implements OnInit {
  audits: any[] = [];
  showModal = false;
  editId: number | null = null;
  form: any = {};

  constructor(private api: ApiService, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.api.getAudits().subscribe(a => { this.audits = a; this.cdr.detectChanges(); }); }

  resetForm(): void { this.editId = null; this.form = { officerId: '', scope: '', findings: '', date: '', status: 'PENDING' }; }

  edit(a: any): void {
    this.editId = a.auditId;
    this.form = { officerId: a.officerId, scope: a.scope, findings: a.findings, date: a.date, status: a.status };
    this.showModal = true;
  }

  save(): void {
    const obs = this.editId ? this.api.updateAudit(this.editId, this.form) : this.api.createAudit(this.form);
    obs.subscribe({
      next: () => { this.toast.show('Audit saved', 'success'); this.showModal = false; this.api.getAudits().subscribe(a => { this.audits = a; this.cdr.detectChanges(); }); },
      error: () => this.toast.show('Failed', 'error')
    });
  }
}
