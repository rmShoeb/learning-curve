import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavigationItem, DocMetadata } from '@core/models/doc-metadata.model';
import { LoggerService } from '@core/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly logger = inject(LoggerService);

  // Using signals for reactive state management (Angular 19 best practice)
  private readonly navigationItems = signal<NavigationItem[]>([]);
  private readonly currentRoute = signal<string>('');
  private readonly loading = signal<boolean>(true);

  // Public read-only signals
  readonly navigation = this.navigationItems.asReadonly();
  readonly activeRoute = this.currentRoute.asReadonly();
  readonly isLoading = this.loading.asReadonly();

  constructor() {
    this.loadNavigation();
    this.subscribeToRouteChanges();
  }

  /**
   * Load navigation structure from auto-generated JSON file
   * The JSON file is generated at build time by scanning the docs folder
   */
  private loadNavigation(): void {
    this.loading.set(true);

    this.http.get<NavigationItem[]>('assets/docs-navigation.json').subscribe({
      next: (navigation) => {
        this.navigationItems.set(navigation);
        this.loading.set(false);
        this.logger.info('Navigation loaded', `${navigation.length} items`);
      },
      error: (error) => {
        this.logger.error('Failed to load navigation', error);
        // Fallback to minimal navigation if JSON fails to load
        this.navigationItems.set([
          {
            label: 'Home',
            route: '/'
          }
        ]);
        this.loading.set(false);
      }
    });
  }

  /**
   * Subscribe to router events to track active route
   */
  private subscribeToRouteChanges(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Use the current router URL which includes encoding
        this.setActiveRoute(this.router.url);
      });

    // Set initial route
    this.setActiveRoute(this.router.url);
  }

  /**
   * Set current active route and auto-expand parent sections
   */
  setActiveRoute(route: string): void {
    this.currentRoute.set(route);
    this.autoExpandActiveSection(route);
  }

  /**
   * Auto-expand parent sections that contain the active route
   */
  private autoExpandActiveSection(route: string): void {
    const items = this.navigationItems();
    const normalizedRoute = decodeURIComponent(route);

    const checkAndExpandParent = (items: NavigationItem[]): boolean => {
      for (const item of items) {
        if (item.children) {
          // Check if any child matches the route (normalize both for comparison)
          const hasActiveChild = item.children.some(child =>
            child.route && decodeURIComponent(child.route) === normalizedRoute
          );

          if (hasActiveChild) {
            item.expanded = true;
            return true;
          }

          // Recursively check nested children
          if (checkAndExpandParent(item.children)) {
            item.expanded = true;
            return true;
          }
        }
      }
      return false;
    };

    checkAndExpandParent(items);
    this.navigationItems.set([...items]); // Trigger update
  }

  /**
   * Toggle navigation item expanded state
   */
  toggleItem(item: NavigationItem): void {
    item.expanded = !item.expanded;
    this.navigationItems.set([...this.navigationItems()]);
  }

  /**
   * Check if a route is currently active
   * Handles URL encoding differences between stored routes and current URL
   */
  isRouteActive(route?: string): boolean {
    if (!route) return false;
    const current = this.currentRoute();

    // Normalize both routes for comparison
    // The current route from router.url is encoded (/Tips%20%26%20Tricks)
    // The stored route from JSON is decoded (/Tips & Tricks)
    const normalizedCurrent = decodeURIComponent(current);
    const normalizedRoute = decodeURIComponent(route);

    const isActive = normalizedCurrent === normalizedRoute;

    return isActive;
  }

  /**
   * Check if a parent item has an active child
   */
  hasActiveChild(item: NavigationItem): boolean {
    if (!item.children) return false;

    const currentRoute = this.currentRoute();
    const normalizedCurrent = decodeURIComponent(currentRoute);

    const checkChildren = (children: NavigationItem[]): boolean => {
      for (const child of children) {
        if (child.route && decodeURIComponent(child.route) === normalizedCurrent) {
          return true;
        }
        if (child.children && checkChildren(child.children)) {
          return true;
        }
      }
      return false;
    };

    return checkChildren(item.children);
  }

  /**
   * Clear active route (useful for error pages)
   */
  clearActiveRoute(): void {
    this.currentRoute.set('');
  }
}
