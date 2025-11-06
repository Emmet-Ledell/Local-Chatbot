# Maybe use bge-base-en-v1.5 to get top 10 then use reranker on the remaning 10, keep top 3 from there


#Use MMR right after the cosine search to ensure diversity of documents instead of getting 5 super similar documents
# that formula is score(d) = λ * sim(q, d) - (1 - λ) * max(sim(d, already_selected))
#sim(q, d) = cosine similarity between query and document. sim(d_i, d_j) = similarity between two documents. λ = relevance vs. diversity balance (usually 0.7–0.8)

##BM25 is just a mathmatical formula for key word amount balanced against length of docment

# Chunks
# BM25 lexical search
# cosine similarity 
# MMR reranking 
# Cross-encoder reranker (bge-reranker-base)
# Top 3–5 sent to LLM context


from fastapi import FastAPI
import uvicorn
from FlagEmbedding import FlagAutoModel
import json

app = FastAPI()
model = FlagAutoModel.from_finetuned("BAAI/bge-base-en-v1.5", use_fp16=True)
readPath = "./data/result.json"

@app.post("/search")
def search(body: dict):
    query = body.get("query", "")
    print("query", query)

    with open(readPath) as f:
        datatext = json.load(f)
    
    queryembed = model.encode(query)
    arr = []
    for x in datatext:
        similarity = queryembed @ x["embedding"]
        print(similarity)
        arr.append((similarity, x["uuid"], x["sourceFile"]))
    arr.sort(key=lambda x: x[0], reverse=True )
    return {"results": arr[:5]}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
