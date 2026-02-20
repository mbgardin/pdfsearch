from pdf_search import duckduckgo_pdf_search, validate_pdf_links, filter_pdfs_by_page_count

def main():
    print("Welcome to Monte's surely not founded on the desire to participate in piracy PDF Search")
    query = input("Enter keywords for the Jahn you want: ")
    num_results = int(input("How many results would you like to retrieve? *I reccommend minimum 30 so that it can sort through the first several pages of the web*"))

    print("Searching for PDFs...")
    pdf_links = duckduckgo_pdf_search(query, num_results)

    if not pdf_links:
        print("That is so tuff bro theres nothing matching what you want, try increasing the number of results or changing the keywords...")
        return

    print("Validating PDF links...")
    verified_links = validate_pdf_links(pdf_links)

    if not verified_links:
        print("No valid PDF files found.")
        return

    # Ask the user for page count filter
    min_pages = int(input("Enter minimum page count (or 0 to skip): "))
    max_pages = input("Enter maximum page count (leave blank for no limit): ")
    max_pages = int(max_pages) if max_pages.strip() else None

    # Filter by page count if limits are specified
    if min_pages > 0 or max_pages is not None:
        print("Filtering PDFs by page count...")
        filtered_links = filter_pdfs_by_page_count(verified_links, min_pages, max_pages)
    else:
        filtered_links = verified_links

    if not filtered_links:
        print("No PDFs found with the specified page count range.")
        return

    print("\nPDF files found:")
    for idx, link in enumerate(filtered_links, 1):
        print(f"{idx}. {link}")

if __name__ == "__main__":
    main()
