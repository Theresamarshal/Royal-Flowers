import re

def apply_darker_pastel():
    with open('client/styles.css', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update variables to include a darker rose specifically for header/footer
    # Current pastel-rose is #d4a5a5. Darker version: #966b6b (Muted Mahogany)
    new_vars = """    --pastel-rose-dark: #8c5a5a;  /* Darker shade of Dusty Rose */
"""
    if '--pastel-rose-dark' not in content:
        content = content.replace(':root {', ':root {\n' + new_vars)

    # 2. Update Header, Top Bar, and Footer to use the darker rose
    content = re.sub(r'(--header-bg:\s*)[^;]+', r'\1var(--pastel-rose-dark)', content)
    content = re.sub(r'(--footer-bg:\s*)[^;]+', r'\1var(--pastel-rose-dark)', content)
    
    # Ensure all background references are updated
    content = re.sub(r'(\.top-bar\s*{[^}]*background:\s*)var\(--pastel-rose\)', r'\1var(--pastel-rose-dark)', content)
    content = re.sub(r'(\.main-header\s*{[^}]*background:\s*)var\(--pastel-rose\)', r'\1var(--pastel-rose-dark)', content)
    content = re.sub(r'(\.footer\s*{[^}]*background:\s*)var\(--pastel-rose\)', r'\1var(--pastel-rose-dark)', content)
    content = re.sub(r'(\.main-footer\s*{[^}]*background:\s*)var\(--pastel-rose\)', r'\1var(--pastel-rose-dark)', content)

    with open('client/styles.css', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    apply_darker_pastel()
    print('Applied darker dusty rose to header and footer.')
