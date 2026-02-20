from ddgs import DDGS
import requests
import fitz  # PyMuPDF
import os    # For deleting the temporary file

def duckduckgo_pdf_search(query, num_results=10):
    
    # Searches DuckDuckGo for PDFs matching a specific query.
    
    search_instance = DDGS()
    results = search_instance.text(f"{query} filetype:pdf", safesearch="Moderate", max_results=num_results)
    
    pdf_links = []
    for result in results:
        link = result.get("href")
        if link and link.endswith(".pdf"):
            pdf_links.append(link)
    
    return pdf_links

def validate_pdf_links(pdf_links):
    
    # Validates the list of links to ensure they point to a PDF.
    
    verified_links = []
    for link in pdf_links:
        try:
            response = requests.head(link, allow_redirects=True, timeout=5)
            if response.headers.get("Content-Type") == "application/pdf":
                verified_links.append(link)
        except requests.RequestException:
            continue  # Skip any link that can't be validated
    return verified_links

def filter_pdfs_by_page_count(pdf_links, min_pages=0, max_pages=None):

    # Filters a list of PDF links by page count.
    
    filtered_links = []
    for link in pdf_links:
        try:
            # Download PDF file
            response = requests.get(link, stream=True)
            response.raise_for_status()

            # Save PDF temporarily
            with open("temp.pdf", "wb") as temp_pdf:
                temp_pdf.write(response.content)

            # Open PDF and get page count
            with fitz.open("temp.pdf") as pdf:
                page_count = pdf.page_count

            # Filter based on page count
            if min_pages <= page_count and (max_pages is None or page_count <= max_pages):
                filtered_links.append(link)

        except (requests.RequestException, fitz.fitz.FileDataError):
            continue  # Skip any PDF that can't be processed

        finally:
            # Remove temporary file
            try:
                os.remove("temp.pdf")
            except OSError:
                pass

    return filtered_links
