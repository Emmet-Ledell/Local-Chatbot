from FlagEmbedding import FlagAutoModel
import os


# model = FlagAutoModel.from_finetuned('BAAI/bge-base-en-v1.5',
# query_instruction_for_retrieval="Represent this sentence for searching relevant passages:", 
# use_fp16=True)


# sentences_1 = ["I love NLP", "I love machine learning I love NLP", "I love machine learningI love NLP", "I love machine learningI love NLP", "I love machine learningI love NLP", "I love machine learningI love NLP", "I love machine learningI love NLP", "I love machine learning"]

# sentences_2 = ["I love BGE", "I love text retrieval"]
# embeddings_1 = model.encode(sentences_1)
# embeddings_2 = model.encode(sentences_2)
# print(embeddings_1)
# print(embeddings_2)



# similarity = embeddings_1 @ embeddings_2.T
# print(similarity)



def process_files_in_folder(folder_path):
    try:
        # List all entries (files and subdirectories) in the specified folder
        for entry_name in os.listdir(folder_path):
            # Construct the full path to the current entry
            full_path = os.path.join(folder_path, entry_name)
            print("entry name",entry_name)

            # Check if the entry is a file (and not a directory)
            if os.path.isfile(full_path):
                try:
                    # Open the file in read mode ('r')
                    with open(full_path, 'r') as file:
                        # Read the content of the file
                        content = file.read()
                        print("file Length", len(content))
                        print(content[0:800])
                        # You can perform further operations with 'content' here
                except Exception as e:
                    print(f"Error opening or reading file {full_path}: {e}")
            else:
                print(f"{full_path} is not a file")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

folder_to_process = 'notes' 
process_files_in_folder(folder_to_process)


# # Create and write to a new file (overwrites if it exists)
# with open("my_file.txt", "w") as f:
#     f.write("This is the first line.\n")
#     f.write("This is the second line.\n")

# # Append to an existing file (creates if it doesn't exist)
# with open("my_file.txt", "a") as f:
#     f.write("This line is appended.\n")