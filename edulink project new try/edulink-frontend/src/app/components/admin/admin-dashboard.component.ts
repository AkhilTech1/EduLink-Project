import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="section-title mb-1">Welcome back, {{ displayName }} 👋</h1>
          <p class="text-muted small mb-0">School Administrator Dashboard — {{ today }}</p>
        </div>
        <button class="btn btn-sm btn-outline-secondary" (click)="load()">🔄 Refresh</button>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-6 col-md-4 col-lg-2" *ngFor="let k of kpis">
          <div class="stat-card h-100" style="cursor:pointer" [routerLink]="k.path">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="text-muted" style="font-size:0.78rem">{{ k.label }}</span>
              <div class="stat-icon" [style.background]="k.color+'22'" style="width:36px;height:36px;font-size:1rem">{{ k.icon }}</div>
            </div>
            <div class="fw-bold" style="font-size:1.7rem;color:var(--text-primary)">{{ k.value }}</div>
            <div class="small mt-1" [style.color]="k.color">{{ k.sub }}</div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-lg-8">
          <div class="card p-4 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold mb-0" style="color:var(--text-primary)">📊 Course Enrollment Overview</h6>
            </div>
            <div *ngIf="courses.length===0" class="text-center text-muted py-4">No course data</div>
            <div *ngFor="let c of courses.slice(0,6)" class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="small fw-semibold" style="color:var(--text-primary)">{{ c.title }}</span>
                <span class="small text-muted">{{ c.subject }}</span>
              </div>
              <div class="progress" style="height:8px">
                <div class="progress-bar" [style.width]="courseBar(c)" [style.background]="c.status==='ACTIVE'?'#4f46e5':'#adb5bd'"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card p-4 h-100">
            <h6 class="fw-bold mb-3" style="color:var(--text-primary)">⏳ Pending Approvals</h6>
            <div *ngIf="pendingStudents.length===0" class="text-center text-muted py-3">No pending approvals</div>
            <div *ngFor="let s of pendingStudents.slice(0,5)" class="d-flex align-items-center gap-2 mb-3 p-2 rounded" style="background:var(--bg-secondary)">
              <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                style="width:34px;height:34px;min-width:34px;background:var(--accent);font-size:0.8rem">
                {{ s.name?.substring(0,2).toUpperCase() }}
              </div>
              <div class="flex-grow-1 overflow-hidden">
                <div class="fw-semibold small text-truncate" style="color:var(--text-primary)">{{ s.name }}</div>
                <div class="text-muted" style="font-size:0.72rem">{{ s.email }}</div>
              </div>
              <div class="d-flex gap-1">
                <button class="btn btn-sm btn-success py-0 px-2" style="font-size:0.72rem" (click)="approve(s.userId)">✓</button>
                <button class="btn btn-sm btn-danger py-0 px-2" style="font-size:0.72rem" (click)="reject(s.userId)">✕</button>
              </div>
            </div>
            <a routerLink="/admin/approvals" class="btn btn-sm w-100 mt-2" style="background:var(--bg-secondary);color:var(--accent)" *ngIf="pendingStudents.length>5">
              View all {{ pendingStudents.length }} pending
            </a>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-lg-4">
          <div class="card p-4 h-100">
            <h6 class="fw-bold mb-3" style="color:var(--text-primary)">📝 Exam Performance</h6>
            <div class="row g-2 mb-3">
              <div class="col-6">
                <div class="p-3 rounded text-center" style="background:rgba(16,185,129,0.1)">
                  <div class="fw-bold" style="font-size:1.5rem;color:#10b981">{{ passRate }}%</div>
                  <div class="text-muted small">Pass Rate</div>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 rounded text-center" style="background:rgba(79,70,229,0.1)">
                  <div class="fw-bold" style="font-size:1.5rem;color:#4f46e5">{{ avgScore }}</div>
                  <div class="text-muted small">Avg Score</div>
                </div>
              </div>
            </div>
            <div *ngFor="let g of gradeDistribution" class="mb-2">
              <div class="d-flex justify-content-between mb-1">
                <span class="small" style="color:var(--text-primary)">Grade {{ g.grade }}</span>
                <span class="small text-muted">{{ g.count }}</span>
              </div>
              <div class="progress" style="height:6px">
                <div class="progress-bar" [style.width]="g.pct+'%'" [style.background]="g.color"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card p-4 h-100">
            <h6 class="fw-bold mb-3" style="color:var(--text-primary)">📋 Attendance Overview</h6>
            <div class="text-center mb-3">
              <div class="d-inline-flex align-items-center justify-content-center rounded-circle"
                style="width:90px;height:90px;background:conic-gradient(#4f46e5 {{ attendancePct*3.6 }}deg, var(--bg-secondary) 0deg)">
                <div class="rounded-circle d-flex align-items-center justify-content-center"
                  style="width:70px;height:70px;background:var(--bg-card)">
                  <span class="fw-bold" style="color:var(--text-primary)">{{ attendancePct }}%</span>
                </div>
              </div>
              <div class="text-muted small mt-2">Overall Attendance</div>
            </div>
            <div class="d-flex justify-content-around text-center">
              <div><div class="fw-bold" style="color:#10b981">{{ presentCount }}</div><div class="text-muted small">Present</div></div>
              <div><div class="fw-bold" style="color:#ef4444">{{ absentCount }}</div><div class="text-muted small">Absent</div></div>
              <div><div class="fw-bold" style="color:#f59e0b">{{ lateCount }}</div><div class="text-muted small">Late</div></div>
            </div>
            <div class="mt-3 p-2 rounded" *ngIf="lowAttendanceCount>0" style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2)">
              <div class="small" style="color:#ef4444">⚠️ {{ lowAttendanceCount }} students below 75% attendance</div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card p-4 h-100">
            <h6 class="fw-bold mb-3" style="color:var(--text-primary)">🛡️ Compliance Status</h6>
            <div *ngFor="let c of complianceSummary" class="d-flex align-items-center justify-content-between mb-3 p-2 rounded" style="background:var(--bg-secondary)">
              <div class="d-flex align-items-center gap-2">
                <div class="rounded-circle" style="width:10px;height:10px;min-width:10px" [style.background]="c.color"></div>
                <span class="small" style="color:var(--text-primary)">{{ c.label }}</span>
              </div>
              <span class="badge" [style.background]="c.color">{{ c.count }}</span>
            </div>
            <div class="mt-2">
              <div class="text-muted small mb-1">Compliance Health</div>
              <div class="progress" style="height:8px">
                <div class="progress-bar bg-success" [style.width]="complianceHealth+'%'"></div>
              </div>
              <div class="text-muted small mt-1">{{ complianceHealth }}% compliant</div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-lg-6">
          <div class="card p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold mb-0" style="color:var(--text-primary)">🔔 Recent Notifications</h6>
              <a routerLink="/admin/notifications" class="small" style="color:var(--accent)">View all</a>
            </div>
            <div *ngIf="notifications.length===0" class="text-center text-muted py-3">No notifications</div>
            <div *ngFor="let n of notifications.slice(0,5)" class="d-flex gap-3 mb-3 pb-3" style="border-bottom:1px solid var(--border-color)">
              <span style="font-size:1.3rem">{{ categoryIcon(n.category) }}</span>
              <div class="flex-grow-1">
                <div class="small fw-semibold" style="color:var(--text-primary)">{{ n.message }}</div>
                <div class="text-muted" style="font-size:0.72rem">{{ n.category }} • {{ n.createdDate | date:'short' }}</div>
              </div>
              <span class="badge align-self-start" [ngClass]="n.status==='UNREAD'?'bg-primary':'bg-secondary'">{{ n.status }}</span>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold mb-0" style="color:var(--text-primary)">📅 Upcoming Exams</h6>
              <a routerLink="/admin/exams" class="small" style="color:var(--accent)">View all</a>
            </div>
            <div *ngIf="upcomingExams.length===0" class="text-center text-muted py-3">No upcoming exams</div>
            <div *ngFor="let e of upcomingExams.slice(0,5)" class="d-flex align-items-center gap-3 mb-3 p-2 rounded" style="background:var(--bg-secondary)">
              <div class="text-center p-2 rounded" style="background:var(--accent);min-width:44px">
                <div class="text-white fw-bold small">{{ e.date | date:'dd' }}</div>
                <div class="text-white" style="font-size:0.65rem">{{ e.date | date:'MMM' }}</div>
              </div>
              <div class="flex-grow-1">
                <div class="small fw-semibold" style="color:var(--text-primary)">Course {{ e.courseId }} — {{ e.type }}</div>
                <div class="text-muted" style="font-size:0.72rem">{{ e.date }}</div>
              </div>
              <span class="badge" [ngClass]="e.status==='SCHEDULED'?'bg-primary':e.status==='COMPLETED'?'bg-success':'bg-secondary'">{{ e.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  displayName = '';
  today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  kpis: any[] = [];
  courses: any[] = [];
  pendingStudents: any[] = [];
  notifications: any[] = [];
  upcomingExams: any[] = [];
  gradeDistribution: any[] = [];
  complianceSummary: any[] = [];

  passRate = 0;
  avgScore = 0;
  attendancePct = 0;
  presentCount = 0;
  absentCount = 0;
  lateCount = 0;
  lowAttendanceCount = 0;
  complianceHealth = 0;

  constructor(private auth: AuthService, private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.auth.getMe().pipe(catchError(() => of(null))).subscribe(u => {
      this.displayName = u?.name?.trim() || this.auth.getEmail() || '';
      this.cdr.detectChanges();
    });
    this.load();
  }

  load(): void {
    forkJoin({
      students: this.auth.getAllStudentRegistrations().pipe(catchError(() => of([]))),
      courses: this.api.getCourses().pipe(catchError(() => of([]))),
      users: this.auth.getUsers().pipe(catchError(() => of([]))),
      pending: this.auth.getPendingStudents().pipe(catchError(() => of([]))),
      attendance: this.api.getAttendance().pipe(catchError(() => of([]))),
      grades: this.api.getGrades().pipe(catchError(() => of([]))),
      exams: this.api.getExams().pipe(catchError(() => of([]))),
      compliance: this.api.getCompliance().pipe(catchError(() => of([]))),
      notifications: this.api.getNotifications().pipe(catchError(() => of([]))),
    }).subscribe(d => {
      const teachers = (d.users as any[]).filter(u => u.role === 'TEACHER').length;
      const activeCourses = (d.courses as any[]).filter(c => c.status === 'ACTIVE').length;
      const approvedStudents = (d.students as any[]).filter(s => s.status === 'ACTIVE').length;
      const passed = (d.grades as any[]).filter(g => g.status === 'PASS').length;
      this.passRate = d.grades.length ? Math.round((passed / d.grades.length) * 100) : 0;
      this.avgScore = d.grades.length ? Math.round((d.grades as any[]).reduce((a, g) => a + g.score, 0) / d.grades.length) : 0;

      this.presentCount = (d.attendance as any[]).filter(a => a.status === 'PRESENT').length;
      this.absentCount = (d.attendance as any[]).filter(a => a.status === 'ABSENT').length;
      this.lateCount = (d.attendance as any[]).filter(a => a.status === 'LATE').length;
      this.attendancePct = d.attendance.length ? Math.round((this.presentCount / d.attendance.length) * 100) : 0;

      const studentAttMap: Record<number, { p: number; t: number }> = {};
      (d.attendance as any[]).forEach(a => {
        if (!studentAttMap[a.studentId]) studentAttMap[a.studentId] = { p: 0, t: 0 };
        studentAttMap[a.studentId].t++;
        if (a.status === 'PRESENT') studentAttMap[a.studentId].p++;
      });
      this.lowAttendanceCount = Object.values(studentAttMap).filter(v => v.t > 0 && (v.p / v.t) < 0.75).length;

      const compPass = (d.compliance as any[]).filter(c => c.result === 'PASS').length;
      const compFail = (d.compliance as any[]).filter(c => c.result === 'FAIL').length;
      const compPending = d.compliance.length - compPass - compFail;
      this.complianceHealth = d.compliance.length ? Math.round((compPass / d.compliance.length) * 100) : 100;
      this.complianceSummary = [
        { label: 'Passed', count: compPass, color: '#10b981' },
        { label: 'Failed', count: compFail, color: '#ef4444' },
        { label: 'Pending', count: compPending, color: '#f59e0b' },
      ];

      const gradeCounts: Record<string, number> = {};
      (d.grades as any[]).forEach(g => { gradeCounts[g.grade] = (gradeCounts[g.grade] || 0) + 1; });
      const gradeColors: Record<string, string> = { A: '#10b981', B: '#4f46e5', C: '#f59e0b', D: '#f97316', F: '#ef4444' };
      this.gradeDistribution = Object.entries(gradeCounts).map(([grade, count]) => ({
        grade, count, pct: Math.round((count / d.grades.length) * 100), color: gradeColors[grade] || '#adb5bd'
      }));

      this.kpis = [
        { label: 'Total Students', value: d.students.length, icon: '🎒', color: '#4f46e5', sub: `${approvedStudents} approved`, path: '/admin/students' },
        { label: 'Teachers', value: teachers, icon: '👨‍🏫', color: '#0ea5e9', sub: 'Staff members', path: '/admin/users' },
        { label: 'Courses', value: d.courses.length, icon: '📚', color: '#10b981', sub: `${activeCourses} active`, path: '/admin/courses' },
        { label: 'Pending', value: (d.pending as any[]).length, icon: '⏳', color: '#f59e0b', sub: 'Awaiting approval', path: '/admin/approvals' },
        { label: 'Attendance', value: this.attendancePct + '%', icon: '📋', color: '#6366f1', sub: `${this.lowAttendanceCount} low`, path: '/admin/attendance' },
        { label: 'Pass Rate', value: this.passRate + '%', icon: '🏆', color: '#10b981', sub: `Avg ${this.avgScore} pts`, path: '/admin/exams' },
      ];

      this.courses = d.courses;
      this.pendingStudents = d.pending;
      this.notifications = d.notifications;
      this.upcomingExams = (d.exams as any[]).filter(e => e.status === 'SCHEDULED').sort((a, b) => a.date > b.date ? 1 : -1);
      this.cdr.detectChanges();
    });
  }

  approve(id: number): void {
    this.auth.approveStudent(id, 'ACTIVE').subscribe({ next: () => this.load() });
  }

  reject(id: number): void {
    this.auth.approveStudent(id, 'REJECTED').subscribe({ next: () => this.load() });
  }

  courseBar(c: any): string {
    return c.status === 'ACTIVE' ? '100%' : '40%';
  }

  categoryIcon(cat: string): string {
    const map: any = { ENROLLMENT: '📋', EXAM: '📝', COMPLIANCE: '🛡️', GENERAL: '🔔' };
    return map[cat] || '🔔';
  }
}
