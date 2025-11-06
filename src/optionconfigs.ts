interface Options {
  numa: boolean; // Use NUMA-aware memory allocation (multi-CPU optimization).
  // default: false | range: true/false

  num_ctx: number; // Number of tokens in context window (how far model can "remember").
  // default: 2048 | range: 512–32768 depending on model

  num_batch: number; // Batch size for prompt processing; higher = faster but uses more RAM/VRAM.
  // default: 512 | range: 1–4096

  num_gpu: number; // Number of GPUs used for inference.
  // default: 1 | range: 0–available GPUs

  main_gpu: number; // ID/index of the primary GPU to use.
  // default: 0 | range: depends on hardware (0–num_gpu-1)

  low_vram: boolean; // Reduce VRAM usage; slower but helps on small GPUs.
  // default: false | range: true/false

  f16_kv: boolean; // Store key/value cache in 16-bit precision (saves VRAM, slight precision loss).
  // default: true | range: true/false

  logits_all: boolean; // Return logits for all tokens (used for debugging or token analysis).
  // default: false | range: true/false

  vocab_only: boolean; // Load only the vocabulary; skips model weights (for metadata testing).
  // default: false | range: true/false

  use_mmap: boolean; // Use memory-mapped model loading for faster startup & lower RAM usage.
  // default: true | range: true/false

  use_mlock: boolean; // Lock model in RAM (prevents swap; boosts consistency).
  // default: false | range: true/false

  embedding_only: boolean; // Run only embedding generation (no text generation).
  // default: false | range: true/false

  num_thread: number; // Number of CPU threads to use for generation.
  // default: system cores / 2 | range: 1–number of logical cores

  num_keep: number; // Number of tokens to keep from the prompt when context resets.
  // default: 0 | range: 0–num_ctx

  seed: number; // Random seed for reproducible results.
  // default: -1 (randomized) | range: any positive integer

  num_predict: number; // Max tokens to generate in one response.
  // default: 128 | range: 1–8192 (depending on model)

  top_k: number; // Limit to top K probable tokens during sampling.
  // default: 40 | range: 1–1000

  top_p: number; // Nucleus sampling cutoff probability (prob mass).
  // default: 0.9 | range: 0.0–1.0

  tfs_z: number; // Tail-free sampling parameter (reduces long-tail randomness).
  // default: 1.0 | range: 0.0–1.0

  typical_p: number; // Typical sampling parameter (focuses on "average" likelihood tokens).
  // default: 1.0 (disabled) | range: 0.0–1.0

  repeat_last_n: number; // Number of previous tokens to consider for repetition penalty.
  // default: 64 | range: 0–1024

  temperature: number; // Controls creativity/randomness; higher = more diverse.
  // default: 0.8 | range: 0.1–2.0

  repeat_penalty: number; // Penalize repeating tokens (higher discourages repetition).
  // default: 1.1 | range: 1.0–2.0

  presence_penalty: number; // Penalize new tokens already present in the text.
  // default: 0.0 | range: 0.0–2.0

  frequency_penalty: number; // Penalize frequent tokens by frequency count.
  // default: 0.0 | range: 0.0–2.0

  mirostat: number; // Enable adaptive temperature (0=off, 1/2=on with variants).
  // default: 0 | range: 0–2

  mirostat_tau: number; // Target entropy for Mirostat (controls surprise).
  // default: 5.0 | range: 1.0–10.0

  mirostat_eta: number; // Learning rate for Mirostat adjustment.
  // default: 0.1 | range: 0.01–1.0

  penalize_newline: boolean; // Apply penalties to newline tokens.
  // default: false | range: true/false

  stop: string[]; // Stop sequences that end generation early.
  // default: [] | range: list of strings (e.g., ["\n", "User:", "###"])
}

// General Reasoning Preset
const chatPreset: Options = {
  numa: false, // most setups won't need NUMA
  num_ctx: 4096, // enough context for multi-turn chat
  num_batch: 512,
  num_gpu: 1,
  main_gpu: 0,
  low_vram: false,
  f16_kv: true,
  logits_all: false,
  vocab_only: false,
  use_mmap: true,
  use_mlock: false,
  embedding_only: false,
  num_thread: 8, // adjust to half or equal to CPU cores
  num_keep: 64, // keeps recent tokens between turns
  seed: -1, // random for variety
  num_predict: 512, // max tokens per response
  top_k: 40,
  top_p: 0.9,
  tfs_z: 1.0,
  typical_p: 1.0,
  repeat_last_n: 128,
  temperature: 0.8, // moderate creativity
  repeat_penalty: 1.15,
  presence_penalty: 0.1,
  frequency_penalty: 0.2,
  mirostat: 0, // off — manual temperature control
  mirostat_tau: 5.0,
  mirostat_eta: 0.1,
  penalize_newline: false,
  stop: ["User:", "Assistant:"],
};

