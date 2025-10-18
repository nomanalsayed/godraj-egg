# Phase 2 Implementation Plan

## Overview
Enterprise integration and system expansion focusing on three core modules:
1. Fiscal Year Configuration Flexibility
2. Granular Access Controls
3. SAP Data Pipeline Integration

## Milestone 1 – Fiscal Year Toggle
**Scope**
- Frontend: Settings panel toggle component
- Backend: `fiscal_year_mode` config flag
- Engine: Aggregation logic adjustments

**Architecture Changes**
- New fiscal configuration service
- Modified date range calculations in forecast engine
- Report template versioning

**Validation Methods**
- Automated date boundary tests
- Manual verification of report recalculations
- End-to-end test scenarios for both FY modes

## Milestone 2 – Role-Based Access
**Scope**
- User role model (Admin/Planner/Viewer)
- JWT claims processing
- Component visibility controls

**Architecture Changes**
- Auth middleware with RBAC checks
- Role-based API endpoint protection
- Frontend permission directives

**Validation Methods**
- Authorization matrix testing
- Negative permission scenarios
- Audit logging verification

## Milestone 3 – SAP Integration
**Scope**
- SAP file ingestion endpoint
- Cost center mapping
- Variance analysis automation

**Architecture Changes**
- SAP parser microservice
- Data reconciliation service
- Import error handling framework

**Validation Methods**
- Sample file regression tests
- Reconciliation accuracy checks
- Performance benchmarking

## Dependencies & Risks
**Critical Path**
1. Auth system must precede SAP integration
2. Fiscal engine changes require full test coverage

**Risk Mitigation**
- Parallel development of UI/backend components
- Shadow mode deployment for FY toggle

## Validation & Testing Plan
| Module          | Unit Tests | Integration | Manual QA |
|-----------------|------------|-------------|-----------|
| Fiscal Year     | 85%        | API+UI      | Full      |
| RBAC            | 95%        | End-to-end  | Partial   |
| SAP Integration | 70%        | Data flow   | Full      |

## Expected Timeline
1. Fiscal Year Toggle: 2 weeks
2. Role-Based Access: 3 weeks 
3. SAP Integration: 4 weeks

## Implementation Sequence
1. Develop and document fiscal_year_toggle.md
2. Implement and validate RBAC system
3. Build SAP integration pipeline
