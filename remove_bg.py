from PIL import Image

def make_transparent(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        r, g, b, a = item
        # Calculate luminance approximately
        luminance = (r + g + b) / 3
        
        # If very dark, make fully transparent (handles black bg)
        if luminance < 25:
            new_data.append((r, g, b, 0))
        elif luminance < 70:
            # Smooth transition for anti-aliased edge pixels
            alpha = int((luminance - 25) / 45 * 255)
            new_data.append((r, g, b, alpha))
        else:
            # Fully opaque for the bright gold text/crown
            new_data.append((r, g, b, 255))
            
    img.putdata(new_data)
    img.save(out_path, "PNG")

if __name__ == "__main__":
    make_transparent("client/images/logo.png", "client/images/logo.png")
    print("Background removed successfully")
