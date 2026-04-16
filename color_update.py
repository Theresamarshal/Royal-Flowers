import re

def update_colors():
    with open('client/styles.css', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Redefine Root Palette for Sophisticated Pastel (Muted)
    new_root = """/* Sophisticated Muted Pastel Palette */
:root {
    --pastel-rose: #d4a5a5;    /* Dusty Rose (Muted, not bright) */
    --pastel-sage: #9fac96;    /* Muted Sage Green */
    --pastel-cream: #f9f4f1;   /* Warm Soft Cream */
    --gold: #D4AF37;           /* Main Gold (Keep for branding logo) */
    --gold-light: #F3E5AB;     /* Soft Gold accent */
    --gold-dark: #B8860B;      /* Rich Gold Accent */
    --white: #ffffff;
    --gray: #6c757d;
    --light-gray: #f8f9fa;
    --black: #333333;          /* Soft Charcoal for text */
}"""
    
    # Replace the current :root theme
    content = re.sub(r'/\* .*? Palette \*/.*?}', new_root, content, flags=re.DOTALL)

    # 2. Variable mapping for the Muted Pastel vibe
    content = content.replace('var(--burgundy)', 'var(--pastel-rose)')
    content = content.replace('var(--burgundy-light)', 'var(--pastel-sage)')
    
    # Ensure background is the soft warm cream
    content = re.sub(r'(body\s*{[^}]*background-color:\s*)[^;]+', r'\1var(--pastel-cream)', content)
    
    # Headers/Footers should use Dusty Rose
    content = re.sub(r'(\.main-header\s*{[^}]*background:\s*)[^;]+', r'\1var(--pastel-rose)', content)
    content = re.sub(r'(\.main-nav\s*{[^}]*background:\s*)[^;]+', r'\1var(--pastel-sage)', content)
    content = re.sub(r'(\.top-bar\s*{[^}]*background:\s*)[^;]+', r'\1var(--pastel-rose)', content)
    content = re.sub(r'(\.footer\s*{[^}]*background:\s*)[^;]+', r'\1var(--pastel-rose)', content)

    # Change text color back to dark for readability on light backgrounds
    content = re.sub(r'(\.nav-link\s*{[^}]*color:\s*)[^;]+', r'\1var(--white)', content)

    with open('client/styles.css', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    update_colors()
    print('Colors successfully updated to Sophisticated Muted Pastel!')
