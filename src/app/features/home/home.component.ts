import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, PLATFORM_ID, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { FeedbackModalComponent } from '../../shared/components/feedback-modal/feedback-modal.component';
import { ProjectCard } from '../../core/models/project.model';
import { PublicSettings } from '../../core/models/settings.model';
import { Testimonial } from '../../core/models/testimonial.model';
import { Certificate } from '../../core/models/certificate.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, FeedbackModalComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly apiService = inject(ApiService);
  private readonly seoService = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('ambientCanvas') ambientCanvasRef?: ElementRef<HTMLCanvasElement>;

  readonly isFeedbackModalOpen = signal(false);
  readonly activeHeroTab = signal<'visual' | 'code'>('visual');

  // Ambient network canvas animation state
  private animFrameId: number | null = null;
  private resizeListener?: () => void;
  private mouseMoveListener?: (e: MouseEvent) => void;

  // Typewriter dynamic headline signal
  readonly displayedHeadline = signal<string>('Building Enterprise-Grade .NET & Angular Solutions');
  private typewriterTimeout: any = null;
  private currentPhraseIndex = 0;
  private currentCharIndex = 0;
  private isDeleting = false;

  // Settings signal
  readonly settings = signal<PublicSettings>({
    fullName: 'Shahid Hussain',
    professionalTitle: 'Senior Full-Stack .NET & Angular Developer',
    oneLineBio: 'Architecting resilient enterprise microservices, clean CQRS backends, and responsive modern web apps.',
    aboutSummary:
      'Senior software engineer with deep expertise in .NET 10, ASP.NET Core Web API, Clean Architecture, MediatR CQRS, EF Core, and Angular 22. Passionate about domain-driven design, high-throughput microservices, sub-second page performance, and clean code that scales.',
    availabilityStatus: 'Open to Work',
    currentLocation: 'Pakistan',
    cvUrl: '/uploads/Shahid_Hussain_CV.pdf',
    whatsAppNumber: '923000000000',
    heroCodeTitle: 'ShahidPortfolio.sln - Clean Architecture',
    heroCodeSnippet: `public class SolutionArchitect
{
    public string Name => "Shahid Hussain";
    public string[] CoreStack => new[]
    {
        ".NET 10 / C#",
        "ASP.NET Core Web API",
        "Clean Architecture & CQRS",
        "Angular 22 (SSR)",
        "SQL Server & EF Core"
    };
    public bool DeliverCleanCode() => true;
}`,
    heroBadgesJson: '["Clean Architecture", "CQRS / MediatR", "Angular 22 Signals"]',
    profilePhotoUrl: '/uploads/Shahid_Profile.jpg',
    heroImageUrl: '',
    heroHeadlinesJson: '["Building Enterprise-Grade .NET & Angular Solutions", "Architecting Scalable Clean Architecture & CQRS Systems", "Engineering Resilient Cloud-Ready Microservices"]',
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com/shahid08569', iconKey: 'github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/shahidhussain', iconKey: 'linkedin' },
    ],
  });

  readonly featuredProjects = signal<ProjectCard[]>([
    {
      id: '1',
      title: 'Enterprise E-Commerce API & Management Portal',
      slug: 'enterprise-ecommerce-portal',
      summary:
        'Scalable multi-tenant e-commerce system built with .NET Clean Architecture, EF Core, SQL Server, and an Angular admin dashboard.',
      problemStatement:
        'Traditional monolith e-commerce backends suffer from high database contention and coupled business logic during peak promotional flash sales.',
      solutionStatement:
        'Engineered a decoupled Clean Architecture backend using CQRS and MediatR to isolate read and write workloads, integrated with Redis cache and optimistic concurrency in EF Core.',
      architectureOverview:
        'Layered Clean Architecture: Domain Core -> Application CQRS Commands/Queries -> Infrastructure SQL Server Persistence -> Web API with JWT Auth and Rate Limiting.',
      keyMetrics:
        'Maintained sub-90ms response times under 5,000 concurrent product catalog queries; achieved 99.9% uptime during load testing.',
      thumbnailUrl: '',
      liveUrl: 'https://github.com/shahid08569/shahidPorfolioBackend',
      githubUrl: 'https://github.com/shahid08569/shahidPorfolioBackend',
      techStackJson: '[]',
      techStack: ['.NET 10', 'ASP.NET Core', 'Angular 22', 'SQL Server', 'MediatR', 'Redis'],
      isFeatured: true,
      isCaseStudy: true,
      displayOrder: 1,
    },
  ]);

  readonly topSkills = signal<{ name: string; category: string; icon: string }[]>([
    { name: '.NET 10 / C#', category: 'Backend', icon: 'server' },
    { name: 'ASP.NET Core Web API', category: 'Backend', icon: 'server' },
    { name: 'Clean Architecture & CQRS', category: 'Architecture', icon: 'code' },
    { name: 'Angular 22 & TypeScript', category: 'Frontend', icon: 'code' },
    { name: 'SQL Server & EF Core', category: 'Database', icon: 'database' },
    { name: 'Docker & Microservices', category: 'DevOps', icon: 'terminal' },
  ]);

  readonly testimonials = signal<Testimonial[]>([]);
  readonly certificates = signal<Certificate[]>([]);

  readonly keyMetrics = [
    { value: '5+', label: 'Years Experience' },
    { value: '25+', label: 'Enterprise Systems' },
    { value: '99.9%', label: 'Architecture Uptime' },
    { value: '< 80ms', label: 'Median API Latency' },
  ];

  get heroHeadlines(): string[] {
    try {
      if (this.settings()?.heroHeadlinesJson) {
        const parsed = JSON.parse(this.settings().heroHeadlinesJson!);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      'Building Enterprise-Grade .NET & Angular Solutions',
      'Architecting Scalable Clean Architecture & CQRS Systems',
      'Engineering Resilient Cloud-Ready Microservices',
      'Delivering Mission-Critical Web Platforms',
    ];
  }

  get heroBadges(): string[] {
    try {
      if (this.settings().heroBadgesJson) {
        const parsed = JSON.parse(this.settings().heroBadgesJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ['Clean Architecture', 'CQRS / MediatR', 'Angular 22 Signals'];
  }

  get whatsAppUrl(): string {
    const raw = this.settings().whatsAppNumber || '923000000000';
    const num = raw.replace(/[^0-9]/g, '');
    const text = encodeURIComponent('Hello Shahid, I reviewed your developer portfolio and would like to connect about an opportunity.');
    return `https://wa.me/${num}?text=${text}`;
  }

  get cvDownloadUrl(): string {
    const url = this.settings().cvUrl;
    const resolved = this.apiService.resolveMediaUrl(url);
    return resolved || `${environment.apiUrl}/media/cv`;
  }

  readonly hasProfileImageError = signal(false);
  readonly hasHeroImageError = signal(false);

  get profilePhotoUrl(): string {
    const raw = this.settings()?.profilePhotoUrl || '/uploads/Shahid_Profile.jpg';
    return this.apiService.resolveMediaUrl(raw);
  }

  get heroImageUrl(): string {
    const raw = this.settings()?.heroImageUrl;
    if (raw) return this.apiService.resolveMediaUrl(raw);
    // If no dedicated hero image is uploaded, use the high-res profile photo
    return this.profilePhotoUrl;
  }

  onProfileImageError(): void {
    this.hasProfileImageError.set(true);
  }

  onHeroImageError(): void {
    this.hasHeroImageError.set(true);
  }

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Senior Full-Stack .NET & Angular Developer',
      description:
        'Portfolio of Shahid Hussain - Senior Full-Stack .NET & Angular Developer specializing in Clean Architecture, CQRS, and enterprise web solutions.',
    });

    this.startTypewriter();
    this.loadData();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initAmbientCanvas();
    }
  }

  ngOnDestroy(): void {
    if (this.typewriterTimeout) {
      clearTimeout(this.typewriterTimeout);
    }
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    if (this.mouseMoveListener) {
      window.removeEventListener('mousemove', this.mouseMoveListener);
    }
  }

  private initAmbientCanvas(): void {
    const canvas = this.ambientCanvasRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const setupDimensions = () => {
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    setupDimensions();

    const onResize = () => {
      if (!canvas) return;
      setupDimensions();
    };
    window.addEventListener('resize', onResize, { passive: true });
    this.resizeListener = onResize;

    // Interactive Mouse Coordinates
    let mouseX = -2000;
    let mouseY = -2000;
    let targetMouseX = -2000;
    let targetMouseY = -2000;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    this.mouseMoveListener = onMouseMove;

    // ── Interactive Constellation Nodes & Energy Sparks ──────
    interface ConstellationNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      pulsePhase: number;
      pulseSpeed: number;
    }

    const nodeColors = ['#d4a373', '#c08d5c', '#8f9d65', '#ccd5ae', '#b88350'];
    const nodeCount = 52;
    const nodes: ConstellationNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || window.innerHeight),
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.2 + 1.4,
        color: nodeColors[i % nodeColors.length],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.025,
      });
    }

    // ── Floating Ambient Light Sparks ──────────────────────────
    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      alphaSpeed: number;
      color: string;
    }

    const sparkColors = ['#d4a373', '#c08d5c', '#a3b178', '#ccd5ae'];
    const sparkCount = 42;
    const sparks: Spark[] = [];

    for (let i = 0; i < sparkCount; i++) {
      sparks.push({
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || window.innerHeight),
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.4 - Math.random() * 0.5,
        size: Math.random() * 2.8 + 1.2,
        alpha: Math.random() * 0.6 + 0.25,
        alphaSpeed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        color: sparkColors[i % sparkColors.length],
      });
    }

    // ── Floating Geometric Polygonal Shapes ────────────────────
    interface GeoShape {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      rot: number;
      rotSpeed: number;
      sides: number;
      alpha: number;
    }

    const geoShapes: GeoShape[] = [
      { x: width * 0.15, y: height * 0.25, vx: 0.15, vy: -0.1, size: 28, rot: 0, rotSpeed: 0.008, sides: 6, alpha: 0.22 },
      { x: width * 0.85, y: height * 0.35, vx: -0.12, vy: 0.12, size: 36, rot: 0.5, rotSpeed: -0.006, sides: 4, alpha: 0.18 },
      { x: width * 0.72, y: height * 0.75, vx: -0.1, vy: -0.15, size: 32, rot: 1.2, rotSpeed: 0.007, sides: 6, alpha: 0.2 },
      { x: width * 0.28, y: height * 0.82, vx: 0.14, vy: 0.08, size: 24, rot: 0.8, rotSpeed: -0.009, sides: 3, alpha: 0.22 },
    ];

    // ── 3D Topological Perspective Wave Parameters ────────────
    const rows = 22;
    const cols = 34;
    let time = 0;

    const render = () => {
      time += 0.024;

      // Smooth mouse easing
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw 3D Topological Perspective Wave Grid
      const perspective = 380;
      const fovCenterY = height * 0.7;
      const fovCenterX = width * 0.5;
      const gridSpacingX = (width * 1.35) / cols;
      const gridSpacingZ = 34;

      // Calculate projected 3D points
      const points: { x: number; y: number; elevation: number }[][] = [];

      for (let r = 0; r < rows; r++) {
        points[r] = [];
        const z = (r + 1) * gridSpacingZ;
        const scale = perspective / (perspective + z);

        for (let c = 0; c < cols; c++) {
          const rawX = (c - cols / 2) * gridSpacingX;

          // Multi-frequency undulating wave physics
          const wave1 = Math.sin(c * 0.22 + time * 1.1) * Math.cos(r * 0.26 + time * 0.85);
          const wave2 = Math.sin(c * 0.12 - r * 0.15 + time * 0.65) * 0.5;
          let elevation = (wave1 + wave2) * (34 + r * 1.8);

          // Screen projection
          const projX = fovCenterX + rawX * scale;
          const projY = fovCenterY + (z * 0.35 - elevation) * scale;

          // Interactive mouse disturbance / shockwave ripple
          const dx = projX - mouseX;
          const dy = projY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 240) {
            const ripple = Math.sin(dist * 0.04 - time * 4) * Math.max(0, 1 - dist / 240);
            elevation += ripple * 45;
          }

          points[r][c] = {
            x: projX,
            y: fovCenterY + (z * 0.35 - elevation) * scale,
            elevation,
          };
        }
      }

      // Render horizontal wave ribbon lines
      for (let r = 0; r < rows; r++) {
        const rowDepthRatio = 1 - r / rows;
        const alpha = Math.max(0.1, rowDepthRatio * 0.45);

        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const pt = points[r][c];
          if (c === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            const prev = points[r][c - 1];
            const cx = (prev.x + pt.x) / 2;
            const cy = (prev.y + pt.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
          }
        }

        // Dynamic warm gradient stroke
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, `rgba(204, 213, 174, 0)`);
        grad.addColorStop(0.2, `rgba(212, 163, 115, ${alpha * 0.75})`);
        grad.addColorStop(0.5, `rgba(192, 141, 92, ${alpha * 1.15})`);
        grad.addColorStop(0.8, `rgba(163, 177, 120, ${alpha * 0.85})`);
        grad.addColorStop(1, `rgba(204, 213, 174, 0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(1, (1 - r / rows) * 2.2);
        ctx.stroke();

        // Glowing crest beads along wave lines
        if (r % 3 === 0) {
          for (let c = 0; c < cols; c += 4) {
            const pt = points[r][c];
            if (pt.x > 0 && pt.x < width) {
              ctx.fillStyle = pt.elevation > 0 ? '#d4a373' : '#8f9d65';
              ctx.globalAlpha = Math.max(0.2, alpha * 0.9);
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, Math.max(1.3, (1 - r / rows) * 3), 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
      ctx.globalAlpha = 1;

      // 2. Draw Interactive Constellation Nodes & Connecting Neural Lines
      const maxConnectDist = 140;
      const mouseConnectDist = 180;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.pulsePhase += n.pulseSpeed;

        // Bounce from walls
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Mouse attraction physics
        const mdx = mouseX - n.x;
        const mdy = mouseY - n.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < mouseConnectDist && mDist > 0) {
          const force = (1 - mDist / mouseConnectDist) * 0.8;
          n.x += (mdx / mDist) * force;
          n.y += (mdy / mDist) * force;

          // Draw bright interactive beam to cursor
          ctx.strokeStyle = `rgba(212, 163, 115, ${(1 - mDist / mouseConnectDist) * 0.65})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }

        // Connect nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < maxConnectDist) {
            const alpha = (1 - d / maxConnectDist) * 0.42;
            ctx.strokeStyle = `rgba(192, 141, 92, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }

        // Draw node with pulsing glow ring
        const pulse = Math.sin(n.pulsePhase) * 0.35 + 1;
        ctx.fillStyle = n.color;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Outer radiant ring
        ctx.strokeStyle = n.color;
        ctx.globalAlpha = 0.28;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 2.4 * pulse, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // 3. Draw Floating Geometric Polygonal Wireframes
      for (const g of geoShapes) {
        g.x += g.vx;
        g.y += g.vy;
        g.rot += g.rotSpeed;

        if (g.x < -40) g.x = width + 40;
        if (g.x > width + 40) g.x = -40;
        if (g.y < -40) g.y = height + 40;
        if (g.y > height + 40) g.y = -40;

        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.rot);
        ctx.strokeStyle = 'rgba(192, 141, 92, ' + g.alpha + ')';
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        for (let s = 0; s < g.sides; s++) {
          const angle = (s / g.sides) * Math.PI * 2;
          const px = Math.cos(angle) * g.size;
          const py = Math.sin(angle) * g.size;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Inner vertex crosslines
        if (g.sides === 4 || g.sides === 6) {
          ctx.strokeStyle = 'rgba(204, 213, 174, ' + (g.alpha * 0.6) + ')';
          ctx.beginPath();
          ctx.moveTo(-g.size * 0.5, 0);
          ctx.lineTo(g.size * 0.5, 0);
          ctx.moveTo(0, -g.size * 0.5);
          ctx.lineTo(0, g.size * 0.5);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 4. Draw Floating Energy Sparks
      for (const s of sparks) {
        s.x += s.vx;
        s.y += s.vy;
        s.alpha += s.alphaSpeed;
        if (s.alpha > 0.8 || s.alpha < 0.2) {
          s.alphaSpeed *= -1;
        }

        // Loop sparks smoothly
        if (s.y < -20) {
          s.y = height + 10;
          s.x = Math.random() * width;
        }
        if (s.x < -20) s.x = width + 10;
        if (s.x > width + 20) s.x = -10;

        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Soft halo
        ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha * 0.35));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      this.animFrameId = requestAnimationFrame(render);
    };

    render();
  }

  private startTypewriter(): void {
    if (this.typewriterTimeout) {
      clearTimeout(this.typewriterTimeout);
    }
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.tickTypewriter();
  }

  private tickTypewriter(): void {
    const phrases = this.heroHeadlines;
    if (!phrases || phrases.length === 0) return;

    const currentPhrase = phrases[this.currentPhraseIndex % phrases.length];

    if (!this.isDeleting) {
      // Forward typing
      this.currentCharIndex++;
      this.displayedHeadline.set(currentPhrase.substring(0, this.currentCharIndex));

      if (this.currentCharIndex >= currentPhrase.length) {
        // Full phrase displayed, wait before erasing
        this.isDeleting = true;
        this.typewriterTimeout = setTimeout(() => this.tickTypewriter(), 2400);
        return;
      }

      const speed = 40 + Math.random() * 35;
      this.typewriterTimeout = setTimeout(() => this.tickTypewriter(), speed);
    } else {
      // Deleting / erasing
      this.currentCharIndex--;
      this.displayedHeadline.set(currentPhrase.substring(0, this.currentCharIndex));

      if (this.currentCharIndex <= 0) {
        // Erased completely, brief pause then next phrase
        this.isDeleting = false;
        this.currentPhraseIndex = (this.currentPhraseIndex + 1) % phrases.length;
        this.typewriterTimeout = setTimeout(() => this.tickTypewriter(), 450);
        return;
      }

      this.typewriterTimeout = setTimeout(() => this.tickTypewriter(), 22);
    }
  }

  loadData(): void {
    this.apiService.getPublicSettings().subscribe({
      next: (res) => {
        if (res.data) {
          this.settings.set(res.data);
          this.hasProfileImageError.set(false);
          this.hasHeroImageError.set(false);
          this.startTypewriter();
        }
      },
      error: () => {},
    });

    this.apiService.getProjects({ isFeatured: true }).subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.featuredProjects.set(res.data);
        }
      },
      error: () => {},
    });

    this.apiService.getTestimonials().subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.testimonials.set(res.data);
        }
      },
      error: () => {},
    });

    this.apiService.getCertificates().subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.certificates.set(res.data as Certificate[]);
        }
      },
      error: () => {},
    });
  }

  openFeedbackModal(): void {
    this.isFeedbackModalOpen.set(true);
  }

  closeFeedbackModal(): void {
    this.isFeedbackModalOpen.set(false);
  }
}
