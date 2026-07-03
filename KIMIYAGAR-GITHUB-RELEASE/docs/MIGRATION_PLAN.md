# کیمیاگری با حروف — V5 Migration Plan

**Status:** Planning Phase (Awaiting Approval)  
**Date:** 2026-06-23  
**Source:** `original/kimiyagar.html` (1841 lines)  

---

## 📊 Project Analysis

### Current State (V4)
- **Type:** Monolithic HTML file
- **Structure:** Single HTML file with embedded CSS and JavaScript
- **Language:** Persian (Farsi) with RTL layout
- **Size:** 1841 lines

### Embedded Modules Identified
```
✓ tokens.css - CSS variables, themes, base styles
✓ layout.css - Topbar, sidebar, grid, page layout
✓ cards.css - Card styling and components
✓ form.css - Form inputs and styling
✓ dialogs.css - Modal and dialog styling
✓ pages.css - Page container styling
✓ footer.css - Footer section
✓ core.js - Core business logic (normalization, calculation engine)
✓ render.js - UI rendering functions
✓ ui.js - User interface management
✓ pages.js - Page routing and management
✓ history.js - Result history management
✓ storage.js - Local storage persistence
✓ method1.js - Method 1 calculation algorithm
✓ method2.js - Method 2 calculation algorithm
✓ app.js - Main application controller
✓ init.js - Initialization and startup
✓ HTML Structure - Persian form layout
```

### Assets Identified
```
✓ logo.jpg - Application logo (moved to /assets)
✓ Inline SVG - Noise pattern (embedded in CSS)
✓ Google Fonts - Noto Naskh Arabic, Cinzel, Vazirmatn (external)
```

---

## 🗂️ Target V5 Structure

```
kimiyagar v5/
├── index.html                    (New main entry point)
├── MIGRATION_PLAN.md             (This file)
├── README.md                      (Project documentation)
│
├── assets/
│   ├── logo.jpg                  (Logo - moved)
│   └── images/                   (Placeholder for future images)
│
├── css/
│   ├── tokens.css                (CSS variables, themes)
│   ├── base.css                  (Global styles, resets)
│   ├── layout.css                (Topbar, sidebar, grid)
│   ├── components.css            (Cards, forms, dialogs)
│   ├── pages.css                 (Page-specific styles)
│   └── main.css                  (Main stylesheet - imports all)
│
├── js/
│   ├── core.js                   (Business logic, normalization, algorithms)
│   ├── storage.js                (LocalStorage management)
│   ├── ui.js                     (DOM manipulation, UI helpers)
│   ├── render.js                 (Rendering functions)
│   ├── app.js                    (Main application controller)
│   ├── init.js                   (Initialization)
│   │
│   └── methods/
│       ├── method1.js            (First calculation method)
│       ├── method2.js            (Second calculation method)
│       ├── registry.js           (Method registry and management)
│       └── steps.js              (Progress and step tracking)
│
│   (Utilities & Components)
│   ├── pages/
│   │   ├── pages.js              (Page routing)
│   │   ├── home.js               (Home page logic)
│   │   ├── tools.js              (Tools page)
│   │   ├── history.js            (History page)
│   │   ├── faq.js                (FAQ page)
│   │   └── contact.js            (Contact page)
│   │
│   ├── components/
│   │   ├── modals.js             (Modal/dialog management)
│   │   ├── toast.js              (Toast notifications)
│   │   └── navbar.js             (Navigation bar)
│
├── original/
│   └── kimiyagar.html            (Original monolithic file - backup)
│
└── .gitignore
```

---

## 📋 Migration Phases

### Phase 1: Structure Setup ✅ **COMPLETE**
- [x] Create folder structure (/assets, /css, /js, /js/methods, /original)
- [x] Move original HTML to /original
- [x] Move logo to /assets
- [ ] Create index.html placeholder

### Phase 2: CSS Extraction (Next)
- [ ] Extract `tokens.css` (CSS variables, themes)
- [ ] Extract `base.css` (Global styles)
- [ ] Extract `layout.css` (Layout components)
- [ ] Extract `components.css` (Cards, forms, dialogs)
- [ ] Extract `pages.css` (Page styling)
- [ ] Create `main.css` to import all CSS files

