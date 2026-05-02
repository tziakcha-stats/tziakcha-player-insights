import { warnLog } from "../../shared/logger";

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function initHistoryVisit(isUserGamePage: boolean): void {
  const refreshLink = document.getElementById("rfrsh");
  const tbody = document.querySelector(
    "table tbody",
  ) as HTMLTableSectionElement | null;
  if (!refreshLink || !tbody) {
    setTimeout(() => initHistoryVisit(isUserGamePage), 100);
    return;
  }
  if (document.getElementById("reviewer-history-visit-btn")) {
    return;
  }

  const nameCellIndexes = isUserGamePage ? [2, 4, 6, 8] : [1, 3, 5, 7];

  const extractNameFromCell = (cell: HTMLTableCellElement): string => {
    const raw = (cell.textContent || "").replace(/\s+/g, " ").trim();
    if (!raw) {
      return "";
    }
    return raw.replace(/^★\s*/, "").trim();
  };

  const getNameCells = (): HTMLTableCellElement[] => {
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const cells: HTMLTableCellElement[] = [];
    rows.forEach((row) => {
      const tds = row.querySelectorAll("td");
      nameCellIndexes.forEach((idx) => {
        if (tds[idx]) {
          cells.push(tds[idx] as HTMLTableCellElement);
        }
      });
    });
    return cells;
  };

  const renderLinkedCell = (
    cell: HTMLTableCellElement,
    userName: string,
    userId: string,
  ): void => {
    if (!userName || !userId) {
      return;
    }
    const raw = (cell.textContent || "").replace(/\s+/g, " ").trim();
    const hasStar = /^★\s*/.test(raw);
    const href = `/user/tech/?id=${encodeURIComponent(userId)}`;
    const currentA = cell.querySelector("a");
    if (currentA && currentA.getAttribute("href") === href) {
      return;
    }
    cell.innerHTML = `${hasStar ? "★ " : ""}<a href="${href}" target="_blank">${escapeHtml(userName)}</a>`;
  };

  const renderPlainCell = (cell: HTMLTableCellElement): void => {
    const raw = (cell.textContent || "").replace(/\s+/g, " ").trim();
    if (!raw) {
      return;
    }
    const hasStar = /^★\s*/.test(raw);
    const userName = raw.replace(/^★\s*/, "").trim();
    cell.textContent = `${hasStar ? "★ " : ""}${userName}`;
  };

  const nameToId = new Map<string, string | null>();
  let enabled = false;
  let loading = false;

  const queryUserIdByName = async (name: string): Promise<string | null> => {
    const resp = await fetch(`/_qry/match/?kw=${encodeURIComponent(name)}`, {
      method: "POST",
      credentials: "include",
    });
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }

    const json = (await resp.json()) as
      | Array<{ n?: string; i?: string }>
      | { data?: Array<{ n?: string; i?: string }> };
    const items = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : [];
    const exact = items.find((item) => item && item.n === name && item.i);
    return exact?.i || null;
  };

  const enrichCurrentRows = async (): Promise<number | undefined> => {
    if (loading) {
      return undefined;
    }
    loading = true;
    try {
      const nameCells = getNameCells();
      const names = Array.from(
        new Set(nameCells.map(extractNameFromCell).filter(Boolean)),
      );

      const pending = names.filter((name) => !nameToId.has(name));
      if (pending.length) {
        const results = await Promise.all(
          pending.map(async (name) => {
            try {
              return [name, await queryUserIdByName(name)] as const;
            } catch (error) {
              warnLog(`Failed to query user id: ${name}`, error);
              return [name, null] as const;
            }
          }),
        );
        results.forEach(([name, userId]) => nameToId.set(name, userId));
      }

      let linkedCount = 0;
      nameCells.forEach((cell) => {
        const name = extractNameFromCell(cell);
        const userId = nameToId.get(name);
        if (name && userId) {
          renderLinkedCell(cell, name, userId);
          linkedCount += 1;
        }
      });
      return linkedCount;
    } finally {
      loading = false;
    }
  };

  const visitBtn = document.createElement("a");
  visitBtn.id = "reviewer-history-visit-btn";
  visitBtn.href = "javascript:void(0)";
  visitBtn.className = "m-1 btn btn-outline-primary btn-sm";
  visitBtn.textContent = "家访（需要会员）";
  visitBtn.addEventListener("click", async () => {
    if (loading) {
      return;
    }
    if (enabled) {
      enabled = false;
      getNameCells().forEach(renderPlainCell);
      visitBtn.textContent = "家访（需要会员）";
      return;
    }

    const oldText = visitBtn.textContent;
    visitBtn.textContent = "家访中...";
    try {
      enabled = true;
      await enrichCurrentRows();
      visitBtn.textContent = "取消家访";
    } catch (error) {
      warnLog("家访失败", error);
    } finally {
      if (!enabled) {
        visitBtn.textContent = "家访（需要会员）";
      } else if (visitBtn.textContent === "家访中...") {
        visitBtn.textContent = oldText;
      }
    }
  });

  refreshLink.parentNode?.insertBefore(visitBtn, refreshLink);

  const observer = new MutationObserver(() => {
    if (enabled) {
      void enrichCurrentRows();
    }
  });
  observer.observe(tbody, { childList: true, subtree: true });
}
