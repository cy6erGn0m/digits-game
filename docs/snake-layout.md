# Snake Layout Algorithm

This document describes the **snake layout** used for `ordinalPosition` tasks, where a child must tap the N-th emoji in a sequence. The algorithm is implemented in `ui.js` as `UI._applySnakeLayout(container)`.

## Table of Contents

- [Problem](#problem)
- [Desired Visual Pattern](#desired-visual-pattern)
- [Algorithm](#algorithm)
- [Pseudocode](#pseudocode)
- [Edge Cases](#edge-cases)
- [Implementation Details](#implementation-details)
- [Why `dataset.index` Is Required](#why-datasetindex-is-required)

---

## Problem

Ordinal tasks ask: *"Нажми на пятую звёздочку"* (tap the 5th star).

If emojis wrap across multiple lines in a simple left-to-right flex container, the natural reading order breaks at line wraps. After finishing the rightmost item of row 1, the eye must jump back to the left edge of row 2. For young children learning counting, this jump is confusing.

The snake layout solves this by making the visual flow continuous, like reading a boustrophedon (ox-plowing) text: left-to-right on the first row, right-to-left on the second, left-to-right on the third, and so on.

**Additionally**, to make the direction change explicit, the first item of each wrapped row is pulled out as a standalone **turn indicator** on its own line, aligned to the edge where the turn happens.

---

## Desired Visual Pattern

### Example A — 7 items, 4 per row

Natural wrap (broken counting flow):

```
1  2  3  4
5  6  7
```

Snake layout with turn indicators:

```
1  2  3  4
         5
      7  6
```

Counting path: 1 → 2 → 3 → 4 → (turn down-right) → 5 → (turn down-left) → 6 → 7

### Example B — 13 items, 4 per row

```
 1  2  3  4
            5
    8  7  6
 9
10 11 12
          13
```

Counting path: 1→2→3→4 → turn → 5 → 6←7←8 → turn → 9 → turn → 10→11→12 → turn → 13

---

## Algorithm

### Phase 1: Detect Natural Rows

The emojis are first rendered in a normal `flex-wrap: wrap` container. We read the browser-computed layout to determine where the line breaks occur.

1. Collect all child elements into an array.
2. Walk left-to-right. Whenever `items[i].offsetTop !== items[i-1].offsetTop`, a new natural row has started.
3. Group elements into `naturalRows`: an array of arrays, where each inner array is one visual line as determined by the browser's wrapping.

> **Why `offsetTop`?**  
> We let the browser do the wrapping math (based on container width, font size, gaps). We only *observe* the result. This avoids duplicating the wrap logic and makes the layout responsive for free.

### Phase 2: Build Output Rows with Turn Indicators

We transform each natural row into one or two **output rows**, depending on whether a direction change happens.

**State:**
- `ltr: boolean` — current reading direction. Starts `true`.

**For each `naturalRow` at index `ri`:**

- **If `ri === 0`:**  
  Output one row: all items, left-aligned (`flex-start`), no reversal.  
  Direction stays LTR.

- **If `ltr === true` (we are coming from an RTL row, so this row starts a new LTR segment):**  
  - **Turn marker row:** `[row[0]]`, left-aligned (`flex-start`).  
    This sits at the left edge, showing the turn from RTL → LTR.
  - **Continuation row:** `row.slice(1)`, left-aligned (`flex-start`), **not reversed**.  
    Items flow left-to-right naturally.
  - Set `ltr = false`.

- **If `ltr === false` (we are coming from an LTR row, so this row starts a new RTL segment):**  
  - **Turn marker row:** `[row[0]]`, right-aligned (`flex-end`).  
    This sits at the right edge, showing the turn from LTR → RTL.
  - **Continuation row:** `row.slice(1)`, right-aligned (`flex-end`), **reversed**.  
    We reverse the item order so that the rightmost DOM element is the first in the counting sequence for this row.
  - Set `ltr = true`.

### Phase 3: Rebuild the DOM

1. Clear the original container.
2. Set the container style to a vertical flex column:  
   `display: flex; flex-direction: column; align-items: stretch; gap: 4px;`
3. For each output row:
   - Create a `<div>` with `display: flex; flex-wrap: nowrap; gap: 6px; justify-content: <align>;`
   - Append the items in the specified order (reversed if needed).
   - Append the row div to the container.

---

## Pseudocode

```
function applySnakeLayout(container):
    items = array(container.children)
    if items.length < 2: return

    // Phase 1: detect natural rows via offsetTop
    naturalRows = [[items[0]]]
    for i from 1 to items.length - 1:
        if items[i].offsetTop != items[i-1].offsetTop:
            naturalRows.push([items[i]])
        else:
            naturalRows.last.push(items[i])

    // Phase 2: build output rows
    outputRows = []
    ltr = true

    for each (row, ri) in naturalRows:
        if ri == 0:
            outputRows.push({items: row, align: "flex-start", reverse: false})
            continue

        if ltr:
            // Transition: RTL -> LTR
            outputRows.push({items: [row[0]], align: "flex-start", reverse: false})
            if row.length > 1:
                outputRows.push({items: row[1..end], align: "flex-start", reverse: false})
            ltr = false
        else:
            // Transition: LTR -> RTL
            outputRows.push({items: [row[0]], align: "flex-end", reverse: false})
            if row.length > 1:
                outputRows.push({items: row[1..end], align: "flex-end", reverse: true})
            ltr = true

    // Phase 3: rebuild DOM
    clear(container)
    container.style = "display:flex; flex-direction:column; align-items:stretch; gap:4px;"

    for each {items, align, reverse} in outputRows:
        rowDiv = createDiv()
        rowDiv.style = "display:flex; flex-wrap:nowrap; gap:6px; justify-content:" + align + ";"
        ordered = reverse ? reverse(items) : items
        for item in ordered:
            rowDiv.appendChild(item)
        container.appendChild(rowDiv)
```

---

## Edge Cases

| Case | Behavior |
|---|---|
| **Only 1 item** | Returns early — no layout change needed. |
| **All items fit in one row** | Returns a single output row (same as natural layout). |
| **Natural row has exactly 1 item** | Only a turn marker row is emitted; no continuation row. |
| **Last natural row has 1 item** | It becomes a turn marker at the appropriate edge. If the previous row ended with a turn, the last item sits alone as the final element in the sequence. |
| **Container resized** | The layout is recomputed from scratch on every task render, so resizing the viewport between tasks will produce correct new row breaks. (Within a single task, the layout is static.) |

---

## Implementation Details

### Container Style Override

The `.emoji-row` class in CSS defines `display: flex; flex-wrap: wrap;`.  
`_applySnakeLayout` **replaces** this with an inline style: `flex-direction: column`. The inner row divs handle the horizontal layout.

### Gap Values

- Outer column gap: `4px` (between snake rows)
- Inner row gap: `6px` (between emojis within a row)

These match the original emoji spacing so the visual density stays consistent.

### No `justify-content: center`

Rows are aligned to `flex-start` or `flex-end`, not `center`. This ensures the turn markers sit flush against the edges, making the snake path visually obvious.

---

## Why `dataset.index` Is Required

After `_applySnakeLayout` runs, the DOM order no longer matches the counting order. In the 7-item example:

- Natural DOM order after wrap: `[1,2,3,4,5,6,7]`
- After snake layout, the DOM order inside the container is:  
  Row 1: `[1,2,3,4]` → Row 2: `[5]` → Row 3: `[7,6]` (reversed)

If code looked up the 6th item by `container.children[5]`, it would find item **7** (because item 6 was moved to index 6).

**Solution:** During initial render, every emoji `<span>` gets `data-index="${idx}"`. All lookups — correct-answer pulsing, hint highlighting, and click handling — use `dataset.index` instead of DOM position. This makes the algorithm resilient to any reordering.

---

## Related Files

- `ui.js` — `UI._applySnakeLayout()`, `UI._renderContent()`, `UI._getCorrectElement()`, `UI._showHint()`
- `animations.js` — `Animations.showHint()`
- `styles.css` — `.emoji-row`, `.row-emoji`, `.row-emoji.hint-highlight`
