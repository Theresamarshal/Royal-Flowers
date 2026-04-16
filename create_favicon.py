from PIL import Image
import os

def create_black_bg_favicon():
    logo_path = 'client/images/logo.png'
    output_path = 'client/images/favicon.png'
    
    if not os.path.exists(logo_path):
        print(f"Error: {logo_path} not found.")
        return

    # Open the transparent logo
    img = Image.open(logo_path).convert("RGBA")
    
    # Create a solid black background image of the same size
    background = Image.new("RGBA", img.size, (17, 17, 17, 255)) # Match deep onyx black or pure black
    
    # Paste the transparent logo onto the black background
    # Use the image itself as a mask if it has transparency
    background.paste(img, (0, 0), img)
    
    # Save as favicon.png
    background.save(output_path, "PNG")
    print(f"Created {output_path} with solid black background.")

if __name__ == '__main__':
    create_black_bg_favicon()
