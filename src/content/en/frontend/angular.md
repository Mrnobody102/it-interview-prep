# Frontend — Angular

## 1. Overview

**Angular** is a TypeScript-based, full-featured front-end framework developed by Google. It uses a component-based architecture with strong typing via TypeScript.

---

## 2. Component

### 2.1. Component Structure

A component controls a portion of the screen through its template.

```typescript
// user.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  name = 'John';
  isActive = true;

  greet(): string {
    return `Hello, ${this.name}!`;
  }
}
```

```html
<!-- user.component.html -->
<div class="user-card">
  <h2>{{ name }}</h2>
  <p>{{ greet() }}</p>
  <button (click)="isActive = !isActive">
    {{ isActive ? 'Active' : 'Inactive' }}
  </button>
</div>
```

### 2.2. Component Lifecycle

| Hook | When it runs |
|------|-------------|
| `ngOnInit` | After Angular first displays the component |
| `ngOnChanges` | When input properties change |
| `ngDoCheck` | On every change detection cycle |
| `ngAfterContentInit` | After projecting content into the component |
| `ngAfterViewInit` | After initializing the component's views |
| `ngOnDestroy` | Just before Angular destroys the component |

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';

export class UserComponent implements OnInit, OnDestroy {
  ngOnInit() {
    console.log('Component initialized');
    this.subscription = this.dataService.getData().subscribe();
  }

  ngOnDestroy() {
    // Cleanup to prevent memory leaks
    this.subscription?.unsubscribe();
  }
}
```

---

## 3. Directives

### 3.1. Structural Directives

Change the DOM structure by adding/removing elements.

```html
<!-- *ngIf — conditional rendering -->
<div *ngIf="isLoggedIn; else guest">
  Welcome, {{ userName }}!
</div>
<ng-template #guest>
  <div>Please log in.</div>
</ng-template>

<!-- *ngFor — loop over collection -->
<li *ngFor="let item of items; let i = index; trackBy: trackById">
  {{ i + 1 }}. {{ item.name }}
</li>

<!-- *ngSwitch — multi-conditional -->
<div [ngSwitch]="userRole">
  <div *ngSwitchCase="'admin'">Admin Panel</div>
  <div *ngSwitchCase="'user'">User Dashboard</div>
  <div *ngSwitchDefault>Guest View</div>
</div>
```

### 3.2. Attribute Directives

Change the appearance or behavior of elements.

```typescript
import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor(el: ElementRef, renderer: Renderer2) {
    renderer.setStyle(el.nativeElement, 'backgroundColor', 'yellow');
  }
}
```

```html
<!-- Custom attribute directive -->
<p appHighlight>Highlighted text</p>

<!-- ngClass — conditional classes -->
<div [ngClass]="{ 'active': isActive, 'disabled': isDisabled }">

<!-- ngStyle — conditional styles -->
<div [ngStyle]="{ 'color': textColor, 'font-size.px': fontSize }">
```

---

## 4. Services & Dependency Injection

### 4.1. Creating a Service

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'    // Singleton across the app
})
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
}
```

### 4.2. Injecting a Service

```typescript
import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-list'
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
}
```

---

## 5. HTTP Client & RxJS

### 5.1. HTTP Calls

```typescript
import { HttpClientModule } from '@angular/common/http';

// In app.config.ts (standalone)
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient()]
};

// Making requests
this.http.get<User[]>('/api/users').subscribe({
  next: data => this.users = data,
  error: err => console.error(err)
});
```

### 5.2. RxJS Operators

```typescript
import { map, filter, catchError, switchMap, debounceTime } from 'rxjs/operators';
import { of } from 'rxjs';

// map — transform data
this.users$ = this.http.get<User[]>('/api/users').pipe(
  map(users => users.map(u => u.name.toUpperCase()))
);

// switchMap — cancel previous request on new one
this.searchTerm$.pipe(
  debounceTime(300),
  switchMap(term => this.userService.search(term)),
  catchError(err => of([]))     // Return empty array on error
);
```

### 5.3. Async Pipe

```html
<!-- Automatically subscribes and unsubscribes -->
<div *ngFor="let user of users$ | async">
  {{ user.name }}
</div>

<!-- With null check -->
<div *ngIf="user$ | async as user">
  <h2>{{ user.name }}</h2>
</div>
```

---

## 6. Forms

### 6.1. Template-driven Forms

```typescript
import { FormsModule } from '@angular/forms';

export class LoginComponent {
  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log(form.value);   // { email: '', password: '' }
    }
  }
}
```

```html
<form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
  <input name="email" ngModel type="email" required>
  <input name="password" ngModel type="password" required>
  <button type="submit" [disabled]="!loginForm.valid">Login</button>
</form>
```

### 6.2. Reactive Forms

```typescript
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

export class RegisterComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      age: [null, [Validators.required, Validators.min(18)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

---

## 7. Routing

### 7.1. Route Configuration

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home.component') },
  { path: 'users', loadChildren: () => import('./users/users.routes') },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent }
];
```

### 7.2. Router Links & Navigation

```html
<!-- Active link styling -->
<a routerLink="/home" routerLinkActive="active">Home</a>
<a routerLink="/users" routerLinkActive="active">Users</a>

<!-- Navigate programmatically -->
<button (click)="goToProfile(user.id)">View Profile</button>
```

```typescript
import { Router, ActivatedRoute } from '@angular/router';

constructor(private router: Router, private route: ActivatedRoute) {}

goToProfile(id: number) {
  this.router.navigate(['/profile', id]);
}

// Read route params
this.route.snapshot.paramMap.get('id');
this.route.snapshot.queryParamMap.get('tab');
}
```

---

## 8. Signals (Angular 16+)

Signals provide a reactive way to manage state with fine-grained change detection.

```typescript
import { signal, computed, effect } from '@angular/core';

// Writable signal
const count = signal(0);
count.set(10);
count.update(c => c + 1);

// Computed signal
const doubled = computed(() => count() * 2);

// Effect — runs when signals change
effect(() => {
  console.log('Count changed:', count());
});
```

```html
<!-- In template -->
<p>Count: {{ count() }}</p>
<p>Doubled: {{ doubled() }}</p>
```

---

## 9. Interview Questions

**Q: What is the difference between a component and a directive?**

> A **component** is a directive with a template. Components create UI elements, while directives modify the behavior or appearance of existing elements without adding new UI.

**Q: What is the purpose of `ChangeDetectionStrategy.OnPush`?**

> It tells Angular to only check the component when its **input references change** (for objects/arrays, reference must change). This significantly improves performance by reducing unnecessary change detection cycles.

**Q: How does dependency injection work in Angular?**

> Angular's DI system creates and injects dependencies (services) into components/services. Services are registered with `providedIn` or in module providers. Angular maintains a dependency injector hierarchy (root, component, directive levels).
