[Portfolio Docs] → split → [Chunks] → Cohere.embed() → [Vectors]
                                                   ↓
                                             stored in Chroma
                                                    
[User Query] → Cohere.embed() → query vector → Chroma.similarity_search()
                                                   ↓
                          top relevant chunks + user query → Hugging Face
                                                   ↓
                                             [Generated Answer]
