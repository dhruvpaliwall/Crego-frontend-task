# Tree Visualizer (React Flow)

Simple demo for building an Account → Loan → Collateral tree with auto-layout.

---

## Data model

```
node  : { id, type, position, data }
edge  : { id, source, target }
```

Node types allowed:

- account → loan | collateral
- loan → collateral

Positions are calculated by Dagre (top-to-bottom).

---

## Node UI

`
Custom React Flow nodes:

- `AccountNode`
- `LoanNode`
- `CollateralNode`

Each one is a small component under `src/nodes/`.

---

## UX notes

- The canvas starts with a single **Account** root node already in place.
- Click any node to open the side panel; it shows actions allowed for that node type (add Loan/Collateral, delete, etc.).
- Adding or connecting nodes auto-re-layouts the tree and recentres the view.
- Deleting a node removes it **and all of its descendants**.
- A read-only JSON view at the bottom always reflects the current graph state.

---

## Run locally

```bash
# install deps
yarn

# start dev server at http://localhost:3000
yarn start
```

---
