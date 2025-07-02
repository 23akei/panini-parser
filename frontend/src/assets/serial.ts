// Web Serial API を利用したシリアル通信ラッパー
export async function connectToArduino(onLine: (line: string) => void) {
  if (!("serial" in navigator)) {
    alert("このブラウザはWeb Serial APIに対応していません。");
    return;
  }

  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const decoder = new TextDecoderStream();
    const inputDone = port.readable?.pipeTo(decoder.writable);
    const inputStream = decoder.readable;

    const reader = inputStream.getReader();

    let buffer = ""; // 🔁 ここで一時的に文字列を溜める

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        buffer += value;

        let lines = buffer.split("\n");
        buffer = lines.pop() ?? ""; // 最後の不完全な行は次に持ち越し

        for (let line of lines) {
          onLine(line.trim());
        }
      }
    }

    await reader.releaseLock();
    await inputDone;
    await port.close();
  } catch (err) {
    console.error("Serial connection error:", err);
  }
}
