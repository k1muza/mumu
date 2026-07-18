/**
 * Web worker that runs the Kokoro-82M TTS model via kokoro-js.
 * Model weights (~90 MB quantised) download once and are cached by the browser.
 */
import { env, KokoroTTS, TextSplitterStream } from "kokoro-js";
import type { WorkerRequest, WorkerResponse } from "./protocol";

const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";

// Serve the onnxruntime wasm binaries ourselves (copied to public/ort from
// @huggingface/transformers/dist) instead of hitting the jsdelivr CDN.
env.wasmPaths = "/ort/";

// `self` is typed as Window under the "dom" lib; the Worker interface has the
// postMessage(message, transfer) signature we actually have here.
const ctx = self as unknown as Worker;
const post = (msg: WorkerResponse, transfer?: Transferable[]) =>
  ctx.postMessage(msg, transfer ?? []);

let device: "webgpu" | "wasm" = "wasm";
let ttsPromise: Promise<KokoroTTS> | null = null;
const cancelledStreams = new Set<number>();

async function hasWebGPU(): Promise<boolean> {
  try {
    const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu;
    return !!gpu && (await gpu.requestAdapter()) !== null;
  } catch {
    return false;
  }
}

function load(): Promise<KokoroTTS> {
  ttsPromise ??= (async () => {
    device = (await hasWebGPU()) ? "webgpu" : "wasm";
    return KokoroTTS.from_pretrained(MODEL_ID, {
      // WebGPU needs fp32 (fp16/q8 have known artefacts there); q8 keeps the
      // wasm download small and fast.
      dtype: device === "webgpu" ? "fp32" : "q8",
      device,
    });
  })();
  return ttsPromise;
}

ctx.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const msg = e.data;
  try {
    switch (msg.type) {
      case "init": {
        await load();
        post({ type: "ready", device });
        break;
      }
      case "generate": {
        const tts = await load();
        const audio = await tts.generate(msg.text, { voice: msg.voice, speed: msg.speed });
        const wav = audio.toWav();
        post({ type: "audio", id: msg.id, wav }, [wav]);
        break;
      }
      case "stream": {
        const tts = await load();
        const splitter = new TextSplitterStream();
        splitter.push(msg.text);
        splitter.close();
        for await (const { text, audio } of tts.stream(splitter, {
          voice: msg.voice,
          speed: msg.speed,
        })) {
          if (cancelledStreams.has(msg.id)) break;
          const wav = audio.toWav();
          post({ type: "chunk", id: msg.id, text, wav }, [wav]);
        }
        cancelledStreams.delete(msg.id);
        post({ type: "done", id: msg.id });
        break;
      }
      case "cancel": {
        cancelledStreams.add(msg.id);
        break;
      }
    }
  } catch (err) {
    post({
      type: "error",
      id: "id" in msg ? msg.id : undefined,
      message: err instanceof Error ? err.message : String(err),
    });
  }
};
