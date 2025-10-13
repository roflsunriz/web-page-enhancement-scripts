// ==UserScript==
// @name         Twitter Wide Layout Fix (Class + XPath 対応)
// @namespace    TwitterWideLayoutFix
// @version      1.4
// @description  Adjusts Twitter layout width using class and XPath selectors
// @author       roflsunriz
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @updateURL    https://gist.githubusercontent.com/roflsunriz/0bc56fc90ea91c2b76aee92ce7250c60/raw/twitter_wide_layout_fix.user.js
// @downloadURL  https://gist.githubusercontent.com/roflsunriz/0bc56fc90ea91c2b76aee92ce7250c60/raw/twitter_wide_layout_fix.user.js
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_SETTINGS = {
        css: [
            '.r-1ye8kvj {',
            '    max-width: {{WIDTH}} !important;',
            '}'
        ].join('\n'),
        xpath: '/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/div[5]',
        width: '900'
    };

    const STORAGE_KEYS = {
        css: 'twitterWideLayoutFix_css',
        xpath: 'twitterWideLayoutFix_xpath',
        width: 'twitterWideLayoutFix_width'
    };

    const OVERLAY_ID = 'twitter-wide-layout-fix-settings';

    let settings = loadSettings();
    let styleElement = null;

    injectCss(settings.css, settings.width);

    if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('Twitter Wide Layout Fix 設定', showSettingsModal);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    function initialize() {
        applyStyle();
        if (!document.body) {
            return;
        }
        const observer = new MutationObserver(applyStyle);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function loadSettings() {
        return {
            css: GM_getValue(STORAGE_KEYS.css, DEFAULT_SETTINGS.css),
            xpath: GM_getValue(STORAGE_KEYS.xpath, DEFAULT_SETTINGS.xpath),
            width: GM_getValue(STORAGE_KEYS.width, DEFAULT_SETTINGS.width)
        };
    }

    function saveSettings(nextSettings) {
        settings = nextSettings;
        GM_setValue(STORAGE_KEYS.css, settings.css);
        GM_setValue(STORAGE_KEYS.xpath, settings.xpath);
        GM_setValue(STORAGE_KEYS.width, settings.width);
    }

    function resolveWidth(value) {
        const trimmed = (value || '').trim();
        if (!trimmed) {
            const fallback = (DEFAULT_SETTINGS.width || '').toString();
            return /^\d+(\.\d+)?$/.test(fallback) ? `${fallback}px` : fallback;
        }
        return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed;
    }

    function injectCss(cssText, widthValue) {
        const renderedCss = renderCss(cssText, widthValue);
        if (styleElement) {
            styleElement.textContent = renderedCss;
            return;
        }
        styleElement = GM_addStyle(renderedCss);
    }

    function renderCss(cssText, widthValue) {
        const template = typeof cssText === 'string' ? cssText : '';
        const resolvedWidth = resolveWidth(widthValue);
        return template.split('{{WIDTH}}').join(resolvedWidth);
    }

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function applyStyle() {
        const target = getElementByXpath(settings.xpath);
        if (target) {
            target.style.setProperty('max-width', resolveWidth(settings.width), 'important');
        }
    }

    function showSettingsModal() {
        if (document.getElementById(OVERLAY_ID)) {
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;
        overlay.style.cssText = [
            'position: fixed',
            'inset: 0',
            'background-color: rgba(0, 0, 0, 0.55)',
            'z-index: 2147483647',
            'display: flex',
            'align-items: center',
            'justify-content: center',
            'padding: 16px'
        ].join('; ');

        const modal = document.createElement('div');
        modal.style.cssText = [
            'background: #ffffff',
            'color: #0f1419',
            'width: min(600px, 100%)',
            'max-height: 90vh',
            'overflow: auto',
            'padding: 24px',
            'border-radius: 12px',
            'box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3)',
            'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        ].join('; ');

        overlay.appendChild(modal);

        const title = document.createElement('h2');
        title.textContent = 'Twitter Wide Layout Fix 設定';
        title.style.marginTop = '0';
        modal.appendChild(title);

        const form = document.createElement('form');
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '16px';
        modal.appendChild(form);

        const cssTextarea = document.createElement('textarea');
        cssTextarea.value = settings.css;
        cssTextarea.style.width = '100%';
        cssTextarea.style.minHeight = '120px';
        cssTextarea.style.fontFamily = 'monospace';
        cssTextarea.style.fontSize = '13px';
        cssTextarea.style.padding = '8px';
        cssTextarea.style.border = '1px solid #d0d7de';
        cssTextarea.style.borderRadius = '6px';

        const cssField = createField('CSS', cssTextarea);
        const cssHelper = createHelperText('CSS内の{{WIDTH}}は幅設定で置換されます。');
        cssField.appendChild(cssHelper);
        form.appendChild(cssField);

        const xpathInput = document.createElement('input');
        xpathInput.type = 'text';
        xpathInput.value = settings.xpath;
        xpathInput.style.width = '100%';
        xpathInput.style.fontSize = '13px';
        xpathInput.style.padding = '8px';
        xpathInput.style.border = '1px solid #d0d7de';
        xpathInput.style.borderRadius = '6px';

        form.appendChild(createField('XPath', xpathInput));

        const widthInput = document.createElement('input');
        widthInput.type = 'text';
        widthInput.value = settings.width;
        widthInput.placeholder = '例: 1010 または 80%';
        widthInput.style.width = '100%';
        widthInput.style.fontSize = '13px';
        widthInput.style.padding = '8px';
        widthInput.style.border = '1px solid #d0d7de';
        widthInput.style.borderRadius = '6px';

        const widthField = createField('幅 (width)', widthInput);
        const widthHelper = createHelperText('数値のみの場合はpxを自動付与し、単位付きの値はそのまま利用します。');
        const widthPreview = createHelperText('');
        widthField.appendChild(widthHelper);
        widthField.appendChild(widthPreview);
        form.appendChild(widthField);

        const updateWidthPreview = () => {
            const resolved = resolveWidth(widthInput.value.trim() || DEFAULT_SETTINGS.width);
            const usesPlaceholder = cssTextarea.value.includes('{{WIDTH}}');
            widthPreview.textContent = usesPlaceholder
                ? `適用幅: ${resolved}（CSSとXPathに共通適用）`
                : `適用幅: ${resolved}（CSSに{{WIDTH}}が含まれていません）`;
        };

        const updateCssHelper = () => {
            const usesPlaceholder = cssTextarea.value.includes('{{WIDTH}}');
            cssHelper.textContent = usesPlaceholder
                ? 'CSS内の{{WIDTH}}は幅設定で置換されます。'
                : 'CSSに{{WIDTH}}を含めると幅設定を共有できます。';
            updateWidthPreview();
        };

        widthInput.addEventListener('input', updateWidthPreview);
        cssTextarea.addEventListener('input', updateCssHelper);

        updateCssHelper();

        const buttonRow = document.createElement('div');
        buttonRow.style.display = 'flex';
        buttonRow.style.justifyContent = 'flex-end';
        buttonRow.style.gap = '8px';

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = 'キャンセル';
        cancelButton.style.padding = '8px 14px';
        cancelButton.style.border = '1px solid #d0d7de';
        cancelButton.style.borderRadius = '999px';
        cancelButton.style.background = '#f7f9f9';
        cancelButton.style.cursor = 'pointer';
        cancelButton.addEventListener('click', closeSettingsModal);

        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.textContent = '保存';
        saveButton.style.padding = '8px 14px';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '999px';
        saveButton.style.background = '#1d9bf0';
        saveButton.style.color = '#ffffff';
        saveButton.style.cursor = 'pointer';

        buttonRow.appendChild(cancelButton);
        buttonRow.appendChild(saveButton);
        form.appendChild(buttonRow);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const nextSettings = {
                css: cssTextarea.value,
                xpath: xpathInput.value.trim() || DEFAULT_SETTINGS.xpath,
                width: widthInput.value.trim() || DEFAULT_SETTINGS.width
            };
            saveSettings(nextSettings);
            injectCss(settings.css, settings.width);
            applyStyle();
            closeSettingsModal();
        });

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeSettingsModal();
            }
        });

        document.body.appendChild(overlay);
        cssTextarea.focus();
    }

    function createField(labelText, inputElement) {
        const wrapper = document.createElement('label');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '8px';
        wrapper.style.fontSize = '14px';

        const caption = document.createElement('span');
        caption.textContent = labelText;
        caption.style.fontWeight = '600';

        wrapper.appendChild(caption);
        wrapper.appendChild(inputElement);

        return wrapper;
    }

    function createHelperText(text) {
        const helper = document.createElement('span');
        helper.textContent = text;
        helper.style.fontSize = '12px';
        helper.style.color = '#536471';
        helper.style.lineHeight = '1.4';
        return helper;
    }

    function closeSettingsModal() {
        const overlay = document.getElementById(OVERLAY_ID);
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }
})();






