# Responsive review

Verified in local headless Chrome with viewport and touch emulation on 8 November 2026.

## Layout checks

Checked Home, all four programme pages, Testimonials, FAQ, Booking, Privacy and Disclaimer at widths of 320, 375, 768, 820, 1024, 1199, 1280 and 1440 CSS pixels (80 page/viewport combinations).

After the fixes, the audit found no elements extending horizontally outside the viewport and no audited buttons or footer navigation controls below 44 CSS pixels in height. Controls checked include buttons, `.btn` links, footer links and programme social links; inline links in body text are not treated as buttons.

## Interaction checks

Verified at 320×740, 375×812, 768×1024, 820×1180, 1024×768, 1199×900, 1280×800, 1440×1000 and 844×390:

- Touch navigation and programme dropdown links at widths using the collapsed menu.
- Full-story pop-up opening, closing and viewport fit.
- All three footer policy pop-ups opening, closing and fitting within the viewport.
- Search and sort interactions at phone and tablet widths (375 and 820 pixels).

Reviewed screenshots of the home header, Contact, footer and programme layout at phone, tablet and desktop sizes. The production build and six testimonial browsing tests pass.

## Limits

These are Chrome emulation checks, not physical-device or Safari/Firefox validation. Third-party analytics and Calendly requests were blocked during the audit; the booking widget's container sizing was checked, but its external calendar content was not.
