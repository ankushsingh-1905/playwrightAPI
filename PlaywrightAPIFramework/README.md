# Playwright API Framework

A Playwright + TypeScript API automation framework with a **custom grouped
HTML report** — module sections, copy buttons on curl/request/response, and
failed rows highlighted in red.

## Structure

```
PlaywrightAPIFramework/
├── api/            BaseAPI (shared execute/curl logic) + one class per resource
├── config/         env.ts (.env loader) + config.ts (central CONFIG object)
├── fixtures/       apiFixture.ts — injects authApi/productApi/userApi into tests
├── headers/        commonHeader.ts + authHeader.ts (in-memory token store)
├── payloads/       request bodies, as typed objects with a *With(overrides) helper
├── schemas/        lightweight required-field + type schemas
├── tests/          one folder per module — folder name becomes the report's group heading
├── utils/          ReportManager, CurlGenerator, JsonValidator, Logger, FileUtil, globalTeardown
├── reports/        CustomReport.html is generated here after a run
└── playwright.config.ts
```

## Adding your own endpoint — the 4 things you touch

Say you want to add a new API call. You only ever touch these:

1. **`payloads/yourPayload.ts`** — the request body, as a plain object.
2. **`api/YourResourceAPI.ts`** (or add a method to an existing one) — extends
   `BaseAPI`, calls `this.post(...)` / `this.get(...)` / etc.
3. **`fixtures/apiFixture.ts`** — one line to register the new API class as a fixture (only if it's a brand-new resource, not needed for a new method on an existing one).
4. **`tests/<Module>/yourTest.spec.ts`** — write the test, call `ReportManager.addResult(...)` in a `finally` block.

Nothing about `BaseAPI`, `CurlGenerator`, or `ReportManager` ever needs to change.

## How to insert your own endpoint/token/body — concretely

**Endpoint & method** — inside your API class:
```typescript
// api/CartAPI.ts
import { BaseAPI } from "./BaseAPI";
import { CommonHeader } from "../headers/commonHeader";

export class CartAPI extends BaseAPI {
    addToCart(payload: any) {
        return this.post("/carts/add", payload, CommonHeader.build());
    }
}
```

**Body** — in `payloads/`:
```typescript
// payloads/addToCart.ts
export const addToCartPayload = {
    userId: 1,
    products: [{ id: 1, quantity: 2 }],
};
```

**Token** — set once after login, every subsequent authed call picks it up automatically:
```typescript
AuthHeader.setToken(loginResponse.accessToken);
// later, anywhere:
const headers = { ...CommonHeader.build(), ...AuthHeader.build() };
```

## Running

```bash
npm install
npm test                 # runs everything, writes reports/CustomReport.html
npm run test:auth        # just tests/Auth
npm run test:product     # just tests/Product
```

Open `reports/CustomReport.html` in a browser after the run.

## The report

- **Grouped by module** — the folder a spec lives in (`tests/Auth`, `tests/Product`, ...)
  becomes its own section with a `X/Y Passed` badge.
- **Copy buttons** — Curl / Request / Response are each behind a collapsible
  `<details>` with a `Copy` button that copies the exact text to your clipboard
  (uses `navigator.clipboard`, no server round-trip).
- **Curl is a complete, absolute URL** — pastes directly into Postman or a terminal.
- **Failed rows are highlighted red** and the Result badge is red for FAIL,
  green for PASS.

## Why `workers: 1` in `playwright.config.ts`

`ReportManager` keeps results in a static in-memory array. Playwright runs
each test **file** in its own worker process by default, and a static array
does not persist across separate Node processes — so with parallel workers,
whichever worker finishes last would silently overwrite everyone else's
results in the report.

Setting `workers: 1` keeps every test in one process so results accumulate
correctly, and `globalTeardown` renders the HTML exactly once after
everything finishes (not from inside each test — that was the earlier race
condition where multiple tests could write the file at the same time).

**If you outgrow this POC** and want parallel workers back: have each test
write its result to its own file (e.g. `reports/results/TC_AUTH_001.json`)
instead of pushing to the in-memory array, then have `globalTeardown` read
every file in that folder and build the grouped HTML from those. That's the
production-grade version of this same idea.

## Known simplifications (a POC, not a production suite)

- `JsonValidator` is a hand-rolled required-field + typeof checker, not a full
  JSON Schema validator (no external dependency needed — keeps `npm install`
  fast and offline-friendly).
- dummyjson.com is a mock API — it doesn't reject invalid payloads the way a
  real backend would (see the comment in `TC_PRODUCT_002`). Point `BASE_URL`
  in `.env` at a real service and the same framework structure holds; only
  the expected-status assertions will need adjusting to match that API's
  actual validation behavior.
