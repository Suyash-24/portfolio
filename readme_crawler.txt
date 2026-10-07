# WebCrawler

An asynchronous web crawler that extracts structured data from websites, including headings, paragraphs, links, and images. Built with Python using `aiohttp` for concurrent HTTP requests and `BeautifulSoup` for HTML parsing.

## Features

- **Asynchronous crawling**: Uses `asyncio` and `aiohttp` for efficient concurrent requests
- **Configurable concurrency**: Control the number of simultaneous requests
- **Page limit**: Set a maximum number of pages to crawl
- **Structured data extraction**: Extracts:
  - Page URLs
  - Headings (h1 with h2 fallback)
  - First paragraph (prioritizes content in `<main>` tag)
  - Outgoing links
  - Image URLs
- **JSON report output**: Generates a sorted JSON report of all crawled pages
- **Domain-restricted**: Only crawls pages within the same domain as the base URL
- **Comprehensive tests**: Unit tests for all extraction functions

## Requirements

- Python >= 3.13
- aiohttp == 3.12.12
- beautifulsoup4 == 4.13.4
- requests == 2.32.4

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd webCrawler
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

Or using uv/pip with pyproject.toml:
```bash
pip install aiohttp==3.12.12 beautifulsoup4==4.13.4 requests==2.32.4
```

## Usage

Run the crawler from the command line:

```bash
python main.py <BASE_URL> <MAX_CONCURRENCY> <MAX_PAGES>
```

### Arguments

- `BASE_URL`: The starting URL to crawl (e.g., `https://example.com`)
- `MAX_CONCURRENCY`: Maximum number of concurrent requests (e.g., `10`)
- `MAX_PAGES`: Maximum number of pages to crawl (e.g., `100`)

### Example

```bash
python main.py https://example.com 10 50
```

This will:
- Start crawling from `https://example.com`
- Use up to 10 concurrent requests
- Stop after crawling 50 pages
- Generate a `report.json` file with the results

## Output

The crawler generates a `report.json` file containing an array of page objects, sorted by URL. Each page object includes:

```json
[
  {
    "url": "https://example.com",
    "heading": "Page Title",
    "first_paragraph": "First paragraph content...",
    "outgoing_links": [
      "https://example.com/page1",
      "https://example.com/page2"
    ],
    "image_urls": [
      "https://example.com/image1.jpg"
    ]
  }
]
```

## Testing

Run the unit tests:

```bash
python test_crawl.py
```

The test suite covers:
- URL normalization
- Heading extraction (h1/h2 fallback)
- Paragraph extraction (main tag priority)
- Link extraction (absolute and relative)
- Image extraction
- Complete page data extraction

## Project Structure

```
webCrawler/
├── main.py           # Entry point and CLI argument handling
├── crawl.py          # Core crawling logic and HTML extraction
├── json_report.py    # JSON report generation
├── test_crawl.py     # Unit tests
├── pyproject.toml    # Project configuration
└── README.md         # This file
```

## How It Works

1. **Initialization**: The `AsyncCrawler` class is initialized with the base URL, concurrency limit, and page limit
2. **Crawling**: Starting from the base URL, the crawler:
   - Fetches HTML content using `aiohttp`
   - Extracts structured data using `BeautifulSoup`
   - Discovers new links within the same domain
   - Recursively crawls discovered pages (respecting limits)
3. **Concurrency Control**: Uses a semaphore to limit concurrent requests
4. **Deduplication**: Tracks visited URLs to avoid re-crawling
5. **Output**: Writes all collected data to `report.json`

## License

Add your license information here.
