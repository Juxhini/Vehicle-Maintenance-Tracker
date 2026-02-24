// Generates simple PNG icons for PWA without any dependencies
import { writeFileSync } from 'fs';
import { deflateSync } from 'zlib';

function generateIcon(size, outputPath) {
    const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    function crc32(buf) {
        let crc = 0xffffffff;
        const table = new Int32Array(256);
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let j = 0; j < 8; j++) {
                c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
            }
            table[i] = c;
        }
        for (let i = 0; i < buf.length; i++) {
            crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
        }
        return (crc ^ 0xffffffff) >>> 0;
    }

    function chunk(type, data) {
        const len = Buffer.alloc(4);
        len.writeUInt32BE(data.length);
        const typeAndData = Buffer.concat([Buffer.from(type), data]);
        const crcVal = Buffer.alloc(4);
        crcVal.writeUInt32BE(crc32(typeAndData));
        return Buffer.concat([len, typeAndData, crcVal]);
    }

    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(size, 0);
    ihdr.writeUInt32BE(size, 4);
    ihdr[8] = 8;   // bit depth
    ihdr[9] = 2;   // color type (RGB)

    const rawData = [];
    const bgR = 0x11, bgG = 0x14, bgB = 0x20;
    const centerX = size / 2;
    const centerY = size / 2;
    const gearRadius = size * 0.28;
    const innerRadius = size * 0.18;

    for (let y = 0; y < size; y++) {
        rawData.push(0); // filter byte
        for (let x = 0; x < size; x++) {
            const dx = x - centerX;
            const dy = y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            const toothCount = 8;
            const toothAngle = (angle + Math.PI) / (2 * Math.PI) * toothCount;
            const toothWave = Math.cos(toothAngle * 2 * Math.PI) * 0.5 + 0.5;
            const outerR = gearRadius + toothWave * size * 0.06;

            const isGear = dist <= outerR && dist >= innerRadius;
            const isHole = dist < innerRadius * 0.55;
            const isGearVisible = isGear && !isHole;

            const cornerR = size * 0.18;
            let inBounds = true;
            if (x < cornerR && y < cornerR) {
                inBounds = Math.sqrt((x - cornerR) ** 2 + (y - cornerR) ** 2) <= cornerR;
            } else if (x > size - cornerR && y < cornerR) {
                inBounds = Math.sqrt((x - (size - cornerR)) ** 2 + (y - cornerR) ** 2) <= cornerR;
            } else if (x < cornerR && y > size - cornerR) {
                inBounds = Math.sqrt((x - cornerR) ** 2 + (y - (size - cornerR)) ** 2) <= cornerR;
            } else if (x > size - cornerR && y > size - cornerR) {
                inBounds = Math.sqrt((x - (size - cornerR)) ** 2 + (y - (size - cornerR)) ** 2) <= cornerR;
            }

            if (!inBounds) {
                rawData.push(0, 0, 0);
            } else if (isGearVisible) {
                const t = (x + y) / (size * 2);
                const r = Math.round(0x38 * (1 - t) + 0x81 * t);
                const g = Math.round(0xBD * (1 - t) + 0x8C * t);
                const b = Math.round(0xF8 * (1 - t) + 0xF8 * t);
                rawData.push(r, g, b);
            } else {
                rawData.push(bgR, bgG, bgB);
            }
        }
    }

    const deflated = deflateSync(Buffer.from(rawData));

    const png = Buffer.concat([
        PNG_SIGNATURE,
        chunk('IHDR', ihdr),
        chunk('IDAT', deflated),
        chunk('IEND', Buffer.alloc(0)),
    ]);

    writeFileSync(outputPath, png);
    console.log(`Generated ${outputPath} (${size}x${size}, ${png.length} bytes)`);
}

generateIcon(192, 'public/icon-192.png');
generateIcon(512, 'public/icon-512.png');
console.log('Done!');
