type TrustedHTML = string & { readonly __trustedHtmlBrand: unique symbol };

type TrustedTypeCreateHTML = (value: string) => string;

type TrustedTypePolicy = {
  createHTML(value: string): TrustedHTML;
};

type TrustedTypePolicyFactory = {
  createPolicy(name: string, policy: { createHTML: TrustedTypeCreateHTML }): TrustedTypePolicy | null;
};

type TrustedTypesHost = Window & {
  trustedTypes?: TrustedTypePolicyFactory;
};

type HtmlSink = ShadowRoot | Element;

const policyCache = new WeakMap<TrustedTypePolicyFactory, Map<string, TrustedTypePolicy>>();

function getTrustedTypesFactory(targetWindow: Window): TrustedTypePolicyFactory | null {
  const { trustedTypes } = targetWindow as TrustedTypesHost;
  if (!trustedTypes || typeof trustedTypes.createPolicy !== 'function') {
    return null;
  }
  return trustedTypes;
}

function getPolicy(factory: TrustedTypePolicyFactory, policyName: string): TrustedTypePolicy | null {
  let policies = policyCache.get(factory);
  if (!policies) {
    policies = new Map();
    policyCache.set(factory, policies);
  }

  const cached = policies.get(policyName);
  if (cached) {
    return cached;
  }

  const policy = factory.createPolicy(policyName, {
    createHTML: (input: string): string => input,
  });
  if (policy) {
    policies.set(policyName, policy);
    return policy;
  }
  return null;
}

export function createTrustedHtml(html: string, policyName: string, targetWindow: Window = window): string | TrustedHTML {
  const factory = getTrustedTypesFactory(targetWindow);
  if (!factory) {
    return html;
  }

  const policy = getPolicy(factory, policyName);
  if (!policy) {
    return html;
  }
  return policy.createHTML(html);
}

export function setTrustedInnerHTML(target: HtmlSink, html: string, policyName: string): void {
  const ownerDocument = target.ownerDocument ?? document;
  const view = ownerDocument.defaultView ?? window;
  const trusted = createTrustedHtml(html, policyName, view);

  if (typeof trusted === 'string') {
    target.innerHTML = trusted;
    return;
  }

  (target as unknown as { innerHTML: TrustedHTML }).innerHTML = trusted;
}

