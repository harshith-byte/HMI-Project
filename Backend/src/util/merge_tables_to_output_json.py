# merge_tables_into_graph.py

import json
import os

def merge_table_data(base_json_path, table_json_path, output_json_path):
    """
    Merge table data from `table_json_path` into `base_json_path` under matching page numbers.
    Insert tables under the 'graph' label; create 'graph' if it doesn't exist.
    """
    try:
        # Load base JSON
        with open(base_json_path, 'r', encoding='utf-8') as f:
            base_data = json.load(f)

        # Load table JSON
        with open(table_json_path, 'r', encoding='utf-8') as f:
            table_data = json.load(f)

        # Create a lookup for pages
        page_lookup = {page.get("page_number"): page for page in base_data.get("pages", [])}

        # Iterate over tables to insert
        for table in table_data:
            page_num = table.get("page")
            table_content = table.get("table_data")

            page_content = page_lookup.get(page_num)
            if not page_content:
                print(f"Warning: Page {page_num} not found in base JSON. Skipping.")
                continue

            # Try to find an existing 'graph' block
            graph_block = next((block for block in page_content.get("blocks", []) if block.get("label") == "graph"), None)

            if graph_block:
                if "data" not in graph_block:
                    graph_block["data"] = {}
                # Append table data under a unique key
                graph_block["data"][f"table_{table.get('table_index', 0)}"] = table_content
            else:
                # No graph block exists, create a new one
                new_graph_block = {
                    "label": "graph",
                    "box": {"x1": 0, "y1": 0, "x2": 0, "y2": 0},
                    "data": {f"table_{table.get('table_index', 0)}": table_content}
                }
                page_content.setdefault("blocks", []).append(new_graph_block)

        # Write merged output
        with open(output_json_path, 'w', encoding='utf-8') as f:
            json.dump(base_data, f, indent=2, ensure_ascii=False)

        print(f"✅ Merge complete! Output saved to: {output_json_path}")

    except Exception as e:
        print(f"❌ Error during merging: {e}")


if __name__ == "__main__":
    # Example usage (replace with your paths)
    base_json = r"E:\SUAS-2024-25\SEM-2\HMI-Team 11\Output_jsons\dwr-24-50.json"
    table_json = r"E:\SUAS-2024-25\SEM-2\HMI-Team 11\Tables_Data\dwr-24-50_tables.json"
    output_json = r"E:\SUAS-2024-25\SEM-2\HMI-Team 11\Merged_tabel_text_Json\dwr-24-50_merged.json"

    merge_table_data(base_json, table_json, output_json)
