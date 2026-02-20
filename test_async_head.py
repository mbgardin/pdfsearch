import asyncio
import aiohttp
from ddgs import DDGS

async def validate_single_link(session, link):
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        async with session.head(link, allow_redirects=True, timeout=10, headers=headers) as response:
            content_type = response.headers.get("Content-Type")
            print(f"HEAD {link} -> {content_type} ({response.status})")
            if content_type == "application/pdf":
                return link
    except Exception as e:
        print(f"Error HEAD {link} -> {e}")
    return None

async def test_head():
    search_instance = DDGS()
    results = search_instance.text("react docs filetype:pdf", safesearch="Moderate", max_results=10)
    
    pdf_links = [r.get("href") for r in results if r.get("href") and r.get("href").endswith(".pdf")]
    print(f"Found {len(pdf_links)} raw PDF links")
    
    async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(ssl=False)) as session:
        tasks = [validate_single_link(session, link) for link in pdf_links]
        results = await asyncio.gather(*tasks)
        
    valid = [link for link in results if link is not None]
    print(f"Valid PDFs: {len(valid)}")

if __name__ == "__main__":
    asyncio.run(test_head())
