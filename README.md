# Sitemap Generator

A modern, React-based web application for generating comprehensive sitemaps by crawling websites. Built with TypeScript, D3.js, and Tailwind CSS.

## Features

- **Web Crawling**: Automatically discover and crawl website pages
- **Visual Sitemap**: Interactive D3.js tree visualization
- **List View**: Hierarchical list representation with expandable nodes
- **Multiple Export Formats**: XML, JSON, and CSV export options
- **Configurable Crawling**: Customize depth, page limits, and delays
- **Real-time Progress**: Live crawling progress with status updates
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **TypeScript**: Full type safety and modern development experience

## Screenshots

The application features a clean, modern interface with:
- URL input with validation
- Configurable crawl options
- Real-time progress tracking
- Interactive visual tree diagram
- Hierarchical list view
- Multiple export formats

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sitemap-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. **Enter Website URL**: Input the website URL you want to crawl
2. **Configure Options**: Set crawl depth, page limits, and other preferences
3. **Start Crawling**: Click "Start Crawling" to begin the process
4. **Monitor Progress**: Watch real-time progress updates
5. **View Results**: Explore the sitemap in visual tree or list format
6. **Export Data**: Download in XML, JSON, or CSV format

## Crawl Options

- **Max Depth**: How deep to crawl from the starting URL (1-10)
- **Max Pages**: Maximum number of pages to crawl (1-1000)
- **Delay**: Time between requests in milliseconds
- **Include Images**: Whether to include image URLs
- **Include External Links**: Whether to include external website links
- **Respect robots.txt**: Follow website crawling rules

## Export Formats

### XML Sitemap
Standard XML format compatible with search engines and SEO tools.

### JSON Data
Structured data format for developers and API integration.

### CSV Report
Spreadsheet format for analysis and reporting.

## Technical Details

### Architecture
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **Visualization**: D3.js for interactive tree diagrams
- **HTTP Client**: Axios for web requests
- **HTML Parsing**: Cheerio for DOM manipulation

### Key Components
- `SitemapService`: Core crawling and sitemap generation logic
- `SitemapVisualizer`: D3.js-based tree visualization
- `SitemapList`: Hierarchical list view component
- `CrawlOptions`: Configuration interface
- `ProgressBar`: Real-time progress tracking
- `ExportOptions`: Multi-format export functionality

### Performance Features
- Configurable request delays to respect server resources
- Abort controller for stopping crawls mid-process
- Efficient URL deduplication
- Memory-conscious tree structure

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Project Structure
```
src/
├── components/          # React components
├── services/           # Business logic and API calls
├── types/              # TypeScript type definitions
├── App.tsx            # Main application component
└── index.tsx          # Application entry point
```

### Available Scripts
- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run test suite
- `npm run eject`: Eject from Create React App

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Visualization with [D3.js](https://d3js.org/)
- Icons from [Lucide React](https://lucide.dev/)

## Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

**Note**: This tool is designed for legitimate website analysis and SEO purposes. Please respect website terms of service and robots.txt files when crawling websites.
