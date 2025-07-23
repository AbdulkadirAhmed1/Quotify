# 🧩 Proposed UI Layout – Quotify

This document outlines the user interface (UI) and user experience (UX) design plan for the **Quotify** app. It serves as a visual and functional reference before expanding frontend features.

---

## 🖥️ UI Wireframe (Concept)

```
+------------------------------------------+
|                Quotify 📝               |
|   "The best way to start is to begin."   |
|                  — Unknown               |
|                                          |
|   [🔁 New Quote]      [❤️ Favorite]       |
|                                          |
|   ------------------------------------   |
|   [ Search 🔍 | 🔽 Filter by Tag ▼ ]      |
|   ------------------------------------   |
|                                          |
|     List of All Quotes (Optional)        |
|   ┌──────────────────────────────┐       |
|   │ "A quote..."     — Author    │       |
|   └──────────────────────────────┘       |
|                                          |
|  [➕ Add New Quote]  [⭐ View Favorites]   |
+------------------------------------------+
```

---

## 🧭 Planned User Flow

| Feature           | UI Element                         | Description |
|------------------|-------------------------------------|-------------|
| **Random Quote** | Display area                        | Shows 1 quote at a time |
| **New Quote**    | 🔁 Button                           | Fetches a random quote |
| **Favorite**     | ❤️ Button/icon                      | Marks current quote as favorite (stored locally) |
| **Search**       | Input field                         | Filters quotes by text |
| **Tag Filter**   | Dropdown or category buttons        | Filters quotes by tag/genre |
| **Quote List**   | Scrollable list or grid             | Shows all quotes fetched/added |
| **Add New**      | Modal or collapsible input section  | Lets users submit their own quotes |
| **Favorites**    | Button/view                         | Shows saved favorites (from localStorage or DB) |

---

## 📁 Suggested Folder/File Extensions (Later)

/components
├── HomeLayout.html       ← NEW: overall layout with slots
├── Header.html           ← title + motto
├── QuoteDisplay.html     ← current quote + author
├── QuoteControls.html    ← new + favorite buttons
├── SearchFilter.html     ← search + tag filter
├── QuoteList.html        ← quote list placeholder
├── QuoteFooter.html      ← add + view favorites 
├── AddQuoteForm.html     ← footer


---

## 🧠 Notes

- The current version supports: random quote fetch + loading animation
- Next UI expansion will add: search, tags, quote list, add form
- UI is mobile-first and responsive via `@media` queries in `styles.css`

---

> **Status**: Current version completed (random quote)  
> **Next step**: Implement modular layout + persistent favorites