### Phase 3: JavaScript Extraction
- [ ] Extract `core.js` (Business logic)
- [ ] Extract `storage.js` (LocalStorage)
- [ ] Extract `ui.js` (DOM utilities)
- [ ] Extract `render.js` (Rendering functions)
- [ ] Extract `app.js` (Main controller)
- [ ] Extract `init.js` (Initialization)

### Phase 4: Methods & Components
- [ ] Extract `method1.js` to `/js/methods/`
- [ ] Extract `method2.js` to `/js/methods/`
- [ ] Extract `registry.js` (method registry)
- [ ] Extract `steps.js` (progress tracking)
- [ ] Extract page modules to `/js/pages/`
- [ ] Extract component modules to `/js/components/`

### Phase 5: Integration & Testing
- [ ] Create new `index.html`
- [ ] Link all CSS files
- [ ] Link all JavaScript files in correct order
- [ ] Test all functionality
- [ ] Verify no logic changes

### Phase 6: Documentation
- [ ] Update README.md
- [ ] Create module documentation
- [ ] Add code comments where needed

---

## 🔗 Dependency Graph

```
index.html
├── css/main.css
│   ├── css/tokens.css
│   ├── css/base.css
│   ├── css/layout.css
│   ├── css/components.css
│   └── css/pages.css
│
└── js/ (Load in this order)
    ├── storage.js
    ├── core.js
    ├── ui.js
    ├── render.js
    ├── methods/registry.js
    ├── methods/steps.js
    ├── methods/method1.js
    ├── methods/method2.js
    ├── pages/pages.js
    ├── components/modals.js
    ├── components/toast.js
    ├── components/navbar.js
    ├── app.js
    └── init.js
```

---

## 📐 Size Analysis

| Component | Lines | Type | Status |
|-----------|-------|------|--------|
| Original HTML | 1841 | Monolithic | ✓ Archived |
| Estimated CSS | ~400 | Extracted | ⏳ Pending |
| Estimated JS | ~1400 | Extracted | ⏳ Pending |
| **Total** | ~1841 | Modular | ⏳ Pending |

---

## ⚠️ Important Notes

### No Logic Changes
- ✅ All business logic will be preserved exactly as-is
- ✅ No refactoring of algorithms
- ✅ No functional changes
- ✅ 1:1 migration of all code

### Scope
- **Includes:** Code extraction, file organization, modularization
- **Excludes:** Features, UI/UX changes, bug fixes, optimizations
- **Preserves:** Functionality, calculations, data structures

### Testing Strategy
- Test each CSS module individually
- Test each JS module for syntax errors
- Test method calculations (Method 1 & 2)
- Test page navigation
- Test history & storage
- Full UI test before completion

---

## 📝 Checklist

### Pre-Migration
- [x] Analyze source code ✅
- [x] Create folder structure ✅
- [x] Archive original files ✅
- [ ] Approve migration plan 🔄

### Migration
- [ ] Extract and split CSS
- [ ] Extract and split JavaScript
- [ ] Create index.html
- [ ] Link resources
- [ ] Verify all imports

### Post-Migration
- [ ] Test all features
- [ ] Verify calculations
- [ ] Check localStorage
- [ ] Test on different devices
- [ ] Performance check

---

## 🎯 Success Criteria

- [x] Folder structure created
- [ ] All CSS extracted to separate files
- [ ] All JavaScript extracted to separate modules
- [ ] All modules properly imported in index.html
- [ ] All functionality working identically
- [ ] No console errors
- [ ] localStorage working correctly
- [ ] Responsive design intact
- [ ] Persian text displays correctly
- [ ] Both calculation methods work

---

## 📞 Next Steps

1. **Awaiting Approval:** Review this migration plan
2. **Phase 2:** Extract CSS modules
3. **Phase 3:** Extract JavaScript modules
4. **Phase 4:** Create index.html with imports
5. **Phase 5:** Testing and validation
6. **Phase 6:** Documentation

---

**Created:** 2026-06-23  
**Last Updated:** 2026-06-23  
**Migration Lead:** GitHub Copilot
