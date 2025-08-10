import { AprilTagFamily } from 'apriltag'
import tagConfig25h9 from 'apriltag/families/25h9.json' with { type: "json" };

import { createCanvas } from 'canvas';

import fs from 'node:fs';

const family = new AprilTagFamily(tagConfig25h9);
const tags = [...Array(35).keys()];

tags.forEach(tag => {
    const tag_data = family.render(tag);
    const tag_width = tag_data[0].length;
    const tag_height = tag_data.length;

    const canvas = createCanvas(tag_width, tag_height);
    const ctx = canvas.getContext('2d')
    
    for (let y = 0; y < tag_height; y++) {
        for (let x = 0; x < tag_width; x++) {
            const color = tag_data[y][x] === 'b' ? 'black' : 'white';
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
        }
    }

    const out = fs.createWriteStream(`./tags/25h9-${tag}.png`);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log(`Saved tag ${tag} to ./tags/25h9-${tag}.png`));
});