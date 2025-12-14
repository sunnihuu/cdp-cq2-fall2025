# Urban Food Resilience Atlas

A thesis website exploring urban food vulnerability and low-carbon food systems in New York City.

## Overview

This project communicates academic design research on urban food resilience through an interactive website. Built with HTML, CSS, and vanilla JavaScript, it presents maps, diagrams, and analysis of NYC's food systems.

## Project Structure

```
urban-food-resilience/
├── index.html              # Home page
├── project.html            # Project overview
├── methods.html            # Research methods
├── proof.html              # Proof of concept
├── data.html               # Data & visualizations
├── precedents.html         # Precedent studies
├── bibliography.html       # Bibliography & references
│
├── css/
│   └── style.css          # Main stylesheet (minimalist design)
│
├── js/
│   └── main.js            # JavaScript interactions
│
└── README.md              # This file
```

## Features

### Design Principles
- **Minimal, academic tone** with earth-tone color palette
- **White background** with careful typography hierarchy
- **Large margins** and generous whitespace for slow reading
- **Responsive design** for mobile, tablet, and desktop

### Interactions
- **Navigation highlighting** - Active page indicated in navbar
- **Scroll effects** - Subtle fade-in animations on scroll
- **Keyboard navigation** - Press 'n' for next page, 'p' for previous
- **Image toggles** - Show/hide visualizations (when implemented)
- **Smooth scrolling** - For anchor links and navigation

### Color Palette
- **Primary**: Earth Brown (#8b6f47)
- **Secondary**: Earth Green (#5a7c59)
- **Accent**: Earth Tan (#c9b89f)
- **Background**: White (#ffffff)
- **Text**: Dark (#1a1a1a)

## Typography
- **Headings**: Georgia serif font
- **Body**: System sans-serif (native fonts)
- **Line height**: 1.8 for readability
- **Large margins** between sections

## Pages

### index.html
Home page introducing the project and providing navigation to key sections.

### project.html
Project overview with research context, key questions, and scope.

### methods.html
Research methodologies including spatial analysis, data collection, design research, and stakeholder engagement.

### proof.html
Proof of concept section detailing design interventions and implementation strategies.

### data.html
Data visualizations and maps showing food vulnerability, infrastructure, and transportation analysis. (Placeholders for map embeds)

### precedents.html
Case studies from other cities including Detroit, Singapore, Paris, and Copenhagen.

### bibliography.html
Academic references organized by topic (food security, urban design, sustainability, NYC context).

## How to Use

1. **Open locally**: Open `index.html` in a web browser
2. **Navigate**: Use the navigation bar or keyboard shortcuts (n/p)
3. **Customize**: Edit HTML to add content, maps, and images
4. **Deploy**: Upload files to a web server

## Customization

### Adding Maps
In `data.html`, replace the `.data-placeholder` divs with embedded maps:
```html
<iframe src="your-map-url" width="100%" height="600"></iframe>
```

### Adding Images
Create an `img/` folder and reference images:
```html
<img src="img/your-image.jpg" alt="Description">
```

### Styling
Edit `css/style.css` to customize:
- Colors (CSS variables at top)
- Typography sizes
- Spacing and layout
- Responsive breakpoints

### Content
Edit any HTML file to:
- Update text and descriptions
- Add new sections
- Modify navigation links
- Update bibliography entries

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Minimal dependencies - no frameworks
- Fast load times with optimized CSS
- Vanilla JavaScript (no libraries)
- Progressive enhancement approach

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- Readable color contrasts
- Responsive text sizing
- Keyboard navigation support

## Future Enhancements

- [ ] Interactive maps (Leaflet or Mapbox)
- [ ] Image galleries with lightbox
- [ ] Data visualization (D3.js or similar)
- [ ] Search functionality
- [ ] Print-friendly styles
- [ ] Multilingual support

## License

This is an academic thesis project. All content and code remain the property of the author.

## Contact

For questions about this project, please contact the author.

---

Built with simplicity and clarity in mind. No frameworks. No fluff. Just good design.
