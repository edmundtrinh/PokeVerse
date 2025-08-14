import requests
from bs4 import BeautifulSoup
import os
import time
import urllib.parse
import re
import sys
from pathlib import Path # Using pathlib for easier path manipulation

# --- Configuration ---
BASE_URL = "https://pokemondb.net"
SPRITES_INDEX_URL = f"{BASE_URL}/sprites"
# Output directory where sprites will be saved
OUTPUT_DIR = Path("pokemon_sprites_organized") # Use Path object, new name for clarity
# Headers to mimic a browser visit
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}
# Delay between requests (in seconds) to be polite to the server
REQUEST_DELAY = 0.5
# Timeout for requests (in seconds)
TIMEOUT = 20
# --- End Configuration ---

def download_image(url: str, filepath: Path):
    """Downloads an image from a URL and saves it to a filepath."""
    try:
        # Ensure the directory exists *before* checking if the file exists
        filepath.parent.mkdir(parents=True, exist_ok=True)

        # Check if file already exists to avoid re-downloading
        if filepath.exists():
            # print(f"      Skipping existing file: {filepath.name}")
            return True, False # Indicate success, but no new download

        print(f"      Downloading {filepath.name} to {filepath.parent}")
        response = requests.get(url, stream=True, headers=HEADERS, timeout=TIMEOUT)
        response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)

        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        # print(f"      Saved: {filepath.name}")
        return True, True # Indicate success and new download
    except requests.exceptions.RequestException as e:
        print(f"      Error downloading {url}: {e}", file=sys.stderr)
        return False, False
    except IOError as e:
        print(f"      Error saving file {filepath}: {e}", file=sys.stderr)
        return False, False
    except Exception as e:
        print(f"      An unexpected error occurred during download/save for {filepath}: {e}", file=sys.stderr)
        return False, False

def sanitize_filename_component(name: str) -> str:
    """Removes or replaces characters invalid for filename/directory components."""
    if not isinstance(name, str): # Ensure input is a string
        name = str(name)
    # Remove characters that are explicitly invalid in Windows/Linux/MacOS path components
    # Keep hyphens as they are common in game names (e.g., 'red-blue')
    name = re.sub(r'[\\/*?:"<>|]', "", name)
    # Replace sequences of whitespace with a single underscore
    name = re.sub(r'\s+', '_', name)
    # Ensure it doesn't start or end with problematic characters like '.' or '_' or space
    name = name.strip('._ ')
    # Prevent names that are reserved on Windows (CON, PRN, AUX, NUL, COM1-9, LPT1-9)
    reserved_names = {'CON', 'PRN', 'AUX', 'NUL'} | {f'COM{i}' for i in range(1, 10)} | {f'LPT{i}' for i in range(1, 10)}
    if name.upper() in reserved_names:
        name = f"_{name}_" # Prepend/append underscore if reserved
    # Return "untitled" or similar if sanitization results in empty string
    return name if name else "untitled"

