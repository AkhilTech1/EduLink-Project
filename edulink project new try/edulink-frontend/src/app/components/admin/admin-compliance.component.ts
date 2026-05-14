import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-compliance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a class="nav-link" [class.active]="tab==='records'" href="javascript:void(0)" (click)="tab='records'">Compliance Records</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" [class.active]="tab==='audits'" href="javascript:void(0)" (click)="tab='audits'">Audit Records</a>
        </li>
        <li class="nav-item" *ngIf="role==='ADMIN'">
          <a class="nav-link" [class.active]="tab==='logs'" href="javascript:void(0)" (click)="tab='logs';loadLogs()">Audit Logs</a>
        </li>
      </ul>

      <div *ngIf="tab==='records'">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="section-title mb-0">Compliance Records</h2>
          <button class="btn-accent" *ngIf="canEdit" (click)="showRecordModal=true;resetRecord()">+ Add Record</button>
        </div>
        <div class="table-wrapper">
          <table class="table table-hover mb-0">
            <thead><tr><th>ID</th><th>Entity ID</th><th>Type</th><th>Result</th><th>Date</th><th>Notes</th><th *ngIf="canEdit">Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let r of records">
                <td>{{ r.complianceId }}</td><td>{{ r.entityId }}</td>
                <td><span class="badge bg-info text-dark">{{ r.type }}</span></td>
                <td>{{ r.result }}</td><td>{{ r.date }}</td><td>{{ r.notes }}</td>
                <td *ngIf="canEdit">
                  <button class="btn btn-sm btn-outline-primary me-1" (click)="editRecord(r)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" *ngIf="role==='ADMIN'" (click)="deleteRecord(r.complianceId)">Delete</button>
                </td>
              </tr>
              <tr *ngIf="records.length===0"><td colspan="7" class="text-center text-muted py-4">No records found</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="tab==='audits'">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="section-title mb-0">Audit Records</h2>
          <button class="btn-accent" *ngIf="canEdit" (click)="showAuditModal=true;resetAudit()">+ Add Audit</button>
        </div>
        <div class="table-wrapper">
          <table class="table table-hover mb-0">
            <thead><tr><th>ID</th><th>Officer ID</th><th>Scope</th><th>Findings</th><th>Date</th><th>Status</th><th *ngIf="canEdit">Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let a of audits">
                <td>{{ a.auditId }}</td><td>{{ a.officerId }}</td><td>{{ a.scope }}</td>
                <td>{{ a.findings }}</td><td>{{ a.date }}</td>
                <td><span class="badge" [ngClass]="a.status==='COMPLETED'?'bg-success':'bg-warning text-dark'">{{ a.status }}</span></td>
                <td *ngIf="canEdit">
                  <button class="btn btn-sm btn-outline-primary" (click)="editAudit(a)">Edit</button>
                </td>
              </tr>
              <tr *ngIf="audits.length===0"><td colspan="7" class="text-center text-muted py-4">No audits found</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="tab==='logs'">
        <h2 class="section-title mb-4">System Audit Logs</h2>
        <div class="table-wrapper">
          <table class="table table-hover mb-0">
            <thead><tr><th>User ID</th><th>Action</th><th>Resource</th><th>Timestamp</th></tr></thead>
            <tbody>
              <tr *ngFor="let l of logs">
                <td>{{ l.userId }}</td><td><span class="badge bg-primary">{{ l.action }}</span></td>
                <td>{{ l.resource }}</td><td>{{ l.timestamp }}</td>
              </tr>
              <tr *ngIf="logs.length===0"><td colspan="4" class="text-center text-muted py-4">No logs found</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="modal d-block" *ngIf="showRecordModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">{{ recordEditId ? 'Edit Record' : 'Add Compliance Record' }}</h5>
              <button class="btn-close" (click)="showRecordModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3"><label>Entity ID</label><input type="number" class="form-control mt-1" [(ngModel)]="recordForm.entityId"></div>
              <div class="mb-3">
                <label>Type</label>
                <select class="form-select mt-1" [(ngModel)]="recordForm.type">
                  <option value="ACCREDITATION">ACCREDITATION</option><option value="SAFETY">SAFETY</option><option value="FINANCIAL">FINANCIAL</option>
                </select>
              </div>
              <div class="mb-3"><label>Result</label><input class="form-control mt-1" [(ngModel)]="recordForm.result"></div>
              <div class="mb-3"><label>Date</label><input type="date" class="form-control mt-1" [(ngModel)]="recordForm.date"></div>
              <div class="mb-3"><label>Notes</label><textarea class="form-control mt-1" [(ngModel)]="recordForm.notes" rows="3"></textarea></div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showRecordModal=false">Cancel</button>
              <button class="btn-accent" (click)="saveRecord()">{{ recordEditId ? 'Update' : 'Create' }}</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal d-block" *ngIf="showAuditModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">{{ auditEditId ? 'Edit Audit' : 'Add Audit' }}</h5>
              <button class="btn-close" (click)="showAuditModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3"><label>Officer ID</label><input type="number" class="form-control mt-1" [(ngModel)]="auditForm.officerId"></div>
              <div class="mb-3"><label>Scope</label><input class="form-control mt-1" [(ngModel)]="auditForm.scope"></div>
              <div class="mb-3"><label>Findings</label><textarea class="form-control mt-1" [(ngModel)]="auditForm.findings" rows="3"></textarea></div>
              <div class="mb-3"><label>Date</label><input type="date" class="form-control mt-1" [(ngModel)]="auditForm.date"></div>
              <div class="mb-3">
                <label>Status</label>
                <select class="form-select mt-1" [(ngModel)]="auditForm.status">
                  <option value="PENDING">PENDING</option><option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showAuditModal=false">Cancel</button>
              <button class="btn-accent" (click)="saveAudit()">{{ auditEditId ? 'Update' : 'Create' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminComplianceComponent implements OnInit {
  tab = 'records';
  records: any[] = [];
  audits: any[] = [];
  logs: any[] = [];
  showRecordModal = false;
  showAuditModal = false;
  recordEditId: number | null = null;
  auditEditId: number | null = null;
  recordForm: any = {};
  auditForm: any = {};
  canEdit = false;
  role = '';

  constructor(private api: ApiService, private toast: ToastService, private auth: AuthService) {}

  ngOnInit(): void {
    this.role = this.auth.getRole() || '';
    this.canEdit = ['ADMIN', 'COMPLIANCE'].includes(this.role);
    this.api.getCompliance().subscribe(r => this.records = r);
    this.api.getAudits().subscribe(a => this.audits = a);
  }

  loadLogs(): void { this.auth.getAuditLogs().subscribe(l => this.logs = l); }

  resetRecord(): void { this.recordEditId = null; this.recordForm = { entityId: '', type: 'ACCREDITATION', result: '', date: '', notes: '' }; }
  resetAudit(): void { this.auditEditId = null; this.auditForm = { officerId: '', scope: '', findings: '', date: '', status: 'PENDING' }; }

  editRecord(r: any): void { this.recordEditId = r.complianceId; this.recordForm = { entityId: r.entityId, type: r.type, result: r.result, date: r.date, notes: r.notes }; this.showRecordModal = true; }
  editAudit(a: any): void { this.auditEditId = a.auditId; this.auditForm = { officerId: a.officerId, scope: a.scope, findings: a.findings, date: a.date, status: a.status }; this.showAuditModal = true; }

  saveRecord(): void {
    const obs = this.recordEditId ? this.api.updateCompliance(this.recordEditId, this.recordForm) : this.api.createCompliance(this.recordForm);
    obs.subscribe({
      next: () => { this.toast.show('Compliance record saved', 'success'); this.showRecordModal = false; this.api.getCompliance().subscribe(r => this.records = r); },
      error: () => this.toast.show('Failed', 'error')
    });
  }

  saveAudit(): void {
    const obs = this.auditEditId ? this.api.updateAudit(this.auditEditId, this.auditForm) : this.api.createAudit(this.auditForm);
    obs.subscribe({
      next: () => { this.toast.show('Audit saved', 'success'); this.showAuditModal = false; this.api.getAudits().subscribe(a => this.audits = a); },
      error: () => this.toast.show('Failed', 'error')
    });
  }

  deleteRecord(id: number): void {
    this.api.deleteCompliance(id).subscribe({
      next: () => { this.toast.show('Record deleted', 'success'); this.api.getCompliance().subscribe(r => this.records = r); },
      error: () => this.toast.show('Failed', 'error')
    });
  }
}
