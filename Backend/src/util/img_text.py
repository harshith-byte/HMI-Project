import pdfplumber
import pytesseract
import cv2
import numpy as np
from PIL import Image
import json
import openai
import base64
from io import BytesIO
import re

current_box = []
cropping = False
boxes = []
page_image_cv = None
clone = None

pdf_path = r""
output_json_path = r""

output = {"pages": []}

vertical_threshold = 20 

openai.api_key=''

def encode_image(pil_img):
    buffer = BytesIO()
    pil_img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")

def draw_boxes(image, box_list):
    for b in box_list:
        x1, y1 = b["box"]["x1"], b["box"]["y1"]
        x2, y2 = b["box"]["x2"], b["box"]["y2"]
        color = (0, 255, 0) if b["label"] == "title" else (0, 255, 255)  # Green for title, Yellow for body
        cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
        cv2.putText(image, b["label"], (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)

def click_and_crop(event, x, y, flags, param):
    global current_box, cropping

    if event == cv2.EVENT_LBUTTONDOWN:
        current_box = [(x, y)]
        cropping = True

    elif event == cv2.EVENT_LBUTTONUP:
        current_box.append((x, y))
        cropping = False
        cv2.rectangle(page_image_cv, current_box[0], current_box[1], (255, 0, 0), 1)
        cv2.imshow("Select Area", page_image_cv)


with pdfplumber.open(pdf_path) as pdf:
    for i, page in enumerate(pdf.pages):
        print(f"📄 Page {i + 1} - Draw box, then press [t]=title, [b]=body, [g]=graph, [u]=undo, [n]=next page, [s]=skip page")
        pil_image = page.to_image(resolution=300).original
        page_image_cv = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR).copy()
        clone = page_image_cv.copy()
        boxes = []

        cv2.namedWindow("Select Area", cv2.WINDOW_NORMAL)
        cv2.setMouseCallback("Select Area", click_and_crop)

        while True:
            image_display = clone.copy()
            draw_boxes(image_display, boxes)
            cv2.imshow("Select Area", image_display)

            key = cv2.waitKey(1) & 0xFF

            if key == ord("t") and len(current_box) == 2:
                x1, y1 = current_box[0]
                x2, y2 = current_box[1]
                roi = clone[min(y1, y2):max(y1, y2), min(x1, x2):max(x1, x2)]
                roi_pil = Image.fromarray(cv2.cvtColor(roi, cv2.COLOR_BGR2RGB))
                text = pytesseract.image_to_string(roi_pil).strip()
                boxes.append({
                    "label": "title",
                    "box": {"x1": min(x1, x2), "y1": min(y1, y2), "x2": max(x1, x2), "y2": max(y1, y2)},
                    "text": text
                })
                current_box = []

            elif key == ord("b") and len(current_box) == 2:
                x1, y1 = current_box[0]
                x2, y2 = current_box[1]
                roi = clone[min(y1, y2):max(y1, y2), min(x1, x2):max(x1, x2)]
                roi_pil = Image.fromarray(cv2.cvtColor(roi, cv2.COLOR_BGR2RGB))
                text = pytesseract.image_to_string(roi_pil).strip()
                response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": f"from the given text - {text}, summarize it into 2 to 3 lines"},
                            ],
                        }
                    ],
                    max_tokens=1000,
                )
                summarized_text=response.choices[0].message['content']
                
                boxes.append({
                    "label": "body",
                    "box": {"x1": min(x1, x2), "y1": min(y1, y2), "x2": max(x1, x2), "y2": max(y1, y2)},
                    "text": text,
                    "summarized_text":summarized_text
                })
                current_box = []

            elif key == ord("g") and len(current_box) == 2:
                x1, y1 = current_box[0]
                x2, y2 = current_box[1]
                roi = clone[min(y1, y2):max(y1, y2), min(x1, x2):max(x1, x2)]
                roi_pil = Image.fromarray(cv2.cvtColor(roi, cv2.COLOR_BGR2RGB))
                base64_image = encode_image(roi_pil)
                response = openai.ChatCompletion.create(
                model="gpt-4-turbo",
                messages=[
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": "Extract the data from this chart and return it as structured JSON. don't repond with any other sentence. just the structured json response"},
                                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{base64_image}"}}
                            ],
                        }
                    ],
                    max_tokens=1000,
                )
                res=response.choices[0].message['content'].strip()
                if res.startswith("```"):
                    res = re.sub(r"```(?:json)?", "", res).strip()
                    res = res.rstrip("```").strip()
                print(res)
                boxes.append({
                    "label": "graph",
                    "box": {"x1": min(x1, x2), "y1": min(y1, y2), "x2": max(x1, x2), "y2": max(y1, y2)},
                    "data": json.loads(res),
                    
                })
            
            elif key == ord("u") and boxes:
                boxes.pop()
                print("↩️ Last box removed.")

            elif key == ord("n"):
                break

            elif key == ord("s"):  # Skip the page if 's' is pressed
                print(f"🛑 Skipping Page {i + 1}")
                boxes = []  # Clear the boxes for this page to skip it
                break

        cv2.destroyAllWindows()

        # Check if there are no titles in the page
        has_title = any(b["label"] == "title" for b in boxes)

        # If there is no title, merge all body text blocks into one
        if not has_title and any(b["label"] == "body" for b in boxes):
            body_blocks = [b for b in boxes if b["label"] == "body"]

            # Ensure we have body blocks to merge
            if body_blocks:
                # Sort body blocks by their top-left y coordinate (y1)
                body_blocks.sort(key=lambda b: b["box"]["y1"])

                merged_body_text = ""
                merged_body_box = {
                    "x1": body_blocks[0]["box"]["x1"],
                    "y1": body_blocks[0]["box"]["y1"],
                    "x2": body_blocks[0]["box"]["x2"],
                    "y2": body_blocks[0]["box"]["y2"]
                }

                # Loop through the sorted body blocks and merge consecutive ones
                for i in range(1, len(body_blocks)):
                    current_block = body_blocks[i]
                    previous_block = body_blocks[i - 1]

                    # Check if the current block is close enough to the previous one (vertically)
                    if current_block["box"]["y1"] - previous_block["box"]["y2"] <= vertical_threshold:
                        # Merge the current block with the previous one
                        merged_body_text += " " + current_block["text"]
                        merged_body_box["x2"] = max(merged_body_box["x2"], current_block["box"]["x2"])
                        merged_body_box["y2"] = max(merged_body_box["y2"], current_block["box"]["y2"])
                    else:
                        # Add the previous block to the final merged blocks
                        boxes.append({
                            "label": "body",
                            "box": merged_body_box,
                            "text": merged_body_text
                        })
                        # Reset for the new block
                        merged_body_text = current_block["text"]
                        merged_body_box = current_block["box"]

                # Add the last merged block
                boxes.append({
                    "label": "body",
                    "box": merged_body_box,
                    "text": merged_body_text
                })

                print("📄 Merged consecutive body blocks.")
            else:
                print("📄 No body text to merge.")

        # Append the page output
        output["pages"].append({
            "page_number": i + 1,
            "blocks": boxes
        })

# Save result to JSON
with open(output_json_path, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=4, ensure_ascii=False)

print("✅ Done! Labeled OCR saved to JSON.")
