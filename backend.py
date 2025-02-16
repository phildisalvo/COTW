import json
import random
import time

# Simulate a database of countries (could be replaced with an API call)
with open("countries.json", "r", encoding="utf-8") as file:
    countries = json.load(file)

# Get the current week number in the year
current_week = int(time.strftime("%U"))

# Select a country based on the week number
selected_country = countries[current_week % len(countries)]

# Save the selected country data to a JSON file for the frontend to access
with open("current_country.json", "w", encoding="utf-8") as outfile:
    json.dump(selected_country, outfile, indent=4)

print(f"Selected country for the week: {selected_country['name']}")
