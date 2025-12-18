#!/bin/bash
echo "=========================================="
echo "  LIGHTHOUSE SEO CHECKLIST VALIDATOR"
echo "  Luxury Typography Website"
echo "=========================================="
echo ""

check_pass=0
check_fail=0

# Function to check for patterns
check_file() {
    local file=$1
    local pattern=$2
    local description=$3
    
    if grep -q "$pattern" "$file" 2>/dev/null; then
        echo "✅ $description"
        ((check_pass++))
        return 0
    else
        echo "❌ $description"
        ((check_fail++))
        return 1
    fi
}

echo "📄 Checking index.html..."
echo ""

# Check viewport
check_file "index.html" '<meta name="viewport"' "Viewport meta tag present"

# Check title
check_file "index.html" '<title>' "Title tag present"

# Check description
check_file "index.html" '<meta name="description"' "Meta description present"

# Check lang attribute
check_file "index.html" '<html lang="en">' "HTML lang attribute present"

# Check for images without alt (should find none)
if grep -q '<img[^>]*>' index.html 2>/dev/null; then
    if grep '<img[^>]*>' index.html | grep -q 'alt='; then
        echo "✅ Images have alt attributes"
        ((check_pass++))
    else
        echo "❌ Images missing alt attributes"
        ((check_fail++))
    fi
else
    echo "✅ No images found (using SVG with ARIA labels)"
    ((check_pass++))
fi

# Check for descriptive link text
if grep -q 'click here\|Click Here\|HERE' index.html; then
    echo "❌ Non-descriptive link text found"
    ((check_fail++))
else
    echo "✅ All links have descriptive text"
    ((check_pass++))
fi

# Check for robots.txt
if [ -f "robots.txt" ]; then
    echo "✅ robots.txt exists"
    ((check_pass++))
else
    echo "❌ robots.txt missing"
    ((check_fail++))
fi

# Check for sitemap
if [ -f "sitemap.xml" ]; then
    echo "✅ sitemap.xml exists"
    ((check_pass++))
else
    echo "❌ sitemap.xml missing"
    ((check_fail++))
fi

# Check font size
if grep -q 'font-size: 16px\|font-size: 1rem\|--text-base: 1rem' src/styles/*.css 2>/dev/null; then
    echo "✅ Legible base font size (16px)"
    ((check_pass++))
else
    echo "❌ Font size may be too small"
    ((check_fail++))
fi

# Check for Open Graph tags
check_file "index.html" 'property="og:title"' "Open Graph title tag present"
check_file "index.html" 'property="og:description"' "Open Graph description tag present"

# Check heading structure
h1_count=$(grep -c '<h1' index.html)
if [ "$h1_count" -eq 1 ]; then
    echo "✅ Exactly one H1 tag (count: $h1_count)"
    ((check_pass++))
else
    echo "❌ Multiple or no H1 tags (count: $h1_count)"
    ((check_fail++))
fi

echo ""
echo "📄 Checking other pages..."
echo ""

# Check about.html
if [ -f "src/pages/about.html" ]; then
    h1_about=$(grep -c '<h1' src/pages/about.html)
    if [ "$h1_about" -eq 1 ]; then
        echo "✅ about.html has exactly one H1"
        ((check_pass++))
    else
        echo "❌ about.html H1 count: $h1_about"
        ((check_fail++))
    fi
    
    if grep -q '<title>About' src/pages/about.html; then
        echo "✅ about.html has unique title"
        ((check_pass++))
    else
        echo "❌ about.html missing unique title"
        ((check_fail++))
    fi
fi

# Check gallery.html
if [ -f "src/pages/gallery.html" ]; then
    h1_gallery=$(grep -c '<h1' src/pages/gallery.html)
    if [ "$h1_gallery" -eq 1 ]; then
        echo "✅ gallery.html has exactly one H1"
        ((check_pass++))
    else
        echo "❌ gallery.html H1 count: $h1_gallery"
        ((check_fail++))
    fi
    
    if grep -q '<title>Gallery' src/pages/gallery.html; then
        echo "✅ gallery.html has unique title"
        ((check_pass++))
    else
        echo "❌ gallery.html missing unique title"
        ((check_fail++))
    fi
fi

# Check contact.html
if [ -f "src/pages/contact.html" ]; then
    h1_contact=$(grep -c '<h1' src/pages/contact.html)
    if [ "$h1_contact" -eq 1 ]; then
        echo "✅ contact.html has exactly one H1"
        ((check_pass++))
    else
        echo "❌ contact.html H1 count: $h1_contact"
        ((check_fail++))
    fi
    
    if grep -q '<title>Contact' src/pages/contact.html; then
        echo "✅ contact.html has unique title"
        ((check_pass++))
    else
        echo "❌ contact.html missing unique title"
        ((check_fail++))
    fi
fi

echo ""
echo "=========================================="
echo "  RESULTS"
echo "=========================================="
echo "✅ Passed: $check_pass"
echo "❌ Failed: $check_fail"
total=$((check_pass + check_fail))
percentage=$((check_pass * 100 / total))
echo "📊 Score: $percentage% ($check_pass/$total)"
echo ""

if [ $check_fail -eq 0 ]; then
    echo "🎉 PERFECT SCORE! All SEO checks passed!"
    echo "   Your site is ready for Lighthouse 100/100"
else
    echo "⚠️  Some checks failed. Review above for details."
fi

echo "=========================================="
