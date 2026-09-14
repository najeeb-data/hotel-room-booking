# Hotel Room Booking

A single-page room booking application built for a Developer Skills Assessment. Users pick check-in and check-out dates, choose one of five available rooms, and see a live booking summary with the total price.

## Assessment

Developer Skills Assessment for Raintech Software Limited.

## Features

- Room listing with type, price per night, and max guests
- Check-in / check-out date selection with dynamic minimums
- Date validation (no past check-in, checkout after check-in, no same-day stays)
- Reusable night and total-price calculation
- Single room selection with visual selected state
- Live booking summary that updates as inputs change
- Inline, non-blocking error messages
- Responsive layout (two-column desktop, stacked mobile)

## Optional Features Implemented

- **Guest capacity filter** — a "Guests" dropdown hides rooms that can't fit the chosen party size (`room.maxGuests >= selected`).
- **Existing booking conflict detection** — a small hardcoded dataset (`js/data/bookings.js`) marks a room unavailable when the requested dates overlap an existing booking, using proper range-overlap logic (checkout is treated as the moment a room becomes free again, not a blocked day).
- **Unit tests** — `tests/booking.test.js` covers the core date and price functions using Node's built-in `assert` module (no test framework dependency).

## Technology

- HTML5
- CSS3
- Vanilla JavaScript (ES6 modules)

No frameworks, build tools, backend, database, or authentication are used.

## Project Structure

```
index.html                 Page markup
css/                        Stylesheets, split by concern (reset, tokens, layout, components, responsive)
js/data/                    Static room and booking data
js/utils/                   Pure functions: dates, currency formatting, validation
js/services/bookingService.js   Business logic: nights, total, availability
js/ui/                      DOM rendering for rooms, summary, and error messages
js/app.js                   Entry point: wires DOM events to the layers above
tests/booking.test.js       Unit tests for the business logic
```

The flow is intentionally one-directional:

```
data -> business logic -> validation -> UI -> user
```

`app.js` is the only file that touches both DOM events and the logic layers; every other module either computes something or renders something, never both.

## How to Run

This is a static site with no build step.

1. Clone or download the project.
2. Open `index.html` directly in a browser, **or** serve the folder with any static server for full ES module support in older setups, e.g.:
   ```
   npx serve .
   ```
3. Visit the printed local URL.

## Design Decisions

- **Room data is hardcoded** in `js/data/rooms.js` because the assessment explicitly rules out a backend or database — the goal is to demonstrate frontend logic, not data plumbing.
- **No backend/database**: all state lives in memory in `app.js` for the lifetime of the page. Refreshing the page resets selections, which is expected for a booking *widget* rather than a persistence layer.
- **Date validation** normalizes every date to UTC midnight (`dateUtils.js`) before comparing or subtracting, which avoids the off-by-one errors that local-timezone or daylight-saving arithmetic can introduce.
- **Booking calculation is separated from the DOM**: `bookingService.js` and `dateUtils.js` never touch `document`, so they can be unit tested and reasoned about independently of rendering.
- **Edge cases** (missing dates, past check-in, same-day stays, inverted ranges, a room becoming unavailable after a date change) are handled centrally in `validationUtils.js` and `bookingService.js`, so the UI never displays a total it can't back up.

## Testing

Manual testing covered the edge cases in the assessment brief: missing dates, missing room, past check-in, today as check-in, same-day and inverted ranges, one-night and multi-night stays, changing a selection after a valid calculation, and mobile widths.

Automated tests for `calculateNights` and `calculateTotal` run with:

```
node tests/booking.test.js
```

## Git Workflow

Development was committed in logical, single-purpose steps (project setup; room data and listing; date selection and validation; room selection and calculation; summary and error handling; responsive/accessibility polish; optional bonuses; README) rather than as one final commit.
