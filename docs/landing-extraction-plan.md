# Extraction Plan: LANDING Content

**Status:** Draft / Planned  
**Target Repository:** `git@github:neo-smart-token-factory/landing.git`  
**Role:** Marketing and Narrative Layer  

---

## 1. Classification and Inventory

The following items are classified as pure **LANDING** content and are slated for extraction to the new repository.

### Folders to Move
| Current Path (smart-ui) | Intended Path (landing) | Notes |
|:---|:---|:---|
| `/landing/` | `/` | The entire standalone Vite project becomes the root. |
| `/public/brand/` | `/public/brand/` | Logos and brand identity. |
| `/public/images/` | `/public/images/` | Specifically `hero-genesis.png` and landing assets. |

### Files to Move
| Current Path (smart-ui) | Intended Path (landing) | Notes |
|:---|:---|:---|
| `/components/LandingSection.tsx` | `/src/components/LandingSection.tsx` | Core landing layout component. |

---

## 2. Dependency Audit

### Internal Dependencies
- **UI Logic:** `LandingSection.tsx` currently relies on `Lucide React` and `Framer Motion`. The new `landing` repo must match these devDependencies.
- **Styling:** The landing repository uses its own `tailwind.config.js` and `postcss.config.js` found in the current `/landing` folder.

### Removal/Replacement Requirements
1. **Next.js Features:** Any landing components referencing `next/image` or `next/link` must be replaced with standard HTML tags or Vite-compatible equivalents.
2. **Demo Coupling:** The `LandingSection.tsx` must be audited to ensure it contains no references to `SmartMint` state or API routes.

---

## 3. Post-Extraction state in smart-ui

Once items are removed:
- `smart-ui` (Step 1) will immediately trigger the **Smart Mint** flow.
- A single "About" or "Narrative" section may remain as a simple link to the external landing repository.

---

## 4. Execution Notice

**This plan is non-authoritative until finalized and executed.**
No code has been moved. No imports have been changed. 
Commit history for these files should be preserved using `git filter-repo` or similar during the actual split.
