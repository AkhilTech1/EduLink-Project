import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-teacher-performance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="section-title mb-1">Student Performance</h2>
          <p class="text-muted small mb-0">Track and record student progress across your courses</p>
        </div>
        <button class="btn-accent" (click)="showModal=true;resetForm()">+ Add Metric</button>
      </div>

      <!-- Summary Stats -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="stat-card text-center">
            <div class="text-muted small mb-1">Total Records</div>
            <div class="fw-bold" style="font-size:1.8rem;color:var(--text-primary)">{{ metrics.length }}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card text-center">
            <div class="text-muted small mb-1">Class Average</div>
            <div class="fw-bold" style="font-size:1.8rem;color:var(--accent)">{{ classAvg }}%</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card text-center">
            <div class="text-muted small mb-1">Skill Gaps</div>
            <div class="fw-bold" style="font-size:1.8rem;color:#ef4444">{{ skillGaps }}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card text-center">
            <div class="text-muted small mb-1">Top Performers</div>
            <div class="fw-bold" style="font-size:1.8rem;color:#10b981">{{ topPerformers }}</div>
          </div>
        </div>
      </div>

      <!-- Filter -->
      <div class="card p-3 mb-4">
        <div class="row g-2">
          <div class="col-md-4">
            <select class="form-select" [(ngModel)]="filterCourse" (change)="applyFilter()">
              <option value="">All Courses</option>
              <option *ngFor="let c of courses" [value]="c.courseId">{{ c.title }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <select class="form-select" [(ngModel)]="filterLevel" (change)="applyFilter()">
              <option value="">All Levels</option>
              <option value="expert">Expert (≥85%)</option>
              <option value="proficient">Proficient (70-84%)</option>
              <option value="developing">Developing (50-69%)</option>
              <option value="beginner">Beginner (&lt;50%)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Performance Cards -->
      <div class="row g-3 mb-4">
        <div class="col-md-6 col-lg-4" *ngFor="let m of filtered">
          <div class="card p-3" [style.border-left]="'4px solid ' + levelColor(m.score)">
            <div class="d-flex justify-content-between mb-2">
              <div>
                <div class="fw-semibold small" style="color:var(--text-primary)">Student #{{ m.studentId }}</div>
                <div class="text-muted small">{{ courseName(m.courseId) }} • {{ m.date }}</div>
              </div>
              <span class="badge" [ngClass]="competencyBadge(m.score)">{{ competencyLabel(m.score) }}</span>
            </div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <div class="progress flex-grow-1" style="height:10px;border-radius:5px">
                <div class="progress-bar" [style.width]="m.score+'%'" [style.background]="levelColor(m.score)" style="border-radius:5px"></div>
              </div>
              <span class="fw-bold small" style="color:var(--text-primary)">{{ m.score }}%</span>
            </div>
            <div class="mt-2 p-2 rounded small" *ngIf="m.score < 50" style="background:rgba(239,68,68,0.1);color:#ef4444">
              ⚠️ Skill gap — needs additional support
            </div>
          </div>
        </div>
        <div *ngIf="filtered.length===0" class="col-12 text-center text-muted py-5">No performance data found</div>
      </div>

      <!-- Course-wise Summary Table -->
      <div class="card p-4">
        <h6 class="fw-bold mb-3" style="color:var(--text-primary)">📊 Course-wise Summary</h6>
        <div class="table-wrapper">
          <table class="table table-hover mb-0">
            <thead><tr><th>Course</th><th>Students Tracked</th><th>Avg Score</th><th>Top Score</th><th>Skill Gaps</th></tr></thead>
            <tbody>
              <tr *ngFor="let c of courseSummary">
                <td class="fw-semibold" style="color:var(--text-primary)">{{ c.title }}</td>
                <td>{{ c.count }}</td>
                <td><span [ngStyle]="{'color': c.avg>=60?'#10b981':'#ef4444'}">{{ c.avg }}%</span></td>
                <td><span class="badge bg-success">{{ c.top }}%</span></td>
                <td><span class="badge" [ngClass]="c.gaps>0?'bg-danger':'bg-success'">{{ c.gaps }}</span></td>
              </tr>
              <tr *ngIf="courseSummary.length===0"><td colspan="5" class="text-center text-muted py-3">No data</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Metric Modal -->
      <div class="modal d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">Add Performance Metric</h5>
              <button class="btn-close" (click)="showModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label>Course</label>
                <select class="form-select mt-1" [(ngModel)]="form.courseId" (change)="onCourseSelect()">
                  <option value="">Select course</option>
                  <option *ngFor="let c of courses" [value]="c.courseId">{{ c.title }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label>Student</label>
                <select class="form-select mt-1" [(ngModel)]="form.studentId" [disabled]="!form.courseId">
                  <option value="">Select student</option>
                  <option *ngFor="let s of courseStudents" [value]="s.studentId">{{ s.name || 'Student ' + s.studentId }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label>Score (%) — {{ form.score }}%</label>
                <input type="range" class="form-range mt-1" [(ngModel)]="form.score" min="0" max="100" step="1">
                <div class="d-flex justify-content-between">
                  <span class="small text-muted">0%</span>
                  <span class="fw-bold" [ngClass]="competencyBadge(form.score)">{{ competencyLabel(form.score) }}</span>
                  <span class="small text-muted">100%</span>
                </div>
              </div>
              <div class="mb-3"><label>Date</label><input type="date" class="form-control mt-1" [(ngModel)]="form.date"></div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showModal=false">Cancel</button>
              <button class="btn-accent" (click)="save()">Save Metric</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TeacherPerformanceComponent implements OnInit {
  metrics: any[] = [];
  filtered: any[] = [];
  courses: any[] = [];
  enrollments: any[] = [];
  allStudents: any[] = [];
  courseStudents: any[] = [];
  courseSummary: any[] = [];
  filterCourse = '';
  filterLevel = '';
  showModal = false;
  form: any = {};
  classAvg = 0; skillGaps = 0; topPerformers = 0;

  constructor(private api: ApiService, private auth: AuthService, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.auth.getMe().pipe(catchError(() => of(null))).subscribe(user => {
      if (!user) return;
      this.api.getClasses().pipe(catchError(() => of([]))).subscribe(allClasses => {
        const myCourseIds = [...new Set((allClasses as any[]).filter(cl => cl.teacherId == user.userId).map((cl: any) => cl.courseId))];
        forkJoin({
          courses: this.api.getCourses().pipe(catchError(() => of([]))),
          metrics: this.api.getPerformance().pipe(catchError(() => of([]))),
          enrollments: this.api.getAllEnrollments().pipe(catchError(() => of([]))),
          students: this.api.getStudents().pipe(catchError(() => of([]))),
        }).subscribe(d => {
          this.courses = (d.courses as any[]).filter(c => myCourseIds.includes(c.courseId));
          this.metrics = (d.metrics as any[]).filter(m => myCourseIds.includes(m.courseId));
          this.enrollments = (d.enrollments as any[]).filter(e => myCourseIds.includes(e.courseId));
          this.allStudents = d.students as any[];
          this.computeStats();
          this.applyFilter();
          this.cdr.detectChanges();
        });
      });
    });
  }

  computeStats(): void {
    this.classAvg = this.metrics.length ? Math.round(this.metrics.reduce((a, m) => a + m.score, 0) / this.metrics.length) : 0;
    this.skillGaps = this.metrics.filter(m => m.score < 50).length;
    this.topPerformers = this.metrics.filter(m => m.score >= 85).length;

    this.courseSummary = this.courses.map(c => {
      const cm = this.metrics.filter(m => m.courseId === c.courseId);
      return {
        title: c.title,
        count: cm.length,
        avg: cm.length ? Math.round(cm.reduce((a, m) => a + m.score, 0) / cm.length) : 0,
        top: cm.length ? Math.max(...cm.map(m => m.score)) : 0,
        gaps: cm.filter(m => m.score < 50).length
      };
    });
  }

  applyFilter(): void {
    this.filtered = this.metrics.filter(m => {
      const mc = !this.filterCourse || m.courseId === +this.filterCourse;
      const ml = !this.filterLevel ||
        (this.filterLevel === 'expert' && m.score >= 85) ||
        (this.filterLevel === 'proficient' && m.score >= 70 && m.score < 85) ||
        (this.filterLevel === 'developing' && m.score >= 50 && m.score < 70) ||
        (this.filterLevel === 'beginner' && m.score < 50);
      return mc && ml;
    });
  }

  onCourseSelect(): void {
    const enrolled = this.enrollments.filter(e => e.courseId === +this.form.courseId);
    this.courseStudents = enrolled.map(e => {
      const s = this.allStudents.find(st => st.studentId === e.studentId);
      return { studentId: e.studentId, name: s?.name || null };
    });
    this.form.studentId = '';
  }

  courseName(id: number): string { return this.courses.find(c => c.courseId === id)?.title || `Course ${id}`; }
  levelColor(s: number): string { if (s >= 85) return '#10b981'; if (s >= 70) return '#4f46e5'; if (s >= 50) return '#f59e0b'; return '#ef4444'; }
  competencyLabel(s: number): string { if (s >= 85) return 'Expert'; if (s >= 70) return 'Proficient'; if (s >= 50) return 'Developing'; return 'Beginner'; }
  competencyBadge(s: number): string { if (s >= 85) return 'bg-success'; if (s >= 70) return 'bg-primary'; if (s >= 50) return 'bg-warning text-dark'; return 'bg-danger'; }

  resetForm(): void { this.form = { courseId: '', studentId: '', score: 70, date: new Date().toISOString().split('T')[0], status: 'ACTIVE' }; this.courseStudents = []; }

  save(): void {
    if (!this.form.courseId || !this.form.studentId) { this.toast.show('Please select course and student', 'error'); return; }
    this.api.createPerformance({ ...this.form, courseId: +this.form.courseId, studentId: +this.form.studentId }).subscribe({
      next: () => { this.toast.show('Metric saved', 'success'); this.showModal = false; this.ngOnInit(); },
      error: () => this.toast.show('Failed', 'error')
    });
  }
}
