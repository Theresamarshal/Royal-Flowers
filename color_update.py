import re

def update_colors():
    with open('client/styles.css', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Redefine Root Palette
    new_root = """/* Luxury Gold & Black Palette */
:root {
    --gold: #D4AF37;           /* Main Gold */
    --gold-light: #F3E5AB;     /* Soft Gold */
    --gold-dark: #B8860B;      /* Rich Gold */
    --black: #111111;          /* Deep Onyx Black */
    --charcoal: #1A1A1A;       /* Soft Black */
    --ivory: #FCFAF5;          /* Warm Ivory */
    --white: #ffffff;
    --gray: #6c757d;
    --light-gray: #f8f9fa;
}"""
    
    # Replace the old Pastel Color Palette block
    content = re.sub(r'/\* Pastel Color Palette \*/.*?}', new_root, content, flags=re.DOTALL)

    # 2. General Variable Replacements
    content = content.replace('var(--dark-pink)', 'var(--gold)')
    content = content.replace('var(--accent-pink)', 'var(--gold)')
    content = content.replace('var(--secondary-pink)', 'var(--gold-dark)')
    content = content.replace('var(--primary-pink)', 'var(--gold-light)')
    content = content.replace('var(--light-pink)', 'var(--ivory)')
    content = content.replace('var(--cream)', 'var(--ivory)')
    
    # Replace hardcoded pink colors
    content = content.replace('#fff5f8', 'var(--ivory)')
    content = content.replace('#d63384', 'var(--gold)')
    content = content.replace('#ffe0ec', 'var(--ivory)')

    # 3. Specific Component Overrides for "Midnight Gold" vibe
    
    # Make headers and footers Black instead of white/gradient
    content = re.sub(r'(\.main-header\s*{[^}]*background:\s*)var\(--white\)', r'\1var(--black)', content)
    content = re.sub(r'(\.main-nav\s*{[^}]*background:\s*)var\(--white\)', r'\1var(--charcoal)', content)
    
    # Top bar should be black/gold
    content = re.sub(r'(\.top-bar\s*{[^}]*background:\s*)linear-gradient[^;]+', r'\1var(--black)', content)
    
    # Footer should be charcoal
    content = re.sub(r'(\.footer\s*{[^}]*background:\s*)linear-gradient[^;]+', r'\1var(--black)', content)

    # Link colors in main nav
    content = re.sub(r'(\.nav-link\s*{[^}]*color:\s*)var\(--gold\)', r'\1var(--white)', content)
    
    # Update heading colors to stay extremely dark on the light ivory background 
    # (except specific ones that use var(--gold))
    content = re.sub(r'(h1,\s*h2,\s*h3,\s*h4\s*{.*?.*?)[}]', r'\1\n    color: var(--black);\n}', content, flags=re.DOTALL)
    
    # Update search bar background in black header
    content = re.sub(r'(\.search-bar\s*{[^}]*background:\s*)var\(--ivory\)', r'\1var(--white)', content)

    # Body background
    content = re.sub(r'(body\s*{[^}]*background-color:\s*)var\(--ivory\)', r'\1var(--ivory)', content)

    with open('client/styles.css', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    update_colors()
    print('Colors successfully updated to Midnight Gold!')
