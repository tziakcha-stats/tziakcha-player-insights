import { beforeEach, describe, expect, it, vi } from "vitest";

describe("favorites navigation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <nav>
        <ul class="navbar-nav">
          <li class="nav-item"><a class="nav-link" href="/">主页</a></li>
          <li class="nav-item"><a class="nav-link" href="/history">历史</a></li>
        </ul>
      </nav>
    `;
    window.history.replaceState({}, "", "https://example.com/history");
  });

  it("detects the favorites hash route", async () => {
    const { FAVORITES_HASH, getFavoritesHref, isFavoritesHash } =
      await import("../../src/features/favorites/route");

    expect(FAVORITES_HASH).toBe("#reviewer-favorites");
    expect(isFavoritesHash("https://example.com/#reviewer-favorites")).toBe(
      true,
    );
    expect(
      isFavoritesHash("https://example.com/history#reviewer-favorites"),
    ).toBe(true);
    expect(isFavoritesHash("https://example.com/history")).toBe(false);
    expect(getFavoritesHref("https://example.com/history?id=1")).toBe(
      "https://example.com/#reviewer-favorites",
    );
  });

  it("injects a single favorites nav item", async () => {
    const { ensureFavoritesNavItem } =
      await import("../../src/features/favorites/nav");

    expect(ensureFavoritesNavItem()).toBe(true);
    expect(ensureFavoritesNavItem()).toBe(false);

    const links = Array.from(
      document.querySelectorAll(".navbar-nav .nav-link"),
    );
    expect(links.map((link) => link.textContent?.trim())).toEqual([
      "主页",
      "历史",
      "收藏",
    ]);
    expect((links[2] as HTMLAnchorElement).href).toBe(
      "https://example.com/#reviewer-favorites",
    );
  });

  it("returns false when no navigation container exists", async () => {
    document.body.innerHTML = `<main>No nav</main>`;
    const { ensureFavoritesNavItem } =
      await import("../../src/features/favorites/nav");

    expect(ensureFavoritesNavItem()).toBe(false);
    expect(document.querySelector("#reviewer-favorites-nav-item")).toBeNull();
  });

  it("retries until the navigation container appears", async () => {
    document.body.innerHTML = `<main>No nav</main>`;
    const { installFavoritesNavItem } =
      await import("../../src/features/favorites/nav");

    expect(installFavoritesNavItem()).toBe(true);
    expect(document.querySelector("#reviewer-favorites-nav-item")).toBeNull();

    document.body.innerHTML = `
      <nav>
        <ul class="navbar-nav">
          <li class="nav-item"><a class="nav-link" href="/">主页</a></li>
        </ul>
      </nav>
    `;
    vi.runAllTimers();

    expect(
      document.querySelector("#reviewer-favorites-nav-item"),
    ).not.toBeNull();
  });
});
