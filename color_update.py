import re

def update_colors():
    with open('client/styles.css', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Redefine Root Palette for Emerald & Gold
    new_root = """/* Royal Emerald & Gold Palette */
:root {
    --emerald: #023020;        /* Deep Emerald Green */
    --emerald-light: #0d543e;  /* Soft Emerald */
    --gold: #D4AF37;           /* Main Gold */
    --gold-light: #F3E5AB;     /* Soft Gold accent */
    --gold-dark: #B8860B;      /* Rich Gold Accent */
    --ivory: #FCFAF5;          /* Warm Ivory Background */
    --white: #ffffff;
    --gray: #6c757d;
    --light-gray: #f8f9fa;
    --black: #111111;
}"""
    
    # Replace the current :root theme
    content = re.sub(r'/\* .*? Palette \*/.*?}', new_root, content, flags=re.DOTALL)

    # 2. Variable mapping for the Emerald vibe
    # In Midnight Gold, we used --black for headers. Now we use --emerald.
    content = content.replace('var(--black)', 'var(--emerald)')
    content = content.replace('var(--charcoal)', 'var(--emerald-light)')
    
    # Ensure background stays Ivory
    content = re.sub(r'(body\s*{[^}]*background-color:\s*)[^;]+', r'\1var(--ivory)', content)
    
    # Headers/Footers should use Emerald
    content = re.sub(r'(\.main-header\s*{[^}]*background:\s*)[^;]+', r'\1var(--emerald)', content)
    content = re.sub(r'(\.main-nav\s*{[^}]*background:\s*)[^;]+', r'\1var(--emerald-light)', content)
    content = re.sub(r'(\.top-bar\s*{[^}]*background:\s*)[^;]+', r'\1var(--emerald)', content)
    content = re.sub(r'(\.footer\s*{[^}]*background:\s*)[^;]+', r'\1var(--emerald)', content)

    with open('client/styles.css', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    update_colors()
    print('Colors successfully updated to Royal Emerald & Gold!')
