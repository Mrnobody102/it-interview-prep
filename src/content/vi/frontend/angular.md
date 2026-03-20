# Frontend - Angular

## 1. Tổng quan

**Angular** là một **TypeScript-based** full-featured framework từ Google, phù hợp cho enterprise-scale applications.

| Đặc điểm | Mô tả |
|-----------|-------|
| **Framework** | Full-featured (routing, forms, HTTP, DI built-in) |
| **Language** | TypeScript (bắt buộc) |
| **Rendering** | Client-side (SPA) + SSR (Angular Universal) |
| **Change Detection** | Zone.js (default), Signals (mới) |
| **Architecture** | Module-based (NgModule) hoặc Standalone Components |

---

## 2. Angular CLI & Project Structure

### 2.1. Common Commands

```bash
# Tạo project mới
ng new my-app --routing --style=scss
ng new my-app --standalone   # Angular 17+ standalone components

# Tạo components, services, modules
ng generate component user-list
ng generate service user/user-service
ng generate module admin --route admin --module app.module
ng generate component user-card --standalone

# Build & Serve
ng build                    # Build production
ng build --configuration=production
ng serve                    # Dev server (http://localhost:4200)
ng serve --open             # Auto open browser
ng serve --port=4201        # Custom port

# Testing
ng test                     # Karma + Jasmine
ng e2e                      # Protractor (legacy) hoặc Cypress
ng test --code-coverage     # Coverage report

# Other
ng update                   # Update Angular và dependencies
ng add @angular/material    # Add Angular Material
ng lint                     # TSLint/ESLint
```

### 2.2. Project Structure

```
src/
  app/
    components/              # Feature components
      user-list/
        user-list.component.ts
        user-list.component.html
        user-list.component.scss
        user-list.component.spec.ts
    services/                # Services (injectable)
      user.service.ts
    models/                  # Interfaces, types
      user.model.ts
    guards/                  # Route guards
    interceptors/            # HTTP interceptors
    app.component.ts          # Root component
    app.module.ts            # Root module
    app-routing.module.ts    # Routing module
  environments/              # Environment configs
    environment.ts
    environment.prod.ts
  assets/
  styles.scss                # Global styles
```

---

## 3. Components (Standalone - Angular 17+)

### 3.1. Basic Component

```typescript
// user-card.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit, OnDestroy {
  @Input() user!: User;
  @Input() selected = false;

  @Output() userClicked = new EventEmitter<User>();
  @Output() userDeleted = new EventEmitter<number>();

  ngOnInit(): void {
    console.log('Component initialized');
  }

  ngOnDestroy(): void {
    console.log('Component destroyed');
  }

  onClick(): void {
    this.userClicked.emit(this.user);
  }

  onDelete(): void {
    this.userDeleted.emit(this.user.id);
  }
}
```

```html
<!-- user-card.component.html -->
<div class="card" [class.selected]="selected">
  <h3>{{ user.name }}</h3>
  <p>{{ user.email }}</p>
  <p>Age: {{ user.age }}</p>

  <button (click)="onClick()">Select</button>
  <button (click)="onDelete()">Delete</button>
</div>
```

### 3.2. Lifecycle Hooks

| Hook | Thời điểm gọi |
|------|---------------|
| `ngOnChanges` | Khi `@Input` properties thay đổi |
| `ngOnInit` | Sau khi component khởi tạo (lần đầu) |
| `ngDoCheck` | Mỗi change detection cycle |
| `ngAfterContentInit` | Sau khi ng-content được projected |
| `ngAfterContentChecked` | Sau mỗi check ng-content |
| `ngAfterViewInit` | Sau khi view được initialized |
| `ngAfterViewChecked` | Sau mỗi check view |
| `ngOnDestroy` | Trước khi component bị destroy |

---

## 4. Services & Dependency Injection

### 4.1. Service

```typescript
// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'  // Singleton — available app-wide
})
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong'));
  }
}
```

### 4.2. Dependency Injection

