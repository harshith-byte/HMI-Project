import pymupdf


# pdf_path = r"E:\SUAS-2024-25\SEM-2\HMI-Team 11\DIW_RawData\dwr-24-03.pdf"
# doc = pymupdf.open(pdf_path)
# print(doc.metadata)

# page_5 = doc[4]
# tables = page_5.find_tables()
# table1 =  tables.tables[0]
# print(table1.extract())
# # print(f"Number of tables found: {len(tables)}")


# import fitz  # PyMuPDF
# import json
# import os

# def extract_tables_from_pdf(pdf_path, output_json_path):
#     try:
#         # Open the PDF
#         doc = fitz.open(pdf_path)
#         all_tables_data = []

#         for page_num in range(len(doc)):
#             page = doc[page_num]
#             try:
#                 tables = page.find_tables()
#                 for idx, table in enumerate(tables.tables):
#                     extracted = table.extract()
#                     all_tables_data.append({
#                         "page": page_num + 1,
#                         "table_index": idx,
#                         "table_data": extracted
#                     })
#             except Exception as e:
#                 print(f"Error processing tables on page {page_num + 1}: {e}")

#         # Save all extracted tables to JSON
#         with open(output_json_path, 'w', encoding='utf-8') as f:
#             json.dump(all_tables_data, f, indent=2, ensure_ascii=False)

#         print(f"Extraction complete. {len(all_tables_data)} tables saved to: {output_json_path}")

#     except Exception as e:
#         print(f"Failed to process PDF '{pdf_path}': {e}")

# # Example usage:
# pdf_file = r"E:\SUAS-2024-25\SEM-2\HMI-Team 11\DIW_RawData\dwr-24-01.pdf"
# json_output = r"E:\SUAS-2024-25\SEM-2\HMI-Team 11\Tables_Data\dwr-24-01_tables.json"
# extract_tables_from_pdf(pdf_file, json_output)



# batch_extract_tables_from_folder.py

# import fitz  # PyMuPDF
# import json
# import os

# def extract_tables_from_pdf(pdf_path, output_json_path):
#     try:
#         # Open the PDF
#         doc = fitz.open(pdf_path)
#         all_tables_data = []

#         for page_num in range(len(doc)):
#             page = doc[page_num]
#             try:
#                 tables = page.find_tables()
#                 for idx, table in enumerate(tables.tables):
#                     extracted = table.extract()
#                     all_tables_data.append({
#                         "page": page_num + 1,
#                         "table_index": idx,
#                         "table_data": extracted
#                     })
#             except Exception as e:
#                 print(f"Error processing tables on page {page_num + 1}: {e}")

#         # Save all extracted tables to JSON
#         with open(output_json_path, 'w', encoding='utf-8') as f:
#             json.dump(all_tables_data, f, indent=2, ensure_ascii=False)

#         print(f"Extraction complete. {len(all_tables_data)} tables saved to: {output_json_path}")

#     except Exception as e:
#         print(f"Failed to process PDF '{pdf_path}': {e}")

# def extract_tables_from_folder(folder_path, output_folder_path):
#     if not os.path.exists(output_folder_path):
#         os.makedirs(output_folder_path)

#     for filename in os.listdir(folder_path):
#         if filename.lower().endswith(".pdf"):
#             pdf_path = os.path.join(folder_path, filename)
#             json_filename = os.path.splitext(filename)[0] + "_tables.json"
#             output_json_path = os.path.join(output_folder_path, json_filename)
#             extract_tables_from_pdf(pdf_path, output_json_path)

# if __name__ == "__main__":
#     # Example usage
#     input_folder = r"E:\\SUAS-2024-25\\SEM-2\\HMI-Team 11\\UniquePDFs"
#     output_folder = r"E:\\SUAS-2024-25\\SEM-2\\HMI-Team 11\\Tables_Data"

#     extract_tables_from_folder(input_folder, output_folder)




# batch_extract_tables_from_folder.py (filtered)

import fitz  # PyMuPDF
import json
import os

def is_probable_real_table(extracted_table):
    """
    Check if the extracted table looks like a real data table.
    Basic rules:
    - At least 2 rows and 2 columns
    - Contains meaningful textual or numeric content
    """
    if not extracted_table:
        return False
    
    if len(extracted_table) <= 2:
        return False  # Less than 2 rows
    
    if all(len(row) < 2 for row in extracted_table):
        return False  # All rows have fewer than 2 columns

    # Check content density (non-empty cells)
    non_empty_cells = sum(1 for row in extracted_table for cell in row if cell and cell.strip())
    total_cells = sum(len(row) for row in extracted_table)

    if total_cells == 0:
        return False

    density = non_empty_cells / total_cells

    if density < 0.5:
        return False  # Very sparse, likely not a real table

    return True

def extract_tables_from_pdf(pdf_path, output_json_path):
    try:
        # Open the PDF
        doc = fitz.open(pdf_path)
        all_tables_data = []

        for page_num in range(len(doc)):
            page = doc[page_num]
            try:
                tables = page.find_tables()
                for idx, table in enumerate(tables.tables):
                    extracted = table.extract()
                    if is_probable_real_table(extracted):
                        all_tables_data.append({
                            "page": page_num + 1,
                            "table_index": idx,
                            "table_data": extracted
                        })
            except Exception as e:
                print(f"Error processing tables on page {page_num + 1}: {e}")

        # Save all extracted tables to JSON
        with open(output_json_path, 'w', encoding='utf-8') as f:
            json.dump(all_tables_data, f, indent=2, ensure_ascii=False)

        print(f"Extraction complete. {len(all_tables_data)} filtered tables saved to: {output_json_path}")

    except Exception as e:
        print(f"Failed to process PDF '{pdf_path}': {e}")

def extract_tables_from_folder(folder_path, output_folder_path):
    if not os.path.exists(output_folder_path):
        os.makedirs(output_folder_path)

    for filename in os.listdir(folder_path):
        if filename.lower().endswith(".pdf"):
            pdf_path = os.path.join(folder_path, filename)
            json_filename = os.path.splitext(filename)[0] + "_tables.json"
            output_json_path = os.path.join(output_folder_path, json_filename)
            extract_tables_from_pdf(pdf_path, output_json_path)

if __name__ == "__main__":
    # Example usage
    input_folder = r"E:\\SUAS-2024-25\\SEM-2\\HMI-Team 11\\UniquePDFs"
    output_folder = r"E:\\SUAS-2024-25\\SEM-2\\HMI-Team 11\\Tables_Data"

    extract_tables_from_folder(input_folder, output_folder)