# --- Main Script Logic ---
if __name__ == "__main__":
    print(f"Starting Pokémon sprite download from {BASE_URL}")
    print(f"Sprites will be saved to the '{OUTPUT_DIR}' directory.")
    OUTPUT_DIR.mkdir(exist_ok=True) # Create base output directory

    # 1. Get the main sprites page to find links to individual Pokemon
    try:
        print(f"\nFetching main sprite index page: {SPRITES_INDEX_URL}...")
        index_response = requests.get(SPRITES_INDEX_URL, headers=HEADERS, timeout=TIMEOUT)
        index_response.raise_for_status()
        print("Main page fetched successfully.")
        time.sleep(REQUEST_DELAY) # Wait after fetching the index
    except requests.exceptions.RequestException as e:
        print(f"FATAL: Error fetching main page {SPRITES_INDEX_URL}: {e}", file=sys.stderr)
        sys.exit(1) # Exit if we can't get the main page

    index_soup = BeautifulSoup(index_response.text, 'html.parser')
    main_content = index_soup.find('main')
    if not main_content:
        print("FATAL: Could not find main content element on the index page. Structure might have changed.", file=sys.stderr)
        sys.exit(1)

    # # 2. Find all Pokemon links on the index page
    # # We'll target the infocards directly, regardless of generation headers,
    # # as the user wants all Pokemon (#1-1025) found on this page.
    # pokemon_links = []
    # infocards = main_content.find_all('a', class_='infocard', href=re.compile(r'^/sprites/'))
    # for card in infocards:
    #     link_tag = card.find('a', class_='infocard', href=re.compile(r'^/sprites/'))
    #     if link_tag and link_tag.get('href'):
    #         pokemon_path = link_tag['href']
    #         # Basic check: ensure it's a direct link to a pokemon sprite page
    #         if pokemon_path.startswith('/sprites/') and len(pokemon_path.split('/')) == 3:
    #              pokemon_links.append(pokemon_path)

    pokemon_links = []
    # Find all relevant anchor tags
    infocards_tags = main_content.find_all('a', class_='infocard', href=re.compile(r'^/sprites/'))

    # Loop through the found tags
    for link_tag in infocards_tags: # Iterate directly over the found tags
        pokemon_path = link_tag.get('href') # Get the href from the tag itself

        # Check if href exists and meets the path structure criteria
        if pokemon_path: # Make sure href is not None
            # Perform checks on the path structure (adjust check if needed)
            # Example: Check for '/sprites/pokemonname' structure
            path_components = pokemon_path.strip('/').split('/') # Remove leading/trailing slashes, then split
            if len(path_components) == 2 and path_components[0] == 'sprites':
                pokemon_links.append(pokemon_path)
            # Or use the original check if '/sprites/pokemonname/' (with trailing slash) was intended
            # elif len(pokemon_path.split('/')) == 3 and pokemon_path.startswith('/sprites/'):
            #      pokemon_links.append(pokemon_path)

    # Now pokemon_links should contain the desired paths

    
    if not pokemon_links:
        print("FATAL: Could not find any Pokemon links on the index page.", file=sys.stderr)
        print("Check HTML structure for span.infocard-lg-img > a.infocard-lg-img-a tags.", file=sys.stderr)
        sys.exit(1)

    # Remove duplicates if any (though unlikely with this structure)
    pokemon_links = sorted(list(set(pokemon_links)))
    total_pokemon = len(pokemon_links)
    print(f"\nFound {total_pokemon} unique Pokemon sprite page links.")

    total_downloaded = 0
    total_skipped = 0
    total_errors = 0

    # 3. Iterate through each Pokemon page
    for i, pokemon_path in enumerate(pokemon_links):
        try:
            # Extract pokemon name (usually the last part of the path)
            pokemon_name = pokemon_path.strip('/').split('/')[-1]
            pokemon_page_url = urllib.parse.urljoin(BASE_URL, pokemon_path)
            # Sanitize the Pokemon name ONCE for use as the main directory
            sane_pokemon_name = sanitize_filename_component(pokemon_name)

            print(f"\n[{i+1}/{total_pokemon}] Processing: {pokemon_name.capitalize()}")
            print(f"  Page URL: {pokemon_page_url}")

            # Create the base directory for this Pokemon if it doesn't exist
            pokemon_base_dir = OUTPUT_DIR / sane_pokemon_name
            pokemon_base_dir.mkdir(exist_ok=True)

            # 4. Fetch the individual Pokemon page
            try:
                pokemon_response = requests.get(pokemon_page_url, headers=HEADERS, timeout=TIMEOUT)
                pokemon_response.raise_for_status()
                time.sleep(REQUEST_DELAY) # Wait after fetching the page
            except requests.exceptions.RequestException as e:
                print(f"  ERROR fetching page {pokemon_page_url}: {e}", file=sys.stderr)
                total_errors += 1 # Count page fetch error
                continue # Skip to the next Pokemon

            pokemon_soup = BeautifulSoup(pokemon_response.text, 'html.parser')

            # 5. Find all sprite images on the page
            page_main_content = pokemon_soup.find('main')
            if not page_main_content:
                print(f"  WARNING: Could not find main content on {pokemon_name.capitalize()}'s page. Searching entire page.")
                page_main_content = pokemon_soup # Fallback to searching the whole page

            # Regex to find sprite images from the specific CDN host
            # Example URLs:
            # https://img.pokemondb.net/sprites/red-blue/normal/bulbasaur.png
            # https://img.pokemondb.net/sprites/black-white/anim/shiny/bulbasaur.gif
            # https://img.pokemondb.net/sprites/home/normal/bulbasaur.png
            # https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/bulbasaur.png
            # https://img.pokemondb.net/sprites/scarlet-violet/normal/bulbasaur.png
            sprite_imgs = page_main_content.find_all('img', src=re.compile(r'https://img\.pokemondb\.net/sprites/.*\.(png|jpg|jpeg|gif)$', re.IGNORECASE))

            # Optional: Look for sprites in span backgrounds (like icons) - adapt if needed
            # sprite_spans = page_main_content.find_all('span', {'class': 'img-sprite', 'style': re.compile(...)})

            if not sprite_imgs:
                 print(f"  WARNING: No sprite image tags found for {pokemon_name.capitalize()}. Skipping.")
                 continue

            print(f"  Found {len(sprite_imgs)} potential sprite image tags. Attempting downloads...")
            download_count_pokemon = 0
            skipped_count_pokemon = 0
            error_count_pokemon = 0
            processed_urls_pokemon = set() # Track URLs processed for *this* pokemon to avoid duplicates if img tag appears twice

            # 6. Download each found sprite with the new path structure
            for img in sprite_imgs:
                img_url = img.get('src')
                # Skip if no src, or if it's a data URI, or already processed
                if not img_url or img_url.startswith('data:') or img_url in processed_urls_pokemon:
                    continue

                # Make sure URL is absolute
                img_url = urllib.parse.urljoin(pokemon_page_url, img_url)

                # --- Create the structured filepath ---
                filepath = None # Reset filepath for each image
                try:
                    url_parts = urllib.parse.urlparse(img_url)
                    url_path = url_parts.path # e.g., '/sprites/red-blue/normal/magikarp.png'
                    # Split path into components, removing empty strings from leading/trailing slashes
                    # e.g., ['sprites', 'red-blue', 'normal', 'magikarp.png']
                    # e.g., ['sprites', 'black-white', 'anim', 'shiny', 'female', 'meowstic.gif']
                    path_segments = [p for p in url_path.strip('/').split('/') if p]

                    # Check if it follows the expected structure: starts with 'sprites', has at least 3 parts (sprites, context, filename)
                    if len(path_segments) >= 3 and path_segments[0].lower() == 'sprites':
                        base_filename = path_segments[-1] # e.g., 'magikarp.png'
                        # Intermediate path components define the context (game, type, etc.)
                        # e.g., ['red-blue', 'normal'] or ['black-white', 'anim', 'shiny', 'female']
                        intermediate_components = path_segments[1:-1]

                        # Sanitize each intermediate component for use as a directory name
                        sane_intermediate_components = [sanitize_filename_component(comp) for comp in intermediate_components]

                        # Construct the new path: OUTPUT_DIR / pokemon-name / comp1 / comp2 / ... / filename.png
                        current_path = pokemon_base_dir # Start with OUTPUT_DIR / sane_pokemon_name
                        for comp in sane_intermediate_components:
                            current_path = current_path / comp # Append each sanitized intermediate component

                        # Final filepath
                        filepath = current_path / base_filename

                    else:
                        # Fallback: Less structured path if URL format is unexpected
                        print(f"      WARNING: Unexpected image URL format: {img_url}. Using fallback path structure.", file=sys.stderr)
                        base_filename = sanitize_filename_component(os.path.basename(url_path))
                        if not base_filename: base_filename = "unknown_sprite" # Handle cases where basename is empty
                        # Put in a generic 'misc' folder under the pokemon's main folder
                        filepath = pokemon_base_dir / "misc" / base_filename

                except Exception as e:
                     print(f"      ERROR parsing URL or building path for ({img_url}): {e}", file=sys.stderr)
                     # Fallback if URL parsing or path building fails unexpectedly
                     try: # Try to salvage a filename
                         base_filename = sanitize_filename_component(os.path.basename(urllib.parse.urlparse(img_url).path))
                         if not base_filename: base_filename = f"error_sprite_{int(time.time())}"
                     except:
                          base_filename = f"error_sprite_{int(time.time())}" # Ultimate fallback filename
                     # Put in an 'error-parse' folder under the pokemon's main folder
                     filepath = pokemon_base_dir / "error-parse" / base_filename

                # --- End of filepath creation ---

                if filepath:
                    # Ensure filename part has a valid extension (basic check) - important if sanitization removed it
                    known_extensions = {'.png', '.jpg', '.jpeg', '.gif'}
                    if filepath.suffix.lower() not in known_extensions:
                        original_suffix = Path(path_segments[-1]).suffix if path_segments else ''
                        if original_suffix.lower() in known_extensions:
                             filepath = filepath.with_suffix(original_suffix)
                        else:
                             # Attempt to get extension from URL if path parsing failed earlier
                             ext_match = re.search(r'\.(png|jpg|jpeg|gif)$', img_url, re.IGNORECASE)
                             if ext_match:
                                 filepath = filepath.with_suffix(ext_match.group(0))
                             else:
                                 filepath = filepath.with_suffix(".png") # Default to png if somehow lost


                    # Attempt download
                    success, was_downloaded = download_image(img_url, filepath)
                    processed_urls_pokemon.add(img_url) # Mark URL as processed for this page

                    if success:
                        if was_downloaded:
                            download_count_pokemon += 1
                            time.sleep(REQUEST_DELAY) # Wait only after a successful *new* download
                        else:
                            skipped_count_pokemon += 1
                    else:
                        error_count_pokemon += 1
                        total_errors += 1 # Increment global error count on download failure too
                        # Optional: Add a longer delay or retry logic here on error
                else:
                    # This should ideally not happen if fallbacks work, but just in case
                    print(f"      ERROR: Could not determine a valid filepath for URL {img_url}", file=sys.stderr)
                    error_count_pokemon += 1
                    total_errors += 1


            print(f"  Finished {pokemon_name.capitalize()}. New Downloads: {download_count_pokemon}, Skipped: {skipped_count_pokemon}, Errors: {error_count_pokemon}")
            total_downloaded += download_count_pokemon
            total_skipped += skipped_count_pokemon
            # Note: total_errors includes page fetch errors and image download/save/path errors

        except KeyboardInterrupt:
             print("\nKeyboard interrupt detected. Exiting gracefully...")
             break # Exit the main loop
        except Exception as e:
            # Catch unexpected errors during the processing of a single Pokemon
            pokemon_name_safe = "Unknown Pokemon"
            try: # Try to get name again for error msg
                pokemon_name_safe = pokemon_path.strip('/').split('/')[-1]
            except: pass
            print(f"\n-----------------------------------------------------", file=sys.stderr)
            print(f"  UNEXPECTED ERROR processing {pokemon_name_safe.capitalize()}: {e}", file=sys.stderr)
            import traceback
            traceback.print_exc() # Print stack trace for debugging
            print(f"-----------------------------------------------------\n", file=sys.stderr)
            total_errors += 1
            # Consider adding a delay here before continuing
            # time.sleep(5)
            continue # Try to continue with the next Pokemon


    print("\n--- Script Finished ---")
    print(f"Total Pokemon Pages Processed: {i+1 if 'i' in locals() else 0}/{total_pokemon}")
    print(f"Total New Sprites Downloaded: {total_downloaded}")
    print(f"Total Sprites Skipped (already existed): {total_skipped}")
    print(f"Total Errors (page fetch, image download/save, path creation, processing): {total_errors}")
    print(f"Sprites saved in: {OUTPUT_DIR.resolve()}") # Print absolute path