```typescript
// Constructor injection (recommended)
@Component({ ... })
export class UserListComponent {
  constructor(
    private userService: UserService,  // DI tự động
    private router: Router,
    private route: ActivatedRoute
  ) {}

// Manual injection (khi cần)
const service = injector.get(UserService);
```

### 4.3. Providers

```typescript
// Different scopes
@Injectable({ providedIn: 'root' })           // App-wide singleton
@Injectable()                                 // New instance mỗi lần inject
@Injectable({ providedIn: 'platform' })       // Platform-wide (testing)
@Injectable({ providedIn: 'any' })           // New instance mỗi module

// Manual provider registration
@NgModule({
  providers: [
    UserService,                              // Class itself
    { provide: API_URL, useValue: '...' },   // Value
    { provide: API_URL, useFactory: () => '...' }, // Factory
    { provide: UserService, useClass: MockUserService }  // Alternative class
  ]
})
```

---

## 5. Routing

### 5.1. Routing Configuration

```typescript
// app-routing.module.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component')
      .then(m => m.HomeComponent),  // Lazy loading
    title: 'Home Page'
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module')  // Lazy load module
      .then(m => m.UsersModule),
    canActivate: [authGuard]
  },
  {
    path: 'user/:id',
    component: UserDetailComponent,
    resolve: { user: userResolver }  // Pre-fetch data
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component'),
    canMatch: [roleGuard('admin')]   // Guard function
  },
  { path: '**', component: NotFoundComponent }
];
```

### 5.2. Navigation

```typescript
// Imperative navigation
constructor(private router: Router) {}

goToUser(id: number): void {
  this.router.navigate(['/user', id]);
}

// With query params
this.router.navigate(['/users'], {
  queryParams: { search: 'huy', page: 1 }
});

// Read route params
constructor(private route: ActivatedRoute) {
  this.route.params.subscribe(params => {
    const id = +params['id'];  // + converts to number
  });

  this.route.queryParams.subscribe(qp => {
    const search = qp['search'];
  });
}
```

### 5.3. Route Guards

```typescript
// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
```

---

## 6. Forms

### 6.1. Reactive Forms

```typescript
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Name">
      <div *ngIf="form.get('name')?.errors?.['required']">Name is required</div>
      <div *ngIf="form.get('name')?.errors?.['minlength']">Min 3 chars</div>

      <input formControlName="email" placeholder="Email" type="email">
      <div *ngIf="form.get('email')?.errors?.['email']">Invalid email</div>

      <button type="submit" [disabled]="form.invalid">Submit</button>
    </form>
  `
})
export class UserFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      age: [null, [Validators.min(0), Validators.max(150)]],
      bio: ['']
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);
      this.form.reset();
    }
  }

  // Update form values programmatically
  patchValue(): void {
    this.form.patchValue({ name: 'Huy', email: 'huy@example.com' });
  }

  // Validate specific field
  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
```

### 6.2. Template-driven Forms

```html
<form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)">
  <input
    name="name"
    [(ngModel)]="user.name"
    required
    minlength="3"
    #nameInput="ngModel"
  >
  <div *ngIf="nameInput.invalid && nameInput.touched">Name is required</div>

  <input
    name="email"
    [(ngModel)]="user.email"
    required
    email
    #emailInput="ngModel"
  >

  <button type="submit" [disabled]="userForm.invalid">Submit</button>
</form>
```

---

## 7. RxJS & Observables

### 7.1. Common Operators

```typescript
import { Observable, of, from, interval } from 'rxjs';
import { map, filter, switchMap, catchError, debounceTime,
         distinctUntilChanged, take, takeUntil, mergeMap,
         concatMap, tap, finalize, retry, retryWhen } from 'rxjs/operators';

// Creation
of(1, 2, 3).subscribe(x => console.log(x));
from([1, 2, 3]).subscribe(x => console.log(x));
interval(1000).pipe(take(5)).subscribe(x => console.log(x));

// Filtering
of(1, 2, 3, 4, 5).pipe(
  filter(x => x % 2 === 0),
  map(x => x * 2)
).subscribe(x => console.log(x));  // 4, 8

