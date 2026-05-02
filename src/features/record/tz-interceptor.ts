import { w } from "../../shared/env";
import { debugLog, infoLog, warnLog } from "../../shared/logger";
import {
  clearReviewError,
  setReviewError,
  setTZInstance,
} from "./reviewer/state";

const originalDefineProperty = Object.defineProperty;
const originalReflectDefineProperty = Reflect.defineProperty;

type TZConstructor = new (...args: unknown[]) => Record<string, unknown>;

type TZPropertyDescriptor = PropertyDescriptor & {
  _tz_wrapped?: boolean;
};

function wrapTZ(OriginalTZ: TZConstructor): TZConstructor {
  const WrappedTZ = function (...args: unknown[]) {
    const instance = new OriginalTZ(...args);
    setTZInstance(instance);
    clearReviewError();
    infoLog("Captured TZ instance", instance);
    return instance;
  } as unknown as TZConstructor;

  WrappedTZ.prototype = OriginalTZ.prototype;
  Object.setPrototypeOf(WrappedTZ, OriginalTZ);

  const originalStatics = OriginalTZ as unknown as Record<string, unknown>;
  const wrappedStatics = WrappedTZ as unknown as Record<string, unknown>;
  for (const key in originalStatics) {
    if (Object.prototype.hasOwnProperty.call(originalStatics, key)) {
      wrappedStatics[key] = originalStatics[key];
    }
  }

  return WrappedTZ;
}

function installDefinePropertyHook(): void {
  const definePropertyRef =
    Object.defineProperty as typeof Object.defineProperty & {
      _tz_hooked?: boolean;
    };
  if (definePropertyRef._tz_hooked) {
    return;
  }

  const hook = function (
    target: object,
    prop: PropertyKey,
    descriptor: TZPropertyDescriptor,
  ) {
    if (
      target === w &&
      prop === "TZ" &&
      descriptor &&
      typeof descriptor.value === "function" &&
      !descriptor._tz_wrapped
    ) {
      descriptor = {
        ...descriptor,
        value: wrapTZ(descriptor.value as TZConstructor),
        _tz_wrapped: true,
      };
      infoLog("Wrapped TZ via defineProperty hook");
    }

    return originalDefineProperty(target, prop, descriptor);
  };

  hook._tz_hooked = true;
  Object.defineProperty = hook as typeof Object.defineProperty;

  if (typeof originalReflectDefineProperty === "function") {
    const reflectHook = function (
      target: object,
      prop: PropertyKey,
      descriptor: TZPropertyDescriptor,
    ) {
      if (
        target === w &&
        prop === "TZ" &&
        descriptor &&
        typeof descriptor.value === "function" &&
        !descriptor._tz_wrapped
      ) {
        descriptor = {
          ...descriptor,
          value: wrapTZ(descriptor.value as TZConstructor),
          _tz_wrapped: true,
        };
        infoLog("Wrapped TZ via Reflect.defineProperty hook");
      }

      return originalReflectDefineProperty(target, prop, descriptor);
    };

    (
      reflectHook as typeof Reflect.defineProperty & { _tz_hooked?: boolean }
    )._tz_hooked = true;
    Reflect.defineProperty = reflectHook;
  }
}

export function tryForceCreateTZ(): boolean {
  try {
    if (w.__review_tz_instance || typeof w.TZ !== "function") {
      return false;
    }

    const searchParams = new URLSearchParams(w.location.search);
    const id = searchParams.get("id");
    const v = searchParams.get("v");
    const cy = searchParams.get("cy");

    const tz = new w.TZ();
    setTZInstance(tz);
    clearReviewError();
    infoLog("Force-created TZ instance");

    if (typeof tz.adapt === "function") {
      tz.adapt();
    }
    if (id && typeof tz.fetch === "function") {
      tz.fetch(id, 0, v, cy);
    }

    return true;
  } catch (error) {
    warnLog("Force-create TZ failed", error);
    return false;
  }
}

export function interceptTZ(): void {
  debugLog("Installing TZ interceptors for current route", w.location.pathname);
  installDefinePropertyHook();

  const existing = Object.getOwnPropertyDescriptor(w, "TZ");

  if (!existing || existing.configurable) {
    const descriptor: PropertyDescriptor = {
      configurable: true,
      enumerable: true,
      get() {
        return this._TZ;
      },
      set(value) {
        if (typeof value === "function" && !this._TZ_intercepted) {
          this._TZ_intercepted = true;
          this._TZ = wrapTZ(value as TZConstructor);
          infoLog("Intercepting TZ constructor");
          return;
        }
        this._TZ = value;
      },
    };

    try {
      originalDefineProperty(w, "TZ", descriptor);
      infoLog("TZ interceptor installed (configurable path)");
      return;
    } catch (error) {
      warnLog("Failed to install TZ interceptor via defineProperty", error);
    }
  }

  if (existing && existing.writable === false) {
    setReviewError("TZ 属性不可拦截，无法捕获牌局");
    warnLog("TZ is non-configurable and non-writable; cannot intercept");
    return;
  }

  const tryPatch = (): boolean => {
    if (typeof w.TZ === "function" && !w._TZ_intercepted_direct) {
      w._TZ_intercepted_direct = true;
      w.TZ = wrapTZ(w.TZ as TZConstructor);
      infoLog("TZ interceptor installed (fallback patch)");
      return true;
    }
    return false;
  };

  if (tryPatch()) {
    return;
  }

  let attempts = 0;
  const timer = w.setInterval(() => {
    attempts += 1;
    if (tryPatch() || attempts > 200) {
      if (attempts > 200) {
        warnLog("Gave up waiting for TZ to patch");
        setReviewError("未捕获牌局核心对象，尝试补建实例");
        tryForceCreateTZ();
      }
      w.clearInterval(timer);
    }
  }, 50);
}
