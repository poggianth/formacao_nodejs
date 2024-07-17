export async function json(req, res) {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    req.body = null;
  }

  // Sempre devolveremos o conteúdo do tipo json
  res.setHeader("Content-type", "application/json");
}
