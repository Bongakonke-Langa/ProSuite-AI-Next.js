export const prosuiteData = {
  "metadata": {
    "version": "2.0",
    "generated_at": "2026-01-29T11:30:00Z",
    "description": "Complete ProSuite demo dataset",
    "tenant_id": 1
  },
  "core": {
    "tenants": [{"id": 1, "tenant_name": "Acme Financial Services", "tenant_code": "ACME"}],
    "users": [
      {"id": 1, "name": "System Administrator", "email": "sysadmin@acme-fs.demo"},
      {"id": 2, "name": "John Risk Manager", "email": "john.risk@acme-fs.demo"},
      {"id": 3, "name": "Sarah Compliance Officer", "email": "sarah.compliance@acme-fs.demo"},
      {"id": 4, "name": "Mike Auditor", "email": "mike.auditor@acme-fs.demo"},
      {"id": 5, "name": "Lisa Asset Manager", "email": "lisa.assets@acme-fs.demo"}
    ],
    "departments": [
      {"id": 1, "name": "Executive Management"},
      {"id": 2, "name": "Finance"},
      {"id": 3, "name": "Operations"},
      {"id": 4, "name": "Information Technology"},
      {"id": 5, "name": "Human Resources"},
      {"id": 6, "name": "Legal & Compliance"},
      {"id": 7, "name": "Internal Audit"}
    ],
    "modules": [
      {"id": 1, "slug": "risk", "name": "Risk Management"},
      {"id": 2, "slug": "asset", "name": "Asset Management"},
      {"id": 3, "slug": "compliance", "name": "Compliance Management"},
      {"id": 4, "slug": "governance", "name": "Governance Management"},
      {"id": 5, "slug": "incident", "name": "Incident Management"},
      {"id": 6, "slug": "audit", "name": "Audit Management"},
      {"id": 7, "slug": "performance", "name": "Performance Management"}
    ]
  },
  "risk": {
    "risk_categories": [
      {"id": 1, "name": "Strategic Risk"},
      {"id": 2, "name": "Operational Risk"},
      {"id": 3, "name": "Financial Risk"},
      {"id": 4, "name": "Compliance Risk"},
      {"id": 5, "name": "Technology Risk"}
    ],
    "risks": [
      {
        "id": 1,
        "title": "Cyber Security Breach",
        "description": "Unauthorized access to critical systems",
        "risk_number": "R-2024-001",
        "category_id": 5,
        "department_id": 4,
        "owner_id": 2,
        "impact_rating_id": 5,
        "likelihood_rating_id": 4,
        "inherit_risk_score": 20,
        "residual_score": 12,
        "is_archived": false
      },
      {
        "id": 2,
        "title": "POPIA Non-Compliance",
        "description": "Failure to comply with POPIA regulations",
        "risk_number": "R-2024-002",
        "category_id": 4,
        "department_id": 6,
        "owner_id": 3,
        "impact_rating_id": 4,
        "likelihood_rating_id": 4,
        "inherit_risk_score": 16,
        "residual_score": 8,
        "is_archived": false
      },
      {
        "id": 3,
        "title": "Key Personnel Departure",
        "description": "Loss of critical staff knowledge",
        "risk_number": "R-2024-003",
        "category_id": 2,
        "department_id": 5,
        "owner_id": 1,
        "impact_rating_id": 4,
        "likelihood_rating_id": 3,
        "inherit_risk_score": 12,
        "residual_score": 9,
        "is_archived": false
      },
      {
        "id": 4,
        "title": "Cloud Service Outage",
        "description": "Extended downtime at cloud provider",
        "risk_number": "R-2024-004",
        "category_id": 5,
        "department_id": 4,
        "owner_id": 2,
        "impact_rating_id": 4,
        "likelihood_rating_id": 3,
        "inherit_risk_score": 12,
        "residual_score": 8,
        "is_archived": false
      },
      {
        "id": 5,
        "title": "Third-Party Vendor Risk",
        "description": "Security risks from vendors",
        "risk_number": "R-2024-005",
        "category_id": 2,
        "department_id": 3,
        "owner_id": 1,
        "impact_rating_id": 3,
        "likelihood_rating_id": 3,
        "inherit_risk_score": 9,
        "residual_score": 6,
        "is_archived": false
      }
    ]
  },
  "asset": {
    "assets": [
      {
        "id": 1,
        "description": "Dell PowerEdge R740 Server",
        "assetTag": "IT-SRV-001",
        "cost": 150000.00,
        "assetStatus_name": "Active",
        "category_name": "IT Equipment",
        "department_name": "Information Technology"
      },
      {
        "id": 2,
        "description": "MacBook Pro 16-inch M3 Max",
        "assetTag": "IT-LAP-001",
        "cost": 65000.00,
        "assetStatus_name": "Active",
        "category_name": "IT Equipment",
        "department_name": "Executive Management"
      },
      {
        "id": 3,
        "description": "Toyota Corolla Cross",
        "assetTag": "VEH-001",
        "cost": 550000.00,
        "assetStatus_name": "Active",
        "category_name": "Vehicles",
        "department_name": "Operations"
      },
      {
        "id": 4,
        "description": "Microsoft 365 Business Premium",
        "assetTag": "SW-M365-001",
        "cost": 85000.00,
        "assetStatus_name": "Active",
        "category_name": "Software",
        "department_name": "Information Technology"
      }
    ]
  },
  "incident": {
    "incidents": [
      {
        "id": 1,
        "title": "Phishing Attack Detected",
        "description": "Multiple employees received phishing emails",
        "status_id": 2,
        "severity_level_id": 2,
        "date_occurred": "2026-01-28"
      },
      {
        "id": 2,
        "title": "Email Server Outage",
        "description": "Exchange server downtime",
        "status_id": 3,
        "severity_level_id": 3,
        "date_occurred": "2026-01-25"
      },
      {
        "id": 3,
        "title": "Unauthorized Access Attempt",
        "description": "Failed login attempts detected",
        "status_id": 2,
        "severity_level_id": 1,
        "date_occurred": "2026-01-27"
      }
    ]
  },
  "audit": {
    "audit_engagements": [
      {
        "id": 1,
        "engagement_id": "AE-2026-001",
        "title": "IT Access Management Audit",
        "lead_auditor_id": 4,
        "start_date": "2026-01-15",
        "end_date": "2026-02-28",
        "status_id": 2
      },
      {
        "id": 2,
        "engagement_id": "AE-2026-002",
        "title": "Financial Controls Review",
        "lead_auditor_id": 4,
        "start_date": "2026-03-01",
        "end_date": "2026-04-15",
        "status_id": 1
      },
      {
        "id": 3,
        "engagement_id": "AE-2025-004",
        "title": "POPIA Compliance Audit",
        "lead_auditor_id": 4,
        "start_date": "2025-10-01",
        "end_date": "2025-11-30",
        "status_id": 4
      }
    ]
  },
  "compliance": {
    "compliance_packages": [
      {
        "id": 1,
        "name": "POPIA Compliance Package",
        "compliance_score": 78.50,
        "total_requirements": 48,
        "completed_requirements": 38,
        "overdue_requirements": 3
      },
      {
        "id": 2,
        "name": "FAIS Compliance Package",
        "compliance_score": 95.00,
        "total_requirements": 35,
        "completed_requirements": 35,
        "overdue_requirements": 0
      },
      {
        "id": 3,
        "name": "King IV Governance Package",
        "compliance_score": 65.00,
        "total_requirements": 75,
        "completed_requirements": 49,
        "overdue_requirements": 8
      }
    ]
  },
  "governance": {
    "governance_policies": [
      {
        "id": 1,
        "title": "Information Security Policy",
        "version": "3.2",
        "policy_status_id": 3,
        "effective_date": "2024-01-01"
      },
      {
        "id": 2,
        "title": "Data Classification Policy",
        "version": "2.0",
        "policy_status_id": 3,
        "effective_date": "2024-03-01"
      },
      {
        "id": 3,
        "title": "Acceptable Use Policy",
        "version": "1.0",
        "policy_status_id": 2,
        "effective_date": null
      },
      {
        "id": 4,
        "title": "Remote Work Policy",
        "version": "1.5",
        "policy_status_id": 3,
        "effective_date": "2024-06-01"
      },
      {
        "id": 5,
        "title": "Procurement Policy",
        "version": "2.1",
        "policy_status_id": 3,
        "effective_date": "2024-02-01"
      }
    ]
  }
};
