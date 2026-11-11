import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = ['/', '/aviso-legal', '/privacidad', '/terminos-y-condiciones', '/politica-de-reembolsos', '/creditos'];

test.describe('Rendimiento y arquitectura', () => {
  test('0 KB de JS de frameworks: sin scripts externos ni islas', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('script[src]')).toHaveCount(0);
    await expect(page.locator('astro-island')).toHaveCount(0);
    const inlineBytes = await page
      .locator('script:not([type="application/ld+json"])')
      .evaluateAll((els) => els.reduce((n, s) => n + (s.textContent ?? '').length, 0));
    expect(inlineBytes).toBeLessThan(2000);
  });

  test('sin hojas de estilo bloqueantes ni peticiones a terceros', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (req) => {
      const url = new URL(req.url());
      if (!['127.0.0.1', 'localhost'].includes(url.hostname) && url.protocol.startsWith('http')) external.push(req.url());
    });
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(0);
    expect(external, `Peticiones a terceros: ${external.join(', ')}`).toEqual([]);
  });

  test('hero prioritario y resto de imágenes diferidas', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('section[aria-labelledby="hero-title"] img');
    await expect(hero).toHaveAttribute('fetchpriority', 'high');
    await expect(hero).toHaveAttribute('loading', 'eager');
    const others = page.locator('main img:not([fetchpriority="high"])');
    expect(await others.count()).toBeGreaterThanOrEqual(7);
    for (const img of await others.all()) {
      await expect(img).toHaveAttribute('loading', 'lazy');
      await expect(img).toHaveAttribute('decoding', 'async');
    }
    // AVIF + WebP responsive
    expect(await page.locator('picture source[type="image/avif"]').count()).toBeGreaterThanOrEqual(8);
  });

  test('sin errores de consola', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto('/', { waitUntil: 'networkidle' });
    expect(errors).toEqual([]);
  });
});

test.describe('Semántica y accesibilidad', () => {
  for (const path of PAGES) {
    test(`${path}: un único h1, jerarquía sin saltos y sin violaciones WCAG 2.1 AA`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('h1')).toHaveCount(1);

      const levels = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll((els) => els.map((h) => Number(h.tagName[1])));
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i]! - levels[i - 1]!, `salto de h${levels[i - 1]} a h${levels[i]}`).toBeLessThanOrEqual(1);
      }

      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
      expect(summary).toEqual([]);
    });
  }

  test('todas las imágenes tienen texto alternativo', async ({ page }) => {
    await page.goto('/');
    const missing = await page.locator('img').evaluateAll((els) => els.filter((i) => !i.getAttribute('alt')?.trim()).length);
    expect(missing).toBe(0);
  });

  test('los anclajes de navegación apuntan a secciones existentes', async ({ page }) => {
    await page.goto('/');
    const targets = await page
      .locator('a[href^="#"]:not([href="#top"])')
      .evaluateAll((els) => [...new Set(els.map((a) => a.getAttribute('href')!.slice(1)))]);
    expect(targets.length).toBeGreaterThanOrEqual(4);
    for (const id of targets) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  });

  test('la FAQ se abre y se cierra sin JS', async ({ page }) => {
    await page.goto('/');
    const first = page.locator('#faq details').first();
    await first.locator('summary').click();
    await expect(first).toHaveAttribute('open', '');
    await expect(first.locator('.faq-answer')).toBeVisible();
    await first.locator('summary').click();
    await expect(first).not.toHaveAttribute('open', '');
  });
});

test.describe('Opiniones', () => {
  test('se muestran con valoración, nombre, ciudad y viaje, sin datos estructurados de reseñas', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('#opiniones figure');
    expect(await cards.count()).toBeGreaterThanOrEqual(5);
    for (const card of await cards.all()) {
      await expect(card.locator('svg[role="img"]')).toHaveAttribute('aria-label', /^Valoración: [1-5] de 5$/);
      expect((await card.locator('blockquote').innerText()).trim().length).toBeGreaterThan(60);
      expect((await card.locator('figcaption').innerText()).trim()).toMatch(/·/);
    }
    // Google penaliza las reseñas propias marcadas con schema: no se publican como datos estructurados.
    const ld = await page.locator('script[type="application/ld+json"]').allInnerTexts();
    expect(ld.join('')).not.toMatch(/"(Review|AggregateRating)"/);
  });
});

test.describe('Menú móvil', () => {
  test('abre, navega y se cierra', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile', 'Solo en móvil');
    await page.goto('/');
    await page.getByRole('button', { name: 'Aceptar todas' }).click();
    const menu = page.locator('#menu-movil');
    await expect(menu).toBeHidden();
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: 'Cómo funciona' }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#como-funciona$/);
  });
});
