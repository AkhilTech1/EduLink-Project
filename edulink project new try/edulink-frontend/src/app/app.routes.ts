import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/auth/login.component';
import { StudentRegisterComponent } from './components/auth/student-register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin/admin-users.component';
import { AdminStaffComponent } from './components/admin/admin-staff.component';
import { AdminCoursesComponent } from './components/admin/admin-courses.component';
import { AdminStudentsComponent } from './components/admin/admin-students.component';
import { AdminAttendanceComponent } from './components/admin/admin-attendance.component';
import { AdminExamsComponent } from './components/admin/admin-exams.component';
import { AdminComplianceComponent } from './components/admin/admin-compliance.component';
import { AdminReportsComponent } from './components/admin/admin-reports.component';
import { AdminNotificationsComponent } from './components/admin/admin-notifications.component';
import { AdminApprovalsComponent } from './components/admin/admin-approvals.component';
import { TeacherMaterialsComponent } from './components/teacher/teacher-materials.component';
import { TeacherPerformanceComponent } from './components/teacher/teacher-performance.component';
import { TeacherDashboardComponent } from './components/teacher/teacher-dashboard.component';
import { TeacherStudentsComponent } from './components/teacher/teacher-students.component';
import { TeacherScheduleComponent } from './components/teacher/teacher-schedule.component';
import { TeacherGradesComponent } from './components/teacher/teacher-grades.component';
import { TeacherExamsComponent } from './components/teacher/teacher-exams.component';
import { StudentDashboardComponent } from './components/student/student-dashboard.component';
import { StudentProfileComponent } from './components/student/student-profile.component';
import { StudentCoursesComponent } from './components/student/student-courses.component';
import { StudentLearningComponent } from './components/student/student-learning.component';
import { StudentGradesComponent } from './components/student/student-grades.component';
import { StudentPerformanceComponent } from './components/student/student-performance.component';
import { StudentAttendanceComponent } from './components/student/student-attendance.component';
import { StudentExamsComponent } from './components/student/student-exams.component';
import { StudentNotificationsComponent } from './components/student/student-notifications.component';
import { StudentReportsComponent } from './components/student/student-reports.component';
import { StudentCalendarComponent } from './components/student/student-calendar.component';
import { DashboardComponent } from './components/shared/dashboard.component';
import { ComplianceRecordsComponent } from './components/compliance/compliance-records.component';
import { ComplianceAuditsComponent } from './components/compliance/compliance-audits.component';
import { RegulatorComplianceComponent } from './components/regulator/regulator-compliance.component';
import { RegulatorAuditsComponent } from './components/regulator/regulator-audits.component';

const guard = [authGuard];

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register/student', component: StudentRegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: guard,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'admin/users', component: AdminUsersComponent },
      { path: 'admin/staff', component: AdminStaffComponent },
      { path: 'admin/approvals', component: AdminApprovalsComponent },
      { path: 'admin/students', component: AdminStudentsComponent },
      { path: 'admin/courses', component: AdminCoursesComponent },
      { path: 'admin/attendance', component: AdminAttendanceComponent },
      { path: 'admin/exams', component: AdminExamsComponent },
      { path: 'admin/compliance', component: AdminComplianceComponent },
      { path: 'admin/reports', component: AdminReportsComponent },
      { path: 'admin/notifications', component: AdminNotificationsComponent },
      { path: 'teacher/dashboard', component: TeacherDashboardComponent },
      { path: 'teacher/courses', component: AdminCoursesComponent },
      { path: 'teacher/materials', component: TeacherMaterialsComponent },
      { path: 'teacher/exams', component: TeacherExamsComponent },
      { path: 'teacher/attendance', component: AdminAttendanceComponent },
      { path: 'teacher/students', component: TeacherStudentsComponent },
      { path: 'teacher/performance', component: TeacherPerformanceComponent },
      { path: 'teacher/schedule', component: TeacherScheduleComponent },
      { path: 'teacher/grades', component: TeacherGradesComponent },
      { path: 'student/dashboard', component: StudentDashboardComponent },
      { path: 'student/profile', component: StudentProfileComponent },
      { path: 'student/courses', component: StudentCoursesComponent },
      { path: 'student/learning', component: StudentLearningComponent },
      { path: 'student/exams', component: StudentExamsComponent },
      { path: 'student/grades', component: StudentGradesComponent },
      { path: 'student/attendance', component: StudentAttendanceComponent },
      { path: 'student/performance', component: StudentPerformanceComponent },
      { path: 'student/notifications', component: StudentNotificationsComponent },
      { path: 'student/reports', component: StudentReportsComponent },
      { path: 'student/calendar', component: StudentCalendarComponent },
      { path: 'compliance/courses', component: AdminCoursesComponent },
      { path: 'compliance/students', component: AdminStudentsComponent },
      { path: 'compliance/records', component: ComplianceRecordsComponent },
      { path: 'compliance/audits', component: ComplianceAuditsComponent },
      { path: 'regulator/compliance', component: RegulatorComplianceComponent },
      { path: 'regulator/audits', component: RegulatorAuditsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
