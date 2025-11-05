#BM25 then MMR
#literally just serch with an embedded query, return top results, use BM25 to rerank and MMR to get best spread then give to LLM


from FlagEmbedding import FlagAutoModel
import os
import sys
import json


modelName = "BAAI/bge-base-en-v1.5"
model = FlagAutoModel.from_finetuned(modelName, use_fp16=True,query_instruction_for_retrieval="Represent this sentence for searching relevant passages:")
readPath = './data/result.json'

# similarity = embeddings_1 @ embeddings_2.T
# print(similarity)

if __name__ == "__main__":

    print("hello")
    if len(sys.argv) > 1:
            f = open(readPath)
            datatext = json.loads(f.read())
            queryembed = model.encode(sys.argv[1])
            arr = []

            for x in datatext:
                similarity = queryembed @ x["embedding"]
                arr.append((similarity, x["uuid"], x["sourceFile"]))
            arr.sort(key=lambda x: x[0], reverse=True )
            print(arr[:5])
            f.close()
    else:
        print("Please provide a name.")