from FlagEmbedding import FlagAutoModel
import os
import json
import uuid


modelName = "BAAI/bge-base-en-v1.5"
model = FlagAutoModel.from_finetuned(modelName, use_fp16=True)
writePath = "data/result.json"


def writeFile(file_path, content):
    with open(file_path, "a") as f:
        f.write(content)

# need to add ACtual Sentence aware chunking and optimize the embedding, prolly just batch embed and hook them up with the meta data later,
# later though, want to see this whole thing come together first

# clean up the UUID stuff with an actualy identifier

def process_files_in_folder(folder_path):
    open(writePath, "w").close()
    arr = []
    counter = 0
    try:
        for entry_name in os.listdir(folder_path):
            full_path = os.path.join(folder_path, entry_name)
            if not os.path.isfile(full_path):
                print(f"{full_path} is not a file")
                continue

            try:
                with open(full_path, 'r') as file:
                    content = file.read()

                i = 0
                while i < len(content):
                    chunk = content[i:min(i + 1500, len(content))]
                    embeddings = model.encode(chunk)
                    record = {
                        "uuid": counter,
                        "sourceFile": entry_name,
                        "text": content[i:min(i + 1500, len(content))],
                        "embedding": embeddings.tolist(),
                        "nameofmodel": modelName,
                        "characterRange": [i, min(i + 1500, len(content))]
                    }
                    counter += 1
                    arr.append(record)
                    i += 1350

            except Exception as e:
                print(f"Error processing {entry_name}: {e}")
        writeFile(writePath, json.dumps(arr, indent=4, ensure_ascii=False))

    except Exception as e:
        print(f"Unexpected error: {e}")

folder_to_process = 'notes' 
process_files_in_folder(folder_to_process)

# similarity = embeddings_1 @ embeddings_2.T
