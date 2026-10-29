/**
 * A single step of a visible breadcrumb trail. The same array is rendered by
 * `Breadcrumbs.astro` and emitted as `BreadcrumbList` in the layout, so the
 * structured data always matches what visitors see.
 */
export interface BreadcrumbItem {
  name: string;
  /** Root-relative path, e.g. "/services". */
  path: string;
}
