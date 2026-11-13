# Virtual House Visualizer and Cost Estimator

A digital housing visualization and cost estimation solution designed for rural housing beneficiaries under the Ministry of Rural Development.

## Problem Statement

Beneficiaries often face difficulties visualizing their houses before construction begins and estimating the expenses involved in completing construction.

The **Virtual House Visualizer and Cost Estimator** aims to solve this problem by allowing beneficiaries to preview a 3D miniature of their proposed house, customize its design, and obtain an instant cost estimate with a stage-wise breakdown.

The system helps beneficiaries plan their construction expenses, understand material choices, and manage their housing construction more effectively.

## Objectives

- Provide a virtual 3D visualization of proposed houses before construction.
- Allow customization of house size, wall materials, and roof types.
- Generate instant construction cost estimates.
- Display a stage-wise breakdown of estimated expenses.
- Support state-wise base construction rates.
- Provide an admin interface to manage and update construction rates.

## System Architecture

The project consists of four interconnected segments sharing a common REST API.

```text
             ┌──────────────────────┐
             │    Unity 3D App      │
             │ Virtual House Model  │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │                      │
             │   Backend REST API   │
             │                      │
             │  /api/estimate       │
             │  /api/house-types    │
             │  /api/materials      │
             │  /api/rates          │
             │                      │
             └──────────┬───────────┘
                        │
               ┌────────┴────────┐
               ▼                 ▼
       ┌──────────────┐   ┌──────────────┐
       │ SQLite       │   │ React Web    │
       │ Database     │   │ Application  │
       └──────────────┘   └──────────────┘
```

### Project Components

**1. Unity 3D Application**
- Displays a miniature 3D representation of the house using simple 3D objects.
- Allows users to change house types, wall materials, and roof types.
- Communicates with the backend API to retrieve updated cost estimates.

**2. Backend REST API**
- Provides endpoints for house types, materials, rates, and cost estimation.
- Fetches relevant data from the database.
- Calculates total construction costs and stage-wise expenses.
- Provides JSON responses with appropriate error handling.

**3. SQLite Database**
- Stores house types and their corresponding areas.
- Maintains wall and roof material multipliers.
- Stores state-wise construction base rates.
- Maintains construction stages and their percentage allocations.

**4. React Web Application**
- Provides a beneficiary interface for selecting house configurations and viewing estimates.
- Displays estimated costs and stage-wise breakdowns using charts.
- Provides an admin interface to add and update state-wise construction rates.

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| 3D Visualization | Unity, C# |
| Web Frontend | React |
| Backend | REST API |
| Database | SQLite |
| Communication | JSON, HTTP |
| API Integration | Shared REST endpoints |
| CORS | Enabled |

## Shared Project Data

All four segments use the same identifiers to maintain consistency across the application.

### House Types

| ID | House Type | Area |
|---|---|---|
| `1BHK` | 1 BHK | 270 sq. ft. |
| `2BHK` | 2 BHK | 450 sq. ft. |

### Wall Materials

| ID | Material | Multiplier |
|---|---|---|
| `brick` | Brick | 1.0 |
| `flyash` | Fly Ash | 0.9 |
| `block` | Block | 1.1 |

### Roof Types

| ID | Roof Type | Multiplier |
|---|---|---|
| `rcc` | RCC | 1.0 |
| `tin` | Tin | 0.7 |

### State-wise Base Rates

| State | Base Rate (₹/sq. ft.) |
|---|---:|
| Chhattisgarh | 1200 |
| Madhya Pradesh | 1150 |
| Odisha | 1100 |

### Construction Stages

| Stage | Percentage |
|---|---:|
| Foundation | 20% |
| Walls | 35% |
| Roof | 25% |
| Finishing | 20% |
| **Total** | **100%** |

## Cost Estimation Logic

The estimated construction cost is calculated using the following formula:

**Total Construction Cost**

```text
Total = Area × Base Rate × Wall Multiplier × Roof Multiplier
```

**Stage-wise Cost**

```text
Stage Cost = Total × Stage Percentage / 100
```

Any rounding remainder is added to the finishing stage to ensure that the sum of all stage costs exactly matches the total estimated cost.

### Example Calculation

For the following configuration:

- House Type: 1BHK
- Area: 270 sq. ft.
- Wall Material: Fly Ash
- Roof Type: RCC
- State: Chhattisgarh
- Base Rate: ₹1200 per sq. ft.

```text
Total = 270 × 1200 × 0.9 × 1.0

Total = ₹2,91,600
```

**Stage-wise Breakdown**

| Construction Stage | Estimated Cost |
|---|---:|
| Foundation (20%) | ₹58,320 |
| Walls (35%) | ₹1,02,060 |
| Roof (25%) | ₹72,900 |
| Finishing (20%) | ₹58,320 |
| **Total** | **₹2,91,600** |

## 🔗 REST API Contract

Base Path: `/api`

All API requests and responses use JSON. CORS is enabled.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/house-types` | Retrieve available house types |
| GET | `/api/materials` | Retrieve wall and roof materials |
| GET | `/api/rates?state=Chhattisgarh` | Retrieve state-wise rates |
| POST | `/api/rates` | Add a new state rate |
| PUT | `/api/rates/:id` | Update an existing rate |
| POST | `/api/estimate` | Calculate construction cost |
| GET | `/api/quantities?houseType=1BHK` | Retrieve estimated material quantities (optional) |

### Estimate API

**Request:**

```json
{
  "houseType": "1BHK",
  "wall": "flyash",
  "roof": "rcc",
  "state": "Chhattisgarh"
}
```

**Response:**

```json
{
  "houseType": "1BHK",
  "areaSqFt": 270,
  "total": 291600,
  "stages": {
    "foundation": 58320,
    "walls": 102060,
    "roof": 72900,
    "finishing": 58320
  }
}
```

Invalid or missing fields return HTTP 400 with an appropriate error message.

## 🔄 Application Workflow

1. The beneficiary opens the Unity application or React web application.
2. Selects the desired house type, wall material, roof type, and state.
3. The application sends the selected configuration to the backend.
4. The backend retrieves the corresponding values from the SQLite database.
5. The estimation formula is applied to calculate the total construction cost.
6. Stage-wise expenses are calculated and returned as a JSON response.
7. The application displays the updated estimate and construction cost breakdown.

## 🌱 Expected Impact

- Improves awareness of construction expenses before building begins.
- Helps rural housing beneficiaries make informed design and material choices.
- Provides better financial planning through stage-wise cost estimates.
- Promotes transparency in estimated construction expenses.
- Makes house planning more accessible through interactive visualization.

## 📌 Project Scope

This project focuses on providing an integrated house visualization and cost estimation platform. The Unity application, React frontend, backend API, and database work together through a shared data contract to ensure consistent estimates across platforms.

---

**Project:** Virtual House Visualizer and Cost Estimator  
**Domain:** Rural Housing | 3D Visualization | Web Development | Cost Estimation  
**Problem Statement:** Ministry of Rural Development
