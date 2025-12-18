# Master Website Compliance & Quality Assurance Guide
**Comprehensive Checklist for Professional Web Development**  
**Version:** 1.0  
**Last Updated:** December 18, 2025  
**Purpose:** Complete website audit and optimization workflow for AI assistants and developers

---

## 📋 TABLE OF CONTENTS

1. [Overview & Methodology](#overview--methodology)
2. [WCAG Accessibility Checklist](#1-wcag-accessibility-checklist)
3. [UX/UI Design Checklist](#2-uxui-design-checklist)
4. [Technical & SEO Checklist](#3-technical--seo-checklist)
5. [Legal Compliance Checklist](#4-legal-compliance-checklist)
6. [Workflow Process](#workflow-process)
7. [Verification Methods](#verification-methods)
8. [Common Issues & Solutions](#common-issues--solutions)

---

## OVERVIEW & METHODOLOGY

### Purpose
This guide provides a systematic approach to auditing and optimizing websites for accessibility, user experience, search engine optimization, and legal compliance. It is designed to be used by AI assistants, developers, and quality assurance teams.

### Target Standards
- **WCAG 2.1 Level AA** (Web Content Accessibility Guidelines)
- **Modern UX/UI Best Practices**
- **Google Lighthouse 100/100 SEO Score**
- **GDPR & CCPA Legal Compliance**

### Success Criteria
A website passes all requirements when it achieves:
- ✅ 100% WCAG 2.1 AA compliance
- ✅ 95+ UX/UI score
- ✅ 100/100 Lighthouse SEO score
- ✅ Full GDPR/CCPA compliance

---

## 1. WCAG ACCESSIBILITY CHECKLIST

### 1.1 Semantic HTML
**Requirement:** Use proper HTML5 semantic tags instead of generic `<div>` elements where appropriate.

**Deterministic Goals:**
- [ ] `<header>` tag used for page header (1 per page)
- [ ] `<nav>` tag used for navigation menus (1+ per page)
- [ ] `<main>` tag wraps primary content (1 per page)
- [ ] `<footer>` tag used for page footer (1 per page)
- [ ] `<section>` tags used for thematic content grouping
- [ ] `<article>` tags used for independent, self-contained content
- [ ] `<button>` tags used for clickable actions (not `<div>` with click handlers)
- [ ] `<a>` tags used for navigation (not `<span>` or `<div>`)
- [ ] Decorative elements marked with `aria-hidden="true"`

**Verification Commands:**
```bash
# Check for semantic tags
grep -r "<header>" *.html
grep -r "<nav>" *.html
grep -r "<main>" *.html
grep -r "<footer>" *.html
grep -r "<button>" *.html

# Check for non-semantic patterns (anti-patterns)
grep -r "div.*onclick" *.html  # Should use <button> instead
grep -r "span.*href" *.html     # Should use <a> instead

Common Issues:
Using <div class="header"> instead of <header>
Using <div onclick=""> instead of <button>
Missing <main> landmark
Multiple <main> tags on one page
Fix Example:
<!-- ❌ WRONG -->
<div class="header">
    <div class="nav">
        <div onclick="navigate()">Home</div>
    </div>
</div>


<!-- ✅ CORRECT -->
<header>
    <nav aria-label="Primary navigation">
        <button onclick="navigate()">Home</button>
    </nav>
</header>



1.2 Alt Text for Images
Requirement: All images must have descriptive alt attributes. Decorative images use alt="".
Deterministic Goals:
 Every <img> tag has an alt attribute
 Descriptive images have meaningful alt text (50-150 characters)
 Alt text describes the content/function, not just "image of..."
 Decorative images use alt="" (empty string)
 Complex images have extended descriptions (longdesc or aria-describedby)
 Alt text doesn't include "image", "picture", "photo" (redundant for screen readers)
Verification Commands:
# Find all images
grep -r "<img" *.html


# Find images without alt attributes (FAIL)
grep -r "<img[^>]*>" *.html | grep -v "alt="


# Find images with empty/missing alt text
grep -r 'alt=""' *.html
grep -r 'alt="[^"]*"' *.html


Alt Text Quality Check:
# Extract all alt text for manual review
grep -oP 'alt="\K[^"]*' *.html


Common Issues:
Missing alt attribute entirely
Generic alt text: alt="image" or alt="photo"
Alt text too short: alt="logo"
Decorative images with descriptive alt text
Fix Examples:
<!-- ❌ WRONG -->
<img src="profile.jpg">
<img src="profile.jpg" alt="image">
<img src="profile.jpg" alt="A photo">
<img src="decorative-line.svg" alt="Decorative line">


<!-- ✅ CORRECT -->
<img src="profile.jpg" alt="Brandon Orozco, AI Implementation Consultant, professional headshot">
<img src="decorative-line.svg" alt="" aria-hidden="true">


Alt Text Writing Guide:
Informative images: Describe what's in the image and its purpose
Functional images (buttons/links): Describe the action/destination
Decorative images: Use alt="" and aria-hidden="true"
Complex images (charts/graphs): Provide both alt text and extended description

1.3 Color Contrast
Requirement: Text must have sufficient contrast against backgrounds (WCAG AA: 4.5:1 for normal text, 3:1 for large text).
Deterministic Goals:
 Body text (normal size): 4.5:1 minimum contrast ratio
 Large text (18px+): 3:1 minimum contrast ratio
 Links: Sufficient contrast against background
 Buttons: Sufficient contrast in all states (default, hover, focus, disabled)
 Form inputs: Sufficient contrast for text and borders
 Error messages: Sufficient contrast for visibility
Verification Methods:
Manual Testing: Use browser DevTools contrast checker
Automated Tools: WebAIM Contrast Checker, Lighthouse audit
CSS Review: Check color values in stylesheets
Verification Commands:
# Extract all color values from CSS
grep -r "color:" style.css | grep -v "background"
grep -r "background-color:" style.css


# Find semi-transparent text (potential contrast issues)
grep -r "rgba.*0\.[0-9])" style.css
grep -r "opacity:" style.css


Color Contrast Calculation:
Contrast Ratio = (L1 + 0.05) / (L2 + 0.05)
Where L1 is lighter color luminance, L2 is darker color luminance


Common Issues:
Light gray text on white background
Semi-transparent overlays reducing contrast
Colored text on colored backgrounds without checking contrast
Link colors that don't meet 3:1 contrast with surrounding text
Fix Examples:
/* ❌ WRONG - Insufficient Contrast */
.text {
    color: rgba(255, 255, 255, 0.5); /* Only 2.3:1 contrast */
    background: #1a1a1a;
}


/* ✅ CORRECT - Sufficient Contrast */
.text {
    color: rgba(255, 255, 255, 0.95); /* 5.2:1 contrast */
    background: #1a1a1a;
}


Recommended Minimum Opacities:
White text on dark backgrounds: 0.85+ opacity
Dark text on light backgrounds: 0.9+ opacity
Always test with contrast checker tools

1.4 Keyboard Navigation
Requirement: All interactive elements must be keyboard accessible with logical tab order.
Deterministic Goals:
 All links can be accessed via Tab key
 All buttons can be accessed via Tab key
 All form inputs can be accessed via Tab key
 Tab order is logical (top to bottom, left to right)
 Focus indicators are visible (outline/border on :focus)
 Skip link provided for screen reader users
 No keyboard traps (can tab out of all elements)
 Enter/Space keys activate buttons
 Arrow keys work in appropriate widgets (menus, sliders)
Verification Method:
Manual Test: Unplug mouse, navigate entire site with Tab key
Check Focus Styles: Verify visible focus indicators on all interactive elements
Tab Order: Verify logical sequence matches visual layout
Verification Commands:
# Check for focus styles
grep -r ":focus" style.css
grep -r "focus-visible" style.css


# Find elements with tabindex
grep -r "tabindex" *.html


# Check for skip links
grep -r "skip" *.html


Common Issues:
Missing :focus styles (invisible focus indicator)
tabindex values > 0 (disrupts natural tab order)
Interactive divs without tabindex="0"
Form inputs not reachable via keyboard
Custom widgets without keyboard support
Fix Examples:
/* ❌ WRONG - No visible focus */
a:focus {
    outline: none; /* NEVER do this without alternative */
}


/* ✅ CORRECT - Clear focus indicator */
a:focus-visible,
button:focus-visible,
input:focus-visible {
    outline: 3px solid #003D7A;
    outline-offset: 4px;
}


<!-- ✅ Skip Link for Screen Readers -->
<a href="#main-content" class="skip-link">Skip to main content</a>


Keyboard Testing Checklist:
 Tab through entire page
 Shift+Tab moves backward
 Enter activates links and buttons
 Space activates buttons
 Escape closes modals/dropdowns
 Arrow keys navigate menus

1.5 Form Labels
Requirement: All form inputs must have associated <label> tags with proper for/id matching.
Deterministic Goals:
 Every <input> has a corresponding <label>
 Label for attribute matches input id attribute
 Labels are descriptive (not just "Input 1")
 Required fields indicated (visually and with aria-required="true")
 Error messages associated with inputs (via aria-describedby)
 Fieldsets used for radio/checkbox groups with <legend>
 Placeholder text is NOT used as the only label
Verification Commands:
# Find all form inputs
grep -r "<input" *.html


# Check for labels
grep -r "<label" *.html


# Find inputs without associated labels (check id/for matching)
grep -oP 'id="\K[^"]*' *.html | sort | uniq -c
grep -oP 'for="\K[^"]*' *.html | sort | uniq -c


Common Issues:
Input without a label
Label without for attribute
for attribute doesn't match any input id
Using placeholder as the only label
Labels not descriptive enough
Fix Examples:
<!-- ❌ WRONG -->
<input type="text" placeholder="Name">
<label>Email</label>
<input type="email" id="email">


<!-- ✅ CORRECT -->
<label for="name">Full Name *</label>
<input type="text" id="name" name="name" required aria-required="true">


<label for="email">Email Address *</label>
<input type="email" id="email" name="email" required aria-required="true">


<!-- Radio Group -->
<fieldset>
    <legend>Select your preference</legend>
    <label><input type="radio" name="pref" value="1"> Option 1</label>
    <label><input type="radio" name="pref" value="2"> Option 2</label>
</fieldset>


Form Accessibility Checklist:
 All inputs have labels
 Required fields marked with * and aria-required="true"
 Error messages shown inline with aria-live="polite"
 Success messages announced to screen readers
 Form validation provides clear feedback

1.6 Heading Hierarchy
Requirement: Use <h1> through <h6> in logical order. Only one <h1> per page.
Deterministic Goals:
 Each page has exactly ONE <h1> tag
 Headings follow sequential order (h1 → h2 → h3, never skip levels)
 Headings describe the content that follows
 Document outline is logical and meaningful
 No empty headings
 Heading levels not used for styling (use CSS instead)
Verification Commands:
# Count h1 tags per file (should be 1)
for file in *.html; do 
    echo "$file: $(grep -c '<h1' $file) h1 tag(s)"
done


# Check heading hierarchy
grep -r "<h[1-6]" *.html | grep -oP '<h[1-6][^>]*>.*?</h[1-6]>'


# Find all heading text
grep -oP '<h[1-6][^>]*>\K[^<]*' *.html


Common Issues:
Multiple <h1> tags on one page
Skipping heading levels (h1 → h3 without h2)
Using headings for styling instead of semantic structure
Empty or meaningless headings
Logo as h1 on every page (should be site name or page title)
Fix Examples:
<!-- ❌ WRONG -->
<h1>My Site</h1>
<h1>Welcome</h1>  <!-- Two h1s! -->
<h4>Section</h4>   <!-- Skipped h2 and h3 -->


<!-- ✅ CORRECT -->
<h1>Brandon Orozco - AI Implementation Consultant</h1>
<h2>Services</h2>
<h3>Website Development</h3>
<h3>AI Integration</h3>
<h2>Recent Projects</h2>
<h3>Comett Music Platform</h3>


Document Outline Test:
Create a table of contents from headings - it should read logically:
H1: About Brandon Orozco
  H2: Professional Background
    H3: Education
    H3: Certifications
  H2: Technical Skills
    H3: Programming Languages
    H3: Frameworks & Tools



2. UX/UI DESIGN CHECKLIST
2.1 Responsiveness
Requirement: Site must look good and function correctly on mobile, tablet, and desktop screens.
Deterministic Goals:
 Mobile breakpoint (≤768px) implemented with media queries
 Tablet breakpoint (769px-1024px) implemented
 Desktop (>1024px) provides optimal layout
 Images scale responsively (max-width: 100%)
 Text remains readable at all sizes (no horizontal scrolling)
 Touch targets are minimum 44x44px on mobile
 Navigation adapts to smaller screens (hamburger menu)
 Tables become scrollable or reflow on mobile
 No fixed-width elements that break layout
 Viewport meta tag present: <meta name="viewport" content="width=device-width, initial-scale=1">
Verification Commands:
# Check for viewport meta tag
grep -r "viewport" *.html


# Find media queries
grep -r "@media" style.css


# Check for responsive image classes
grep -r "max-width.*100%" style.css
grep -r "width:.*100%" style.css


Testing Method:
Browser DevTools: Open responsive design mode
Test Sizes: 375px (mobile), 768px (tablet), 1440px (desktop)
Rotate: Test portrait and landscape orientations
Common Issues:
Missing viewport meta tag (site zoomed out on mobile)
Fixed pixel widths that don't scale
Text too small to read on mobile
Buttons too small to tap on mobile
Horizontal scrolling on small screens
Images overflow containers
Fix Examples:
<!-- ✅ REQUIRED: Viewport Meta Tag -->
<meta name="viewport" content="width=device-width, initial-scale=1">
/* ❌ WRONG - Fixed widths */
.container {
    width: 1200px; /* Breaks on smaller screens */
}


/* ✅ CORRECT - Responsive widths */
.container {
    width: 100%;
    max-width: 1200px;
    padding: 0 var(--space-16);
}


/* Mobile breakpoint */
@media (max-width: 768px) {
    .container {
        padding: 0 var(--space-8);
    }
    
    h1 {
        font-size: 2rem; /* Smaller on mobile */
    }
    
    .desktop-only {
        display: none;
    }
}


/* Tablet breakpoint */
@media (min-width: 769px) and (max-width: 1024px) {
    .grid {
        grid-template-columns: repeat(2, 1fr); /* 2 columns on tablet */
    }
}


Responsive Testing Checklist:
 Test at 320px, 375px, 768px, 1024px, 1440px
 Check both portrait and landscape
 Verify text readability without zooming
 Confirm all buttons are tappable (44x44px minimum)
 Ensure no horizontal scrolling
 Test form usability on mobile
 Check image loading and scaling

2.2 Navigation
Requirement: Menu must be easy to find and use. Mobile should use hamburger menu or appropriate pattern.
Deterministic Goals:
 Navigation is in consistent location across all pages
 Desktop: Horizontal nav bar or sidebar clearly visible
 Mobile (≤768px): Hamburger menu icon (☰) implemented
 Hamburger menu has proper ARIA label: aria-label="Toggle navigation menu"
 Menu state tracked with aria-expanded="true/false"
 JavaScript handles menu toggle functionality
 Menu is keyboard accessible (Tab, Enter, Escape)
 Active page is visually indicated
 All navigation links are descriptive (not "Click here")
 Sticky/fixed navigation (optional but recommended)
Verification Commands:
# Check for navigation element
grep -r "<nav" *.html


# Check for hamburger menu button
grep -r "nav-toggle\|menu-toggle\|hamburger" *.html


# Check for JavaScript navigation file
ls js/navigation.js


# Verify ARIA labels
grep -r "aria-label.*nav" *.html
grep -r "aria-expanded" *.html


Testing Method:
Desktop: Verify nav is visible and links work
Mobile: Verify hamburger menu appears and toggles
Keyboard: Tab through navigation, press Enter to activate
Screen Reader: Verify ARIA labels are descriptive
Common Issues:
No hamburger menu on mobile (desktop nav cramped)
Hamburger menu without ARIA attributes
Menu doesn't close after clicking a link
No visual indication of active page
Navigation hidden or hard to find
Fix Examples:
<!-- ✅ CORRECT: Responsive Navigation -->
<nav aria-label="Primary navigation">
    <button class="nav-toggle" 
            aria-label="Toggle navigation menu" 
            aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
    </button>
    
    <ul class="nav-menu">
        <li><a href="index.html" aria-current="page">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="blog.html">Blog</a></li>
        <li><a href="contact.html">Contact</a></li>
    </ul>
</nav>
/* Desktop Navigation */
.nav-menu {
    display: flex;
    gap: var(--space-24);
}


.nav-toggle {
    display: none; /* Hidden on desktop */
}


/* Mobile Navigation */
@media (max-width: 768px) {
    .nav-toggle {
        display: block;
        /* Hamburger icon styles */
    }
    
    .nav-menu {
        display: none; /* Hidden by default */
        flex-direction: column;
    }
    
    .nav-menu.active {
        display: flex; /* Show when toggled */
    }
}
// JavaScript: Toggle Menu
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');


navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
});



2.3 Typography
Requirement: Use readable font size (16px base) and limit to 2-3 font families.
Deterministic Goals:
 Base font size is 16px minimum (18px recommended)
 Maximum 3 font families used across entire site
 Font families defined in CSS variables for consistency
 Body text is 16-18px
 Headings scale proportionally (h1: 2.5-3rem, h2: 2rem, h3: 1.5rem)
 Line height is 1.5-1.7 for body text
 Line length (measure) is 45-75 characters
 Font weights used sparingly (400 for normal, 700 for bold)
 No font sizes smaller than 14px
 Mobile: Font sizes scale down appropriately
Verification Commands:
# Check font-family declarations
grep -r "font-family:" style.css | sort | uniq


# Count unique font families
grep -r "font-family:" style.css | grep -oP "font-family:[^;]*" | sort | uniq | wc -l


# Check base font size on body
grep -r "body\s*{" -A 10 style.css | grep "font-size"


# Find all font-size declarations
grep -r "font-size:" style.css


Common Issues:
Too many font families (4+)
Base font size too small (14px or less)
Inconsistent font usage (different fonts on different pages)
Font sizes not responsive (too large on mobile)
Poor line height (text cramped)
Fix Examples:
/* ❌ WRONG - Too many fonts */
body { font-family: Arial; }
h1 { font-family: Georgia; }
h2 { font-family: Helvetica; }
.special { font-family: Comic Sans; }


/* ✅ CORRECT - 2-3 font families max */
:root {
    --font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --font-heading: Georgia, "Times New Roman", serif;
    --font-mono: "Courier New", monospace;
}


body {
    font-family: var(--font-primary);
    font-size: 18px; /* Base size */
    line-height: 1.6;
}


h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    line-height: 1.2;
}


code, pre {
    font-family: var(--font-mono);
}


/* Responsive Typography */
@media (max-width: 768px) {
    body {
        font-size: 16px; /* Slightly smaller on mobile */
    }
    
    h1 {
        font-size: 2rem; /* 32px instead of 48px */
    }
}


Typography Checklist:
 2-3 font families maximum
 Base font size 16px+
 Line height 1.5-1.7 for readability
 Consistent heading scale
 No text smaller than 14px
 Mobile font sizes adjusted
 Font weights limited to 2-3 values

2.4 Whitespace
Requirement: Give content room to breathe. Avoid clutter.
Deterministic Goals:
 Consistent spacing system using CSS variables
 Section padding: 48px-128px (desktop)
 Element margins: 16px, 24px, 32px, 48px (multiples of 8)
 Cards/boxes have internal padding (24px-48px)
 Line spacing (margin-bottom) between paragraphs (16px-24px)
 Generous margins around images (24px-32px)
 No elements touching page edges (minimum 16px padding)
 Mobile: Reduced but proportional spacing
 Empty space is intentional, not accidental
Verification Commands:
# Check spacing variables
grep -r "\-\-space" style.css


# Find padding declarations
grep -r "padding:" style.css


# Find margin declarations
grep -r "margin:" style.css


Common Issues:
Inconsistent spacing (random pixel values)
Too little whitespace (content cramped)
Too much whitespace (content lost)
Elements touching edges on mobile
No spacing system/variables
Fix Examples:
/* ✅ Spacing System with Variables */
:root {
    --space-4: 4px;
    --space-8: 8px;
    --space-16: 16px;
    --space-24: 24px;
    --space-32: 32px;
    --space-48: 48px;
    --space-64: 64px;
    --space-96: 96px;
    --space-128: 128px;
}


/* Apply consistent spacing */
section {
    padding: var(--space-96) 0; /* Vertical rhythm */
}


.container {
    padding: 0 var(--space-48);
    max-width: 1200px;
    margin: 0 auto;
}


.card {
    padding: var(--space-48);
    margin-bottom: var(--space-32);
}


p {
    margin-bottom: var(--space-24);
}


h2 {
    margin-top: var(--space-64);
    margin-bottom: var(--space-32);
}


/* Mobile: Reduce spacing proportionally */
@media (max-width: 768px) {
    section {
        padding: var(--space-48) 0;
    }
    
    .container {
        padding: 0 var(--space-16);
    }
    
    .card {
        padding: var(--space-24);
    }
}


Whitespace Principles:
Micro-whitespace: Between letters, words, lines (line-height, letter-spacing)
Macro-whitespace: Between sections, elements (padding, margin)
Use multiples of 8: 8px, 16px, 24px, 32px, 48px, 64px
Consistent: Same spacing for similar elements
Proportional: Larger on desktop, smaller on mobile

2.5 Call to Action (CTA)
Requirement: Primary action buttons must be prominent and easy to click.
Deterministic Goals:
 Primary CTA is visually distinct (different color, larger, bold)
 CTA buttons minimum 44x44px (touch-friendly)
 CTA text is action-oriented ("Schedule Consultation", "Get Started")
 Hover states show interactivity (color change, shadow, transform)
 Focus states are visible (outline or border)
 CTAs placed at logical decision points
 One primary CTA per section (avoid competing actions)
 CTA buttons stand out from body text and links
 Mobile: CTAs remain easy to tap (full width or prominent)
Verification Commands:
# Find CTA buttons
grep -r "btn-primary\|cta\|call-to-action" *.html


# Check button styles
grep -r ".btn-primary" style.css -A 20


# Verify hover/focus states
grep -r ".btn.*:hover\|.btn.*:focus" style.css


Common Issues:
CTA looks like regular link or button
No hover/focus states
Too many competing CTAs
CTA text unclear ("Click here", "Submit")
CTA too small on mobile
Fix Examples:
<!-- ✅ CORRECT: Clear, Action-Oriented CTA -->
<a href="contact.html" class="btn btn-primary">
    Schedule Free Consultation
</a>
/* ✅ Prominent Primary CTA */
.btn-primary {
    display: inline-block;
    padding: 16px 32px;
    font-size: 18px;
    font-weight: 700;
    color: var(--color-white);
    background-color: var(--color-blue);
    border: 3px solid var(--color-blue);
    border-radius: 4px;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 61, 122, 0.3);
    cursor: pointer;
    
    /* Minimum touch target */
    min-width: 44px;
    min-height: 44px;
}


.btn-primary:hover {
    background-color: var(--color-black);
    border-color: var(--color-black);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 61, 122, 0.4);
}


.btn-primary:focus-visible {
    outline: 3px solid var(--color-blue);
    outline-offset: 4px;
}


/* Mobile: Full width for easier tapping */
@media (max-width: 768px) {
    .btn-primary {
        width: 100%;
        text-align: center;
    }
}


CTA Best Practices:
Action verbs: "Start", "Get", "Join", "Schedule", "Download"
Specificity: "Schedule Free Consultation" > "Learn More"
Urgency: "Start Today", "Get Started Now"
Value: "Get Your Free Guide", "See Pricing"
Visibility: High contrast, prominent placement
One primary: Per section/page (secondary CTAs can be less prominent)

2.6 404 Page
Requirement: Custom error page that guides users back to home.
Deterministic Goals:
 File named 404.html exists in root and docs/ directory
 Page includes full site navigation (header, nav)
 Large, clear "404" or "Page Not Found" heading
 Friendly, helpful error message (not technical jargon)
 At least one CTA button back to homepage
 Optionally: Links to main sections (About, Blog, Contact)
 Optionally: Search bar or sitemap
 Same styling as rest of site (consistent branding)
 Page title: "404 - Page Not Found | Your Site Name"
Verification Commands:
# Check if 404.html exists
ls 404.html
ls docs/404.html


# Verify 404 page has navigation
grep -r "<nav" 404.html


Common Issues:
No 404 page (uses generic GitHub Pages or server default)
404 page missing navigation (user stuck)
Error message is technical or unhelpful
No way to navigate back to site
Inconsistent branding
Fix Example:
<!-- ✅ CORRECT: Custom 404 Page -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found | Brandon Orozco</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Full Navigation -->
    <nav aria-label="Primary navigation">
        <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="contact.html">Contact</a></li>
        </ul>
    </nav>
    
    <main class="error-page">
        <div class="error-number">404</div>
        <h1>Page Not Found</h1>
        <p>Sorry, the page you're looking for doesn't exist or has been moved.</p>
        
        <div class="error-actions">
            <a href="index.html" class="btn btn-primary">Go to Homepage</a>
            <a href="contact.html" class="btn btn-secondary">Contact Us</a>
        </div>
        
        <div class="error-links">
            <h2>Try these pages instead:</h2>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="about.html">About Me</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
        </div>
    </main>
    
    <footer>
        <p>© 2025 Brandon Orozco. All rights reserved.</p>
    </footer>
</body>
</html>
/* 404 Page Styling */
.error-page {
    text-align: center;
    padding: var(--space-96) var(--space-48);
}


.error-number {
    font-size: 10rem;
    font-weight: 700;
    opacity: 0.1;
}


.error-page h1 {
    font-size: 3rem;
    margin-bottom: var(--space-24);
}


.error-actions {
    display: flex;
    gap: var(--space-16);
    justify-content: center;
    margin: var(--space-48) 0;
}



2.7 Favicon
Requirement: Small icon in browser tab representing the site.
Deterministic Goals:
 Favicon file exists (.ico, .png, or .svg)
 Multiple sizes provided for different devices (16x16, 32x32, 180x180)
 Favicon linked in <head> of all HTML pages
 SVG favicon includes fallback formats
 Favicon is recognizable at small sizes
 Favicon matches brand colors/logo
 Apple touch icon provided for iOS (180x180px)
Verification Commands:
# Check for favicon file
ls favicon.* 
ls apple-touch-icon.png


# Verify favicon links in HTML
grep -r "favicon\|apple-touch-icon" *.html


Common Issues:
No favicon (browser shows generic icon)
Favicon not linked in HTML
Favicon too complex (unrecognizable when small)
Missing mobile/iOS icons
Fix Examples:
<!-- ✅ CORRECT: Comprehensive Favicon Setup -->
<head>
    <!-- SVG Favicon (Modern Browsers) -->
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
    
    <!-- PNG Fallback (Older Browsers) -->
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
    
    <!-- Apple Touch Icon (iOS) -->
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    
    <!-- Android Chrome -->
    <link rel="manifest" href="site.webmanifest">
</head>


Creating Favicons:
Design: Simple, recognizable icon (logo, initials, symbol)
Formats:
favicon.svg (modern, scalable)
favicon-32x32.png (standard)
favicon-16x16.png (small)
apple-touch-icon.png (180x180px for iOS)
Generator Tools: favicon.io, realfavicongenerator.net

3. TECHNICAL & SEO CHECKLIST
3.1 Valid Code
Requirement: HTML and CSS must pass W3C validation.
Deterministic Goals:
 All HTML files have valid DOCTYPE declaration
 All HTML tags are properly closed
 All HTML attributes are properly quoted
 No deprecated HTML tags (e.g., <center>, <font>)
 CSS properties use valid values
 No syntax errors in CSS or JavaScript
 Character encoding specified: <meta charset="UTF-8">
 Language attribute on <html> tag: <html lang="en">
Verification Methods:
W3C HTML Validator: https://validator.w3.org/
W3C CSS Validator: https://jigsaw.w3.org/css-validator/
Manual Check: Review code structure
Verification Commands:
# Check DOCTYPE
head -1 *.html


# Check for unclosed tags (simplified check)
grep -r "<[a-z]*>" *.html | grep -v "</"


# Check for deprecated tags
grep -rE "<(center|font|marquee|blink)" *.html


# Check charset declaration
grep -r "charset" *.html


# Check lang attribute
grep -r '<html.*lang=' *.html


Common Issues:
Missing DOCTYPE
Unclosed tags (<div> without </div>)
Attributes without quotes: <img src=image.jpg> should be <img src="image.jpg">
Invalid CSS properties or values
Missing charset or language declaration
Fix Examples:
<!-- ❌ WRONG -->
<html>
<head>
<body>
<div>Content
<img src=photo.jpg>


<!-- ✅ CORRECT -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
</head>
<body>
    <div>Content</div>
    <img src="photo.jpg" alt="Description">
</body>
</html>



3.2 No Broken Links
Requirement: All internal and external links must work correctly.
Deterministic Goals:
 All navigation links point to existing pages
 All internal links (same site) use relative paths correctly
 All external links (other sites) use absolute URLs with https://
 External links open in new tab with target="_blank" rel="noopener noreferrer"
 No 404 errors when clicking links
 Image src attributes point to existing files
 CSS and JS file paths are correct
 No typos in file names or paths
Verification Commands:
# Find all href links
grep -r "href=" *.html


# Find all external links (http/https)
grep -rE 'href="https?://' *.html


# Find all internal links
grep -r 'href="[^h]' *.html | grep -v "mailto:"


# Check if linked files exist
for file in $(grep -oP 'href="\K[^"]*' *.html | grep -v "^http" | grep -v "^mailto" | grep -v "^#"); do
    if [ ! -f "$file" ]; then
        echo "Broken link: $file"
    fi
done


# Check image paths
grep -oP 'src="\K[^"]*' *.html | while read img; do
    if [ ! -f "$img" ]; then
        echo "Missing image: $img"
    fi
done


Common Issues:
Typos in file names: abuot.html instead of about.html
Incorrect paths: /page.html vs page.html
Links to non-existent pages
External links without protocol: www.example.com instead of https://www.example.com
Missing images or resources
Fix Examples:
<!-- ❌ WRONG -->
<a href="abuot.html">About</a>
<a href="contact">Contact</a>
<a href="www.example.com">External</a>
<img src="images/missing.jpg" alt="Photo">


<!-- ✅ CORRECT -->
<a href="about.html">About</a>
<a href="contact.html">Contact</a>
<a href="https://www.example.com" target="_blank" rel="noopener noreferrer">External</a>
<img src="images/profile.jpg" alt="Brandon Orozco professional photo">


Link Testing Checklist:
 Click every link on every page
 Verify navigation menu works
 Test external links open in new tab
 Check all image links load
 Verify CSS and JS files load (check browser console)

3.3 GitHub Pages Deployment
Requirement: Site must be deployed and accessible via public URL.
Deterministic Goals:
 Repository has a docs folder with all website files
 GitHub Pages is enabled in repository settings
 Source set to "main" branch and "/docs" folder
 All HTML, CSS, JS, and image files are in docs/
 Site is accessible at: https://username.github.io/repository-name/
 No 404 errors on deployed site
 All pages load correctly
 All assets (images, CSS, JS) load correctly
Deployment Steps:
# 1. Ensure docs/ folder has all files
ls docs/


# 2. Commit and push to GitHub
git add docs/
git commit -m "Deploy website to GitHub Pages"
git push origin main


# 3. Enable GitHub Pages
# Go to: https://github.com/USERNAME/REPO/settings/pages
# Source: Deploy from a branch
# Branch: main
# Folder: /docs
# Click Save


Verification Commands:
# Check if docs/ folder exists and has content
ls -la docs/


# Verify all main files are in docs/
diff -rq . docs/ --exclude=.git --exclude=node_modules --exclude=docs


Common Issues:
docs/ folder doesn't exist or is empty
GitHub Pages not enabled in settings
Wrong branch selected (should be "main")
Wrong folder selected (should be "/docs")
Site URL incorrect (missing username or repo name)
Mixed content errors (http vs https)
Fix:
# If docs/ doesn't exist or is out of sync
cp -r *.html docs/
cp -r *.css docs/
cp -r js/ docs/
cp -r images/ docs/
cp -r *.svg docs/
git add docs/
git commit -m "Sync files to docs for GitHub Pages"
git push origin main



3.4 Unique Page Titles
Requirement: Every page must have a unique, descriptive <title> tag.
Deterministic Goals:
 Every HTML file has a <title> tag in <head>
 Each title is unique (no duplicates)
 Titles are descriptive (50-60 characters)
 Format: "Page Name - Site Name" or "Page Name | Site Name"
 Homepage: "Site Name - Tagline" or just "Site Name"
 Titles include relevant keywords for SEO
 No generic titles: "Untitled", "Page 1", "New Page"
Verification Commands:
# Extract all titles
grep -r "<title>" *.html


# Check for duplicates
grep -oP '<title>\K[^<]*' *.html | sort | uniq -c | sort -rn


# Verify each file has exactly one title
for file in *.html; do
    count=$(grep -c "<title>" "$file")
    echo "$file: $count title tag(s)"
done


Common Issues:
Same title on all pages
Missing title tag
Generic or non-descriptive titles
Titles too long (>60 characters) or too short (<30 characters)
Fix Examples:
<!-- ❌ WRONG - Not unique, not descriptive -->
<title>My Website</title>  <!-- On every page -->
<title>Page</title>
<title>Untitled Document</title>


<!-- ✅ CORRECT - Unique and descriptive -->
<!-- index.html -->
<title>Brandon Orozco - AI Implementation Consultant</title>


<!-- about.html -->
<title>About Me - Brandon Orozco</title>


<!-- blog.html -->
<title>Blog - Brandon Orozco</title>


<!-- contact.html -->
<title>Contact - Brandon Orozco</title>


<!-- 404.html -->
<title>404 - Page Not Found | Brandon Orozco</title>


Title Writing Best Practices:
Primary keyword first: Most important term at the start
Brand name last: "Page Name - Brand" format
Length: 50-60 characters (shows fully in search results)
Unique: No two pages should have the same title
Descriptive: User should know what page it is from title alone

3.5 Meta Descriptions
Requirement: Every page must have a meta description tag (150-160 characters).
Deterministic Goals:
 Every HTML file has <meta name="description" content="..."> in <head>
 Each description is unique
 Descriptions are 150-160 characters (optimal for search results)
 Descriptions accurately summarize page content
 Descriptions include relevant keywords
 Descriptions are compelling (encourage clicks)
 Descriptions end with a call-to-action when appropriate
Verification Commands:
# Extract all meta descriptions
grep -r 'meta name="description"' *.html


# Get description content
grep -oP 'meta name="description" content="\K[^"]*' *.html


# Check character count
grep -oP 'meta name="description" content="\K[^"]*' *.html | while read desc; do
    echo "${#desc} chars: $desc"
done


Common Issues:
Missing meta description
Description too short (<100 characters) or too long (>160 characters)
Duplicate descriptions across pages
Generic descriptions: "Welcome to my website"
Descriptions don't match page content
Fix Examples:
<!-- ❌ WRONG -->
<meta name="description" content="My website">  <!-- Too short, generic -->
<meta name="description" content="This is a very long description that goes on and on and on and won't show fully in search results because it's way too long and will get cut off which looks unprofessional">  <!-- Too long -->


<!-- ✅ CORRECT -->
<!-- index.html -->
<meta name="description" content="Brandon Orozco is an AI Implementation Consultant specializing in custom AI websites, automation, and intelligent solutions for businesses. Schedule a free consultation today.">


<!-- about.html -->
<meta name="description" content="Learn about Brandon Orozco's background in AI development, web design, and technical consulting. Discover his expertise in building intelligent, user-friendly digital solutions.">


<!-- blog.html -->
<meta name="description" content="Explore Brandon Orozco's blog featuring insights on AI implementation, web development tutorials, case studies, and best practices for modern digital solutions.">


<!-- contact.html -->
<meta name="description" content="Get in touch with Brandon Orozco for AI consulting, custom website development, or technical project collaboration. Book a free 30-minute consultation or send a message directly.">


Meta Description Best Practices:
Length: 150-160 characters (shows fully in Google)
Unique: Every page needs its own description
Accurate: Must reflect actual page content
Keywords: Include 1-2 relevant keywords naturally
Compelling: Write like ad copy to encourage clicks
Call-to-action: "Learn more", "Get started", "Contact us"
Avoid: Keyword stuffing, duplicate content, misleading claims

3.6 Semantic Structure (Revisited for SEO)
Requirement: Correct heading hierarchy for search engine understanding.
Deterministic Goals:
 One <h1> per page containing primary keyword
 <h2> tags for main sections
 <h3> tags for subsections under <h2>
 No skipped heading levels
 Headings create a logical outline
 Keywords used naturally in headings
 Headings are descriptive (not "Section 1", "Part A")
See Section 1.6 for detailed requirements
SEO-Specific Heading Tips:
H1: Should contain main keyword/topic of page
H2-H3: Should contain related keywords and variations
Natural language: Write for humans first, SEO second
Question format: "How to...", "What is...", "Why..." (voice search)

3.7 Image Alt Text (Revisited for SEO)
Requirement: Descriptive alt text helps search engines understand images.
Deterministic Goals:
 All images have descriptive alt attributes
 Alt text includes relevant keywords where appropriate
 Alt text describes image content and context
 Decorative images use alt=""
 Alt text is concise (125 characters or less)
See Section 1.2 for detailed requirements
SEO-Specific Alt Text Tips:
Include keywords naturally: Don't force them
Describe context: How does image relate to surrounding content?
Be specific: "Brandon Orozco giving presentation" > "man presenting"
File names matter too: Use brandon-orozco-profile.jpg not IMG_1234.jpg

3.8 Open Graph Tags
Requirement: Include Open Graph meta tags for social media sharing.
Deterministic Goals:
 og:title on every page (similar to <title>)
 og:description on every page (similar to meta description)
 og:image with absolute URL to social share image (1200x630px recommended)
 og:url with canonical page URL
 og:type ("website" for most pages, "article" for blog posts)
 og:site_name with site/brand name
 Optional: og:locale (e.g., "en_US")
 Twitter Card tags for Twitter-specific sharing
Verification Commands:
# Check for Open Graph tags
grep -r 'property="og:' *.html


# Verify og:image is absolute URL
grep -r 'property="og:image"' *.html


Common Issues:
Missing Open Graph tags (site looks unprofessional when shared)
Relative image URLs (og:image must be absolute: https://...)
Wrong image dimensions (optimal: 1200x630px)
Same og:title and og:description on all pages
Missing og:url (canonical URL)
Fix Examples:
<!-- ❌ WRONG -->
<meta property="og:title" content="My Site">  <!-- Same on all pages -->
<meta property="og:image" content="image.jpg">  <!-- Relative path, won't work -->


<!-- ✅ CORRECT -->
<head>
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://brandonorozco12623-creator.github.io/boportfolio/index.html">
    <meta property="og:title" content="Brandon Orozco - AI Implementation Consultant">
    <meta property="og:description" content="Specializing in custom AI websites, automation, and intelligent solutions for businesses. Schedule a free consultation today.">
    <meta property="og:image" content="https://brandonorozco12623-creator.github.io/boportfolio/og-image.svg">
    <meta property="og:site_name" content="Brandon Orozco Portfolio">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Brandon Orozco - AI Implementation Consultant">
    <meta name="twitter:description" content="Specializing in custom AI websites, automation, and intelligent solutions.">
    <meta name="twitter:image" content="https://brandonorozco12623-creator.github.io/boportfolio/og-image.svg">
</head>


Creating OG Image:
Dimensions: 1200x630px (Facebook/LinkedIn standard)
Format: JPG or PNG (SVG works but check platform support)
Content: Logo, site name, tagline, or page-specific visual
Text: Large, readable (will be shown small in social feeds)
Safe zone: Keep important content away from edges
Testing Open Graph:
Facebook Debugger: https://developers.facebook.com/tools/debug/
Twitter Card Validator: https://cards-dev.twitter.com/validator
LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

3.9 Lighthouse SEO Score (100/100)
Requirement: Pass Google Lighthouse SEO audit with 100/100 score.
Deterministic Goals:
 Document has <meta name="viewport"> tag
 Document has <title> tag
 Document has <meta name="description"> tag
 Page has successful HTTP status code (200)
 Links have descriptive text (not "click here")
 Page uses legible font sizes (16px+)
 Tap targets are appropriately sized (44x44px minimum)
 Document has valid <html lang> attribute
 Image elements have [alt] attributes
 robots.txt is valid (if present)
 Page is mobile-friendly
Running Lighthouse:
Chrome DevTools: F12 → Lighthouse tab → Select "SEO" → Run
Command Line: lighthouse https://yoursite.com --only-categories=seo
Web: https://web.dev/measure/
Verification Commands:
# Quick checks for common Lighthouse failures
grep -r '<meta name="viewport"' *.html
grep -r '<title>' *.html
grep -r '<meta name="description"' *.html
grep -r '<html lang=' *.html
grep -r 'alt=""' *.html  # Should only be decorative images
grep -r 'click here' *.html  # Should not use generic link text


Common Lighthouse SEO Failures:
Missing viewport tag (mobile-friendliness)
Missing title or description
Font size too small (< 12px)
Non-descriptive link text ("click here", "read more")
Missing alt attributes on images
No lang attribute on <html>
Tap targets too small (< 44px on mobile)
Fix for 100/100 Score:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Unique 150-160 character description">
    <title>Unique Page Title - Site Name</title>
    
    <!-- All other required tags -->
</head>
<body>
    <!-- All images have alt -->
    <img src="photo.jpg" alt="Descriptive alt text">
    
    <!-- Links are descriptive -->
    <a href="about.html">Learn about Brandon Orozco</a>
    
    <!-- NOT: <a href="about.html">Click here</a> -->
    
    <!-- Buttons are 44x44px minimum -->
    <button style="min-width: 44px; min-height: 44px;">Submit</button>
</body>
</html>



4. LEGAL COMPLIANCE CHECKLIST
4.1 Copyright Notice
Requirement: Include copyright year and name in footer.
Deterministic Goals:
 Copyright notice in footer of all pages
 Format: "© [Year] [Your Name/Brand]"
 Includes current year (update annually)
 Includes "All rights reserved" (optional but recommended)
 Consistent across all pages
Verification Commands:
# Check for copyright symbol
grep -r "©\|&copy;\|(c)" *.html


# Verify year is current
grep -r "© $(date +%Y)" *.html


Common Issues:
Missing copyright notice
Outdated year (e.g., "© 2020" in 2025)
Missing from some pages
Inconsistent formatting
Fix Example:
<!-- ✅ CORRECT -->
<footer>
    <p>© 2025 Brandon Orozco. All rights reserved.</p>
</footer>



4.2 Privacy Policy
Requirement: Link to privacy policy in footer, especially if collecting data.
Deterministic Goals:
 Privacy policy page exists (privacy.html)
 Link to privacy policy in footer of all pages
 Policy covers all required sections:
 What data is collected (personal info, cookies, analytics)
 How data is used
 Who data is shared with (third parties: Zapier, Calendly, etc.)
 User rights (access, correction, deletion)
 GDPR compliance (if serving EU users)
 CCPA compliance (if serving California users)
 Contact information for privacy inquiries
 Last updated date
 Policy is written in clear, understandable language
 Policy is easily accessible (one click from any page)
Verification Commands:
# Check if privacy.html exists
ls privacy.html docs/privacy.html


# Check for privacy policy links
grep -r "Privacy Policy\|privacy.html" *.html


# Verify privacy policy content sections
grep -E "GDPR|CCPA|cookies|personal information|user rights" privacy.html


Common Issues:
No privacy policy at all
Generic template not customized to site
Missing GDPR/CCPA sections
Not linked from all pages
Outdated information
Privacy Policy Minimum Sections:
Information We Collect
Personal information (name, email, etc.)
Automatically collected data (IP, browser, cookies)
How We Use Your Information
Contact/communication
Service improvement
Analytics
Data Sharing
List all third-party services (Zapier, Calendly, Google Analytics, etc.)
State if data is sold (usually "We do not sell your personal information")
Cookies
What cookies are used
How to disable them
Your Rights (GDPR/CCPA)
Right to access your data
Right to correct inaccuracies
Right to delete your data
Right to opt-out of data sale
How to exercise these rights
Data Security
Measures taken to protect data
Contact Information
Email or form to contact about privacy
Fix Example:
<!-- ✅ Privacy Policy Link in Footer -->
<footer>
    <nav aria-label="Footer navigation">
        <ul>
            <li><a href="privacy.html">Privacy Policy</a></li>
            <li><a href="contact.html">Contact</a></li>
        </ul>
    </nav>
    <p>© 2025 Brandon Orozco. All rights reserved.</p>
</footer>



4.3 Cookie Consent Banner
Requirement: Display banner notifying users about cookie usage with accept/decline options.
Deterministic Goals:
 Cookie banner visible on first visit to all pages
 Banner explains cookie usage clearly
 Two action buttons: "Accept" and "Decline"
 Link to Privacy Policy for more information
 User choice is stored (cookie or localStorage)
 Banner doesn't show again after user makes choice
 Banner is dismissible (user can close it)
 Banner is accessible (keyboard navigable)
 Banner doesn't block critical content
Verification Commands:
# Check for cookie banner HTML
grep -r "cookie.*banner\|cookie.*consent" *.html


# Check for JavaScript handling cookie consent
ls js/cookies.js
grep -r "cookie.*accept\|cookie.*decline" js/


Common Issues:
No cookie banner (violates GDPR if serving EU users)
Banner blocks content and can't be dismissed
No decline option (non-compliant)
No link to Privacy Policy
Banner shows every page load (annoying)
Fix Example:
<!-- ✅ CORRECT: Cookie Consent Banner -->
<div class="cookie-banner" id="cookie-banner" role="dialog" aria-label="Cookie consent">
    <div class="cookie-content">
        <p>
            This website uses cookies to enhance your browsing experience and analyze site traffic. 
            By clicking 'Accept', you consent to our use of cookies. 
            <a href="privacy.html">Learn more in our Privacy Policy</a>.
        </p>
        <div class="cookie-actions">
            <button id="cookie-accept" class="btn btn-primary">Accept<!-- ✅ CORRECT: Cookie Consent Banner -->
<div class="cookie-banner" id="cookie-banner" role="dialog" aria-label="Cookie consent">
    <div class="cookie-content">
        <p>
            This website uses cookies to enhance your browsing experience and analyze site traffic. 
            By clicking 'Accept', you consent to our use of cookies. 
            <a href="privacy.html">Learn more in our Privacy Policy</a>.
        </p>
        <div class="cookie-actions">
            <button id="cookie-accept" class="btn btn-primary">Accept





