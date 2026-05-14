import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-exams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="section-title mb-1">Academic Oversight</h2>
          <p class="text-muted small mb-0">Monitor exams, grades and performance analytics</p>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="stat-card text-center">
            <div class="text-muted small mb-1">Total Exams</div>
            <div class="fw-bold" style="font-size:1.8rem;color:var(--text-primary)">{{ exams.length }}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card text-center">
            <div class="text-muted small mb-1">Pass Rate</div>
            <div class="fw-bold" style="font-size:1.8rem;color:#10b981">{{ passRate }}%</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card text-center">
            <div class="text-muted small mb-1">Avg Score</div>
            <div class="fw-bold" style="font-size:1.8rem;color:#4f46e5">{{ avgScore }}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card text-center">
            <div class="text-muted small mb-1">Pending Grading</div>
            <div class="fw-bold" style="font-size:1.8rem;color:#f59e0b">{{ pendingGrading }}</div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4" *ngIf="pendingGrading > 0">
        <div class="col-12">
          <div class="p-3 rounded d-flex align-items-center gap-3" style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3)">
            <span style="font-size:1.5rem">⚠️</span>
            <div>
              <div class="fw-semibold" style="color:var(--text-primary)">{{ pendingGrading }} exams have no grades published yet</div>
              <div class="text-muted small">Teachers need to publish grades for completed exams</div>
            </div>
          </div>
        </div>
      </div>

      <ul class="nav nav-tabs mb-4">
        <li class="nav-item"><a class="nav-link" [class.active]="tab==='exams'" href="javascript:void(0)" (click)="tab='exams'">📅 Exam Schedule</a></li>
        <li class="nav-item"><a class="nav-link" [class.active]="tab==='grades'" href="javascript:void(0)" (click)="tab='grades'">📊 Grades</a></li>
        <li class="nav-item"><a class="nav-link" [class.active]="tab==='analytics'" href="javascript:void(0)" (click)="tab='analytics'">📈 Analytics</a></li>
      </ul>

      <!-- Exams Tab — read-only for ADMIN -->
      <div *ngIf="tab==='exams'">
        <div class="d-flex gap-2 mb-3">
          <input class="form-control form-control-sm" style="width:220px" [(ngModel)]="examSearch" placeholder="Search by course ID..." (input)="applyExamFilter()">
          <select class="form-select form-select-sm" style="width:160px" [(ngModel)]="examStatusFilter" (change)="applyExamFilter()">
            <option value="">All Status</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <!-- Teacher-only actions -->
          <button class="btn-accent btn-sm ms-auto" *ngIf="isTeacher" (click)="showExamModal=true;resetExam()">+ Add Exam</button>
        </div>
        <div class="table-wrapper">
          <table class="table table-hover mb-0">
            <thead>
              <tr><th>Exam ID</th><th>Course</th><th>Type</th><th>Date</th><th>Status</th><th>Grades</th><th *ngIf="isTeacher">Actions</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let e of filteredExams">
                <td>#{{ e.examId }}</td>
                <td>{{ e.courseId }}</td>
                <td><span class="badge bg-info text-dark">{{ e.type }}</span></td>
                <td>{{ e.date }}</td>
                <td><span class="badge" [ngClass]="e.status==='SCHEDULED'?'bg-primary':e.status==='COMPLETED'?'bg-success':'bg-secondary'">{{ e.status }}</span></td>
                <td><span class="badge" [ngClass]="gradeCount(e.examId)>0?'bg-success':'bg-warning text-dark'">{{ gradeCount(e.examId) }} grades</span></td>
                <td *ngIf="isTeacher">
                  <button class="btn btn-sm btn-outline-primary me-1" (click)="editExam(e)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" (click)="deleteExam(e.examId)">Delete</button>
                </td>
              </tr>
              <tr *ngIf="filteredExams.length===0"><td colspan="7" class="text-center text-muted py-4">No exams found</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Grades Tab — read-only for ADMIN -->
      <div *ngIf="tab==='grades'">
        <div class="d-flex gap-2 mb-3">
          <input class="form-control form-control-sm" style="width:220px" [(ngModel)]="gradeSearch" placeholder="Search by student ID..." (input)="applyGradeFilter()">
          <!-- Teacher-only actions -->
          <button class="btn-accent btn-sm ms-auto" *ngIf="isTeacher" (click)="showGradeModal=true;resetGrade()">+ Add Grade</button>
        </div>
        <div class="table-wrapper">
          <table class="table table-hover mb-0">
            <thead>
              <tr><th>Grade ID</th><th>Exam ID</th><th>Student ID</th><th>Score</th><th>Grade</th><th>Status</th><th *ngIf="isTeacher">Actions</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let g of filteredGrades">
                <td>#{{ g.gradeId }}</td>
                <td>{{ g.examId }}</td>
                <td>{{ g.studentId }}</td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <div class="progress flex-grow-1" style="height:6px;max-width:60px">
                      <div class="progress-bar" [style.width]="g.score+'%'" [ngClass]="g.score>=60?'bg-success':'bg-danger'"></div>
                    </div>
                    <span>{{ g.score }}</span>
                  </div>
                </td>
                <td><span class="badge" [ngClass]="gradeBadge(g.grade)">{{ g.grade }}</span></td>
                <td><span class="badge" [ngClass]="g.status==='PASS'?'bg-success':'bg-danger'">{{ g.status }}</span></td>
                <td *ngIf="isTeacher"><button class="btn btn-sm btn-outline-primary" (click)="editGrade(g)">Edit</button></td>
              </tr>
              <tr *ngIf="filteredGrades.length===0"><td colspan="7" class="text-center text-muted py-4">No grades found</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Analytics Tab -->
      <div *ngIf="tab==='analytics'">
        <div class="row g-3">
          <div class="col-md-6">
            <div class="card p-4">
              <h6 class="fw-bold mb-3" style="color:var(--text-primary)">Grade Distribution</h6>
              <div *ngFor="let g of gradeDistribution" class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                  <span class="small fw-semibold" style="color:var(--text-primary)">Grade {{ g.grade }}</span>
                  <span class="small text-muted">{{ g.count }} students ({{ g.pct }}%)</span>
                </div>
                <div class="progress" style="height:12px;border-radius:6px">
                  <div class="progress-bar" [style.width]="g.pct+'%'" [style.background]="g.color" style="border-radius:6px"></div>
                </div>
              </div>
              <div *ngIf="gradeDistribution.length===0" class="text-muted small text-center py-3">No grade data available</div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card p-4">
              <h6 class="fw-bold mb-3" style="color:var(--text-primary)">Exam Type Breakdown</h6>
              <div *ngFor="let t of examTypeBreakdown" class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                  <span class="small fw-semibold" style="color:var(--text-primary)">{{ t.type }}</span>
                  <span class="small text-muted">{{ t.count }} exams</span>
                </div>
                <div class="progress" style="height:12px;border-radius:6px">
                  <div class="progress-bar" [style.width]="t.pct+'%'" [style.background]="t.color" style="border-radius:6px"></div>
                </div>
              </div>
              <div *ngIf="examTypeBreakdown.length===0" class="text-muted small text-center py-3">No exam data available</div>
            </div>
          </div>
          <div class="col-12">
            <div class="card p-4">
              <h6 class="fw-bold mb-3" style="color:var(--text-primary)">Top Performing Students</h6>
              <div class="table-wrapper">
                <table class="table mb-0">
                  <thead><tr><th>Student ID</th><th>Exams Taken</th><th>Avg Score</th><th>Pass Rate</th><th>Performance</th></tr></thead>
                  <tbody>
                    <tr *ngFor="let s of topStudents">
                      <td class="fw-semibold">{{ s.studentId }}</td>
                      <td>{{ s.count }}</td>
                      <td>{{ s.avg }}</td>
                      <td><span class="badge" [ngClass]="s.passRate>=80?'bg-success':s.passRate>=60?'bg-warning text-dark':'bg-danger'">{{ s.passRate }}%</span></td>
                      <td>
                        <div class="progress" style="height:6px;max-width:100px">
                          <div class="progress-bar" [style.width]="s.avg+'%'" [ngClass]="s.avg>=70?'bg-success':s.avg>=50?'bg-warning':'bg-danger'"></div>
                        </div>
                      </td>
                    </tr>
                    <tr *ngIf="topStudents.length===0"><td colspan="5" class="text-center text-muted py-3">No performance data available</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Exam Modal — Teacher only -->
      <div class="modal d-block" *ngIf="showExamModal && isTeacher" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">{{ examEditId ? 'Edit Exam' : 'Add Exam' }}</h5>
              <button class="btn-close" (click)="showExamModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3"><label>Course ID</label><input type="number" class="form-control mt-1" [(ngModel)]="examForm.courseId"></div>
              <div class="mb-3">
                <label>Type</label>
                <select class="form-select mt-1" [(ngModel)]="examForm.type">
                  <option value="QUIZ">QUIZ</option><option value="PRACTICAL">PRACTICAL</option><option value="FINAL">FINAL</option>
                </select>
              </div>
              <div class="mb-3"><label>Date</label><input type="date" class="form-control mt-1" [(ngModel)]="examForm.date"></div>
              <div class="mb-3">
                <label>Status</label>
                <select class="form-select mt-1" [(ngModel)]="examForm.status">
                  <option value="SCHEDULED">SCHEDULED</option><option value="COMPLETED">COMPLETED</option><option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showExamModal=false">Cancel</button>
              <button class="btn-accent" (click)="saveExam()">{{ examEditId ? 'Update' : 'Create' }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Grade Modal — Teacher only -->
      <div class="modal d-block" *ngIf="showGradeModal && isTeacher" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="fw-bold" style="color:var(--text-primary)">{{ gradeEditId ? 'Edit Grade' : 'Add Grade' }}</h5>
              <button class="btn-close" (click)="showGradeModal=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3"><label>Exam ID</label><input type="number" class="form-control mt-1" [(ngModel)]="gradeForm.examId"></div>
              <div class="mb-3"><label>Student ID</label><input type="number" class="form-control mt-1" [(ngModel)]="gradeForm.studentId"></div>
              <div class="mb-3"><label>Score</label><input type="number" class="form-control mt-1" [(ngModel)]="gradeForm.score" min="0" max="100"></div>
              <div class="mb-3"><label>Grade</label><input class="form-control mt-1" [(ngModel)]="gradeForm.grade" placeholder="A, B, C..."></div>
              <div class="mb-3">
                <label>Status</label>
                <select class="form-select mt-1" [(ngModel)]="gradeForm.status">
                  <option value="PASS">PASS</option><option value="FAIL">FAIL</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showGradeModal=false">Cancel</button>
              <button class="btn-accent" (click)="saveGrade()">{{ gradeEditId ? 'Update' : 'Create' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminExamsComponent implements OnInit {
  tab = 'exams';
  exams: any[] = [];
  filteredExams: any[] = [];
  grades: any[] = [];
  filteredGrades: any[] = [];
  examSearch = '';
  examStatusFilter = '';
  gradeSearch = '';
  showExamModal = false;
  showGradeModal = false;
  examEditId: number | null = null;
  gradeEditId: number | null = null;
  examForm: any = {};
  gradeForm: any = {};
  role = '';
  isTeacher = false;
  passRate = 0;
  avgScore = 0;
  pendingGrading = 0;
  gradeDistribution: any[] = [];
  examTypeBreakdown: any[] = [];
  topStudents: any[] = [];

  constructor(private api: ApiService, private toast: ToastService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.role = this.auth.getRole() || '';
    this.isTeacher = this.role === 'TEACHER';
    this.load();
  }

  load(): void {
    forkJoin({ exams: this.api.getExams(), grades: this.api.getGrades() }).subscribe(d => {
      this.exams = d.exams;
      this.grades = d.grades;
      this.filteredExams = d.exams;
      this.filteredGrades = d.grades;
      this.computeAnalytics();
      this.cdr.detectChanges();
    });
  }

  computeAnalytics(): void {
    const passed = this.grades.filter(g => g.status === 'PASS').length;
    this.passRate = this.grades.length ? Math.round((passed / this.grades.length) * 100) : 0;
    this.avgScore = this.grades.length ? Math.round(this.grades.reduce((a, g) => a + g.score, 0) / this.grades.length) : 0;
    this.pendingGrading = this.exams.filter(e => e.status === 'COMPLETED' && this.gradeCount(e.examId) === 0).length;

    const gc: Record<string, number> = {};
    this.grades.forEach(g => { gc[g.grade] = (gc[g.grade] || 0) + 1; });
    const colors: Record<string, string> = { A: '#10b981', B: '#4f46e5', C: '#f59e0b', D: '#f97316', F: '#ef4444' };
    this.gradeDistribution = Object.entries(gc).map(([grade, count]) => ({
      grade, count, pct: this.grades.length ? Math.round((count / this.grades.length) * 100) : 0, color: colors[grade] || '#adb5bd'
    })).sort((a, b) => a.grade.localeCompare(b.grade));

    const tc: Record<string, number> = {};
    this.exams.forEach(e => { tc[e.type] = (tc[e.type] || 0) + 1; });
    const tColors: Record<string, string> = { QUIZ: '#4f46e5', PRACTICAL: '#10b981', FINAL: '#f59e0b' };
    this.examTypeBreakdown = Object.entries(tc).map(([type, count]) => ({
      type, count, pct: this.exams.length ? Math.round((count / this.exams.length) * 100) : 0, color: tColors[type] || '#adb5bd'
    }));

    const sm: Record<number, number[]> = {};
    this.grades.forEach(g => { if (!sm[g.studentId]) sm[g.studentId] = []; sm[g.studentId].push(g.score); });
    this.topStudents = Object.entries(sm).map(([sid, scores]) => {
      const avg = Math.round(scores.reduce((a, s) => a + s, 0) / scores.length);
      const passCount = this.grades.filter(g => g.studentId === +sid && g.status === 'PASS').length;
      return { studentId: sid, count: scores.length, avg, passRate: Math.round((passCount / scores.length) * 100) };
    }).sort((a, b) => b.avg - a.avg).slice(0, 10);
  }

  applyExamFilter(): void {
    this.filteredExams = this.exams.filter(e => {
      const ms = !this.examSearch || String(e.examId).includes(this.examSearch) || String(e.courseId).includes(this.examSearch);
      const mst = !this.examStatusFilter || e.status === this.examStatusFilter;
      return ms && mst;
    });
  }

  applyGradeFilter(): void {
    this.filteredGrades = this.grades.filter(g => !this.gradeSearch || String(g.studentId).includes(this.gradeSearch));
  }

  gradeCount(examId: number): number { return this.grades.filter(g => g.examId === examId).length; }

  gradeBadge(grade: string): string {
    const map: any = { A: 'bg-success', B: 'bg-primary', C: 'bg-warning text-dark', D: 'bg-orange', F: 'bg-danger' };
    return map[grade] || 'bg-secondary';
  }

  resetExam(): void { this.examEditId = null; this.examForm = { courseId: '', type: 'QUIZ', date: '', status: 'SCHEDULED' }; }
  resetGrade(): void { this.gradeEditId = null; this.gradeForm = { examId: '', studentId: '', score: 0, grade: '', status: 'PASS' }; }

  editExam(e: any): void { this.examEditId = e.examId; this.examForm = { courseId: e.courseId, type: e.type, date: e.date, status: e.status }; this.showExamModal = true; }
  editGrade(g: any): void { this.gradeEditId = g.gradeId; this.gradeForm = { examId: g.examId, studentId: g.studentId, score: g.score, grade: g.grade, status: g.status }; this.showGradeModal = true; }

  saveExam(): void {
    const obs = this.examEditId ? this.api.updateExam(this.examEditId, this.examForm) : this.api.createExam(this.examForm);
    obs.subscribe({ next: () => { this.toast.show('Exam saved', 'success'); this.showExamModal = false; this.load(); }, error: () => this.toast.show('Failed', 'error') });
  }

  saveGrade(): void {
    const obs = this.gradeEditId ? this.api.updateGrade(this.gradeEditId, this.gradeForm) : this.api.createGrade(this.gradeForm);
    obs.subscribe({ next: () => { this.toast.show('Grade saved', 'success'); this.showGradeModal = false; this.load(); }, error: () => this.toast.show('Failed', 'error') });
  }

  deleteExam(id: number): void {
    this.api.deleteExam(id).subscribe({ next: () => { this.toast.show('Exam deleted', 'success'); this.load(); }, error: () => this.toast.show('Failed', 'error') });
  }
}
