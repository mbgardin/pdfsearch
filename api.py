from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pdf_search import duckduckgo_pdf_search, validate_pdf_links, filter_pdfs_by_page_count

app = FastAPI(title="PDF Search API")

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.concurrency import run_in_threadpool

@app.get("/api/search")
async def search_pdfs(
    query: str = Query(..., description="The search keywords"),
    num_results: int = Query(10, description="Number of results to retrieve"),
    min_pages: int = Query(0, description="Minimum page count"),
    max_pages: int = Query(None, description="Maximum page count")
):
    try:
        # Step 1: Search DuckDuckGo (Run blocking DDGS code in threadpool)
        pdf_links = await run_in_threadpool(duckduckgo_pdf_search, query, num_results)
        if not pdf_links:
            return {"links": [], "message": "No PDFs found for the given keywords."}

        # Step 2: Validate the links concurrently
        verified_links = await validate_pdf_links(pdf_links)
        if not verified_links:
            return {"links": [], "message": "No valid PDF links found after validation."}

        # Step 3: Filter by page count concurrently if requested
        if min_pages > 0 or max_pages is not None:
            filtered_links = await filter_pdfs_by_page_count(verified_links, min_pages, max_pages)
        else:
            filtered_links = verified_links
            
        return {"links": filtered_links, "message": f"Found {len(filtered_links)} valid PDFs."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Make sure to run the server on a port that doesn't conflict with Vite (5173)
    uvicorn.run("api:app", host="0.0.0.1", port=8000, reload=True)
