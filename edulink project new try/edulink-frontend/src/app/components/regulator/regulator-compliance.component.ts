import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-regulator-compliance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2 class="section-title">Compliance Reports Review</h2>
      <div class="row g-3 mb-4">
        <div class="col-md-4"><div class="stat-card text-center"><div class="text-muted small mb-1">Total Records</div><div class="fw-bold" style="font-size:2rem;color:var(--text-primary)">{{ records.length }}</div></div></div>
        <div class="col-md-4"><div class="stat-card text-center"><div class="text-muted small mb-1">Accreditation</div><div class="fw-bold" style="font-size:2rem;color:#10b981">{{ byType('ACCREDITATION') }}</div></div></div>
        <div class="col-md-4"><div class="stat-card text-center"><div class="text-muted small mb-1">Safety</div><div class="fw-bold" style="font-size:2rem;color:#f59e0b">{{ byType('SAFETY') }}</div></div></div>
      </div>
      <div class="table-wrapper">
        <table class="table table-hover mb-0">
          <thead><tr><th>ID</th><th>Entity ID</th><th>Type</th><th>Result</th><th>Date</th><th>Notes</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of records">
              <td>{{ r.complianceId }}</td><td>{{ r.entityId }}</td>
              <td><span class="badge bg-info text-dark">{{ r.type }}</span></td>
              <td>{{ r.result }}</td><td>{{ r.date }}</td><td>{{ r.notes }}</td>
            </tr>
            <tr *ngIf="records.length===0"><td colspan="6" class="text-center text-muted py-4">No records found</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class RegulatorComplianceComponent implements OnInit {
  records: any[] = [];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.api.getCompliance().subscribe(r => { this.records = r; this.cdr.detectChanges(); }); }

  byType(type: string): number { return this.records.filter(r => r.type === type).length; }
}
