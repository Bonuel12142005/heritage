# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Layout Shift Detection
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the layout shift bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing navigation cases (dashboard→messages, gallery→heritage-form, messages→users)
  - Test that navigating between admin pages maintains consistent 260px sidebar width
  - Test that main content margin-left remains 260px across all navigations
  - Test that no horizontal layout shift occurs during page transitions
  - Run test on UNFIXED code (admin-messages.xian and admin-heritage-form.xian with 280px width)
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found:
    - admin-messages.xian sidebar width = 280px (expected 260px)
    - admin-heritage-form.xian sidebar width = 280px (expected 260px)
    - Layout shift of 20px occurs when navigating to/from these pages
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Visual and Functional Integrity
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for all non-width-related styling and functionality
  - Write property-based tests capturing observed behavior patterns:
    - Sidebar navigation links work with proper hover states and active indicators
    - Sidebar logo, badge, and menu structure render correctly
    - Mobile responsive behavior (240px for messages, 70px for heritage-form) works correctly
    - All color schemes, shadows, borders, typography remain unchanged
    - Sidebar z-index, positioning, and scrolling behavior work correctly
    - Main content area renders without unexpected wrapping or overflow
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3. Fix for admin sidebar width inconsistency

  - [x] 3.1 Update admin-messages.xian sidebar width
    - Change line ~14: `.sidebar { width: 280px; }` to `.sidebar { width: 260px; }`
    - Change line ~26: `.main-content { margin-left: 280px; }` to `.main-content { margin-left: 260px; }`
    - Verify mobile responsive width at line ~66 remains unchanged (240px)
    - _Bug_Condition: isBugCondition(navigation) where navigation involves admin-messages.xian with mismatched 280px width_
    - _Expected_Behavior: Consistent 260px sidebar width across all admin pages with no layout shift_
    - _Preservation: All sidebar styling, navigation functionality, responsive behavior, and visual elements remain unchanged_
    - _Requirements: 2.1, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_

  - [x] 3.2 Update admin-heritage-form.xian sidebar width
    - Change line ~14: `.sidebar { width: 280px; }` to `.sidebar { width: 260px; }`
    - Change line ~26: `.main-content { margin-left: 280px; }` to `.main-content { margin-left: 260px; }`
    - Verify mobile responsive width at line ~66 remains unchanged (70px)
    - _Bug_Condition: isBugCondition(navigation) where navigation involves admin-heritage-form.xian with mismatched 280px width_
    - _Expected_Behavior: Consistent 260px sidebar width across all admin pages with no layout shift_
    - _Preservation: All sidebar styling, navigation functionality, responsive behavior, and visual elements remain unchanged_
    - _Requirements: 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_

  - [x] 3.3 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Consistent Sidebar Width
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify sidebar width is 260px on admin-messages.xian
    - Verify sidebar width is 260px on admin-heritage-form.xian
    - Verify main content margin-left is 260px on both pages
    - Verify no layout shift occurs during navigation between any admin pages
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.4 Verify preservation tests still pass
    - **Property 2: Preservation** - Visual and Functional Integrity
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all visual styling remains identical (colors, fonts, shadows, borders)
    - Confirm navigation functionality works correctly (hover states, active states, links)
    - Confirm mobile responsive behavior works correctly (240px for messages, 70px for heritage-form)
    - Confirm main content layout renders correctly with no unexpected changes
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise
  - Verify no layout shift occurs when navigating between any admin pages
  - Verify sidebar width is consistently 260px across all admin pages
  - Verify all existing functionality and visual styling is preserved
