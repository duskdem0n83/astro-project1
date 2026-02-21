---
title: OSINT Exercises Walkthrough - Practical Geolocation Techniques
description: A comprehensive walkthrough of OSINT (Open Source Intelligence) exercises covering geolocation techniques, image analysis, and open-source investigation methods. Learn how to identify locations from photos using Google Earth, historical imagery, and careful observation.
publishDate: 2025-01-15
tags:
  - osint
  - cybersecurity
  - geolocation
  - investigation
author: Daniel Buckman
---

## Introduction

Open Source Intelligence (OSINT) is the practice of gathering information from publicly available sources. In this walkthrough, we'll explore several practical OSINT exercises that demonstrate real-world geolocation and investigation techniques. These exercises come from [Gralhix's OSINT Exercise Collection](https://gralhix.com/list-of-osint-exercises/) and showcase how careful observation, combined with the right tools, can reveal surprising amounts of information from seemingly innocuous photos.

## Exercise 1: Geolocating a Tweet Photo

**Task:** Identify the coordinates of where a photo was taken from a tweet screenshot.

**Difficulty:** 
- For beginners: Hard
- For experts: Medium

### Key Observations

From the tweet, we can extract several clues:

- **Language:** "Translated from Arabic by Google" - This narrows the search to Arabic-speaking countries
- **Location Text:** The city of Kiffa is mentioned in the text
- **Timestamp:** 1:45 PM on February 20, 2013 - This helps determine sun direction and allows us to use historical imagery
- **Visual Elements:**
  - People heading out of town
  - Fewer buildings (outskirts of city)
  - Paved road
  - Tree on the right side
  - Telephone poles
  - Building shadows falling across the road toward the right
  - Road intersection after the building on the left

### Solution Process

1. **Initial Location:** Use Google Earth to locate Kiffa, Mauritania
2. **Historical Imagery:** Click "Show historical imagery" to find imagery closest to February 2013
3. **Pattern Matching:** Look for a paved road leading to the outskirts of the city
4. **Verification:** Match the visual conditions (trees, telephone poles, building shadows, road intersection) to the southern part of the city

**Result:** The location was identified near L'hôtel de Kiffa and Complexe justice commercials.

**Coordinates:**
- 16°36'34.44"N
- 11°23'52.24"W

### Key Takeaways

- Timestamps are crucial for using historical imagery
- Multiple visual clues (shadows, road types, building density) help narrow down locations
- Text in images, even when translated, provides valuable context

## Exercise 2: Train Station Identification

**Task:** 
a) Identify the train station in the photo
b) Identify the name and height of the tallest structure visible

**Difficulty:**
- For beginners: a) Easy, b) Hard
- For experts: a) Easy, b) Medium

### Solution

**Part A - Train Station:**
The name "Flinders Street" is clearly visible in the photo. A quick Google search or Google Earth lookup reveals this is Flinders Street Station in Melbourne, Australia.

**Part B - Tallest Building:**
From the photo, the IBM building and the building to its right appear to be the same height. However, using Google Earth's 3D view reveals that the building to the right is actually larger. This building is the Central Equity building, also known as Focus Apartments, standing at 167 meters tall.

### Key Takeaways

- Sometimes what appears equal in a 2D photo isn't equal in reality
- Google Earth's 3D view is invaluable for building identification
- Building nicknames and alternate names are common - search multiple terms

## Exercise 3: Presidential Meeting Location

**Task:** Find the name and coordinates of the location where a photo of two presidents shaking hands was taken.

**Context:** In April 2017, Mohamed Abdullahi Farmaajo (President of Somalia) visited Turkey and was photographed shaking hands with Recep Tayyip Erdoğan (President of Turkey). The news article didn't disclose the location.

**Difficulty:**
- For beginners: Medium
- For experts: Easy

### Solution Process

1. **Context Analysis:** Official presidential handshake between two country leaders
2. **Location Narrowing:** Since Erdogan was hosting, the venue would be an official building in Turkey's capital, Ankara
3. **Research:** Search for where Erdogan conducts official meetings and note coordinates
4. **Visual Verification:** Compare the structure in the photo to the Presidential Complex
5. **Cross-Reference:** Verify the specific meeting by searching dates and participants
6. **Additional Evidence:** Find other photos of the same meeting from different angles to confirm

**Result:** Turkish Presidential Complex (Cumhurbaşkanlığı Külliyesi)

**Coordinates:**
- 39°55'50"N
- 32°47'55"E

### Key Takeaways

- Context (who, when, why) is often more important than visual clues alone
- Official venues have distinctive architectural features
- Cross-referencing multiple sources confirms findings

## Exercise 4: Island Resort Geolocation

**Task:** 
a) Identify the name of the resort
b) Find the coordinates of the island
c) Determine the cardinal direction the camera was facing

**Difficulty:**
- For beginners: a) Easy, b) Easy, c) Medium
- For experts: a) Easy, b) Easy, c) Easy

*(Note: The full solution details for this exercise would require the original photo, but the methodology would involve identifying distinctive resort features, using satellite imagery to match the island's shape, and analyzing shadows or landmarks to determine camera direction.)*

## Common OSINT Techniques Demonstrated

### 1. Historical Imagery
Google Earth's historical imagery feature is invaluable when working with dated photos. It allows you to see how locations looked at specific points in time, accounting for changes in development.

### 2. Visual Pattern Matching
Learning to identify and catalog visual elements:
- Road types (paved vs. unpaved)
- Building density and styles
- Natural features (trees, water bodies)
- Infrastructure (telephone poles, street signs)
- Shadows (for time and direction)

### 3. Context Analysis
Understanding the context of a photo often provides more clues than the photo itself:
- Who is in the photo?
- When was it taken?
- What is the occasion?
- What language is used?

### 4. Cross-Referencing
Never rely on a single source. Cross-reference findings with:
- Multiple photos of the same location
- News articles about events
- Official building databases
- Satellite imagery from different angles

### 5. Tool Mastery
Essential tools for OSINT geolocation:
- **Google Earth:** For historical imagery and 3D building views
- **Google Maps/Street View:** For current conditions and verification
- **Reverse image search:** To find other instances of the same photo
- **Time zone and sun position calculators:** For shadow analysis

## Best Practices

1. **Document Everything:** Take notes on every observation, no matter how small
2. **Work Systematically:** Follow a consistent methodology for each investigation
3. **Verify Multiple Times:** Don't stop at the first match - verify with additional evidence
4. **Understand Limitations:** Some locations may have changed significantly over time
5. **Respect Privacy:** OSINT should be used ethically and legally

## Conclusion

These OSINT exercises demonstrate that with careful observation, the right tools, and systematic methodology, it's possible to extract significant information from publicly available sources. The key is learning to see details that others might overlook and knowing how to use available tools effectively.

Whether you're interested in cybersecurity, journalism, or just curious about how information can be gathered from open sources, OSINT skills are valuable and can be developed through practice with exercises like these.

## Resources

- [Gralhix OSINT Exercise Collection](https://gralhix.com/list-of-osint-exercises/)
- Google Earth Pro (free for desktop)
- [OSINT Framework](https://osintframework.com/) - Comprehensive OSINT resource directory

## Ethical Considerations

Remember that OSINT should always be conducted ethically and legally. These techniques are valuable for:
- Cybersecurity research
- Journalistic investigation
- Academic research
- Personal security awareness

Always respect privacy and use these skills responsibly.

