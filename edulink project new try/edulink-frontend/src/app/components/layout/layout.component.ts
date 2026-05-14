import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { ToastComponent } from '../shared/toast.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, ToastComponent],
  template: `
    <div class="d-flex">
      <nav class="sidebar" [class.open]="sidebarOpen">
        <div class="brand">🎓 EduLink</div>
        <div class="p-3 text-center" style="flex-shrink:0">
          <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
            style="width:52px;height:52px;background:var(--accent)">
            <span class="text-white fw-bold fs-5">{{ initials }}</span>
          </div>
          <div class="text-white fw-semibold mt-1">{{ displayName }}</div>
          <div style="color:rgba(255,255,255,0.5);font-size:0.72rem">{{ email }}</div>
          <span class="badge mt-1" [ngClass]="roleBadge">{{ role }}</span>
        </div>
        <div class="nav-scroll">
          <ul class="nav flex-column px-2 py-1">
            <li *ngFor="let item of navItems" class="nav-item">
              <a class="nav-link" [routerLink]="item.path" routerLinkActive="active">
                <span>{{ item.icon }}</span> {{ item.label }}
              </a>
            </li>
          </ul>
        </div>
        <div class="logout-section">
          <button class="btn btn-sm w-100" style="background:rgba(255,255,255,0.1);color:#fff" (click)="logout()">
            🚪 Logout
          </button>
        </div>
      </nav>

      <div class="main-content flex-grow-1">
        <div class="topbar">
          <button class="btn btn-sm d-md-none" style="background:var(--bg-secondary);color:var(--text-primary)" (click)="sidebarOpen=!sidebarOpen">☰</button>
          <div class="d-flex align-items-center gap-3 ms-auto">
            <button class="btn btn-sm" style="background:var(--bg-secondary);color:var(--text-primary)" (click)="toggleTheme()">
              {{ isDark ? '☀️' : '🌙' }}
            </button>
            <div class="d-flex align-items-center gap-2">
              <div class="rounded-circle d-inline-flex align-items-center justify-content-center"
                style="width:34px;height:34px;background:var(--accent);font-size:0.8rem">
                <span class="text-white fw-bold">{{ initials }}</span>
              </div>
              <div>
                <div class="fw-semibold" style="font-size:0.875rem;color:var(--text-primary)">{{ displayName }}</div>
                <div class="text-muted" style="font-size:0.72rem">{{ role }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
    <app-toast></app-toast>
  `
})
export class LayoutComponent implements OnInit {
  sidebarOpen = false;
  displayName = '';
  email = '';
  role = '';
  initials = '';
  isDark = false;
  navItems: { path: string; label: string; icon: string }[] = [];

  private navMap: Record<string, { path: string; label: string; icon: string }[]> = {
    ADMIN: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/admin/approvals', label: 'Approvals', icon: '✅' },
      { path: '/admin/students', label: 'Students', icon: '🎒' },
      { path: '/admin/staff', label: 'Staff', icon: '👨‍💼' },
      { path: '/admin/users', label: 'All Users', icon: '👥' },
      { path: '/admin/courses', label: 'Courses & Classes', icon: '📚' },
      { path: '/admin/attendance', label: 'Attendance', icon: '📋' },
      { path: '/admin/exams', label: 'Exams & Grades', icon: '📝' },
      { path: '/admin/compliance', label: 'Compliance', icon: '🛡️' },
      { path: '/admin/reports', label: 'Reports', icon: '📊' },
      { path: '/admin/notifications', label: 'Notifications', icon: '🔔' },
    ],
    STUDENT: [
      { path: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/student/profile', label: 'My Profile', icon: '👤' },
      { path: '/student/courses', label: 'My Courses', icon: '📚' },
      { path: '/student/learning', label: 'Learning', icon: '📖' },
      { path: '/student/exams', label: 'Exams', icon: '📝' },
      { path: '/student/grades', label: 'Grades', icon: '🏆' },
      { path: '/student/attendance', label: 'Attendance', icon: '📋' },
      { path: '/student/notifications', label: 'Notifications', icon: '🔔' },
      { path: '/student/reports', label: 'Reports', icon: '📊' },
      { path: '/student/calendar', label: 'Calendar', icon: '📅' },
    ],
    TEACHER: [
      { path: '/teacher/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/teacher/courses', label: 'My Courses', icon: '📚' },
      { path: '/teacher/students', label: 'My Students', icon: '🎒' },
      { path: '/teacher/schedule', label: 'Schedule', icon: '🗓️' },
      { path: '/teacher/materials', label: 'Materials', icon: '📄' },
      { path: '/teacher/exams', label: 'Exams & Grades', icon: '📝' },
      { path: '/teacher/grades', label: 'Grades', icon: '🏆' },
      { path: '/teacher/attendance', label: 'Attendance', icon: '📋' },
      { path: '/teacher/performance', label: 'Performance', icon: '📈' },
    ],
    COMPLIANCE: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/compliance/courses', label: 'Courses', icon: '📚' },
      { path: '/compliance/students', label: 'Students', icon: '🎒' },
      { path: '/compliance/records', label: 'Compliance Records', icon: '🛡️' },
      { path: '/compliance/audits', label: 'Audit Records', icon: '🔍' },
    ],
    BOARD: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/admin/courses', label: 'Courses', icon: '📚' },
      { path: '/admin/reports', label: 'Reports', icon: '📊' },
      { path: '/admin/compliance', label: 'Compliance', icon: '🛡️' },
    ],
    REGULATOR: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/regulator/compliance', label: 'Compliance Reports', icon: '🛡️' },
      { path: '/regulator/audits', label: 'Audit Logs', icon: '🔍' },
      { path: '/admin/reports', label: 'Reports', icon: '📊' },
    ],
  };

  constructor(private auth: AuthService, private theme: ThemeService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.email = this.auth.getEmail() || '';
    this.role = this.auth.getRole() || '';
    this.isDark = this.theme.isDark();
    this.navItems = this.navMap[this.role] || [];

    this.auth.getMe().pipe(catchError(() => of(null))).subscribe(user => {
      const name = user?.name?.trim() || this.email;
      this.displayName = name;
      this.initials = name.split(' ').filter((w: string) => w.length > 0).map((w: string) => w[0].toUpperCase()).join('').substring(0, 2);
      localStorage.setItem('name', name);
      this.cdr.detectChanges();
    });
  }

  toggleTheme(): void { this.theme.toggle(); this.isDark = this.theme.isDark(); }
  logout(): void { this.auth.logout(); }

  get roleBadge(): string {
    const map: any = { ADMIN: 'bg-danger', STUDENT: 'bg-success', TEACHER: 'bg-primary', COMPLIANCE: 'bg-warning text-dark', BOARD: 'bg-info text-dark', REGULATOR: 'bg-secondary' };
    return map[this.role] || 'bg-secondary';
  }
}
