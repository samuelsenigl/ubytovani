import re
import glob

def fix_html(content):
    # Split by <script>...</script>, <style>...</style>, and then by tags
    parts = re.split(r'(<script[^>]*>.*?</script>|<style[^>]*>.*?</style>|<[^>]*>)', content, flags=re.DOTALL | re.IGNORECASE)
    
    for i in range(len(parts)):
        # Only process text nodes (even indices if the split matches exactly)
        # Actually re.split with a group will put non-matches in even, matches in odd.
        if i % 2 == 0:
            parts[i] = re.sub(r'(^|[\s(„"\'-])([vkszouaiVKSZOUAI])\s+', r'\1\2&nbsp;', parts[i])
            parts[i] = re.sub(r'(^|[\s(„"\'-])([vkszouaiVKSZOUAI])\s+', r'\1\2&nbsp;', parts[i])
            
    return "".join(parts)

for filename in glob.glob("**/*.html", recursive=True):
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()
    new_content = fix_html(content)
    with open(filename, "w", encoding="utf-8") as f:
        f.write(new_content)
print("Done!")
