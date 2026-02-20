from ddgs import DDGS
import aiohttp
import asyncio
import aiofiles
import fitz  # PyMuPDF
import os    # For deleting the temporary files
import uuid

def duckduckgo_pdf_search(query, num_results=10):
    """Searches DuckDuckGo for PDFs matching a specific query (runs synchronously)."""
    search_instance = DDGS()
    results = search_instance.text(f"{query} filetype:pdf", safesearch="Moderate", max_results=num_results)
    
    pdf_links = []
    for result in results:
        link = result.get("href")
        if link and link.endswith(".pdf"):
            pdf_links.append(link)
    
    return pdf_links

async def validate_single_link(session, link):
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        async with session.head(link, allow_redirects=True, timeout=10, headers=headers) as response:
            if response.headers.get("Content-Type") == "application/pdf":
                return link
    except Exception:
        pass
    return None

async def validate_pdf_links(pdf_links):
    """Validates the list of links concurrently to ensure they point to a PDF."""
    async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(ssl=False)) as session:
        tasks = [validate_single_link(session, link) for link in pdf_links]
        results = await asyncio.gather(*tasks)
    
    return [link for link in results if link is not None]

async def check_single_pdf_page_count(session, link, min_pages, max_pages):
    headers = {'User-Agent': 'Mozilla/5.0'}
    temp_filename = f"temp_{uuid.uuid4().hex}.pdf"
    
    try:
        async with session.get(link, timeout=15, headers=headers) as response:
            response.raise_for_status()
            content = await response.read()

        async with aiofiles.open(temp_filename, "wb") as f:
            await f.write(content)

        # PyMuPDF is blocking, but usually extremely fast for pulling page counts vs downloading
        # so this is executed directly
        with fitz.open(temp_filename) as pdf:
            page_count = pdf.page_count
            
        if min_pages <= page_count and (max_pages is None or page_count <= max_pages):
            return link

    except Exception:
        pass

    finally:
        try:
            if os.path.exists(temp_filename):
                os.remove(temp_filename)
        except OSError:
            pass
            
    return None

async def filter_pdfs_by_page_count(pdf_links, min_pages=0, max_pages=None):
    """Filters a list of PDF links concurrently by page count."""
    async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(ssl=False)) as session:
        tasks = [check_single_pdf_page_count(session, link, min_pages, max_pages) for link in pdf_links]
        results = await asyncio.gather(*tasks)
        
    return [link for link in results if link is not None]