const embeddingPreset: Options = {
  numa: false,
  num_ctx: 1024, // embeddings usually don't need long context
  num_batch: 1024, // larger batch = faster embedding throughput
  num_gpu: 1,
  main_gpu: 0,
  low_vram: true, // prefer CPU fallback to save VRAM
  f16_kv: true,
  logits_all: false,
  vocab_only: false,
  use_mmap: true,
  use_mlock: false,
  embedding_only: true, // critical for embedding generation
  num_thread: 8,
  num_keep: 0,
  seed: 42, // deterministic embeddings
  num_predict: 0, // disable token generation
  top_k: 1,
  top_p: 1.0,
  tfs_z: 1.0,
  typical_p: 1.0,
  repeat_last_n: 0,
  temperature: 0.0, // no randomness
  repeat_penalty: 1.0,
  presence_penalty: 0.0,
  frequency_penalty: 0.0,
  mirostat: 0,
  mirostat_tau: 5.0,
  mirostat_eta: 0.1,
  penalize_newline: false,
  stop: [],
};

const fastChatPreset: Options = {
  numa: false, // not needed unless you have multiple CPU sockets
  num_ctx: 2048, // smaller context = less VRAM use, faster response
  num_batch: 256, // lighter batch for limited memory
  num_gpu: 1,
  main_gpu: 0,
  low_vram: true, // enable memory-saving mode
  f16_kv: true, // halve KV cache size, minimal accuracy loss
  logits_all: false,
  vocab_only: false,
  use_mmap: true, // memory-map model to speed up load
  use_mlock: false, // disable RAM locking (can cause issues on small systems)
  embedding_only: false,
  num_thread: 4, // fewer threads for lighter CPU load
  num_keep: 32, // keep minimal context between turns
  seed: -1, // randomized generation
  num_predict: 256, // shorter responses for speed
  top_k: 40,
  top_p: 0.9,
  tfs_z: 1.0,
  typical_p: 1.0,
  repeat_last_n: 64,
  temperature: 0.7, // slightly lower for consistency
  repeat_penalty: 1.1,
  presence_penalty: 0.0,
  frequency_penalty: 0.0,
  mirostat: 0, // disabled to avoid extra compute
  mirostat_tau: 5.0,
  mirostat_eta: 0.1,
  penalize_newline: false,
  stop: ["User:", "Assistant:"],
};





// interface Tool {
//   type: string;
//   function: {
//     name?: string;
//     description?: string;
//     type?: string;
//     parameters?: {
//       type?: string;
//       $defs?: any;
//       items?: any;
//       required?: string[];
//       properties?: {
//         [key: string]: {
//           type?: string | string[];
//           items?: any;
//           description?: string;
//           enum?: any[];
//         };
//       };
//     };
//   };
// }

// interface Options {
//   numa: boolean;
//   num_ctx: number;
//   num_batch: number;
//   num_gpu: number;
//   main_gpu: number;
//   low_vram: boolean;
//   f16_kv: boolean;
//   logits_all: boolean;
//   vocab_only: boolean;
//   use_mmap: boolean;
//   use_mlock: boolean;
//   embedding_only: boolean;
//   num_thread: number;
//   num_keep: number;
//   seed: number;
//   num_predict: number;
//   top_k: number;
//   top_p: number;
//   tfs_z: number;
//   typical_p: number;
//   repeat_last_n: number;
//   temperature: number;
//   repeat_penalty: number;
//   presence_penalty: number;
//   frequency_penalty: number;
//   mirostat: number;
//   mirostat_tau: number;
//   mirostat_eta: number;
//   penalize_newline: boolean;
//   stop: string[];
// }

// interface Message {
//   role: string;
//   content: string;
//   thinking?: string;
//   images?: Uint8Array[] | string[];
//   tool_calls?: ToolCall[];
//   tool_name?: string;
// }

// interface ToolCall {
//   function: {
//     name: string;
//     arguments: {
//       [key: string]: any;
//     };
//   };
// }
