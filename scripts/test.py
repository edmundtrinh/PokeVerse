# 1. Initialize an empty list to store the results
pokemon_links = []

# 2. Find all relevant anchor tags
infocards = main_content.find_all('a', class_='infocard', href=re.compile(r'^/sprites/'))

# 3. Loop through the found tags
for card in infocards:
    # 4. Try to find *another* anchor tag *inside* the current one (Problematic)
    link_tag = card.find('a', class_='infocard', href=re.compile(r'^/sprites/'))

    # 5. Check if the inner find was successful and has an href
    if link_tag and link_tag.get('href'):
        # 6. Get the href value
        pokemon_path = link_tag['href']

        # 7. Perform checks on the path structure
        # Basic check: ensure it's a direct link to a pokemon sprite page
        if pokemon_path.startswith('/sprites/') and len(pokemon_path.split('/')) == 3:
             # 8. Add the path to the list if checks pass
             pokemon_links.append(pokemon_path)
