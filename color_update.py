import re

def update_colors():
    with open('client/styles.css', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Redefine Root Palette for Regal Velvet
    new_root = """/* Regal Velvet & Gold Palette */
:root {
    --burgundy: #4a0404;       /* Deep Burgundy Red */
    --burgundy-light: #5d0e0e; /* Soft Burgundy */
    --gold: #D4AF37;           /* Main Gold */
    --gold-light: #F3E5AB;     /* Soft Gold accent */
    --gold-dark: #B8860B;      /* Rich Gold Accent */
    --ivory: #FDF9F6;          /* Rose-Ivory Background */
    --white: #ffffff;
    --gray: #6c757d;
    --light-gray: #f8f9fa;
    --black: #111111;
}"""
    
    # Replace the current :root theme
    content = re.sub(r'/\* .*? Palette \*/.*?}', new_root, content, flags=re.DOTALL)

    # 2. Variable mapping for the Burgundy vibe
    content = content.replace('var(--emerald)', 'var(--burgundy)')
    content = content.replace('var(--emerald-light)', 'var(--burgundy-light)')
    
    # Ensure background stays Rose-Ivory
    content = re.sub(r'(body\s*{[^}]*background-color:\s*)[^;]+', r'\1var(--ivory)', content)
    
    # Headers/Footers should use Burgundy
    content = re.sub(r'(\.main-header\s*{[^}]*background:\s*)[^;]+', r'\1var(--burgundy)', content)
    content = re.sub(r'(\.main-nav\s*{[^}]*background:\s*)[^;]+', r'\1var(--burgundy-light)', content)
    content = re.sub(r'(\.top-bar\s*{[^}]*background:\s*)[^;]+', r'\1var(--burgundy)', content)
    content = re.sub(r'(\.footer\s*{[^}]*background:\s*)[^;]+', r'\1var(--burgundy)', content)

    with open('client/styles.css', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    update_colors()
    print('Colors successfully updated to Regal Velvet & Gold!')