// Async operations
this.http.get<User[]>('/api/users').pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(search => this.http.get(`/api/users?search=${search}`)),
  retry(3),  // Retry 3 lần khi fail
  catchError(err => {
    console.error(err);
    return of([]);  // Return empty array on error
  }),
  finalize(() => console.log('Request complete'))
).subscribe(users => this.users = users);
```

### 7.2. Subscription Management

```typescript
// Take until destroy pattern
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({ ... })
export class UserListComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.userService.getUsers().pipe(
      takeUntil(this.destroy$)
    ).subscribe(users => this.users = users);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// Async pipe (auto unsubscribe)
@Component({ ... })
export class UserListComponent {
  users$: Observable<User[]>;

  constructor(private userService: UserService) {
    this.users$ = this.userService.getUsers();
  }
}
```

```html
<!-- Async pipe — tự động unsubscribe khi component destroy -->
<ul>
  <li *ngFor="let user of users$ | async">{{ user.name }}</li>
</ul>
```

---

## 8. Angular Signals (v17+)

```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <p>Count: {{ count() }}</p>
    <p>Doubled: {{ doubled() }}</p>
    <button (click)="increment()">+</button>
    <button (click)="decrement()">-</button>
  `
})
export class CounterComponent {
  count = signal(0);

  // Computed signal — derived value, auto-updates
  doubled = computed(() => this.count() * 2);

  // Effect — side effects
  constructor() {
    effect(() => {
      console.log('Count changed:', this.count());
      document.title = `Count: ${this.count()}`;
    });
  }

  increment(): void {
    this.count.update(c => c + 1);
  }

  decrement(): void {
    this.count.update(c => c - 1);
  }
}
```

---

## 9. Directives

### 9.1. Built-in Directives

| Directive | Mô tả |
|-----------|-------|
| `*ngIf` | Conditional rendering |
| `*ngFor` | Loop through collection |
| `*ngSwitch` | Switch-case rendering |
| `ngClass` | Conditional CSS classes |
| `ngStyle` | Conditional inline styles |
| `ngModel` | Two-way binding (forms) |
| `ngTemplateOutlet` | Template reuse |
| `ngContainer` | Structural directive host (no element rendered) |

### 9.2. Custom Directive

```typescript
import { Directive, ElementRef, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @HostBinding('style.backgroundColor') bgColor = 'transparent';

  @HostListener('mouseenter') onMouseEnter(): void {
    this.bgColor = 'yellow';
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.bgColor = 'transparent';
  }
}
```

---

## 10. Common Interview Questions

### Q: Sự khác biệt giữa Component và Directive?

| | Component | Directive |
|--|-----------|-----------|
| **Template** | Có template riêng | Không có template |
| **Element** | Custom element (`<app-xyz>`) | Attribute (`<div appHighlight>`) |
| **Use case** | UI building blocks | Modify element behavior/appearance |

### Q: Change Detection hoạt động như thế nào?

- Angular sử dụng **Zone.js** để detect async operations và trigger change detection.
- Default: **Default** strategy — kiểm tra tất cả components.
- **OnPush** strategy — chỉ kiểm tra khi `@Input` thay đổi, event, observable emit.

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### Q: Sự khác biệt giữa `*ngIf` và `[hidden]`?

| | `*ngIf` | `[hidden]` |
|--|---------|-----------|
| **DOM** | Xóa khỏi DOM | Giữ trong DOM (display: none) |
| **Performance** | Tốt hơn cho expensive content | Giữ listeners/resources |
| **ngIf else** | Hỗ trợ `else template` | Không hỗ trợ |

### Q: Lazy loading là gì và tại sao cần?

- Chỉ load code khi cần (khi route được navigate).
- Giảm initial bundle size, improve load time.
- Dùng `loadComponent` (Angular 17+) hoặc `loadChildren`.

### Q: Interceptors HTTP là gì?

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next.handle(cloned);
  }
}
```
