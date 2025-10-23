import { RenderMode, ServerRoute } from '@angular/ssr';

// Explicit server routes for prerender extraction to avoid wildcard-related issues
export const serverRoutes: ServerRoute[] = [
	{ path: '/', renderMode: RenderMode.Prerender },
	//{ path: '/inicio', renderMode: RenderMode.Prerender },
	{ path: '/productos', renderMode: RenderMode.Prerender },
	{ path: '/productos/:id', renderMode: RenderMode.Prerender },
	{ path: '/materiales', renderMode: RenderMode.Prerender },
	{ path: '/cursos', renderMode: RenderMode.Prerender },
	{ path: '/carrito', renderMode: RenderMode.Prerender },
	{ path: '/checkout', renderMode: RenderMode.Prerender },
	{ path: '/admin', renderMode: RenderMode.Prerender }
];
