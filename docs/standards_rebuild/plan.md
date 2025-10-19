# Edit Standards (LIRM) Rebuild Plan

## 1️⃣ Overview
**Purpose:** Enable editing of Layer In Rearing & Maturity (LIRM) data per week with proper access controls and data synchronization.

**Access Modes:**
- Admin: Full edit capabilities
- Planner/Viewer: Read-only access

**Data Sources:**
- `GET /api/standards/week/{week}`
- `PUT /api/standards/week/{week}`
- `POST /api/standards/import` (CSV bulk update)

## 2️⃣ UI/UX Design
### Component Structure
| Component | Description |
|-----------|-------------|
| `StandardsPage.vue` | Main view with week list and Edit Standards button |
| `EditStandardsSingle.vue` | Single-week editor with navigation and save functionality |
| `StandardsImport.vue` | CSV upload/validation sidebar (optional) |

### User Flow
1. Click "Edit Standards" → Opens week 1 editor
2. API loads week data into form fields
3. Edit values → Click "Save"
4. System:
   - Sends PUT request
   - Shows success toast
   - Enables navigation only after save

## 3️⃣ Data Flow
```
+-------------------+
|  /api/standards   | ← CSV Import / Bulk Fetch
+---------+---------+
          |
          ↓
  /api/standards/week/{week}
    ↑             ↓
  (GET)       (PUT)
          Frontend: EditStandardsSingle.vue
```

## 4️⃣ Frontend Logic
**Key Features:**
- Week navigation (prev/next + dropdown)
- Dirty state protection
- RBAC-driven UI elements
- Toast notifications

**Implementation:**
```vue
<script setup>
import { ref, onMounted, watch } from '#imports'
// API handling and state management
</script>
```

## 5️⃣ Backend Updates
**Endpoints:**
- Add RBAC middleware to:
  ```ts
  export default defineEventHandler(async (event) => {
    await checkRole(event, ['admin', 'planner', 'viewer'])
  })
  ```
- Validation:
  - Field type checks
  - Week range validation (1-71)
  - Error handling with user-friendly messages

## 6️⃣ Testing & Verification
| Role | Permissions |
|------|-------------|
| Admin | Full edit access |
| Planner | Read-only |
| Viewer | Hidden button |

**Test Checklist:**
- [ ] Button opens editor
- [ ] Week data loads correctly
- [ ] Save triggers PUT
- [ ] Navigation blocking works
- [ ] CSV import updates all weeks

## 7️⃣ Deliverables
- This plan document
- Implemented components:
  - `/pages/standards/index.vue`
  - `/pages/standards/edit/week/[week].vue`
- Updated backend endpoints
