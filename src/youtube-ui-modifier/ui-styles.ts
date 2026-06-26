export const UI_STYLES = `
.youtube-ui-modifier-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 18, 24, 0.58);
  font-family: Arial, sans-serif;
}

.youtube-ui-modifier-dialog {
  width: min(920px, 96vw);
  max-height: min(760px, 92vh);
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
  color: #111827;
  background: #ffffff;
  border: 1px solid #d7dce5;
  border-radius: 8px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
}

.youtube-ui-modifier-header,
.youtube-ui-modifier-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.youtube-ui-modifier-footer {
  border-top: 1px solid #e5e7eb;
  border-bottom: 0;
}

.youtube-ui-modifier-header h2,
.youtube-ui-modifier-panel h3 {
  margin: 0;
  font-size: 20px;
  line-height: 1.25;
  letter-spacing: 0;
}

.youtube-ui-modifier-header p {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
}

.youtube-ui-modifier-content {
  min-height: 0;
  display: grid;
  grid-template-columns: 190px 1fr;
}

.youtube-ui-modifier-sidebar {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  overflow-y: auto;
  background: #f8fafc;
  border-right: 1px solid #e5e7eb;
}

.youtube-ui-modifier-category,
.youtube-ui-modifier-button,
.youtube-ui-modifier-icon-button {
  font: inherit;
  cursor: pointer;
}

.youtube-ui-modifier-category {
  width: 100%;
  padding: 10px 12px;
  color: #374151;
  text-align: left;
  background: transparent;
  border: 0;
  border-radius: 6px;
}

.youtube-ui-modifier-category:hover,
.youtube-ui-modifier-category.active {
  color: #b91c1c;
  background: #fee2e2;
}

.youtube-ui-modifier-category-filter {
  font-weight: 700;
}

.youtube-ui-modifier-sidebar-divider {
  height: 1px;
  margin: 6px 0;
  background: #e5e7eb;
}

.youtube-ui-modifier-panel {
  min-height: 0;
  padding: 20px;
  overflow-y: auto;
}

.youtube-ui-modifier-option-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.youtube-ui-modifier-option {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}

.youtube-ui-modifier-option-text {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.youtube-ui-modifier-option-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
}

.youtube-ui-modifier-option-description {
  color: #6b7280;
  font-size: 12px;
  line-height: 1.45;
}

.youtube-ui-modifier-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.youtube-ui-modifier-switch {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: #cbd5e1;
  transition: background 0.16s ease;
}

.youtube-ui-modifier-switch::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.16s ease;
}

.youtube-ui-modifier-option input:checked + .youtube-ui-modifier-switch {
  background: #dc2626;
}

.youtube-ui-modifier-option input:checked + .youtube-ui-modifier-switch::after {
  transform: translateX(20px);
}

.youtube-ui-modifier-icon-button {
  width: 34px;
  height: 34px;
  color: #374151;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.youtube-ui-modifier-button {
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #ffffff;
}

.youtube-ui-modifier-button-danger {
  color: #b91c1c;
  border-color: #fecaca;
  background: #fff5f5;
}

.youtube-ui-modifier-status {
  color: #4b5563;
  font-size: 13px;
}

.youtube-ui-modifier-empty {
  margin: 16px 0 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
}

.youtube-ui-modifier-reveal-box {
  position: relative;
  z-index: 2020;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: fit-content;
  margin: 48px auto;
  padding: 12px 16px;
  color: #374151;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.16);
  font-family: Arial, sans-serif;
  font-size: 13px;
}

.youtube-ui-modifier-reveal-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.youtube-ui-modifier-reveal-box button {
  color: inherit;
  background: transparent;
  border: 0;
  cursor: pointer;
  font: inherit;
}

.youtube-ui-modifier-reveal-box button:hover {
  text-decoration: underline;
}

.youtube-ui-modifier-reveal-primary {
  font-weight: 700;
  text-align: left;
}

@media (max-width: 700px) {
  .youtube-ui-modifier-overlay {
    padding: 10px;
  }

  .youtube-ui-modifier-content {
    grid-template-columns: 1fr;
  }

  .youtube-ui-modifier-sidebar {
    flex-direction: row;
    overflow-x: auto;
    border-right: 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .youtube-ui-modifier-category {
    width: auto;
    white-space: nowrap;
  }
}
`;
