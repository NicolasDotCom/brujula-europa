import { expect, test, type Page } from '@playwright/test';

const LEGAL_ROUTES = [
  { path: '/aviso-legal', heading: 'Aviso legal' },
  { path: '/privacidad', heading: 'Política de privacidad' },
  { path: '/terminos-y-condiciones', heading: 'Términos y condiciones' },
  { path: '/politica-de-reembolsos', heading: 'Política de reembolsos' },
];

const WA_PATTERN = /^https:\/\/wa\.me\/\d{8,15}\?text=.+/;

async function horizontalOverflow(page: Page) {
  // Recorre la página para que se maqueten las secciones con content-visibility: auto.
  await page.evaluate(async () => {
    for (let y = 0; y <= document.documentElement.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
  });
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
}

function decodedText(href: string): string {
  return new URL(href).searchParams.get('text') ?? '';
}

test.describe('Cero desbordamiento horizontal', () => {
  test('la portada no se desborda (con todas las FAQ abiertas)', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true)));
    const { scrollWidth, clientWidth } = await horizontalOverflow(page);
    expect(scrollWidth, `scrollWidth ${scrollWidth} > clientWidth ${clientWidth}`).toBeLessThanOrEqual(clientWidth);
  });

  for (const route of [...LEGAL_ROUTES, { path: '/creditos', heading: 'Créditos fotográficos' }]) {
    test(`${route.path} no se desborda`, async ({ page }) => {
      await page.goto(route.path);
      const { scrollWidth, clientWidth } = await horizontalOverflow(page);
      expect(scrollWidth, `${route.path}: ${scrollWidth} > ${clientWidth}`).toBeLessThanOrEqual(clientWidth);
    });
  }
});

test.describe('Embudo de WhatsApp intacto', () => {
  test('todos los enlaces a WhatsApp son wa.me válidos con mensaje prellenado', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page.locator('a[href*="wa.me"]').evaluateAll((els) => els.map((a) => a.getAttribute('href') ?? ''));
    expect(hrefs.length).toBeGreaterThanOrEqual(12); // nav, menú, hero, 6 destinos, FAQ, cierre, pie, flotante
    for (const href of hrefs) {
      expect(href).toMatch(WA_PATTERN);
      expect(decodedText(href).length).toBeGreaterThan(20);
    }
  });

  test('cada destino codifica en ?text= su nombre exacto y su precio', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('#destinos article[data-experience]');
    await expect(cards).toHaveCount(6);

    for (let i = 0; i < 6; i++) {
      const card = cards.nth(i);
      const title = (await card.locator('h3').innerText()).trim();
      const price = (await card.locator('.price').innerText()).replace(/\s/g, ' ').trim();
      const cta = card.getByRole('link', { name: /Consultar disponibilidad por WhatsApp/ });
      await expect(cta).toBeVisible();

      const href = (await cta.getAttribute('href'))!;
      expect(href).toMatch(WA_PATTERN);
      // El título viaja codificado en la URL…
      expect(href).toContain(encodeURIComponent(title));
      // …y el mensaje decodificado es el del brief.
      expect(decodedText(href)).toBe(
        `Hola, estoy en Europa y quiero consultar disponibilidad y tarifa para la experiencia: ${title} (Desde ${price})`,
      );
    }
  });

  test('cada vehículo de alquiler codifica su nombre y su precio por día', async ({ page }) => {
    await page.goto('/');
    const rows = page.locator('#alquiler [data-rental]');
    await expect(rows).toHaveCount(8); // 4 por carretera + 4 por mar
    await expect(page.locator('#alquiler [data-rental-category="carretera"] [data-rental]')).toHaveCount(4);
    await expect(page.locator('#alquiler [data-rental-category="mar"] [data-rental]')).toHaveCount(4);

    for (let i = 0; i < 8; i++) {
      const row = rows.nth(i);
      const name = (await row.locator('h4').innerText()).trim();
      const price = (await row.locator('.rental-price').innerText()).replace(/\s/g, ' ').trim();
      const href = (await row.getByRole('link', { name: new RegExp(`Consultar disponibilidad de ${name}`) }).getAttribute('href'))!;
      expect(href).toMatch(WA_PATTERN);
      expect(decodedText(href)).toBe(
        `Hola, estoy en Europa y quiero consultar disponibilidad y tarifa para alquilar: ${name} (Desde ${price}/día). Destino y fechas:`,
      );
    }
  });

  test('los CTA principales llevan a WhatsApp', async ({ page }) => {
    await page.goto('/');
    for (const cta of ['nav', 'hero', 'rentals', 'faq', 'closing', 'footer', 'fab']) {
      const href = await page.locator(`[data-cta="${cta}"]`).first().getAttribute('href');
      expect(href, `CTA ${cta}`).toMatch(WA_PATTERN);
    }
    await expect(page.locator('[data-cta="hero"]')).toBeVisible();
    await expect(page.locator('[data-cta="fab"]')).toHaveAttribute('aria-label', /WhatsApp/);
  });
});

test.describe('Verificación de Stripe: rutas legales', () => {
  for (const route of LEGAL_ROUTES) {
    test(`${route.path} responde 200 y renderiza su h1`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status(), `${route.path} debe responder 200`).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveText(route.heading);
    });
  }

  test('el pie enlaza las 4 páginas legales y muestra datos de contacto y fiscales', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    for (const route of LEGAL_ROUTES) {
      await expect(footer.locator(`a[href="${route.path}"]`)).toHaveCount(1);
    }
    await expect(footer).toContainText('@');
    await expect(footer).toContainText('NIF');
    await expect(footer).toContainText('CET');
  });
});

test.describe('Cumplimiento RGPD', () => {
  test('el banner aparece al cargar, se oculta al aceptar y la elección persiste', async ({ page }) => {
    await page.goto('/');
    const banner = page.locator('[data-cookie]');
    await expect(banner).toBeVisible();

    await banner.getByRole('button', { name: 'Aceptar todas' }).click();
    await expect(banner).toBeHidden();
    expect(await page.evaluate(() => localStorage.getItem('be-cookie-consent'))).toBe('all');

    await page.reload();
    await expect(banner).toBeHidden();
  });

  test('«Solo necesarias» guarda la preferencia', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Solo necesarias' }).click();
    await expect(page.locator('[data-cookie]')).toBeHidden();
    expect(await page.evaluate(() => localStorage.getItem('be-cookie-consent'))).toBe('necessary');
  });

  test('las preferencias se pueden reabrir desde el pie', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Aceptar todas' }).click();
    await page.getByRole('button', { name: 'Preferencias de cookies' }).click();
    await expect(page.locator('[data-cookie]')).toBeVisible();
  });
});
