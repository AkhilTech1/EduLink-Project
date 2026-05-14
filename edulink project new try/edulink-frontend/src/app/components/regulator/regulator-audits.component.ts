import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-regulator-audits',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2 class="section-title">Audit Logs & Accreditation Monitoring</h2>

      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a class="nav-link" [class.active]="tab==='audits'" href="javascript:void(0)" (click)="tab='audits'">Compliance Audits</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" [class.active]="tab==='logs'" href="javascript:void(0)" (click)="tab='logs'">System Audit Logs</a>
        </li>
      </ul>

      <div *ngIf="tab==='audits'" class="table-wrapper">
        <table class="table table-hover mb-0">
          <thead><tr><th>ID</th><th>Officer ID</th><th>Scope</th><th>Findings</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            <tr *ngFor="let a of audits">
              <td>{{ a.auditId }}</td><td>{{ a.officerId }}</td><td>{{ a.scope }}</td>
              <td>{{ a.findings }}</td><td>{{ a.date }}</td>
              <td><span class="badge" [ngClass]="a.status==='COMPLETED'?'bg-success':'bg-warning text-dark'">{{ a.status }}</span></td>
            </tr>
            <tr *ngIf="audits.length===0"><td colspan="6" class="text-center text-muted py-4">No audits found</td></tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="tab==='logs'" class="table-wrapper">
        <table class="table table-hover mb-0">
          <thead><tr><th>User ID</th><th>Action</th><th>Resource</th><th>Timestamp</th></tr></thead>
          <tbody>
            <tr *ngFor="let l of logs">
              <td>{{ l.userId }}</td>
              <td><span class="badge bg-primary">{{ l.action }}</span></td>
              <td>{{ l.resource }}</td>
              <td>{{ l.timestamp }}</td>
            </tr>
            <tr *ngIf="logs.length===0"><td colspan="4" class="text-center text-muted py-4">No logs found</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class RegulatorAuditsComponent implements OnInit {
  tab = 'audits';
  audits: any[] = [];
  logs: any[] = [];

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.api.getAudits().subscribe(a => this.audits = a);
    this.auth.getAuditLogs().subscribe(l => this.logs = l);
  }
}
