import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="section-title mb-1">Staff Management</h2>
          <p class="text-muted small mb-0">Manage teachers, compliance officers, board officers and regulators</p>
        </div>
        <button class="btn-accent" (click)="showModal=true;resetForm()">+ Add Staff</button>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3" *ngFor="let r of roleSummary">
          <div class="stat-card text-center">
            <div class="stat-icon mx-auto mb-2" [style.background]="r.color+'22'" style="width:44px;height:44px;font-size:1.2rem">{{ r.icon }}</div>
            <div class="fw-bold" style="font-size:1.5rem;color:var(--text-primary)">{{ r.count }}</div>
            <div class="text-muted small">{{ r.label }}</div>
          </div>
        </div>
      </div>

      <div class="card p-3 mb-3">
        <div class="row g-2">
          <div class="col-md-6">
            <input class="form-control" [(ngModel)]="search" placeholder="🔍 Search by name or email..." (input)="applyFilter()">
          </div>
          <div class="col-md-3">
            <select class="form-select" [(ngModel)]="filterRole" (change)="applyFilter()">
              <option value="">All Roles</option>
              <option value="TEACHER">Teacher</option>
              <option value="COMPLIANCE">Compliance Officer</option>
              <option value="BOARD">Board Officer</option>
              <option value="REGULATOR">Regulator</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select" [(ngModel)]="filterStatus" (change)="applyFilter()">
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="table table-hover mb-0">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of filtered">
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                    style="width:34px;height:34px;min-width:34px;font-size:0.8rem" [style.background]="roleColor(u.role)">
                    {{ u.name?.substring(0,2).toUpperCase() }}
                  </div>
                  <span class="fw-semibold" style="color:var(--text-primary)">{{ u.name }}</span>
                </div>
              </td>
              <td>{{ u.email }}</td>
              <td>{{ u.phone }}</td>
              <td><span class="badge" [ngClass]="roleBadge(u.role)">{{ u.role }}</span></td>
              <td>
                <div class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" [checked]="u.status==='ACTIVE'" (change)="toggleStatus(u)">
                  <label class="form-check-label small" [style.color]="u.status==='ACTIVE'?'#10b981':'#adb5bd'">
                    {{ u.status }}
                  </label>
                </div>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-1" (click)="edit(u)">Edit</button>
                <button class="btn btn-sm btn-outline-danger" (click)="confirmDelete(u)">Delete</button>
              </td>
            </tr>
            <tr *ngIf="filtered.length===0">
              <td colspan="6" class="text-center text-muted py-4">No staff found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">{{ editId ? 'Edit Staff' : 'Add Staff Member' }}</h5>
              <button class="btn-close" (click)="showModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3"><label>Full Name</label><input class="form-control mt-1" [(ngModel)]="form.name" placeholder="Full name"></div>
              <div class="mb-3" *ngIf="!editId"><label>Email</label><input type="email" class="form-control mt-1" [(ngModel)]="form.email" placeholder="Email address"></div>
              <div class="mb-3"><label>Phone</label><input class="form-control mt-1" [(ngModel)]="form.phone" placeholder="Phone number"></div>
              <div class="mb-3" *ngIf="!editId">
                <label>Password</label>
                <div class="input-group mt-1">
                  <input class="form-control" [(ngModel)]="form.password" placeholder="Set password">
                  <button class="btn btn-outline-secondary" type="button" (click)="generatePassword()">Generate</button>
                </div>
              </div>
              <div class="mb-3" *ngIf="!editId">
                <label>Role</label>
                <select class="form-select mt-1" [(ngModel)]="form.role">
                  <option value="">Select role</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="COMPLIANCE">Compliance Officer</option>
                  <option value="BOARD">Board Officer</option>
                  <option value="REGULATOR">Regulator</option>
                </select>
              </div>
              <div class="mb-3" *ngIf="editId">
                <label>Status</label>
                <select class="form-select mt-1" [(ngModel)]="form.status">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
              <div class="p-3 rounded mt-2" *ngIf="!editId && form.password" style="background:rgba(79,70,229,0.08);border:1px solid rgba(79,70,229,0.2)">
                <div class="small text-muted mb-1">Generated credentials to share:</div>
                <div class="small fw-semibold" style="color:var(--text-primary)">Email: {{ form.email }}</div>
                <div class="small fw-semibold" style="color:var(--text-primary)">Password: {{ form.password }}</div>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showModal=false">Cancel</button>
              <button class="btn-accent" (click)="save()">{{ editId ? 'Update' : 'Create Account' }}</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal d-block" *ngIf="deleteTarget" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">Confirm Delete</h5>
              <button class="btn-close" (click)="deleteTarget=null"></button>
            </div>
            <div class="modal-body">
              <p style="color:var(--text-primary)">Delete <strong>{{ deleteTarget.name }}</strong> ({{ deleteTarget.role }})?</p>
              <div class="p-2 rounded small" style="background:rgba(239,68,68,0.08);color:#ef4444">⚠️ This action cannot be undone.</div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="deleteTarget=null">Cancel</button>
              <button class="btn btn-danger" (click)="deleteUser()">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminStaffComponent implements OnInit {
  staff: any[] = [];
  filtered: any[] = [];
  search = '';
  filterRole = '';
  filterStatus = '';
  showModal = false;
  editId: number | null = null;
  deleteTarget: any = null;
  form: any = {};
  roleSummary: any[] = [];

  constructor(private auth: AuthService, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.auth.getUsers().pipe(catchError(() => of([]))).subscribe(users => {
      this.staff = (users as any[]).filter(u => u.role !== 'ADMIN' && u.role !== 'STUDENT');
      this.buildSummary();
      this.applyFilter();
      this.cdr.detectChanges();
    });
  }

  buildSummary(): void {
    const roles = [
      { label: 'Teachers', role: 'TEACHER', icon: '👨🏫', color: '#0ea5e9' },
      { label: 'Compliance', role: 'COMPLIANCE', icon: '🛡️', color: '#f59e0b' },
      { label: 'Board Officers', role: 'BOARD', icon: '🏛️', color: '#10b981' },
      { label: 'Regulators', role: 'REGULATOR', icon: '🔍', color: '#6366f1' },
    ];
    this.roleSummary = roles.map(r => ({ ...r, count: this.staff.filter(s => s.role === r.role).length }));
  }

  applyFilter(): void {
    this.filtered = this.staff.filter(u => {
      const matchSearch = !this.search || u.name?.toLowerCase().includes(this.search.toLowerCase()) || u.email?.toLowerCase().includes(this.search.toLowerCase());
      const matchRole = !this.filterRole || u.role === this.filterRole;
      const matchStatus = !this.filterStatus || u.status === this.filterStatus;
      return matchSearch && matchRole && matchStatus;
    });
  }

  resetForm(): void {
    this.editId = null;
    this.form = { name: '', email: '', phone: '', password: '', role: '', status: 'ACTIVE' };
  }

  edit(u: any): void {
    this.editId = u.userId;
    this.form = { name: u.name, phone: u.phone, status: u.status };
    this.showModal = true;
  }

  generatePassword(): void {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$';
    this.form.password = Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  toggleStatus(u: any): void {
    const newStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.auth.updateUser(u.userId, { name: u.name, phone: u.phone, status: newStatus }).subscribe({
      next: () => { this.toast.show(`${u.name} ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`, 'success'); this.load(); },
      error: () => this.toast.show('Failed to update status', 'error')
    });
  }

  confirmDelete(u: any): void { this.deleteTarget = u; }

  deleteUser(): void {
    this.auth.deleteUser(this.deleteTarget.userId).subscribe({
      next: () => { this.toast.show('Staff member deleted', 'success'); this.deleteTarget = null; this.load(); },
      error: () => this.toast.show('Failed to delete', 'error')
    });
  }

  save(): void {
    if (this.editId) {
      this.auth.updateUser(this.editId, this.form).subscribe({
        next: () => { this.toast.show('Staff updated', 'success'); this.showModal = false; this.load(); },
        error: () => this.toast.show('Failed to update', 'error')
      });
    } else {
      if (!this.form.role) { this.toast.show('Please select a role', 'warning'); return; }
      this.auth.register(this.form).subscribe({
        next: () => { this.toast.show(`${this.form.role} account created`, 'success'); this.showModal = false; this.load(); },
        error: (err) => this.toast.show(err?.error?.message || 'Failed to create', 'error')
      });
    }
  }

  roleBadge(role: string): string {
    const map: any = { TEACHER: 'bg-primary', COMPLIANCE: 'bg-warning text-dark', BOARD: 'bg-info text-dark', REGULATOR: 'bg-secondary' };
    return map[role] || 'bg-secondary';
  }

  roleColor(role: string): string {
    const map: any = { TEACHER: '#0ea5e9', COMPLIANCE: '#f59e0b', BOARD: '#10b981', REGULATOR: '#6366f1' };
    return map[role] || '#adb5bd';
  }
}
