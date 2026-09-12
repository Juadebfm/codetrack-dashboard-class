# Auth page review: Emmanuel vs Wale

## Decision

Use [Wale's implementation](https://github.com/wale1759/codetrack-dashboard-react) as the visual reference when matching the supplied CodeTrack desktop auth designs.

It is closer to the target's overall composition: a top-right dark hero panel with white space below it. Emmanuel's version matches more of the target copy and some individual controls, but its dark right column fills the viewport height, which is a larger visual mismatch.

## Scope and method

This review compares the supplied 1340 × 900 desktop references for:

- Sign up
- Sign in
- Invalid sign-in state

Both repositories were cloned from their `main` branches on 2026-09-12 and checked at these commits:

| Repository | Commit reviewed |
| --- | --- |
| [wale1759/codetrack-dashboard-react](https://github.com/wale1759/codetrack-dashboard-react) | `884daab682a308486a90c3382b3d75e7a9793abb` |
| [Emmanuel-N873/codetrack-dashboard-react](https://github.com/Emmanuel-N873/codetrack-dashboard-react) | `589766d3c9b0a112605a348f5452ef142c2902d1` |

For each repository, the auth routes were rendered at the reference desktop size and at phone and tablet widths. Lint and production builds passed for both repositories.

The visual scores are review scores, not automated image-diff measurements. The supplied references do not include mobile targets, so responsive scores evaluate reflow, readability, and horizontal overflow rather than mobile pixel matching.

## Scores

| Repository | Desktop visual fidelity | Responsive behavior |
| --- | ---: | ---: |
| Wale | **61 / 100** | 58 / 100 |
| Emmanuel | 52 / 100 | **82 / 100** |

## Findings

### Wale

Strengths:

- The hero is a top-right dark panel with white space below it, matching the reference structure.
- The desktop form and hero positions are closer to the supplied desktop composition.
- The invalid-login message uses wording close to the supplied error state.
- The repository has reusable auth components, protected routes, and a broader dashboard implementation.

Gaps to fix before adopting its UI unchanged:

- The sign-in hero title and supporting copy differ from the supplied design.
- The desktop sign-in form omits the `Remember me` control shown in the reference.
- The invalid-login alert appears before the social buttons. The supplied design places it after the divider and visually invalidates both fields.
- The sign-up page visibly breaks at the tested 768px tablet width.

### Emmanuel

Strengths:

- Sign-in and sign-up copy closely follows the supplied design.
- The sign-in form includes the `Remember me` control.
- The layout had no horizontal overflow at the tested 320px through 1340px widths.
- Phone layouts are stable and readable.

Gaps that make it less suitable as the visual base:

- The right side is dark for the full viewport height, unlike the supplied design's top-only hero panel with white below it.
- Desktop form content is vertically lower than the reference.
- The invalid-login alert is before the social buttons and does not show the supplied red field-invalid treatment.
- The two-column layout begins at tablet width, making the 768px layout denser than necessary.

## Recommended implementation approach

Start from Wale's desktop composition, but keep the simpler responsive behavior demonstrated by Emmanuel:

1. Use a white, full-page two-column layout on desktop.
2. Keep the dark hero attached to the top of the right half only; leave the remainder of that half white.
3. Center the auth form within the left half and retain a 400px maximum form width.
4. Use the supplied sign-in, sign-up, and error-state copy exactly.
5. Show the error alert after the divider and add red borders and error markers to both invalid fields.
6. Collapse to a one-column mobile form before tablet-width crowding occurs.

## Current project outcome

The current project implements this recommended direction: a responsive split auth layout, supplied CodeTrack image assets, sign-up/sign-in flows, error handling, and a simple authenticated welcome dashboard.
