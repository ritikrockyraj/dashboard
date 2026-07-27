# 🧠 LLM From Scratch — Complete Project Handbook

> **Repository:** [llm_from_scratch](https://github.com/ritikrockyraj/llm_from_scratch)
> **Author:** Ritik Rocky Raj
> **Difficulty:** 🟡 Intermediate-Hard | **Resume Rating:** Medium-Hard | **Interview Rating:** Hard

---

## 📋 TABLE OF CONTENTS

*(Same structure as other handbooks — scrolling-friendly format)*

---

## PART 1: PROJECT OVERVIEW

### 📌 Project Name
**LLM From Scratch** — A Step-by-Step GPT Implementation

### 🎯 Problem Statement
Most developers use Large Language Models like GPT through APIs (OpenAI, Anthropic). They type a prompt and get a response. But very few understand what happens **inside** the model. This project solves that gap: it builds a working GPT-style LLM from scratch using nothing but PyTorch.

### ❓ Why This Project Exists
- Educational purpose — to demystify LLMs
- Inspired by Andrej Karpathy's "Neural Networks: Zero to Hero" and Sebastian Raschka's book
- Shows deep understanding of transformer architecture
- Proves you can build AI from fundamentals, not just use APIs

### 👥 Who Is This For
- Students who want to understand transformers deeply
- ML engineers preparing for AI/LLM interviews
- Anyone tired of just calling APIs and wanting to know what's underneath

### 🌍 Real-World Value
- **Interview Differentiator:** VERY few candidates have built an LLM from scratch
- **Research Preparation:** Understanding attention mechanisms is the foundation of modern AI research
- **Debugging Skills:** When you've built it, you can debug production LLMs better

### ✨ What You Learn
1. Tokenization (Byte-Pair Encoding)
2. Text data preparation and batching
3. Token and positional embeddings
4. Self-attention mechanism (the "magic" of transformers)
5. Multi-head attention
6. Transformer blocks with LayerNorm and residual connections
7. Full GPT model assembly
8. Training loop with CrossEntropy loss
9. Text generation from trained model

### 📊 Difficulty Level
- **Project Difficulty:** 🟡 Intermediate-Hard
- **Math Required:** Linear Algebra basics (matrix multiplication, softmax), Probability basics
- **ML Knowledge:** PyTorch fundamentals, Neural Network basics
- **Good for:** AI/ML internship interviews, research positions

### 🏗️ Architecture Type
**Modular Sequential Pipeline** — Each component is built separately, then assembled.

### 🛠️ Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Language** | Python 3.8+ |
| **Deep Learning** | PyTorch 2.0+ |
| **Tokenization** | tiktoken (OpenAI's tokenizer) |
| **Numerical** | NumPy |
| **Visualization** | Matplotlib |
| **Environment** | Jupyter Notebooks + Python scripts |

---

> **💡 Interview Tip:** "I built a GPT-style language model from scratch in PyTorch" is one of the most impressive things you can say in an ML interview. It signals deep understanding.

---

## PART 2: COMPLETE STORY

### Chapter 1: Why I Built This

I had been using ChatGPT, Claude, and other LLMs for months. They felt like magic. Type some text, get intelligent responses. But I had no idea what was happening inside. When interviewers asked "How does attention work?" I could recite the formula but didn't TRULY understand it.

I discovered Andrej Karpathy's "Let's build GPT from scratch" video and Sebastian Raschka's book. They showed that building an LLM isn't magic — it's math, code, and patience. I decided to build one myself, step by step, and document every single piece.

### Chapter 2: The Problem with Just Using APIs

Using `openai.ChatCompletion.create()` teaches you API integration. It does NOT teach you:
- Why transformers work
- What attention actually computes
- How tokens become numbers
- Why training data matters
- How to debug when something goes wrong

For anyone serious about AI/ML, this knowledge is essential.

### Chapter 3: My Approach — Divide and Conquer

An LLM is complex. But it's made of smaller pieces that are each understandable:

1. **Tokenization** — Break text into numbers the model can process
2. **Embeddings** — Convert token IDs into meaningful vectors
3. **Attention** — Let tokens "look at" other tokens to understand context
4. **Transformer Block** — Combine attention with feed-forward networks
5. **GPT Model** — Stack multiple transformer blocks
6. **Training** — Teach the model to predict the next token

I tackled each piece as a separate module. Only when each piece worked did I combine them.

### Chapter 4: The Dataset — Alice in Wonderland

I trained on "Alice's Adventures in Wonderland" — about 150,000 characters. Why?
- It's small enough to train on a laptop (no GPU cluster needed)
- Public domain — no copyright issues
- Interesting text that shows if the model actually learns language patterns

### Chapter 5: Challenges

**Challenge 1: Understanding Attention Intuitively**
The self-attention formula looks scary: `Attention(Q,K,V) = softmax(QK^T/√d_k)V`. But the INTUITION is simple: each word looks at all other words and decides how much to "pay attention" to each.

**Challenge 2: Causal Masking**
During training, the model shouldn't cheat by looking at future words. The causal mask (a triangular matrix) blocks access to future tokens. Understanding WHY this matters took time.

**Challenge 3: Dimensionality**
PyTorch tensors have shapes like `[batch_size, num_heads, seq_len, head_dim]`. Keeping track of dimensions was the #1 source of bugs.

**Challenge 4: Training Stability**
Without proper initialization and LayerNorm, the model's gradients would explode or vanish. Learning about normalization techniques was crucial.

### Chapter 6: What I'd Improve

1. Train on larger dataset (OpenWebText, Wikipedia)
2. Implement KV-caching for faster inference
3. Add RoPE (Rotary Position Embeddings) instead of learned positional embeddings
4. Implement flash attention for memory efficiency
5. Add fine-tuning for specific tasks

---

> **💡 Interview Tip:** When telling this story, emphasize the "from scratch" aspect. Most candidates use APIs. You BUILT the thing. That's your competitive advantage.

---

## PART 3: WORKFLOW

### Complete Pipeline

```
Raw Text ("Alice was beginning to get very tired...")
      ↓
┌─────────────────────────────────────────────────┐
│ STEP 1: TOKENIZATION (00_tokenization/)           │
│ • Load text file                                  │
│ • Use tiktoken to encode text → integer IDs      │
│ • Example: "Alice" → [13343]                     │
│ • Output: List of integers (vocabulary indices)  │
└─────────────────────┬───────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ STEP 2: DATA PREPARATION (01_data_preparation/)  │
│ • Create PyTorch Dataset class                   │
│ • Sliding window: input[0:n] → target[1:n+1]    │
│ • Create DataLoader with batching               │
│ • Output: Batches of (input_ids, target_ids)    │
└─────────────────────┬───────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ STEP 3: EMBEDDINGS (02_embedding_layer/)         │
│ • Token Embedding: map IDs → vectors (d_model)  │
│ • Position Embedding: add position information  │
│ • Output: [batch, seq_len, d_model]             │
└─────────────────────┬───────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ STEP 4: ATTENTION (03_attention_mechanism/)      │
│ • Self-Attention: Q, K, V projections           │
│ • Scaled dot-product: softmax(QK^T/√d) × V      │
│ • Causal Mask: prevent looking at future        │
│ • Multi-Head: parallel attention heads          │
│ • Output: [batch, seq_len, d_model]             │
└─────────────────────┬───────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ STEP 5: TRANSFORMER BLOCK (04_transformer_block/)│
│ • Attention + Residual Connection               │
│ • LayerNorm                                     │
│ • Feed-Forward Network (MLP)                    │
│ • Residual Connection + LayerNorm               │
│ • Output: [batch, seq_len, d_model]             │
└─────────────────────┬───────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ STEP 6: GPT MODEL (05_Finalgpt/)                 │
│ • Stack N transformer blocks                    │
│ • Final LayerNorm                               │
│ • LM Head: Linear(d_model → vocab_size)         │
│ • Output: Logits [batch, seq_len, vocab_size]   │
└─────────────────────┬───────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ STEP 7: TRAINING (06_training/)                  │
│ • CrossEntropy Loss                             │
│ • AdamW Optimizer                               │
│ • Training loop: forward → loss → backward →    │
│   optimizer.step()                              │
│ • Track train/val loss                          │
│ • Save model checkpoints                        │
└─────────────────────┬───────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ STEP 8: TEXT GENERATION                          │
│ • Start with prompt tokens                      │
│ • Model predicts next token                     │
│ • Sample from probability distribution          │
│ • Append to sequence, repeat                    │
│ • Output: Generated text                        │
└─────────────────────────────────────────────────┘
```

---

## PART 4: FOLDER STRUCTURE

```
llm_from_scratch/
│
├── .config/                    ← Training configuration files
│
├── 00_tokenization/            ← Step 1: Breaking text into tokens
│   ├── tokenizer.py            ← Tokenizer implementation
│   └── tokenizer.ipynb         ← Interactive notebook
│
├── 01_data_preparation/        ← Step 2: PyTorch datasets & dataloaders
│   ├── dataset.py              ← GPTDataset class
│   ├── dataloader.py           ← Batching logic
│   └── dataloader.ipynb        ← Interactive notebook
│
├── 02_embedding_layer/         ← Step 3: Token + Position embeddings
│   ├── embedding.py            ← Embedding layer implementation
│   └── embedding.ipynb         ← Interactive notebook
│
├── 03_attention_mechanism/     ← Step 4: The core of transformers
│   ├── attention.py            ← Self-attention & multi-head
│   └── attention.ipynb         ← Interactive notebook
│
├── 04_transformer_block/       ← Step 5: Complete transformer block
│   ├── transformer_block.py    ← Block with attention + FFN
│   └── transformer_block.ipynb ← Interactive notebook
│
├── 05_Finalgpt/                ← Step 6: Full GPT model assembly
│   ├── gpt_model.py            ← Complete GPT architecture
│   └── gpt_model.ipynb         ← Interactive notebook
│
├── 06_training/                ← Step 7: Training loop
│   ├── train.py                ← Training script
│   ├── utils.py                ← Helper functions
│   └── training.ipynb          ← Training notebook
│
├── requirements.txt            ← Python dependencies
├── README.md                   ← Documentation
└── .gitignore                  ← Ignore patterns
```

### Why Numbered Folders?
Each folder is a **learning checkpoint**. You should understand 00 before moving to 01. The numbering forces sequential learning — you can't skip attention and expect to understand the GPT model.

### Why Both .py and .ipynb?
- **.py files** — Clean, reusable code. What you'd use in production.
- **.ipynb files** — Interactive exploration. Shows outputs, shapes, visualizations. Better for learning.

---

> **💡 Interview Tip:** The numbered folder structure shows methodical thinking. When asked "How did you approach this?", say: "I decomposed the LLM architecture into 7 sequential modules and built each one individually."

---

## PART 5: CODE FLOW

### Where Execution Starts

**Two paths:**

1. **Learning Path:** Open `00_tokenization/tokenizer.ipynb` and run cells sequentially through each folder.
2. **Training Path:** `python 06_training/train.py` (loads GPT model, runs training loop)

### Training Execution Flow

```python
# 1. Load and tokenize text
with open('alice.txt', 'r') as f:
    text = f.read()
tokenizer = tiktoken.get_encoding('gpt2')
tokens = tokenizer.encode(text)

# 2. Create dataset
dataset = GPTDataset(tokens, max_length=256, stride=128)
dataloader = DataLoader(dataset, batch_size=8, shuffle=True)

# 3. Initialize model
model = GPTModel(
    vocab_size=50304,
    emb_dim=768,        # d_model
    context_length=256, # max sequence length
    n_heads=12,         # attention heads
    n_layers=12,        # transformer blocks
    dropout=0.1
)

# 4. Training loop
optimizer = AdamW(model.parameters(), lr=3e-4)
for epoch in range(epochs):
    for batch in dataloader:
        input_ids, target_ids = batch
        logits = model(input_ids)           # Forward pass
        loss = F.cross_entropy(             # Compute loss
            logits.view(-1, vocab_size),
            target_ids.view(-1)
        )
        optimizer.zero_grad()               # Clear gradients
        loss.backward()                     # Backpropagation
        optimizer.step()                    # Update weights

# 5. Generate text
prompt = "Alice was"
tokens = tokenizer.encode(prompt)
for _ in range(50):                        # Generate 50 new tokens
    logits = model(torch.tensor([tokens])) # Forward pass
    next_token = torch.argmax(logits[0, -1])  # Greedy sampling
    tokens.append(next_token.item())
generated_text = tokenizer.decode(tokens)
```

### Data Flow Through the Model

```
Input Token IDs: [batch, seq_len]
        ↓
Token Embedding: [batch, seq_len, d_model]
    + Position Embedding: [batch, seq_len, d_model]
        ↓
For each Transformer Block:
    → Multi-Head Attention with Causal Mask
    → Residual Connection + LayerNorm
    → Feed-Forward Network
    → Residual Connection + LayerNorm
        ↓
Final LayerNorm
        ↓
LM Head (Linear Layer): [batch, seq_len, vocab_size]
        ↓
Logits (raw scores for each token)
        ↓
Softmax → probabilities, or CrossEntropy → loss
```

### Key PyTorch Operations

| Operation | Where | Purpose |
|-----------|-------|---------|
| `nn.Embedding` | 02_embedding | Convert token IDs to vectors |
| `nn.Linear` | 03_attention | Q, K, V projections |
| `F.scaled_dot_product_attention` | 03_attention | Efficient attention computation |
| `nn.LayerNorm` | 04_transformer_block | Normalize activations |
| `nn.Dropout` | All layers | Regularization |
| `F.cross_entropy` | 06_training | Loss function |
| `torch.argmax` | Generation | Pick highest-probability token |

---

## PART 6: TECH STACK EXPLANATION

### 🔥 PyTorch
- **What:** Deep learning framework by Meta. Tensors + automatic differentiation.
- **Why used:** PyTorch is the #1 framework for transformer research. Its eager execution model makes debugging attention mechanisms much easier than TensorFlow's graph mode.
- **Key feature:** `torch.nn.Module` lets you build clean, composable neural network layers.
- **Alternatives:** TensorFlow/Keras (more production-focused), JAX (more research-focused).
- **Interview One-liner:** "PyTorch is the standard deep learning framework for transformer-based architectures."

### 📝 tiktoken
- **What:** OpenAI's fast BPE tokenizer. The same tokenizer used by GPT-3.5 and GPT-4.
- **Why used:** Instead of building a tokenizer from scratch (which is a separate project), I used a production tokenizer to focus on the model architecture.
- **BPE (Byte-Pair Encoding):** Iteratively merges the most frequent character pairs into tokens. "low" + "er" → "lower".
- **Alternatives:** SentencePiece, HuggingFace tokenizers, character-level (simpler but worse).
- **Interview One-liner:** "I used tiktoken for tokenization, which is the same BPE tokenizer used in GPT models."

### 🧮 NumPy
- **What:** Python's numerical computing library.
- **Why used:** Under the hood for PyTorch. Used directly for data inspection and visualization.
- **Interview One-liner:** "NumPy powers all numerical operations behind the scenes."

### 📊 Matplotlib
- **What:** Python plotting library.
- **Why used:** Visualize training loss curves, attention patterns, embedding spaces.
- **Interview One-liner:** "I used Matplotlib to visualize training progress and debug attention patterns."

### 📓 Jupyter Notebooks
- **What:** Interactive Python environment — mix code, output, and explanation.
- **Why used:** Perfect for learning. Each notebook shows the code AND its output. You can experiment with attention mechanisms interactively.
- **Interview One-liner:** "The project uses Jupyter notebooks for interactive learning alongside clean .py modules."

---

## PART 7: FILE-BY-FILE EXPLANATION

### `00_tokenization/tokenizer.py`

**Purpose:** Convert raw text into integer token IDs that the model can process.

**Key functions:**
- `load_text(filepath)` — Read the training text file
- Tokenization via `tiktoken.get_encoding('gpt2').encode(text)`
- Vocabulary size: 50,257 tokens (GPT-2 vocabulary)

**Why it matters:** LLMs don't understand characters or words — they understand tokens. The tokenizer is the bridge between human language and model mathematics.

### `01_data_preparation/dataset.py`

**Purpose:** Create PyTorch Dataset that produces input-target pairs for next-token prediction.

**Key class:** `GPTDataset`
- **Input:** Tokenized text (list of ints), `max_length`, `stride`
- **Method:** Sliding window approach
- **Example:** For text "Alice was tired", tokens [13343, 1425, 2342]
  - Input: [13343, 1425], Target: [1425, 2342]
  - The model predicts token[i+1] given tokens[0...i]

**Why stride matters:** `stride=128` with `max_length=256` means windows overlap by 128 tokens. This creates more training examples from the same text.

### `03_attention_mechanism/attention.py`

**Purpose:** The HEART of the transformer. This is what makes LLMs work.

**Key class:** `MultiHeadAttention`
- Projects input into Query (Q), Key (K), Value (V)
- Computes: `Attention(Q,K,V) = softmax(QK^T/√d_k + mask) × V`
- Splits into multiple heads for parallel attention

**The Intuition:**
- **Query:** "What am I looking for?" (current token's perspective)
- **Key:** "What do I contain?" (all tokens' identities)
- **Value:** "What information do I have?" (what to pass forward)
- **QK^T:** Similarity score between each query and all keys
- **Softmax:** Convert scores to attention weights
- **× V:** Weighted sum of values based on attention

**Causal Mask:** A triangular matrix of -∞ values that prevents token[i] from attending to token[i+1] and beyond. This is CRUCIAL for autoregressive generation.

### `04_transformer_block/transformer_block.py`

**Purpose:** Combine attention with feed-forward network into one reusable block.

**Architecture:**
```
Input
  → Multi-Head Attention
  → Add Input (Residual) → LayerNorm
  → Feed-Forward (Linear → GELU → Linear)
  → Add (Residual) → LayerNorm
  → Output
```

**Why residual connections:** They allow gradients to flow directly through the network, preventing vanishing gradients in deep models. Think of them as "shortcuts."

### `05_Finalgpt/gpt_model.py`

**Purpose:** The complete GPT model — stacks transformer blocks and adds the output layer.

**Key class:** `GPTModel`
- Token Embedding layer
- Position Embedding layer
- Dropout
- N × TransformerBlock
- Final LayerNorm
- LM Head: `nn.Linear(d_model, vocab_size)` — maps hidden states to vocabulary probabilities

**GPT-2 Small Architecture (what's implemented):**
- 12 transformer blocks
- 768 embedding dimensions
- 12 attention heads
- ~124M parameters

### `06_training/train.py`

**Purpose:** The training loop — where the model actually learns.

**Key components:**
- **Loss:** `CrossEntropyLoss` — standard for next-token prediction
- **Optimizer:** `AdamW` — Adam with decoupled weight decay
- **Learning rate:** 3e-4 (standard for transformers)
- **Batch size:** 8 (limited by GPU memory)

**Training loop pseudocode:**
```
for epoch in range(n_epochs):
    for batch in dataloader:
        logits = model(batch.inputs)
        loss = cross_entropy(logits, batch.targets)
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()
    validate()
    save_checkpoint()
```

---

## PART 8: AI/ML/LLM DEEP DIVE

### The Transformer Architecture — Explained Simply

Imagine you're reading a sentence: "The cat sat on the mat."

When you read "sat," you know it refers to "the cat." Your brain connected two words that are 2 positions apart. Attention does exactly this — it lets every word "look at" every other word to understand relationships.

### Self-Attention — Technical

For a sequence of tokens, self-attention computes:
```
Q = X × W_Q    # [seq_len, d_model] → [seq_len, d_k]
K = X × W_K    # [seq_len, d_model] → [seq_len, d_k]
V = X × W_V    # [seq_len, d_model] → [seq_len, d_v]

Scores = (Q × K^T) / √d_k    # Scaled dot product
Weights = softmax(Scores)     # Normalize to [0,1]
Output = Weights × V          # Weighted sum
```

### Multi-Head Attention

Instead of one attention operation, run multiple in parallel:
- Head 1 might learn to connect subject-verb
- Head 2 might learn to connect pronoun-noun
- Head 3 might track long-range dependencies

All heads run independently, then concatenate results.

### Positional Embeddings

Transformers have no built-in notion of word order. "A ate B" and "B ate A" would look the same. Positional embeddings add position information by adding a unique vector for each position (0, 1, 2, ...).

### Layer Normalization

After each sub-layer (attention, FFN), normalize activations to have mean=0 and std=1. This stabilizes training and allows deeper networks.

### GPT vs BERT

| Feature | GPT (this project) | BERT |
|---------|-------------------|------|
| Direction | Left-to-right (autoregressive) | Bidirectional |
| Masking | Causal (can't see future) | Random token masking |
| Use case | Text generation | Text understanding |
| Training | Next token prediction | Masked token prediction |

### Training Objective

**Next Token Prediction (Language Modeling):**
Given tokens [t₁, t₂, ..., tₙ], predict token [tₙ₊₁].
Loss = CrossEntropy(predicted_probs, actual_token)

### Generation Strategies

| Strategy | How It Works | Pros | Cons |
|----------|-------------|------|------|
| **Greedy** | Always pick highest probability | Deterministic, fast | Repetitive, boring |
| **Temperature** | Divide logits by T before softmax | Control creativity | T>1 = more random |
| **Top-k** | Sample from top k tokens | Balances quality/variety | Fixed k |
| **Top-p (nucleus)** | Sample from tokens with cumulative prob p | Dynamic, best quality | Slightly more complex |

---

> **💡 Interview Tip:** If you can draw the attention formula on a whiteboard and explain it in plain English, you're ahead of 90% of candidates. Practice: "Attention is a weighted sum of values, where the weights come from comparing queries to keys."

---

## PART 9: INTERVIEW PREPARATION

### 30-Second Introduction
> "I built a GPT-style language model from scratch using PyTorch. I implemented every component — tokenization, embeddings, multi-head attention, transformer blocks, and the training loop. It's trained on text data and can generate new text token by token."

### 2-Minute Explanation
> "This project is an educational implementation of a GPT-style Large Language Model, built entirely from scratch with PyTorch. I broke the architecture into 7 sequential modules.
>
> First, tokenization using tiktoken — this converts raw text into integer IDs. Then data preparation with a sliding window approach to create input-target pairs for next-token prediction.
>
> The core is the transformer architecture. I implemented token and positional embeddings, multi-head self-attention with causal masking, and full transformer blocks with residual connections and layer normalization. The self-attention mechanism is the heart — it lets each token compute how much attention to pay to every other token using Query, Key, Value projections.
>
> I stacked 12 transformer blocks into a GPT model with about 124 million parameters, added a language modeling head to predict vocabulary probabilities, and trained with CrossEntropy loss and AdamW optimizer.
>
> The model learns to predict the next token given previous context. After training, it can generate coherent text one token at a time."

### Technical Deep-Dive (5-10 minutes)
> "Let me go deeper on attention. The formula is Attention(Q,K,V) = softmax(QK^T/√d_k) × V.
>
> Q, K, V are projections of the input. Q represents the 'question' each token asks: 'which other tokens are relevant to me?' K represents the 'identity' of each token: 'here's what I contain.' V represents the actual information to propagate.
>
> QK^T computes pairwise similarity between all tokens — it's an n×n matrix where position (i,j) tells how much token i should attend to token j. We divide by √d_k to prevent dot products from growing too large with dimension. Then softmax normalizes to attention weights that sum to 1.
>
> The causal mask is crucial for autoregressive generation. It's a lower triangular matrix that sets attention to future tokens to negative infinity, so after softmax they become zero. Without this, the model would cheat by looking at future words during training.
>
> Multi-head attention runs this process in parallel with different learned projections. Each head can specialize in different linguistic patterns — syntax, semantics, long-range dependencies."

---

## PART 10: INTERVIEW QUESTIONS

### 🟢 EASY

**Q1: What is a token?**
> A token is the basic unit that LLMs process. It can be a word, part of a word, or punctuation. "Hello world" might be tokens [15496, 995]. Tokenization converts text into these IDs.

**Q2: Why PyTorch?**
> PyTorch's eager execution and nn.Module system make it ideal for building and debugging transformer architectures. It's the most popular framework for transformer research.

**Q3: What is a transformer?**
> A transformer is a neural network architecture that uses self-attention instead of recurrence or convolution. It processes all tokens in parallel and uses attention to model relationships between any two positions.

### 🟡 MEDIUM

**Q4: Explain self-attention like I'm 5, then like I'm a PhD.**
> **5-year-old:** Imagine each word in a sentence is a person in a room. Each person asks everyone else "how relevant are you to me?" They collect answers and combine information from the most relevant people.
>
> **PhD:** Self-attention computes a weighted representation of each position as a convex combination of all positions' transformed inputs, where weights are derived from a compatibility function (scaled dot-product) between position-pair representations projected into query and key spaces.

**Q5: Why divide by √d_k in attention?**
> Without scaling, dot products grow larger as d_k increases. Large values push softmax into regions with tiny gradients, slowing learning. Dividing by √d_k keeps the variance of QK^T around 1 regardless of dimension.

**Q6: What is the causal mask and why is it needed?**
> The causal mask prevents token at position i from attending to positions > i. This is essential for autoregressive training because during generation, the model won't have access to future tokens — so it shouldn't learn to rely on them during training.

### 🔴 HARD

**Q7: Compare Multi-Head Attention with a single large attention head.**
> Multi-head attention projects into multiple lower-dimensional subspaces, allowing the model to attend to different representation subspaces simultaneously. A single head would average these effects. Multi-head is more parameter-efficient (h × d_k × d_v vs one large d_model × d_model) and empirically performs better.

**Q8: Walk me through the full GPT model forward pass.**
> Input tokens → Token Embedding + Position Embedding → Dropout → For each of N transformer blocks: MultiHeadAttention → Residual Add → LayerNorm → FFN (Linear→GELU→Linear) → Residual Add → LayerNorm → Final LayerNorm → LM Head (Linear to vocab_size) → Logits.

**Q9: How would you implement KV-caching for faster inference?**
> During autoregressive generation, each step recomputes attention for all previous tokens. KV-caching stores the Key and Value tensors from previous steps and only computes attention for the new token. This reduces per-step computation from O(n²) to O(n).

### ⭐ EXPERT

**Q10: How does this compare to GPT-2?**
> Architectural match to GPT-2 Small: 12 layers, 768 dim, 12 heads, ~124M params. Differences: my training data is tiny (Alice in Wonderland vs WebText), so the model won't produce coherent general text — but the architecture is correct.

**Q11: Why GELU activation instead of ReLU?**
> GELU (Gaussian Error Linear Unit) is smoother than ReLU, which helps gradient flow. It's defined as x × Φ(x) where Φ is the standard Gaussian CDF. Empirically, GELU outperforms ReLU in transformer architectures, which is why GPT and BERT use it.

---

## PART 11: HR QUESTIONS

**Q1: Why build an LLM from scratch?**
> "I wanted to truly understand how modern AI works, not just use APIs. Building it from scratch forced me to understand every component deeply — attention, embeddings, normalization. This knowledge helps me debug and optimize production LLMs."

**Q2: Biggest challenge?**
> "Understanding causal masking intuitively. The math made sense, but truly grasping why we must prevent attending to future tokens — and how the triangular mask achieves this — took hands-on experimentation with small examples."

**Q3: What would you improve?**
> "Train on a larger dataset like OpenWebText, implement flash attention for efficiency, add KV-caching for faster generation, and implement fine-tuning for downstream tasks like classification."

**Q4: What did you learn?**
> "That LLMs aren't magic — they're well-engineered mathematical systems. Also, that dimension management in PyTorch is the source of 90% of bugs. And that attention is both the simplest and most powerful idea in modern AI."

---

## PART 12: RESUME EXPLANATION

### One-Line
> Implemented a GPT-style Large Language Model (124M params) from scratch in PyTorch, including multi-head self-attention, transformer blocks, and training pipeline.

### Two-Line
> Built a GPT architecture from scratch using PyTorch, implementing tokenization (tiktoken/BPE), multi-head self-attention with causal masking, transformer blocks, and full training loop. Trained on text corpus with next-token prediction objective.

### Bullet Points
- 🧠 **Architected** a GPT-style transformer model (~124M parameters) from scratch using PyTorch
- ⚡ **Implemented** multi-head scaled dot-product attention with causal masking for autoregressive generation
- 🏗️ **Built** modular transformer blocks with residual connections, LayerNorm, and GELU activation
- 📊 **Designed** data pipeline with BPE tokenization, sliding-window dataset, and efficient batching
- 🎯 **Trained** model using CrossEntropy loss and AdamW optimizer with learning rate scheduling

---

## PART 13: LEARNING ROADMAP

### Week 1: Fundamentals
- Linear Algebra review (matrix multiplication, softmax)
- PyTorch basics (tensors, autograd, nn.Module)
- Video: Andrej Karpathy "Let's build GPT from scratch"

### Week 2: Core Components
- Tokenization concepts (BPE)
- Embeddings (token + positional)
- Self-attention — implement from scratch with small matrices
- Understand Q, K, V intuition

### Week 3: Architecture
- Multi-head attention
- Transformer block assembly
- LayerNorm and residual connections
- GPT model — stack it all together

### Week 4: Training & Beyond
- Training loop implementation
- Loss curves and debugging
- Text generation with different strategies
- Read: "Attention Is All You Need" paper

---

## PART 14: FLASHCARDS

| # | Question | Answer |
|---|----------|--------|
| 1 | What framework? | PyTorch |
| 2 | What tokenizer? | tiktoken (BPE, same as GPT) |
| 3 | Attention formula? | softmax(QK^T/√d_k) × V |
| 4 | Why √d_k? | Prevents large dot products → small gradients |
| 5 | Causal mask? | Triangular mask blocking future tokens |
| 6 | # parameters? | ~124M (GPT-2 Small config) |
| 7 | Loss function? | CrossEntropyLoss |
| 8 | Optimizer? | AdamW (lr=3e-4) |
| 9 | Activation? | GELU (better than ReLU for transformers) |
| 10 | Generation strategy? | Greedy (argmax), can add temperature/top-k |

---

## PART 15: CHEAT SHEET

```
╔══════════════════════════════════════════════════════════╗
║           LLM FROM SCRATCH — CHEAT SHEET                  ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  🧠 MODEL: GPT-2 Small Architecture                      ║
║     12 layers, 768 dim, 12 heads, ~124M params           ║
║                                                          ║
║  🔄 PIPELINE:                                            ║
║     Tokenize → Dataset → Embed → Attention → Blocks      ║
║     → GPT Model → Train → Generate                       ║
║                                                          ║
║  ⚡ ATTENTION: softmax(QK^T / √d_k) × V                  ║
║     Q=Query ("what am I looking for?")                   ║
║     K=Key ("what do I contain?")                         ║
║     V=Value ("what info do I pass?")                     ║
║                                                          ║
║  🔒 CAUSAL MASK: Blocks attention to future tokens       ║
║                                                          ║
║  🏗️ TRANSFORMER BLOCK:                                   ║
║     Attn → +Input → LN → FFN → +Input → LN              ║
║                                                          ║
║  📚 TECH: PyTorch | tiktoken | NumPy | Matplotlib        ║
║                                                          ║
║  🎯 TRAINING:                                            ║
║     Loss: CrossEntropy | Optimizer: AdamW lr=3e-4        ║
║     Dataset: Alice in Wonderland                         ║
║                                                          ║
║  🎤 KEY TALKING POINTS:                                  ║
║     "Built GPT from scratch — not just using APIs"       ║
║     "Implemented attention from first principles"        ║
║     "7 sequential modules, each built independently"     ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

## PART 16: FINAL CHECKLIST

- [ ] Can you explain self-attention in plain English?
- [ ] Can you write the attention formula?
- [ ] Can you explain why the causal mask is needed?
- [ ] Can you describe the transformer block architecture?
- [ ] Can you explain what happens in a forward pass?
- [ ] Can you name 3 improvements you'd make?
- [ ] Have you run at least one notebook from the repo?
- [ ] Can you explain why √d_k scaling matters?

---

> **💡 Final Tip:** Building an LLM from scratch puts you in the top 1% of candidates. Even if your model generates gibberish (small training data), the ARCHITECTURE is correct and you understand it deeply. That's what interviewers care about. 🚀
