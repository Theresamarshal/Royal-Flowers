import re

def fix_contrast():
    with open('client/styles.css', 'r', encoding='utf-8') as f:
        content = f.read()

    # Define the new high-contrast variables
    # We add --header-bg to the root
    new_root_additions = """    --header-bg: #111111;      /* High contrast black for logo area */
    --footer-bg: #111111;
"""
    content = content.replace(':root {', ':root {\n' + new_root_additions)

    # Update Top Bar to use the new dark bg
    content = re.sub(r'(\.top-bar\s*{[^}]*background:\s*)var\(--pastel-rose\)', r'\1var(--header-bg)', content)
    
    # Update Main Header to use the new dark bg
    content = re.sub(r'(\.main-header\s*{[^}]*background:\s*)var\(--pastel-rose\)', r'\1var(--header-bg)', content)
    
    # Update Footer to use the new dark bg
    content = re.sub(r'(\.footer\s*{[^}]*background:\s*)var\(--pastel-rose\)', r'\1var(--footer-bg)', content)
    content = re.sub(r'(\.main-footer\s*{[^}]*background:\s*)var\(--pastel-rose\)', r'\1var(--footer-bg)', content)

    # Ensure search bar remains white for visibility in the dark header
    content = re.sub(r'(\.search-bar\s*{[^}]*background:\s*)var\(--white\)', r'\1var(--white)', content)

    # Ensure nav links are visible (Keep them in the sage bar if sage bar is separate)
    # Actually, in some files the nav bar is rose. Let's make it sage/muted-green.
    content = re.sub(r'(\.main-nav\s*{[^}]*background:\s*)var\(--burgundy-light\)', r'\1var(--pastel-sage)', content)
    content = re.sub(r'(\.main-nav\s*{[^}]*background:\s*)var\(--pastel-sage\)', r'\1var(--pastel-sage)', content)

    with open('client/styles.css', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    fix_contrast()
    print('Contrast fixed: Header and Footer are now Dark for Gold logo visibility.')
