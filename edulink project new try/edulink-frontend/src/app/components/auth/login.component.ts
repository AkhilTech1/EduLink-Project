import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ThemeService } from '../../services/theme.service';
import { ToastComponent } from '../shared/toast.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ToastComponent],
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0a1628 0%, #0d2b4e 40%, #0a3d62 70%, #1a5276 100%);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }
    .login-page::before {
      content: '';
      position: absolute;
      width: 500px; height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%);
      top: -100px; left: -100px;
      pointer-events: none;
    }
    .login-page::after {
      content: '';
      position: absolute;
      width: 400px; height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%);
      bottom: -80px; right: -80px;
      pointer-events: none;
    }
    .login-box {
      display: flex;
      width: 100%;
      max-width: 920px;
      min-height: 540px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.5);
      position: relative;
      z-index: 1;
    }
    /* ── Left Panel ── */
    .left-panel {
      flex: 1.1;
      background: linear-gradient(160deg, rgba(14,165,233,0.15) 0%, rgba(99,102,241,0.1) 100%);
      backdrop-filter: blur(2px);
      border-right: 1px solid rgba(255,255,255,0.08);
      padding: 52px 44px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: #fff;
    }
    .brand-logo { font-size: 2.8rem; margin-bottom: 6px; }
    .brand-name {
      font-size: 2.6rem;
      font-weight: 800;
      letter-spacing: 2px;
      background: linear-gradient(90deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 6px;
    }
    .brand-tagline {
      font-size: 0.95rem;
      color: rgba(255,255,255,0.55);
      font-style: italic;
      margin-bottom: 36px;
      letter-spacing: 0.3px;
    }
    .feature {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 22px;
    }
    .feature-icon {
      width: 40px; height: 40px;
      border-radius: 10px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    .feature-title { font-size: 0.9rem; font-weight: 700; color: #e2e8f0; margin-bottom: 2px; }
    .feature-desc { font-size: 0.78rem; color: rgba(255,255,255,0.45); line-height: 1.4; }
    .left-footer {
      margin-top: auto;
      padding-top: 32px;
      font-size: 0.72rem;
      color: rgba(255,255,255,0.25);
    }
    /* ── Right Panel ── */
    .right-panel {
      flex: 1;
      background: #ffffff;
      padding: 52px 44px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .right-panel h3 {
      font-size: 1.6rem;
      font-weight: 800;
      color: #0a1628;
      margin-bottom: 4px;
      letter-spacing: -0.3px;
    }
    .right-panel .sub { font-size: 0.875rem; color: #64748b; margin-bottom: 32px; }
    .field-label { font-size: 0.78rem; font-weight: 700; color: #374151; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 6px; display: block; }
    .field-input {
      width: 100%;
      padding: 11px 14px;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      font-size: 0.9rem;
      color: #0a1628;
      background: #f8fafc;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      margin-bottom: 20px;
    }
    .field-input:focus {
      border-color: #0ea5e9;
      box-shadow: 0 0 0 3px rgba(14,165,233,0.15);
      background: #fff;
    }
    .btn-login {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.15s;
      box-shadow: 0 4px 14px rgba(14,165,233,0.35);
      letter-spacing: 0.3px;
    }
    .btn-login:hover { opacity: 0.92; transform: translateY(-1px); }
    .btn-login:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
    .divider { border-top: 1px solid #e2e8f0; margin: 24px 0; }
    .btn-register {
      width: 100%;
      padding: 10px;
      background: transparent;
      color: #0ea5e9;
      border: 1.5px solid #0ea5e9;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      display: block;
      text-align: center;
    }
    .btn-register:hover { background: rgba(14,165,233,0.06); color: #0284c7; }
    .theme-btn {
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 0.78rem;
      cursor: pointer;
      margin-top: 16px;
      display: block;
      width: 100%;
      text-align: center;
    }
    @media (max-width: 640px) {
      .left-panel { display: none; }
      .right-panel { padding: 40px 28px; border-radius: 20px; }
    }
  `],
  template: `
    <div class="login-page">
      <div class="login-box">

        <!-- Left: Project Info -->
        <div class="left-panel">
          <div class="brand-logo">🎓</div>
          <div class="brand-name">EduLink</div>
          <div class="brand-tagline">Connecting Education, Empowering Futures</div>

          <div class="feature">
            <div class="feature-icon">📚</div>
            <div>
              <div class="feature-title">Unified Learning Platform</div>
              <div class="feature-desc">Manage courses, assignments and study materials all in one place.</div>
            </div>
          </div>

          <div class="feature">
            <div class="feature-icon">📊</div>
            <div>
              <div class="feature-title">Real-time Analytics</div>
              <div class="feature-desc">Track student performance, attendance and academic progress instantly.</div>
            </div>
          </div>

          <div class="feature">
            <div class="feature-icon">🔔</div>
            <div>
              <div class="feature-title">Smart Notifications</div>
              <div class="feature-desc">Stay updated with exam schedules, grades and announcements.</div>
            </div>
          </div>

          <div class="feature">
            <div class="feature-icon">🛡️</div>
            <div>
              <div class="feature-title">Role-based Access</div>
              <div class="feature-desc">Secure dedicated portals for Admins, Teachers and Students.</div>
            </div>
          </div>

          <div class="left-footer">© 2025 EduLink. All rights reserved.</div>
        </div>

        <!-- Right: Login Form -->
        <div class="right-panel">
          <h3>Welcome Back 👋</h3>
          <p class="sub">Sign in to your EduLink account</p>

          <form (ngSubmit)="onLogin()">
            <label class="field-label">Email Address</label>
            <input class="field-input" type="email" [(ngModel)]="email" name="email" placeholder="you@example.com" required>

            <label class="field-label">Password</label>
            <input class="field-input" type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required>

            <div class="rounded p-3 mb-3" *ngIf="statusMsg"
              [ngClass]="statusMsg.type==='pending' ? 'alert-warning' : 'alert-danger'"
              style="font-size:0.82rem">
              <span *ngIf="statusMsg.type==='pending'">⏳ </span>
              <span *ngIf="statusMsg.type==='rejected'">❌ </span>
              {{ statusMsg.text }}
            </div>

            <button type="submit" class="btn-login" [disabled]="loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <div class="divider"></div>

          <p style="font-size:0.8rem;color:#94a3b8;text-align:center;margin-bottom:10px">New student? Create your account</p>
          <a routerLink="/register/student" class="btn-register">🎒 Student Registration</a>

          <button class="theme-btn" (click)="toggleTheme()">
            {{ isDark ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode' }}
          </button>
        </div>

      </div>
    </div>
    <app-toast></app-toast>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  isDark = false;
  statusMsg: { type: string; text: string } | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService,
    private theme: ThemeService,
    private cdr: ChangeDetectorRef
  ) {
    this.isDark = this.theme.isDark();
  }

  onLogin(): void {
    this.statusMsg = null;
    this.loading = true;

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: res => {
        this.toast.show(`Welcome back, ${res.name || res.email}!`, 'success');
        const route = res.role === 'STUDENT' ? '/student/dashboard' : res.role === 'TEACHER' ? '/teacher/dashboard' : '/dashboard';
        setTimeout(() => this.router.navigate([route]), 500);
      },
      error: (err) => {
        this.loading = false;
        const msg: string = err?.error?.message || '';

        if (msg.toLowerCase().includes('under review') || msg.toLowerCase().includes('pending')) {
          this.statusMsg = { type: 'pending', text: 'Your registration is still under review. Please wait for admin approval.' };
        } else if (msg.toLowerCase().includes('rejected')) {
          this.statusMsg = { type: 'rejected', text: 'Your registration has been rejected. Please contact the administrator.' };
        } else {
          this.toast.show('Invalid credentials. Please try again.', 'error');
        }
        this.cdr.detectChanges();
      }
    });
  }

  toggleTheme(): void {
    this.theme.toggle();
    this.isDark = this.theme.isDark();
  }
}
