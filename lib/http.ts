export class BodyTooLargeError extends Error {}
export class InvalidJsonError extends Error {}

/**
 * Reads a JSON request body while enforcing a byte limit on the actual stream,
 * not just the (optional, client-controlled) Content-Length header.
 */
export async function readJsonBody(request: Request, maxBytes: number): Promise<unknown> {
  if (Number(request.headers.get("content-length") ?? 0) > maxBytes) {
    throw new BodyTooLargeError();
  }
  if (!request.body) throw new InvalidJsonError();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > maxBytes) {
      await reader.cancel();
      throw new BodyTooLargeError();
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    throw new InvalidJsonError();
  }
}
