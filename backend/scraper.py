import requests
from bs4 import BeautifulSoup


def scrape_wikipedia(url: str):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch URL: {response.status_code}")

    html = response.text
    soup = BeautifulSoup(html, "html.parser")

    # title
    title = soup.find("h1").text

    # remove unwanted tags
    for tag in soup(["script", "style", "sup", "table"]):
        tag.decompose()

    # summary
    paragraphs = soup.find_all("p")
    summary = ""
    for p in paragraphs:
        if p.text.strip():
            summary = p.text.strip()
            break

    # sections
    sections = []
    for heading in soup.find_all(["h2", "h3"]):
        section_title = heading.text.replace("[edit]", "").strip()
        sections.append(section_title)

    # text cleaning
    content_div = soup.find("div", {"id": "mw-content-text"})
    article_text = content_div.get_text(separator="\n", strip=True)

    return {
        "title": title,
        "summary": summary,
        "sections": sections,
        "article_text": article_text,
        "raw_html": html,
    }
