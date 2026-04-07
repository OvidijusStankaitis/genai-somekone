export function uint8ArrayToArrayBuffer(uint8Array: Uint8Array): ArrayBuffer {
    // If correct size and byteOffset, this returns the underlying ArrayBuffer directly
    if (uint8Array.byteOffset === 0 && uint8Array.byteLength === uint8Array.buffer.byteLength) {
        return uint8Array.buffer as ArrayBuffer;
    }
    return uint8Array.buffer.slice(uint8Array.byteOffset, uint8Array.byteOffset + uint8Array.byteLength) as ArrayBuffer;
}
