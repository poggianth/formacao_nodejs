import http from "node:http";
import { Transform } from "node:stream";

const port = 3334;

class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString() * -1);

    console.log(`transformed: ${transformed}`);

    callback(null, Buffer.from(String(transformed)));
  }
}

// No node, as resquests => ReadbleStreams e responses => WritableStreams

const server = http.createServer((req, res) => {
    return req.pipe(new InverseNumberStream()).pipe(res);
});

server.listen(port);