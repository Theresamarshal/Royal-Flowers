import re

def revert_to_pastel_with_shadows():
    with open('client/styles.css', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Revert header/footer backgrounds back to pastel rose
    content = re.sub(r'(--header-bg:\s*)[^;]+', r'\1var(--pastel-rose)', content)
    content = re.sub(r'(--footer-bg:\s*)[^;]+', r'\1var(--pastel-rose)', content)
    
    # 2. Add drop shadows to logo and gold elements for visibility on pastel
    # Re-apply pastel rose to areas that were forced black
    content = re.sub(r'(\.top-bar\s*{[^}]*background:\s*)var\(--header-bg\)', r'\1var(--pastel-rose)', content)
    content = re.sub(r'(\.main-header\s*{[^}]*background:\s*)var\(--header-bg\)', r'\1var(--pastel-rose)', content)
    content = re.sub(r'(\.footer\s*{[^}]*background:\s*)var\(--footer-bg\)', r'\1var(--pastel-rose)', content)
    content = re.sub(r'(\.main-footer\s*{[^}]*background:\s*)var\(--footer-bg\)', r'\1var(--pastel-rose)', content)

    # Add drop shadow to the logo image
    if '.logo-img' in content:
        content = re.sub(r'(\.logo-img\s*{[^}]*)', r'\1\n    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));', content)
    else:
        # Add the style if not exists
        content += "\n.logo-img { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); }\n"

    # Add shadow to gold icons in the header
    content = re.sub(r'(\.social-icons\s*a\s*{[^}]*)', r'\1\n    text-shadow: 0 1px 2px rgba(0,0,0,0.1);', content)

    with open('client/styles.css', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    revert_to_pastel_with_shadows()
    print('Reverted to Pastel. Added shadows for visibility.')
