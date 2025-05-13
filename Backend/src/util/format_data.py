import json
import openai

# Load your OpenAI API key
openai.api_key = "your-openai-api-key"

# Load the original JSON
with open(r"E:\College\Hochschule Schmalkalden\Sem 2\HMI\HMI-Project\Data\dwr-24-03.json", "r", encoding="utf-8") as f:
    data = json.load(f)

formatted_pages = []

# Process each page
for page in data.get("pages", []):
    title_text = []
    body_text = []
    graph_text = []

    for block in page.get("blocks", []):
        label = block.get("label", "").lower()
        text = block.get("text", "").strip()

        if not text:
            continue

        if label == "title":
            title_text.append(text)
        elif "graph" in label or "chart" in label or "figure" in label:
            graph_text.append(text)
        else:
            body_text.append(text)

    formatted_page = {
        "page_number": page.get("page_number"),
        "title": " ".join(title_text),
        "text": " ".join(body_text),
        "graph-data": " ".join(graph_text)
    }

    formatted_pages.append(formatted_page)

# Optionally, use OpenAI to summarize or enrich if needed
# Example: summarize the text (optional, per use case)
# for page in formatted_pages:
#     response = openai.ChatCompletion.create(
#         model="gpt-4",
#         messages=[
#             {"role": "system", "content": "You are a summarization assistant."},
#             {"role": "user", "content": f"Summarize the following text:\n{page['text']}"}
#         ]
#     )
#     summary = response.choices[0].message['content']
#     page['summary'] = summary

# Save the formatted JSON
with open(r"E:\College\Hochschule Schmalkalden\Sem 2\HMI\HMI-Project\Data\formatted_dwr_24_03.json", "w", encoding="utf-8") as out_file:
    json.dump({"pages": formatted_pages}, out_file, indent=2, ensure_ascii=False)

print("✅ File processed and saved as 'formatted_dwr_24_03.json'")
