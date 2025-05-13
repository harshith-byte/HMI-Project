import requests

CHATWITHPDF_API_KEY="sec_loUyJX9O4X2dJNHWgyNLjbWIiCr0qAaN"

def get_source_id(file):
    url="https://api.chatpdf.com/v1/sources/add-file"
    files = [
        ('file', ('file', open(f'{file}', 'rb'), 'application/octet-stream'))
    ]
    headers = {
        'x-api-key': f'{CHATWITHPDF_API_KEY}'
    }

    response = requests.post(url, headers=headers, files=files)

    if response.status_code == 200:
        print('Source ID:', response.json()['sourceId'])
        return response.json()['sourceId']

    else:
        print('Status:', response.status_code)
        print('Error:', response.text)
        raise Exception("went wrong while getting sourceID")

def get_chatwithpdf(source_id,query):
    url="https://api.chatpdf.com/v1/chats/message"
    headers = {
        'x-api-key': CHATWITHPDF_API_KEY,
        "Content-Type": "application/json"
    }
    body={
          'sourceId': source_id,
          'messages': [
            {
              'role': 'user',
              'content': query
            }
          ]
        }
    response = requests.post(url,headers=headers,json=body)
    if response.status_code == 200:
        print(response.json()['content'])
        return response.json()['content']
    else:
        print("Status:", response.status_code)
        raise Exception("went wrong in chat with pdf")

if __name__ == '__main__':
    # source_id=get_source_id(r"E:\College\Hochschule Schmalkalden\Sem 2\HMI\Datasets\Publikationen_diwwr_Media\73\dwr-24-01-1.pdf")
    get_chatwithpdf("src_d7pfkvW3jq0itj18dbZWY","What role did consumer sentiment and inflation play in Germany's economic performance in 2023?")
